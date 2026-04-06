<template>
  <div class="notification-container">
    <TransitionGroup name="notification" tag="div">
      <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >
          <div class="notification-content">
            <span class="notification-icon">
              {{ getIcon(notification.type) }}
            </span>
            <span class="notification-message">
              {{ notification.message }}
            </span>
            <button
              @click="removeNotification(notification.id)"
              class="notification-close"
              aria-label="Close notification"
            >
              &times;
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
</template>

<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications';

const { notifications, removeNotification } = useNotifications();

const getIcon = (type: string) => {
  const icons = {
    success: '✅',
    info: '📢',
    error: '❌'
  };
  return icons[type as keyof typeof icons] || '📢';
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1000;
  pointer-events: none;
}

.notification {
  pointer-events: auto;
  margin-bottom: 10px;
  max-width: 400px;
  background: #2563eb;
  color: white;
  border: 1px solid #1d4ed8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification.success {
  background: #059669;
  border-color: #047857;
}

.notification.error {
  background: #dc2626;
  border-color: #b91c1c;
}

.notification-content {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.75rem;
}

.notification-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  font-weight: 500;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Vue Transitions */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

@media (max-width: 480px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
  }
  
  .notification {
    max-width: none;
  }
  
  .notification-content {
    padding: 0.75rem;
  }
  
  .notification-message {
    font-size: 0.9rem;
  }
}
</style>
