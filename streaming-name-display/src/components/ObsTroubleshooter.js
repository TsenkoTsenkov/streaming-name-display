import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { formButtonStyles } from '../styles/appStyles';

const ObsTroubleshooter = () => {
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  
  return (
    <div style={{ marginTop: '1rem' }}>
      <button
        onClick={() => setShowTroubleshooting(!showTroubleshooting)}
        style={{
          ...formButtonStyles,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          color: 'rgba(239, 68, 68, 0.8)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          width: '100%',
          justifyContent: 'space-between',
          fontSize: '0.875rem',
          padding: '0.5rem 0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={16} />
          <span>Troubleshoot OBS Integration</span>
        </div>
        {showTroubleshooting ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      {showTroubleshooting && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.75rem',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '0.375rem',
          fontSize: '0.75rem',
          lineHeight: '1.5',
          color: 'rgba(255, 255, 255, 0.7)'
        }}>
          <h4 style={{ marginBottom: '0.5rem', color: 'rgba(239, 68, 68, 0.8)' }}>
            Troubleshooting Steps for OBS Display
          </h4>
          
          <div style={{ marginBottom: '1rem' }}>
            <strong style={{ color: 'rgba(239, 68, 68, 0.8)' }}>If you see an empty display or just a purple box in OBS:</strong>
            <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>
                <strong>Use the Force Refresh Button:</strong> Click the "Force OBS Refresh" button in the OBS Options section. This updates the Firebase database and creates a new URL with a fresh timestamp.
              </li>
              <li>
                <strong>Copy the New Dynamic URL:</strong> After forcing a refresh, copy the new Dynamic OBS URL.
              </li>
              <li>
                <strong>Update OBS Browser Source:</strong> In OBS, select your browser source, click Properties, and paste in the new URL.
              </li>
              <li>
                <strong>Empty User Data Issue:</strong> If OBS shows an empty user or names like "", this means the browser source isn't receiving the current data. Try the following:
                <ul style={{ marginTop: '0.3rem', paddingLeft: '1.5rem' }}>
                  <li>Make sure you've selected someone and clicked "GO LIVE" in the main app</li>
                  <li>Delete the browser source completely and add a new one with a fresh URL</li>
                  <li>Ensure "Shutdown source when not visible" is checked in OBS browser source</li>
                  <li>Refresh the browser source cache (right-click source → "Refresh cache of current page")</li>
                </ul>
              </li>
              <li>
                <strong>Ensure Essential OBS Settings:</strong>
                <ul style={{ marginTop: '0.3rem', paddingLeft: '1.5rem' }}>
                  <li>Width: {document.querySelector('html').clientWidth} (or match your display width setting)</li>
                  <li>Height: {document.querySelector('html').clientHeight} (or match your display height setting)</li>
                  <li>"Refresh browser when scene becomes active" must be checked</li>
                  <li>"Shutdown source when not visible" must be checked</li>
                </ul>
              </li>
              <li>
                <strong>Clear OBS Browser Source Cache:</strong> In OBS, right-click on the browser source, choose "Properties", and click the button labeled "Refresh cache of current page" at the bottom.
              </li>
              <li>
                <strong>Try Direct Parameters:</strong> If all else fails, try creating a URL with direct parameters by clicking "Copy Static URL" instead.
              </li>
            </ol>
          </div>
          
          <div style={{ marginBottom: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <strong style={{ color: 'rgba(59, 130, 246, 0.8)' }}>Firebase Integration:</strong>
            <p style={{ marginTop: '0.3rem' }}>
              This application uses Firebase Realtime Database to ensure that all instances (browsers, OBS sources, etc.) 
              stay synchronized with the latest data. If you're still experiencing issues, try the following Firebase-specific steps:
            </p>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>Make sure your internet connection is stable</li>
              <li>Check that your browser and OBS can access firebase.googleapis.com domains</li>
              <li>Force refresh using the button to update all Firebase data</li>
              <li>If using a VPN or firewall, ensure it's not blocking WebSocket connections</li>
            </ul>
          </div>
          
          <div style={{ marginBottom: '0.5rem' }}>
            <strong style={{ color: 'rgba(239, 68, 68, 0.8)' }}>Common Error Messages:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>
                <strong>"Script error"</strong> - This can occur if OBS is trying to load HTML as JavaScript. Delete the browser source and create a new one.
              </li>
              <li>
                <strong>"Empty user data"</strong> - The browser source isn't receiving the current user data. Force a refresh using the button in OBS options.
              </li>
              <li>
                <strong>"Firebase: Error connecting..."</strong> - This indicates a network issue with the Firebase connection. Check your internet connection and any firewall settings.
              </li>
            </ul>
          </div>
          
          <div style={{ marginTop: '1rem', fontStyle: 'italic', fontSize: '0.7rem', opacity: 0.7 }}>
            Note: OBS browser sources can sometimes be difficult to work with due to caching issues. If you continue to experience problems, try closing OBS completely and restarting. Using the Firebase integration should provide more reliable cross-browser and OBS synchronization compared to previous versions.
          </div>
        </div>
      )}
    </div>
  );
};

export default ObsTroubleshooter; 