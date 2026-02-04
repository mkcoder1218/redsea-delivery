# Firebase Push Notifications Setup Guide

This guide will help you configure Firebase Cloud Messaging (FCM) for push notifications in your RedSea Delivery app.

## Prerequisites

- A Google/Firebase account
- Your app running on HTTPS (required for service workers)

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web** icon (</>) to add a web app
2. Register your app with a nickname (e.g., "RedSea Delivery Web")
3. Copy the Firebase configuration object

## Step 3: Get Your Firebase Configuration

After registering your app, you'll see a configuration object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
};
```

## Step 4: Generate VAPID Key

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Navigate to the **Cloud Messaging** tab
3. Scroll down to **Web Push certificates**
4. Click **Generate key pair**
5. Copy the generated key (starts with "B...")

## Step 5: Update Your Code

### 5.1 Update `services/firebase.ts`

Replace the placeholder config with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_ACTUAL_AUTH_DOMAIN",
  projectId: "YOUR_ACTUAL_PROJECT_ID",
  storageBucket: "YOUR_ACTUAL_STORAGE_BUCKET",
  messagingSenderId: "YOUR_ACTUAL_SENDER_ID",
  appId: "YOUR_ACTUAL_APP_ID",
};
```

And replace the VAPID key:

```typescript
const token = await getToken(messaging, {
  vapidKey: "YOUR_ACTUAL_VAPID_KEY", // The key from Step 4
});
```

### 5.2 Update `public/firebase-messaging-sw.js`

Replace the placeholder config with the same Firebase config from Step 5.1.

## Step 6: Test Notifications

### Testing in Development

1. Start your dev server: `npm run dev`
2. Open your app in a browser (must be HTTPS or localhost)
3. Log in to the app
4. When prompted, click "Allow" for notifications
5. Check the browser console for the FCM token

### Sending Test Notifications

You can send test notifications from Firebase Console:

1. Go to **Cloud Messaging** in Firebase Console
2. Click **Send your first message**
3. Enter a notification title and text
4. Click **Send test message**
5. Paste your FCM token (from browser console)
6. Click **Test**

## Step 7: Backend Integration

Your backend is already set up to handle the `/notifications/subscribe` endpoint. When a user enables notifications:

1. The app requests notification permission
2. Gets the FCM token from Firebase
3. Sends the token to your backend via `POST /notifications/subscribe`
4. Backend subscribes the token to the "delivery" topic

## Troubleshooting

### "Failed to get notification token"

- Ensure you're using HTTPS or localhost
- Check that service worker is registered correctly
- Verify Firebase config is correct

### "Notification permission denied"

- User must manually enable notifications in browser settings
- Clear site data and try again

### Service Worker Not Registering

- Check that `firebase-messaging-sw.js` is in the `public` folder
- Ensure the file is accessible at `/firebase-messaging-sw.js`
- Check browser console for errors

## Important Notes

1. **HTTPS Required**: Service workers only work on HTTPS (or localhost for development)
2. **Browser Support**: Not all browsers support push notifications
3. **User Permission**: Users must explicitly grant notification permission
4. **Token Refresh**: FCM tokens can change; implement token refresh logic if needed

## File Structure

```
redsea-delivery/
├── services/
│   ├── firebase.ts          # Firebase initialization and FCM token handling
│   └── api.ts              # API calls including subscribeToTopic
├── public/
│   └── firebase-messaging-sw.js  # Service worker for background notifications
└── App.tsx                 # Main app with notification prompt
```

## Next Steps

1. Add notification icons to `public/` folder:
   - `icon-192x192.png` (app icon)
   - `badge-72x72.png` (badge icon)

2. Customize notification behavior in `firebase-messaging-sw.js`

3. Handle notification clicks to navigate to specific orders

4. Implement token refresh logic for long-term reliability
