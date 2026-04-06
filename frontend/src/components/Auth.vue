<template>
  <div class="auth-container">
    <Login
      v-if="currentView === 'login'"
      @login-success="handleLoginSuccess"
      @switch-to-register="currentView = 'register'"
    />
    <Register
      v-else
      @register-success="handleRegisterSuccess"
      @switch-to-login="currentView = 'login'"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Login from './Login.vue';
import Register from './Register.vue';

defineOptions({
  name: 'AuthContainer'
});

const emit = defineEmits(['auth-success']);

const currentView = ref<'login' | 'register'>('login');

const handleLoginSuccess = () => {
  emit('auth-success');
};

const handleRegisterSuccess = () => {
  emit('auth-success');
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
