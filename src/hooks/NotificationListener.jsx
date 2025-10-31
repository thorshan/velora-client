// NotificationListener.jsx (Example component)
import { useEffect } from 'react';
import { io } from 'socket.io-client';

// Define your server URL
const SOCKET_SERVER_URL = 'https://5000-firebase-velora-1761801943646.cluster-xpmcxs2fjnhg6xvn446ubtgpio.cloudworkstations.dev'; 

// Initialize the socket outside the component to keep it stable
const socket = io(SOCKET_SERVER_URL);

function NotificationListener() {
  useEffect(() => {
    // 1. Log connection status
    socket.on('connect', () => {
      console.log(`Connected to socket server with ID: ${socket.id}`);
      
      // If you are using rooms, emit the event here (e.g., after login)
      // socket.emit('join_notifications', 'user_123');
    });

    // 2. Listen for the 'new_notification' event
    socket.on('new_notification', (data) => {
      console.log('--- NEW PUSH NOTIFICATION RECEIVED ---');
      console.log(`Title: ${data.title}`);
      console.log(`Message: ${data.message}`);
      
      // Implement your UI logic here:
      // - Show a toast/snackbar (MUI)
      // - Update a global notification state
      alert(`${data.title}: ${data.message}`); // Simple browser alert for demonstration
    });

    // 3. Cleanup: Disconnect when the component unmounts
    return () => {
      socket.off('new_notification');
      socket.off('connect');
      socket.disconnect();
    };
  }, []); // Empty dependency array: runs only on mount/unmount

  return null; // This component handles logic, it doesn't need to render anything
}

export default NotificationListener;