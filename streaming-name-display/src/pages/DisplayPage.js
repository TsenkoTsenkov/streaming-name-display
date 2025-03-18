import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import DisplayView from "../components/DisplayView";
import { getData, listenToData } from '../utils/firebaseConfig';

// Empty person to display when nothing is streaming - completely empty
const EMPTY_PERSON = {
  id: 0,
  name: "",
  surname: "",
  title: "",
  streaming: false,
  isEmpty: true
};

// Default settings if none are provided
const DEFAULT_SETTINGS = {
  displayWidth: 400,
  displayHeight: 120,
  fontSize: 32,
  titleFontSize: 18,
  displayStyle: "gradient",
  borderStyle: "thin",
  textStyle: "normal",
  animation: "fade",
  showName: true,
  showTitles: true,
  textShadow: true,
  boxShadow: true,
  cornerRadius: 8,
  padding: 16,
  decorativeElements: false
};

const DisplayPage = () => {
  const [person, setPerson] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debugMessage, setDebugMessage] = useState("");
  const [lastUpdate, setLastUpdate] = useState(0);
  const refreshCountRef = useRef(0);
  const firebaseUnsubscribeRef = useRef(null);

  // Use useMemo to create URL parameters to prevent unnecessary re-rendering
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);
  const obsMode = urlParams.get("obs") === "true";
  const refreshParam = urlParams.get("t"); // Timestamp param for forced refresh

  // Load data from local sources as fallback
  const loadFromLocalSources = useCallback(() => {
    console.log("Loading from local sources (fallback)");
    // Try localStorage first
    const liveDataEl = document.getElementById("liveStreamData");
    
    // Check for streamingAppLiveUpdate first (the data that's set by AppContext)
    const streamingAppData = localStorage.getItem("streamingAppLiveUpdate");
    if (streamingAppData) {
      try {
        const livePerson = JSON.parse(localStorage.getItem("streamingAppLivePerson"));
        const liveSettings = JSON.parse(localStorage.getItem("streamingAppLiveSettings"));
        
        if (livePerson) {
          const updateTime = parseInt(streamingAppData, 10);
          if (updateTime > lastUpdate) {
            // Check if the livePerson is empty (has empty name or is not properly initialized)
            const isEmptyPerson = !livePerson.name || livePerson.name === '';
            
            if (isEmptyPerson) {
              console.log("Empty person data found, using default", EMPTY_PERSON);
              setPerson(EMPTY_PERSON);
            } else {
              console.log("Loaded from streamingApp localStorage", livePerson);
              setPerson(livePerson);
            }
            
            setSettings(liveSettings || DEFAULT_SETTINGS);
            setLastUpdate(updateTime);
            setLoading(false);
            setDebugMessage(isEmptyPerson ? "Using default person (empty data found)" : "Loaded from streamingApp localStorage");
          }
          return true;
        }
      } catch (err) {
        console.error("Error parsing streamingApp data", err);
      }
    }
    
    // Try liveStreamData element (newer method)
    if (liveDataEl) {
      try {
        const jsonData = liveDataEl.getAttribute("data-json");
        if (jsonData) {
          const parsedData = JSON.parse(jsonData);
          if (parsedData.timestamp > lastUpdate) {
            // Check for empty person data
            if (!parsedData.person || !parsedData.person.name || parsedData.person.name === '') {
              console.log("Empty person in liveStreamData, using default");
              setPerson(EMPTY_PERSON);
            } else {
              setPerson(parsedData.person);
            }
            setSettings(parsedData.settings || DEFAULT_SETTINGS);
            setLastUpdate(parsedData.timestamp);
            setLoading(false);
            setDebugMessage("Loaded from liveStreamData element");
          }
          return true;
        }
      } catch (err) {
        console.error("Error parsing liveStreamData element", err);
      }
    }
    
    // If nothing worked, use default settings
    if (!person && !settings) {
      console.log("No data found in any source, using defaults");
      setPerson(EMPTY_PERSON);
      setSettings(DEFAULT_SETTINGS);
      setLoading(false);
      setDebugMessage("Using default data (no local data found)");
      return true;
    }
    
    return false;
  }, [lastUpdate, person, settings]);

  // Load data from Firebase and fall back to other sources if needed
  const loadLiveData = useCallback(async () => {
    console.log("Loading live data from Firebase");
    
    try {
      // First check URL parameters (for direct links)
      const personParam = urlParams.get("person");
      const settingsParam = urlParams.get("settings");
      const timestamp = urlParams.get("t") || '0';
      
      if (personParam && settingsParam) {
        try {
          const decodedPerson = JSON.parse(decodeURIComponent(personParam));
          const decodedSettings = JSON.parse(decodeURIComponent(settingsParam));
          
          // Only update if there's new data
          if (parseInt(timestamp, 10) > lastUpdate) {
            // Check for empty person data
            if (!decodedPerson || !decodedPerson.name || decodedPerson.name === '') {
              console.log("Empty person in URL parameters, using default");
              setPerson(EMPTY_PERSON);
            } else {
              setPerson(decodedPerson);
            }
            
            setSettings(decodedSettings || DEFAULT_SETTINGS);
            setLastUpdate(parseInt(timestamp, 10));
            setLoading(false);
            setDebugMessage("Loaded from URL parameters");
            return true;
          }
        } catch (err) {
          console.error("Error parsing URL parameters", err);
        }
      }
      
      // Try to load from Firebase
      const livePerson = await getData('livePerson');
      const liveSettings = await getData('liveSettings');
      const streamingState = await getData('streamingState');
      
      if (streamingState && streamingState.timestamp > lastUpdate) {
        if (livePerson) {
          // Check if the livePerson is empty
          const isEmptyPerson = !livePerson.name || livePerson.name === '';
          
          if (isEmptyPerson) {
            console.log("Empty person data found in Firebase, using default");
            setPerson(EMPTY_PERSON);
          } else {
            console.log("Loaded person from Firebase", livePerson);
            setPerson(livePerson);
          }
          
          setSettings(liveSettings || DEFAULT_SETTINGS);
          setLastUpdate(streamingState.timestamp);
          setLoading(false);
          setDebugMessage("Loaded from Firebase");
          return true;
        }
      }
      
      // If Firebase data was not found or outdated, try local sources
      return loadFromLocalSources();
    } catch (error) {
      console.error("Error loading from Firebase:", error);
      // Fall back to local sources if Firebase fails
      return loadFromLocalSources();
    }
  }, [urlParams, lastUpdate, loadFromLocalSources]);

  // Force a refresh when the refreshParam (timestamp) changes
  useEffect(() => {
    if (refreshParam) {
      console.log("Refresh param changed", refreshParam);
      refreshCountRef.current++;
      // Clear any cached data
      setLoading(true);
      
      // Small delay to ensure load state is visible
      setTimeout(() => {
        loadLiveData();
      }, 100);
    }
  }, [refreshParam, loadLiveData]);

  // Set up Firebase realtime listeners
  useEffect(() => {
    console.log("Setting up Firebase realtime listeners");
    
    // Unsubscribe from any existing listeners
    if (firebaseUnsubscribeRef.current) {
      firebaseUnsubscribeRef.current();
    }
    
    // Listen for streaming state changes
    const unsubscribeStreamingState = listenToData('streamingState', (data) => {
      if (data && data.timestamp > lastUpdate) {
        console.log("Received streaming state update from Firebase", data);
        // Load the updated data
        loadLiveData();
      }
    });
    
    // Store the unsubscribe function
    firebaseUnsubscribeRef.current = () => {
      unsubscribeStreamingState();
    };
    
    return () => {
      if (firebaseUnsubscribeRef.current) {
        firebaseUnsubscribeRef.current();
      }
    };
  }, [lastUpdate, loadLiveData]);

  // Initial data load and setup event listeners
  useEffect(() => {
    console.log("Initial setup for DisplayPage");
    
    // Disable caching with meta tags
    const addNoCacheMetaTags = () => {
      // Only add if they don't exist
      if (!document.querySelector('meta[http-equiv="Cache-Control"]')) {
        const cacheControlMeta = document.createElement('meta');
        cacheControlMeta.setAttribute('http-equiv', 'Cache-Control');
        cacheControlMeta.setAttribute('content', 'no-cache, no-store, must-revalidate');
        document.head.appendChild(cacheControlMeta);
      }
      
      if (!document.querySelector('meta[http-equiv="Pragma"]')) {
        const pragmaMeta = document.createElement('meta');
        pragmaMeta.setAttribute('http-equiv', 'Pragma');
        pragmaMeta.setAttribute('content', 'no-cache');
        document.head.appendChild(pragmaMeta);
      }
      
      if (!document.querySelector('meta[http-equiv="Expires"]')) {
        const expiresMeta = document.createElement('meta');
        expiresMeta.setAttribute('http-equiv', 'Expires');
        expiresMeta.setAttribute('content', '0');
        document.head.appendChild(expiresMeta);
      }
    };
    
    addNoCacheMetaTags();
    loadLiveData();
    
    // Set page title to help identify in OBS
    document.title = obsMode ? "OBS Streaming Display (Firebase)" : "Streaming Display (Firebase)";
    
    // Listen for storage changes (for cross-tab communication)
    const handleStorageChange = (e) => {
      if (e.key === "streamingAppLiveUpdate" || e.key === "streamingData") {
        console.log("Storage changed", e.key);
        // Only use this as a fallback
        if (!firebaseUnsubscribeRef.current) {
          loadFromLocalSources();
        }
      }
    };
    
    // Listen for postMessage events from parent window
    const handleMessage = (event) => {
      if (event.data && (event.data.type === "STREAMING_UPDATE" || event.data.type === "stream-update")) {
        const { person: newPerson, settings: newSettings, timestamp } = event.data.data;
        console.log("Received message update", event.data);
        if (timestamp > lastUpdate) {
          if (!newPerson || !newPerson.name || newPerson.name === '') {
            setPerson(EMPTY_PERSON);
          } else {
            setPerson(newPerson);
          }
          setSettings(newSettings || DEFAULT_SETTINGS);
          setLastUpdate(timestamp);
          setLoading(false);
          setDebugMessage("Updated via window message");
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("message", handleMessage);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("message", handleMessage);
    };
  }, [loadLiveData, loadFromLocalSources, lastUpdate, obsMode]);

  // Return appropriate styles based on mode
  const getContainerStyles = () => {
    const baseStyles = {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    };
    
    // For OBS mode, use transparent background
    if (obsMode) {
      return {
        ...baseStyles,
        background: 'transparent'
      };
    }
    
    // Regular display mode
    return {
      ...baseStyles,
      background: 'rgb(30, 30, 30)'
    };
  };

  // Define styles
  const loadingStyles = {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: '14px',
    opacity: 0.7
  };

  const debugContainerStyles = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    padding: '4px',
    fontSize: '10px',
    zIndex: 1000
  };

  const debugMsgStyles = {
    textAlign: 'center',
    margin: '2px 0'
  };

  return (
    <div style={getContainerStyles()}>
      {/* Display debug info when in development or enabled */}
      {(process.env.NODE_ENV === "development" || urlParams.get("debug") === "true") && !obsMode && (
        <div style={debugContainerStyles}>
          {debugMessage && <div style={debugMsgStyles}>{debugMessage}</div>}
          <div style={debugMsgStyles}>
            Last Update: {new Date(lastUpdate).toLocaleTimeString()}
            {refreshCountRef.current > 0 && ` (${refreshCountRef.current} refreshes)`}
          </div>
        </div>
      )}
      
      {/* While loading, show a loading indicator */}
      {loading ? (
        <div style={loadingStyles}>Loading display data...</div>
      ) : (
        /* When not loading, show the display view if we have a person */
        person && settings && <DisplayView person={person} settings={settings} />
      )}
    </div>
  );
};

export default DisplayPage; 