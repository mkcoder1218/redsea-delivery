import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Replace with your Firebase config
// Get this from Firebase Console > Project Settings > General > Your apps > Firebase SDK snippet
const firebaseConfig = {
  apiKey: "AIzaSyDZ5uLD_UXkIUNp5j47-6he_0PENmkXwV0",
  authDomain: "redseapushnotification.firebaseapp.com",
  projectId: "redseapushnotification",
  storageBucket: "redseapushnotification.firebasestorage.app",
  messagingSenderId: "265713345",
  appId: "1:265713345:web:4a9da10711a9650095c640",
  measurementId: "G-MS90SH6TCF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

/**
 * Request notification permission and get FCM token
 */
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  try {
    // Request permission
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("Notification permission granted.");

      // Get FCM token
      // TODO: Replace 'YOUR_VAPID_KEY' with your actual VAPID key from Firebase Console
      // Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
      const token = await getToken(messaging, {
        vapidKey:
          "BOVKI2iDsvL8-BvXGHTHtYCxEMJRHd5kyz_DBEYACmXwMhXjLny7mRQ_JtpIulp04cdCEhOOnY4ZxTMRpPRhEgA",
      });

      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.log("No registration token available.");
        return null;
      }
    } else {
      console.log("Notification permission denied.");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while retrieving token:", error);
    return null;
  }
};

/**
 * Listen for foreground messages
 */
export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);
      resolve(payload);
    });
  });
