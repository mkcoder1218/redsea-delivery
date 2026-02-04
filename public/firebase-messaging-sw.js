// Firebase Cloud Messaging Service Worker
// This file handles background notifications

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDZ5uLD_UXkIUNp5j47-6he_0PENmkXwV0",
  authDomain: "redseapushnotification.firebaseapp.com",
  projectId: "redseapushnotification",
  storageBucket: "redseapushnotification.firebasestorage.app",
  messagingSenderId: "265713345",
  appId: "1:265713345:web:4a9da10711a9650095c640",
  measurementId: "G-MS90SH6TCF",
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message:", payload);

  const notificationTitle = payload.notification?.title || "New Delivery Order";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new delivery request",
    icon: "/icon-192x192.png", // Add your app icon
    badge: "/badge-72x72.png", // Add your badge icon
    tag: "delivery-notification",
    requireInteraction: true,
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  event.notification.close();

  // Open the app when notification is clicked
  event.waitUntil(clients.openWindow("/"));
});
