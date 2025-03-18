import React, { useState, useEffect, useCallback } from 'react';
import { Copy, ExternalLink, Play, Download, Server, RefreshCw, StopCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formButtonStyles } from '../styles/appStyles';
import ObsTroubleshooter from './ObsTroubleshooter';
import { saveData } from '../utils/firebaseConfig';

const DisplayControls = () => {
  const { 
    selectedPerson,
    handleGoLive,
    handleStopStreaming,
    livePerson,
    people,
    liveSettings
  } = useAppContext();

  const [liveUrl, setLiveUrl] = useState("");
  const [obsUrl, setObsUrl] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [receiverUrl, setReceiverUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyObsSuccess, setCopyObsSuccess] = useState(false);
  const [copyReceiverSuccess, setCopyReceiverSuccess] = useState(false);
  const [copyApiSuccess, setCopyApiSuccess] = useState(false);
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [forceRefreshCount, setForceRefreshCount] = useState(0);

  // Define the updateLiveDisplayWindows function with useCallback before using it
  const updateLiveDisplayWindows = useCallback((url) => {
    // Broadcast message to any open windows
    window.postMessage({
      type: 'stream-update',
      data: {
        person: livePerson,
        settings: liveSettings,
        timestamp: Date.now()
      }
    }, '*');
  }, [livePerson, liveSettings]);

  // Generate an OBS-specific URL with cache busting
  const generateObsUrl = useCallback(() => {
    // Base URL for the display page
    const baseUrl = window.location.origin + window.location.pathname;
    
    // Current timestamp for cache busting
    const timestamp = Date.now();
    
    // Create a URL that directly loads the display page without requiring transformation
    // Add receiver=true to enable cross-window communication
    // Add obs=true to enable OBS-specific styling
    // Add t parameter for cache busting
    return `${baseUrl}?display=true&obs=true&receiver=true&t=${timestamp}`;
  }, []);

  // Function to force a refresh of all live data and URLs
  const forceDataRefresh = useCallback(() => {
    // Increment the refresh counter
    setForceRefreshCount(prev => prev + 1);
    
    // Update the timestamp
    const timestamp = Date.now();
    setLastUpdated(timestamp);
    
    // Force regeneration of all URLs
    setObsUrl(generateObsUrl());
    setReceiverUrl(generateObsUrl());
    
    // Save the streaming state to Firebase to trigger real-time updates
    saveData('streamingState', {
      active: true,
      timestamp: timestamp,
      forceRefresh: forceRefreshCount + 1
    }).catch(error => {
      console.error("Error updating Firebase streaming state:", error);
    });
    
    // Also update localStorage as a fallback
    localStorage.setItem("streamingAppLiveUpdate", timestamp.toString());
    
    // Also update the live data elements for backwards compatibility
    if (livePerson && liveSettings) {
      // Update the DOM element for OBS
      const liveDataEl = document.getElementById('liveStreamData');
      const liveDataContent = {
        person: livePerson,
        settings: liveSettings,
        timestamp: timestamp
      };
      
      if (liveDataEl) {
        liveDataEl.setAttribute('data-json', JSON.stringify(liveDataContent));
      } else {
        const newEl = document.createElement('div');
        newEl.id = 'liveStreamData';
        newEl.style.display = 'none';
        newEl.setAttribute('data-json', JSON.stringify(liveDataContent));
        document.body.appendChild(newEl);
      }
      
      // Update the other data element too
      const dataEl = document.getElementById('data-stream-data');
      const streamData = {
        person: livePerson,
        settings: liveSettings,
        lastUpdate: timestamp
      };
      
      if (dataEl) {
        dataEl.setAttribute('data-stream-content', JSON.stringify(streamData));
      } else {
        const newEl = document.createElement('div');
        newEl.id = 'data-stream-data';
        newEl.style.display = 'none';
        newEl.setAttribute('data-stream-content', JSON.stringify(streamData));
        document.body.appendChild(newEl);
      }
    }
    
    // Send message to any open windows
    updateLiveDisplayWindows();
  }, [generateObsUrl, livePerson, liveSettings, updateLiveDisplayWindows, forceRefreshCount]);

  // Generate the display URLs
  useEffect(() => {
    const baseUrl = window.location.origin + window.location.pathname;
    
    // Basic URL for simple display
    const displayUrl = `${baseUrl}?display=true`;
    setLiveUrl(displayUrl);
    
    // Create a stable receiver URL that automatically polls for changes
    // Always use the generateObsUrl function to ensure proper cache busting
    const stableReceiverUrl = generateObsUrl();
    setReceiverUrl(stableReceiverUrl);
    
    // Generate specialized URL for OBS with parameters
    if (livePerson) {
      try {
        // Update Firebase with streaming state to trigger live updates
        const timestamp = Date.now();
        setLastUpdated(timestamp);
        
        // Update the streaming state in Firebase
        saveData('streamingState', {
          active: true,
          timestamp: timestamp,
          forceRefresh: forceRefreshCount
        }).catch(error => {
          console.error("Error updating Firebase streaming state:", error);
        });
        
        // Also update localStorage data as a fallback to ensure it's available for display
        const streamData = {
          person: livePerson,
          settings: liveSettings,
          lastUpdate: timestamp
        };
        
        localStorage.setItem("streamingData", JSON.stringify(streamData));
        
        // For OBS, we need a more reliable way than localStorage
        // Create a DOM element with the data for better OBS access (primary method)
        const liveDataEl = document.getElementById('liveStreamData');
        const liveDataContent = {
          person: livePerson,
          settings: liveSettings,
          timestamp: timestamp
        };
        
        if (liveDataEl) {
          liveDataEl.setAttribute('data-json', JSON.stringify(liveDataContent));
        } else {
          const newEl = document.createElement('div');
          newEl.id = 'liveStreamData';
          newEl.style.display = 'none';
          newEl.setAttribute('data-json', JSON.stringify(liveDataContent));
          document.body.appendChild(newEl);
        }
        
        // Trigger a localStorage update that DisplayPage can listen for
        localStorage.setItem("streamingAppLiveUpdate", timestamp.toString());
        
        // Always use the generateObsUrl function for OBS URLs to ensure proper cache busting
        setObsUrl(generateObsUrl());
        
        // Also create a DOM element with the data for better OBS access
        const dataEl = document.getElementById('data-stream-data');
        if (dataEl) {
          dataEl.setAttribute('data-stream-content', JSON.stringify(streamData));
        } else {
          const newEl = document.createElement('div');
          newEl.id = 'data-stream-data';
          newEl.style.display = 'none';
          newEl.setAttribute('data-stream-content', JSON.stringify(streamData));
          document.body.appendChild(newEl);
        }
        
        // Create a Blob with the data for file download and API access
        const blob = new Blob([JSON.stringify(streamData)], { type: 'application/json' });
        const fileUrl = URL.createObjectURL(blob);
        
        // Setup download link
        const filename = `stream-data-${timestamp}.json`;
        const downloadLink = document.getElementById('streamDataDownload');
        if (downloadLink) {
          downloadLink.href = fileUrl;
          downloadLink.download = filename;
        } else {
          const newLink = document.createElement('a');
          newLink.id = 'streamDataDownload';
          newLink.href = fileUrl;
          newLink.download = filename;
          newLink.style.display = 'none';
          document.body.appendChild(newLink);
        }
        
        // Set the API URL (used for advanced integration)
        setApiUrl(`${baseUrl}?display=true&api=${encodeURIComponent(fileUrl)}`);
        
        // Update any open display windows
        updateLiveDisplayWindows(stableReceiverUrl);
      } catch (error) {
        console.error("Error generating URLs:", error);
      }
    } else {
      setObsUrl(displayUrl);
    }
  }, [livePerson, liveSettings, updateLiveDisplayWindows, generateObsUrl, forceRefreshCount]);
  
  // Function to copy the display URL to clipboard
  const handleCopyDisplayUrl = () => {
    navigator.clipboard.writeText(liveUrl).then(
      () => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };
  
  // Function to copy the receiver URL to clipboard
  const handleCopyReceiverUrl = () => {
    navigator.clipboard.writeText(receiverUrl).then(
      () => {
        setCopyReceiverSuccess(true);
        setTimeout(() => setCopyReceiverSuccess(false), 2000);
      },
      (err) => {
        console.error("Could not copy receiver URL: ", err);
      }
    );
  };
  
  // Function to copy the OBS URL to clipboard
  const handleCopyObsUrl = () => {
    navigator.clipboard.writeText(obsUrl).then(
      () => {
        setCopyObsSuccess(true);
        setTimeout(() => setCopyObsSuccess(false), 2000);
      },
      (err) => {
        console.error("Could not copy OBS URL: ", err);
      }
    );
  };
  
  // Function to copy the API URL to clipboard
  const handleCopyApiUrl = () => {
    navigator.clipboard.writeText(apiUrl).then(
      () => {
        setCopyApiSuccess(true);
        setTimeout(() => setCopyApiSuccess(false), 2000);
      },
      (err) => {
        console.error("Could not copy API URL: ", err);
      }
    );
  };

  // Function to open the display in a new window
  const handleOpenDisplayWindow = () => {
    window.open(liveUrl, "StreamingDisplay", "width=800,height=200");
  };
  
  // Function to download the stream data file
  const handleDownloadStreamData = () => {
    const downloadLink = document.getElementById('streamDataDownload');
    if (downloadLink) {
      downloadLink.click();
    }
  };

  // Format the last updated time
  const formatLastUpdated = () => {
    const date = new Date(lastUpdated);
    return date.toLocaleTimeString();
  };

  const isLiveActive = people.some((p) => p.streaming);

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Display Controls</h3>
      
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleGoLive}
          disabled={!selectedPerson}
          style={{
            ...formButtonStyles,
            backgroundColor: !selectedPerson ? 'rgba(255, 255, 255, 0.1)' : '#3b82f6',
            color: !selectedPerson ? 'rgba(255, 255, 255, 0.5)' : 'white',
            cursor: !selectedPerson ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          <Play size={16} /> Go Live with Selected Person
        </button>
        
        <button
          onClick={handleStopStreaming}
          disabled={!livePerson || livePerson.isEmpty}
          style={{
            ...formButtonStyles,
            backgroundColor: livePerson && !livePerson.isEmpty ? '#b91c1c' : '#6b7280',
            color: livePerson && !livePerson.isEmpty ? 'white' : 'rgba(255, 255, 255, 0.5)',
            cursor: livePerson && !livePerson.isEmpty ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          <StopCircle size={16} />
          Stop Streaming
        </button>
      </div>
      
      <div>
        <div style={{ 
          marginBottom: '0.75rem', 
          padding: '0.5rem',
          backgroundColor: isLiveActive ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 0, 0, 0.2)',
          borderRadius: '0.375rem',
          border: isLiveActive ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            fontSize: '0.875rem', 
            marginBottom: '0.5rem', 
            color: isLiveActive ? '#ef4444' : 'rgba(255, 255, 255, 0.7)',
            fontWeight: isLiveActive ? 'bold' : 'normal'
          }}>
            {isLiveActive ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ 
                  display: 'inline-block', 
                  width: '0.5rem', 
                  height: '0.5rem', 
                  backgroundColor: '#ef4444',
                  borderRadius: '50%',
                  animation: 'pulse 1.5s infinite'
                }}></span>
                Currently Live: {livePerson?.name} {livePerson?.surname}
                <span style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: 'normal', 
                  marginLeft: 'auto',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  Last updated: {formatLastUpdated()}
                </span>
              </div>
            ) : 'Not currently streaming any person'}
          </div>
          
          <div style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '0.75rem'
          }}>
            {isLiveActive 
              ? 'Use these options to share the display in OBS or other streaming software.' 
              : 'Select a person and click "Go Live" to start streaming.'}
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            <button
              onClick={handleCopyDisplayUrl}
              style={{
                ...formButtonStyles,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Copy size={16} /> {copySuccess ? 'Copied!' : 'Copy URL'}
            </button>
            
            <button
              onClick={handleOpenDisplayWindow}
              style={{
                ...formButtonStyles,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <ExternalLink size={16} /> Open Display
            </button>
            
            {isLiveActive && (
              <>
                <button
                  onClick={() => setShowApiInfo(!showApiInfo)}
                  style={{
                    ...formButtonStyles,
                    backgroundColor: showApiInfo ? 'rgba(39, 174, 96, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: showApiInfo ? 'rgba(39, 174, 96, 0.8)' : 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Server size={16} /> OBS Options
                </button>
                
                {showApiInfo && (
                  <div style={{
                    width: '100%',
                    marginTop: '0.5rem',
                    padding: '0.5rem',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem'
                  }}>
                    <p style={{ 
                      marginBottom: '0.5rem', 
                      color: 'rgba(39, 174, 96, 0.8)',
                      fontWeight: 'bold'
                    }}>
                      RECOMMENDED: Dynamic URL for OBS (auto-updates when you make changes)
                    </p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      <button
                        onClick={handleCopyReceiverUrl}
                        style={{
                          ...formButtonStyles,
                          backgroundColor: 'rgba(39, 174, 96, 0.5)',
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '0.3rem 0.6rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <RefreshCw size={14} style={{ marginRight: '0.25rem' }} />
                        {copyReceiverSuccess ? 'Copied!' : 'Copy Dynamic OBS URL'}
                      </button>
                      
                      {/* Force Refresh button */}
                      <button
                        onClick={forceDataRefresh}
                        style={{
                          ...formButtonStyles,
                          backgroundColor: 'rgba(244, 114, 182, 0.7)',  // Pink color
                          color: 'white',
                          fontSize: '0.7rem',
                          padding: '0.3rem 0.6rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <RefreshCw size={14} style={{ marginRight: '0.25rem' }} />
                        Force OBS Refresh
                      </button>
                    </div>
                    
                    <p style={{ marginBottom: '0.5rem', color: 'rgba(39, 174, 96, 0.8)', marginTop: '0.5rem' }}>
                      Alternative: Static URL (requires manual update when you make changes)
                    </p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <button
                        onClick={handleCopyObsUrl}
                        style={{
                          ...formButtonStyles,
                          backgroundColor: 'rgba(39, 174, 96, 0.2)',
                          color: 'rgba(39, 174, 96, 0.8)',
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.5rem',
                        }}
                      >
                        <Copy size={14} style={{ marginRight: '0.25rem' }} />
                        {copyObsSuccess ? 'Copied!' : 'Copy Static URL'}
                      </button>
                      
                      <button
                        onClick={handleCopyApiUrl}
                        style={{
                          ...formButtonStyles,
                          backgroundColor: 'rgba(39, 174, 96, 0.2)',
                          color: 'rgba(39, 174, 96, 0.8)',
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.5rem',
                        }}
                      >
                        <Copy size={14} style={{ marginRight: '0.25rem' }} />
                        {copyApiSuccess ? 'Copied!' : 'Copy Alternative URL'}
                      </button>
                      
                      <button
                        onClick={handleDownloadStreamData}
                        style={{
                          ...formButtonStyles,
                          backgroundColor: 'rgba(39, 174, 96, 0.2)',
                          color: 'rgba(39, 174, 96, 0.8)',
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.5rem',
                        }}
                      >
                        <Download size={14} style={{ marginRight: '0.25rem' }} />
                        Download Stream Data
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)',
          padding: '0.5rem',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '0.375rem'
        }}>
          <strong>How to use with OBS:</strong>
          <ol style={{ marginTop: '0.5rem', paddingLeft: '1rem', lineHeight: '1.4' }}>
            <li>Copy the <strong>Dynamic OBS URL</strong> by clicking "OBS Options" then "Copy Dynamic OBS URL"</li>
            <li>In OBS, add a "Browser" source</li>
            <li>Paste the URL in the URL field</li>
            <li>Set width and height to match your settings (currently {liveSettings?.displayWidth || 400}×{liveSettings?.displayHeight || 120})</li>
            <li><strong>Important:</strong> Check "Refresh browser when scene becomes active" to ensure updates</li>
            <li><strong>Important:</strong> Check "Shutdown source when not visible" to force refreshing</li>
            <li>If updates are still not showing, click the "<strong>Force OBS Refresh</strong>" button to push updates</li>
            <li>Remove and add the browser source again with a fresh URL if all else fails</li>
          </ol>
          <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#f87171' }}>
            If you still don't see updates in OBS, remove the browser source and add it again with a new URL.
          </p>
        </div>
      </div>
      
      {/* Add OBS Troubleshooter component */}
      <ObsTroubleshooter />
    </div>
  );
};

export default DisplayControls; 