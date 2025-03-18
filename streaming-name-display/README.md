# Streaming Name Display

A simple, customizable application for displaying names and titles in OBS for live streaming. Perfect for podcasts, interviews, webinars, and live events.

## Features

- Display names and titles with customizable styles
- Easy-to-use interface for managing people
- Preview display in real-time before going live
- Import people from Excel/CSV files
- Direct integration with OBS via browser sources
- Firebase Realtime Database for cross-browser and OBS synchronization

## What's New: Firebase Integration

We've integrated Firebase Realtime Database to solve the critical issue of data sharing between different browsers and OBS sources. This ensures:

- All displays (browsers, incognito windows, OBS) stay in sync
- No more issues with empty user data in OBS
- Reliable updates across different devices and environments
- Real-time streaming data for everyone viewing the display

## Setup

### Basic Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

### Firebase Setup (Required)

To ensure proper functionality, you must set up Firebase Realtime Database:

1. See the detailed [Firebase Setup Guide](FIREBASE_SETUP.md)
2. Create a `.env.local` file in the project root (copy from `.env.example`)
3. Add your Firebase configuration to the `.env.local` file:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_DATABASE_URL=https://your_project_id-default-rtdb.firebaseio.com
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Netlify Deployment

When deploying to Netlify:

1. In your Netlify dashboard, go to your site settings > Build & deploy > Environment
2. Add all environment variables from your `.env.local` file to Netlify:
   - REACT_APP_FIREBASE_API_KEY
   - REACT_APP_FIREBASE_AUTH_DOMAIN
   - All other Firebase configuration variables
3. Redeploy your site to apply the environment variables

## Usage

1. Add people to your list with their names and titles
2. Select a person and click "Go Live"
3. Copy the Dynamic OBS URL and add it as a browser source in OBS
4. When you want to display a different person, select them and click "Go Live"

## OBS Integration

1. In OBS, add a new "Browser" source
2. Copy the "Dynamic OBS URL" from the application
3. Set width and height to match your settings
4. Check "Refresh browser when scene becomes active"
5. Check "Shutdown source when not visible"

## Troubleshooting

If you experience issues with OBS integration:

1. Click the "Force OBS Refresh" button in the OBS Options
2. Copy the freshly generated Dynamic OBS URL
3. Update your OBS browser source with the new URL
4. See the Troubleshooting section in the app for detailed steps

## Development

- Built with React
- Uses Firebase Realtime Database for data synchronization
- Supports modern browsers and OBS browser sources

## License

MIT

## Credits

Created by [Your Name]
