# Deployment Guide

This guide will help you set up and deploy your application with proper Firebase configuration for both local development and production.

## Local Development

1. Copy `.env.example` to `.env.local`
2. Update `.env.local` with your actual Firebase credentials
3. Make sure `.env.local` is included in `.gitignore` (it should be by default)
4. Run `npm start` to start the development server

## GitHub Repository

1. **NEVER** commit `.env.local` or any file containing your actual Firebase credentials
2. The repository should include:
   - `.env.example` (with placeholder values)
   - `.env.development` (with development-only values, if needed)
   - `.gitignore` (including `.env.local`)

## Netlify Deployment

### One-time Setup

1. Connect your GitHub repository to Netlify
2. In the Netlify dashboard, go to **Site settings** > **Build & deploy** > **Environment**
3. Add all the Firebase environment variables:

   | Key | Value |
   | --- | --- |
   | `REACT_APP_FIREBASE_API_KEY` | Your Firebase API key |
   | `REACT_APP_FIREBASE_AUTH_DOMAIN` | Your Firebase auth domain |
   | `REACT_APP_FIREBASE_PROJECT_ID` | Your Firebase project ID |
   | `REACT_APP_FIREBASE_DATABASE_URL` | Your Firebase database URL |
   | `REACT_APP_FIREBASE_STORAGE_BUCKET` | Your Firebase storage bucket |
   | `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Your Firebase messaging sender ID |
   | `REACT_APP_FIREBASE_APP_ID` | Your Firebase app ID |
   | `REACT_APP_FIREBASE_MEASUREMENT_ID` | Your Firebase measurement ID |

4. Go to **Build & deploy** > **Build settings**
5. Set the **Build command** to `npm run build`
6. Set the **Publish directory** to `build`

### Continuous Deployment

Every time you push to your GitHub repository, Netlify will:
1. Clone your repository
2. Use your configured environment variables during build
3. Build the application with `npm run build`
4. Deploy to Netlify's CDN

### Updating Environment Variables

If you need to update your Firebase credentials:
1. Go to the Netlify dashboard
2. Navigate to **Site settings** > **Build & deploy** > **Environment**
3. Update the necessary variables
4. Trigger a new deployment by clicking **Deploys** > **Trigger deploy** > **Deploy site**

## Troubleshooting

If your Firebase integration doesn't work after deployment:

1. Check the browser console for any Firebase-related errors
2. Verify all environment variables are correctly set in Netlify
3. Make sure your Firebase project has the appropriate security rules
4. Check that your Firebase database URL is correctly formatted and accessible
5. Verify that you've enabled the appropriate Firebase services for your project

Remember: Keep your Firebase credentials secure by using environment variables and never committing them to your repository! 