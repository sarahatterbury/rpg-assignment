<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="handleLoginSubmit">
      <div class="form-group">
        <label for="email">Email:</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
          placeholder="Enter your email"
        />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
    <p>
      Don't have an account? 
      <a @click="$emit('switch-to-register')">Register here</a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth';

defineOptions({
  name: 'LoginForm'
});

const emit = defineEmits(['login-success', 'switch-to-register']);

const { handleLogin, loading, error } = useAuth();

const email = ref('');
const password = ref('');

const handleLoginSubmit = async () => {
  const success = await handleLogin(email.value, password.value);
  if (success) {
    emit('login-success');
  }
};
</script>

<style scoped>
.login-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 0;
}

@media (max-width: 480px) {
  .login-container {
    max-width: 100%;
  }
  
  .login-container h2 {
    font-size: 1.3rem;
  }
  
  input {
    padding: 0.6rem;
  }
  
  button {
    padding: 0.6rem;
  }
}

.login-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #ffffff;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #b0b0b0;
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #2a2a2a;
  border-radius: 6px;
  font-size: 1rem;
  background: #1a1a1a;
  color: #ffffff;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #2563eb;
}

input::placeholder {
  color: #6a6a6a;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background: #1d4ed8;
}

button:disabled {
  background: #374151;
  cursor: not-allowed;
}

.error {
  color: #ef4444;
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.login-container > p {
  text-align: center;
  margin-top: 1.5rem;
  color: #b0b0b0;
  font-size: 0.9rem;
}

a {
  cursor: pointer;
  color: #2563eb;
  font-weight: 500;
  text-decoration: none;
}

a:hover {
  color: #1d4ed8;
  text-decoration: underline;
}
</style>
