<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import Auth from './components/Auth.vue';
import BlogList from './components/BlogList.vue';
import NotificationContainer from './components/NotificationContainer.vue';
import { useAuth } from './composables/useAuth';

const { isAuthenticated, logout, user } = useAuth();

const showAuth = ref(false);

const handleAuthSuccess = async () => {
  await nextTick();
  showAuth.value = false;
};

const handleLogout = () => {
  logout();
  showAuth.value = false;
};

const handleCloseAuth = async () => {
  showAuth.value = false;
  await nextTick();
};

onMounted(() => {
  if (!isAuthenticated.value) {
    showAuth.value = true;
  }
});
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>rePurpose Blog</h1>
      <nav>
        <span v-if="isAuthenticated" class="user-info">
          Welcome, {{ user?.name || 'User' }}!
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </span>
        <span v-else>
          <button @click="showAuth = true" class="login-btn">Log In</button>
        </span>
      </nav>
    </header>

    <main class="main-content">
      <!-- Auth Modal -->
      <div v-if="showAuth && !isAuthenticated" class="auth-modal">
        <div class="auth-modal-content">
          <button @click="handleCloseAuth" class="close-btn">&times;</button>
          <Auth @auth-success="handleAuthSuccess" />
        </div>
      </div>

      <!-- Blog Content -->
      <BlogList v-if="isAuthenticated" />
      <div v-else class="welcome-message">
        <div class="welcome-card">
          <h2>Join the Conversation</h2>
          <p>Please login or register to view and create blog posts.</p>
          <button @click="showAuth = true" class="cta-button">Get Started</button>
        </div>
      </div>
    </main>

    <!-- Global Notifications -->
    <NotificationContainer />
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #0a0a0a;
  color: #ffffff;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: #1a1a1a;
  border-bottom: 1px solid #2a2a2a;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.app-header h1 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffffff;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #b0b0b0;
}

.login-btn, .logout-btn, .cta-button {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.login-btn:hover, .cta-button:hover {
  background: #1d4ed8;
}

.logout-btn {
  background: #dc2626;
}

.logout-btn:hover {
  background: #b91c1c;
}

.main-content {
  flex: 1;
  padding: 1.5rem 1rem;
  margin: 0;
  width: 100%;
}

.welcome-message {
  min-height: calc(100vh - 80px);
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.auth-modal-content {
  background: #1a1a1a;
  border-radius: 8px;
  padding: 2rem;
  position: relative;
  max-width: 90%;
  max-height: 90%;
  overflow-y: auto;
  border: 1px solid #2a2a2a;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #2a2a2a;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #b0b0b0;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #3a3a3a;
  color: #ffffff;
}

.welcome-message h2 {
  color: #ffffff;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.welcome-card {
  background: #1f2937;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #374151;
  text-align: center;
  max-width: 500px;
  margin-top: 4rem;
}

.welcome-message p {
  color: #9ca3af;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
}
</style>
