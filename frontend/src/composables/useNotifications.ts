import { ref, onMounted, onUnmounted } from 'vue';
import { io, Socket } from 'socket.io-client';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
  timestamp: number;
}

const notifications = ref<Notification[]>([]);
const socket = ref<Socket | null>(null);

export function useNotifications() {
  const connect = () => {
    if (socket.value) return;
    
    try {
      socket.value = io('http://localhost:3200', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
      });
      
      socket.value.on('connect', () => {
        console.log('Connected to notifications server');
        socket.value?.emit('joinNotifications');
      });

      socket.value.on('newBlog', (data) => {
        addNotification({
          message: `${data.author} just posted: "${data.title}"`,
          type: 'info'
        });
      });

      socket.value.on('connect_error', (error) => {
        console.error('Connection error:', error);
      });

    } catch (error) {
      console.error('Failed to connect to notifications:', error);
    }
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    
    notifications.value.push(newNotification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index > -1) {
      notifications.value.splice(index, 1);
    }
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
    }
  };

  // Auto-connect on mount with delay
  onMounted(() => {
    setTimeout(() => {
      connect();
    }, 1000); // Delay to ensure component is mounted
  });

  // Auto-disconnect on unmount
  onUnmounted(() => {
    disconnect();
  });

  return {
    notifications: notifications,
    connect,
    disconnect,
    addNotification,
    removeNotification
  };
}
