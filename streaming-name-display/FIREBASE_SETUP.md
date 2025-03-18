# Firebase Setup for Streaming Name Display

This guide will help you set up Firebase Realtime Database for your Streaming Name Display application, ensuring consistent data across all browsers and OBS sources.

## Why Firebase?

Firebase Realtime Database solves the critical issue of data sharing between:
- Multiple browser windows/tabs
- Incognito mode browsers
- OBS browser sources
- Different computers/devices

Without Firebase, the application relies on localStorage which is isolated to each browser and not accessible in OBS browser sources.

## Step 1: Create a Firebase Account and Project

1. Go to [https://firebase.google.com/](https://firebase.google.com/)
2. Click "Get Started" and sign in with your Google account
3. Click "Add project" and follow the setup wizard:
   - Enter a project name (e.g., "streaming-name-display")
   - Decide whether to enable Google Analytics (optional)
   - Accept the terms and create the project

## Step 2: Set Up Realtime Database

1. In the Firebase console, select your project
2. In the left sidebar, click "Build" → "Realtime Database"
3. Click "Create Database"
4. Choose a location closest to you
5. Start in **test mode** for easiest setup (we'll adjust security later):
   - Select "Start in test mode"
   - Click "Enable"

## Step 3: Get Your Firebase Configuration

1. In the Firebase console, click the gear icon (⚙️) next to "Project Overview" and select "Project settings"
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register your app with a nickname (e.g., "streaming-name-display-web")
5. Click "Register app"
6. You'll see a code snippet with your Firebase configuration. It looks like this:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## Step 4: Update Your Application with Firebase Config

1. Copy the `.env.example` file to `.env.local` in the project root
2. Update the values in `.env.local` with your actual Firebase configuration:

```
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_DATABASE_URL=https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

3. Make sure the `.env.local` file is included in your `.gitignore` to keep your API keys secure
4. When you deploy to Netlify, add these environment variables in the Netlify dashboard:
   - Go to Site settings > Build & deploy > Environment
   - Add each variable from your `.env.local` file

## Step 5: Test Your Integration

1. Start your application with `npm start`
2. Select a person and click "Go Live"
3. Open a new browser window or incognito mode and navigate to the same URL
4. Open the OBS URL in a new tab
5. Make changes in the main application and verify that they appear in all open windows/tabs

## Step 6: Set Up Database Rules (Optional but Recommended)

For production use, you should update your database rules for better security:

1. In the Firebase console, go to "Realtime Database" → "Rules" tab
2. Replace the rules with something like:

```json
{
  "rules": {
    ".read": true,
    "people": {
      ".write": true
    },
    "settings": {
      ".write": true
    },
    "livePerson": {
      ".write": true
    },
    "liveSettings": {
      ".write": true
    },
    "streamingState": {
      ".write": true
    }
  }
}
```

3. Click "Publish"

These rules allow reading all data but restrict writing to specific paths.

## Step 7: Deploy Your Application (Optional)

For hosting your application:

1. In the Firebase console, click "Build" → "Hosting"
2. Click "Get started"
3. Install Firebase CLI: `npm install -g firebase-tools`
4. Login to Firebase: `firebase login`
5. Initialize your project: `firebase init`
   - Select "Hosting"
   - Select your Firebase project
   - Specify "build" as your public directory
   - Configure as a single-page app: "Yes"
6. Build your React app: `npm run build`
7. Deploy to Firebase: `firebase deploy`

## Troubleshooting

If you encounter issues with Firebase:

1. **Connection Issues**: Check that your internet connection can access Firebase domains
2. **Error Messages in Console**: Look for error messages in your browser's developer console
3. **Security Rules**: If you see permission errors, check your database rules
4. **API Key Restrictions**: If you've restricted your API key, make sure the domains you're using are allowed

## Next Steps

- Consider adding user authentication for more security
- Set up database backups for your important data
- Review Firebase quota limits for the free tier

For more detailed Firebase documentation, visit [https://firebase.google.com/docs](https://firebase.google.com/docs) 