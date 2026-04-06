import { reactive, toRefs } from 'vue';
import { graphqlService } from '@/services/graphql';
import { REGISTER_MUTATION, LOGIN_MUTATION } from '@/graphql/auth';

interface User {
  id: string;
  email: string;
  name: string;
}

// Helper functions for localStorage operations
const storage = {
  getToken: () => localStorage.getItem('authToken'),
  setToken: (token: string) => localStorage.setItem('authToken', token),
  removeToken: () => localStorage.removeItem('authToken'),
  getUser: () => JSON.parse(localStorage.getItem('authUser') || 'null'),
  setUser: (user: User) => localStorage.setItem('authUser', JSON.stringify(user)),
  removeUser: () => localStorage.removeItem('authUser'),
  clearAuth: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  }
};

// Create a shared reactive state
const authState = reactive({
  token: storage.getToken(),
  user: storage.getUser(),
  loading: false,
  error: null as string | null,
  isAuthenticated: !!storage.getToken()
});

// Function to decode JWT and get user data
const getUserFromToken = (token: string) => {
  try {
    console.log('🔍 Decoding JWT token:', token.substring(0, 20) + '...');
    
    // Simple JWT decode (in production, use proper JWT library)
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('❌ Invalid JWT format, expected 3 parts but got:', parts.length);
      return null;
    }
    
    const payload = JSON.parse(atob(parts[1]!));
    console.log('📋 JWT payload:', payload);
    console.log('📋 Payload keys:', Object.keys(payload));
    
    // Extract user data from JWT payload
    let userData = null;
    
    if (payload.name && payload.email && payload.sub) {
      // Backend includes flat user data in JWT
      userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.name
      };
      console.log('✅ Using flat JWT payload data:', userData.name);
    } else if (payload.user) {
      // Fallback: nested user object (old format)
      userData = payload.user;
      console.log('✅ Using nested user data:', userData.name);
    } else if (payload.email && payload.sub) {
      // Last resort: use direct payload data without name
      userData = {
        id: payload.sub,
        email: payload.email,
        name: payload.email.split('@')[0] // Use email prefix as name fallback
      };
      console.log('⚠️ Using direct payload data (no name):', userData.email);
    } else {
      console.warn('❌ No recognizable user data in JWT payload');
      return null;
    }
    
    return userData;
  } catch (error) {
    console.warn('❌ Failed to decode JWT:', error);
    return null;
  }
};

export function useAuth() {
  // Initialize user data from token on app load
  if (authState.token && !authState.user) {
    const userData = getUserFromToken(authState.token);
    if (userData) {
      authState.user = userData;
      storage.setUser(userData); // Cache the decoded user data
      console.log('🔑 Restored user from JWT token:', userData.name);
    }
  }

  // Function to update authentication state
  const updateAuthState = () => {
    authState.isAuthenticated = !!authState.token;
  };

  const logout = () => {
    authState.token = null;
    authState.user = null;
    storage.clearAuth();
    updateAuthState();
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    authState.loading = true;
    authState.error = null;
    
    try {
      const result = await graphqlService.mutate<{ register: User }>(REGISTER_MUTATION, {
        input: { email, password, name }
      });
      
      if (result?.register) {
        authState.user = result.register;
        
        // Auto-login after successful registration
        try {
          const loginResult = await graphqlService.mutate<{ login: { access_token: string; user: User } }>(LOGIN_MUTATION, {
            input: { email, password }
          });
          
          if (loginResult?.login) {
            console.log('🔑 Login attempt:', { email });
            console.log('✅ Found user in database:', { id: loginResult.login.user.id, name: loginResult.login.user.name });
            console.log('🔐 Generated JWT payload:', { email: loginResult.login.user.email, sub: loginResult.login.user.id });
            console.log('🔑 Generated JWT token:', loginResult.login.access_token.substring(0, 20) + '...');
            
            authState.token = loginResult.login.access_token;
            authState.user = loginResult.login.user;
            storage.setToken(loginResult.login.access_token);
            storage.setUser(loginResult.login.user);
            updateAuthState();
          }
        } catch {
          // Auto-login failed, but registration succeeded
        }
        
        return true;
      }
      return false;
    } catch (err: unknown) {
      authState.error = err instanceof Error ? err.message : 'Registration failed';
      return false;
    } finally {
      authState.loading = false;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    authState.loading = true;
    authState.error = null;
    
    try {
      const result = await graphqlService.mutate<{ login: { access_token: string; user: User } }>(LOGIN_MUTATION, {
        input: { email, password }
      });
      
      if (result?.login) {
        authState.token = result.login.access_token;
        authState.user = result.login.user;
        storage.setToken(result.login.access_token);
        storage.setUser(result.login.user);
        updateAuthState();
        return true;
      }
      return false;
    } catch (err: unknown) {
      authState.error = err instanceof Error ? err.message : 'Login failed';
      return false;
    } finally {
      authState.loading = false;
    }
  };

  return {
    ...toRefs(authState),
    handleRegister,
    handleLogin,
    logout,
  };
}

// Export storage helpers for use in other modules
export { storage };
