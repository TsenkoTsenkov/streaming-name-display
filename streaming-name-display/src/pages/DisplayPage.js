import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import DisplayView from "../components/DisplayView";

// Polling interval for receiver mode (1 second)
const POLLING_INTERVAL = 1000;

const DisplayPage = () => {
  const [searchParams] = useSearchParams();
  const [person, setPerson] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiUrl] = useState(null);
  const [debugMessage, setDebugMessage] = useState("");
  const [lastUpdate, setLastUpdate] = useState(0);

  // Get mode parameters
  const isDisplay = searchParams.get("display") === "true";
  const isReceiver = searchParams.get("receiver") === "true";
  const obsMode = searchParams.get("obs") === "true";

  // Load data from localStorage or DOM element
  const loadFromLocalSources = useCallback(() => {
    // Try localStorage first
    const storedData = localStorage.getItem("streamingData");
    const streamingAppData = localStorage.getItem("streamingAppLiveUpdate");
    const dataEl = document.getElementById("data-stream-data");
    const liveDataEl = document.getElementById("liveStreamData");
    
    // Check for streamingAppLiveUpdate first (the data that's set by AppContext)
    if (streamingAppData) {
      try {
        const livePerson = JSON.parse(localStorage.getItem("streamingAppLivePerson"));
        const liveSettings = JSON.parse(localStorage.getItem("streamingAppLiveSettings"));
        
        if (livePerson) {
          const updateTime = parseInt(streamingAppData, 10);
          if (updateTime > lastUpdate) {
            setPerson(livePerson);
            setSettings(liveSettings);
            setLastUpdate(updateTime);
            setLoading(false);
            setDebugMessage("Loaded from streamingApp localStorage");
          }
          return;
        }
      } catch (err) {
        console.error("Error parsing streamingApp data", err);
      }
    }
    
    // Try legacy streamingData
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        // Only update if data has changed
        if (parsedData.lastUpdate > lastUpdate) {
          setPerson(parsedData.person);
          setSettings(parsedData.settings);
          setLastUpdate(parsedData.lastUpdate);
          setLoading(false);
          setDebugMessage("Loaded from localStorage");
        }
        return;
      } catch (err) {
        console.error("Error parsing localStorage data", err);
      }
    }
    
    // Try liveStreamData element (newer method)
    if (liveDataEl) {
      try {
        const jsonData = liveDataEl.getAttribute("data-json");
        if (jsonData) {
          const parsedData = JSON.parse(jsonData);
          if (parsedData.timestamp > lastUpdate) {
            setPerson(parsedData.person);
            setSettings(parsedData.settings);
            setLastUpdate(parsedData.timestamp);
            setLoading(false);
            setDebugMessage("Loaded from liveStreamData element");
          }
          return;
        }
      } catch (err) {
        console.error("Error parsing liveStreamData element", err);
      }
    }
    
    // Try DOM element as fallback (older method)
    if (dataEl) {
      const domData = dataEl.getAttribute("data-stream-content");
      if (domData) {
        try {
          const parsedData = JSON.parse(domData);
          // Only update if data has changed
          if (parsedData.lastUpdate > lastUpdate) {
            setPerson(parsedData.person);
            setSettings(parsedData.settings);
            setLastUpdate(parsedData.lastUpdate);
            setLoading(false);
            setDebugMessage("Loaded from DOM element");
          }
          return;
        } catch (err) {
          console.error("Error parsing DOM data", err);
        }
      }
    }
    
    // If no person data is found, use default settings
    if (!person) {
      setSettings({
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
      });
      setDebugMessage("No live data found - using defaults");
      setLoading(false);
    }
  }, [lastUpdate, person]);

  // Load data from various sources based on mode
  const loadLiveData = useCallback(async () => {
    try {
      // 1. Try to load from URL parameters (for direct links)
      const personParam = searchParams.get("person");
      const settingsParam = searchParams.get("settings");
      
      if (personParam && settingsParam) {
        try {
          const decodedPerson = JSON.parse(decodeURIComponent(personParam));
          const decodedSettings = JSON.parse(decodeURIComponent(settingsParam));
          
          // Only update if there's new data
          const personTimestamp = searchParams.get("t") || 0;
          if (parseInt(personTimestamp) > lastUpdate) {
            setPerson(decodedPerson);
            setSettings(decodedSettings);
            setLastUpdate(parseInt(personTimestamp));
            setLoading(false);
            setDebugMessage("Loaded from URL parameters");
            
            // If in receiver mode, also save this to localStorage for consistent state
            if (isReceiver) {
              try {
                localStorage.setItem("streamingAppLivePerson", JSON.stringify(decodedPerson));
                localStorage.setItem("streamingAppLiveSettings", JSON.stringify(decodedSettings));
                localStorage.setItem("streamingAppLiveUpdate", personTimestamp);
              } catch (e) {
                console.error("Error saving received data to localStorage", e);
              }
            }
          }
          return;
        } catch (err) {
          console.error("Error parsing URL parameters", err);
        }
      }
      
      // Look for personData and settingsData (alternative parameter names)
      const personDataParam = searchParams.get("personData");
      const settingsDataParam = searchParams.get("settingsData");
      
      if (personDataParam && settingsDataParam) {
        try {
          const decodedPerson = JSON.parse(decodeURIComponent(personDataParam));
          const decodedSettings = JSON.parse(decodeURIComponent(settingsDataParam));
          
          // Only update if there's new data
          const personTimestamp = searchParams.get("t") || 0;
          if (parseInt(personTimestamp) > lastUpdate) {
            setPerson(decodedPerson);
            setSettings(decodedSettings);
            setLastUpdate(parseInt(personTimestamp));
            setLoading(false);
            setDebugMessage("Loaded from URL personData parameters");
            
            // If in receiver mode, also save this to localStorage
            if (isReceiver) {
              try {
                localStorage.setItem("streamingAppLivePerson", JSON.stringify(decodedPerson));
                localStorage.setItem("streamingAppLiveSettings", JSON.stringify(decodedSettings));
                localStorage.setItem("streamingAppLiveUpdate", personTimestamp);
              } catch (e) {
                console.error("Error saving received data to localStorage", e);
              }
            }
          }
          return;
        } catch (err) {
          console.error("Error parsing personData URL parameters", err);
        }
      }
      
      // 2. Try to load from API if URL is provided
      const apiUrlParam = searchParams.get("api");
      if (apiUrlParam) {
        try {
          const apiResponse = await fetch(decodeURIComponent(apiUrlParam));
          if (apiResponse.ok) {
            const data = await apiResponse.json();
            // Check if data has changed since last update
            const dataTimestamp = data.timestamp || data.lastUpdate || Date.now();
            if (dataTimestamp > lastUpdate) {
              setPerson(data.person);
              setSettings(data.settings);
              setLastUpdate(dataTimestamp);
              setLoading(false);
              setDebugMessage("Loaded from API URL parameter");
              
              // If in receiver mode, also save this to localStorage
              if (isReceiver) {
                try {
                  localStorage.setItem("streamingAppLivePerson", JSON.stringify(data.person));
                  localStorage.setItem("streamingAppLiveSettings", JSON.stringify(data.settings));
                  localStorage.setItem("streamingAppLiveUpdate", dataTimestamp.toString());
                } catch (e) {
                  console.error("Error saving API data to localStorage", e);
                }
              }
            }
            return;
          }
        } catch (err) {
          console.error("Error fetching from API URL parameter", err);
        }
      }
      
      // 3. Try to load from API if URL is set in state
      if (apiUrl) {
        try {
          const response = await fetch(apiUrl);
          if (response.ok) {
            const data = await response.json();
            // Check if data has changed since last update
            if (data.lastUpdate > lastUpdate) {
              setPerson(data.person);
              setSettings(data.settings);
              setLastUpdate(data.lastUpdate);
              setLoading(false);
              setDebugMessage("Loaded from API");
            }
          }
          return;
        } catch (err) {
          console.error("Error fetching from API", err);
        }
      }
      
      // 4. Fall back to localStorage or DOM element
      loadFromLocalSources();
      
    } catch (err) {
      console.error("Error loading live data", err);
      setDebugMessage(`Error: ${err.message}`);
      setLoading(false);
    }
  }, [apiUrl, isReceiver, lastUpdate, loadFromLocalSources, searchParams]);

  // Handle storage change events (for localStorage communication)
  const handleStorageChange = useCallback((e) => {
    if (e.key === "streamingData") {
      loadLiveData();
    }
  }, [loadLiveData]);

  // Handle message events (for postMessage communication)
  const handleMessageEvent = useCallback((event) => {
    // Check origin for security if needed
    // For localhost development, we allow any origin
    // In production, you might want to restrict this

    // console.log("Received message event:", event);

    try {
      // Handle messages of type updateStreamingData
      if (event.data && event.data.type === "updateStreamingData") {
        const { person, settings, timestamp } = event.data;
        
        // Only update if there's new data or no existing data
        if (!lastUpdate || (timestamp && timestamp > lastUpdate) || !person) {
          setPerson(person);
          setSettings(settings);
          setLastUpdate(timestamp || Date.now());
          setLoading(false);
          setDebugMessage("Updated via direct message");
        }
        return;
      }
      
      // Handle raw data objects (without a type) as a fallback
      if (event.data && (event.data.person || event.data.settings)) {
        const { person, settings, timestamp, lastUpdate: msgLastUpdate } = event.data;
        const updateTime = timestamp || msgLastUpdate || Date.now();
        
        // Only update if there's new data or no existing data
        if (!lastUpdate || updateTime > lastUpdate) {
          if (person) setPerson(person);
          if (settings) setSettings(settings);
          setLastUpdate(updateTime);
          setLoading(false);
          setDebugMessage("Updated via direct message (raw data)");
        }
      }
    } catch (err) {
      console.error("Error processing message event:", err);
    }
  }, [lastUpdate]);

  useEffect(() => {
    // Initial load
    loadLiveData();

    // Set up polling for receiver mode
    let pollingInterval = null;
    
    if (isDisplay && isReceiver) {
      pollingInterval = setInterval(() => {
        loadLiveData();
      }, POLLING_INTERVAL);
    } else if (isDisplay) {
      // For regular display mode, listen for localStorage changes
      window.addEventListener("storage", handleStorageChange);
      
      // Listen for direct messages
      window.addEventListener("message", handleMessageEvent);
    }

    // Clean up
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("message", handleMessageEvent);
    };
  }, [isDisplay, isReceiver, handleStorageChange, loadLiveData, handleMessageEvent]);

  if (loading) {
    return (
      <div className="loading-display">
        <h2>Loading display...</h2>
      </div>
    );
  }

  if (!isDisplay) {
    return (
      <div className="display-error">
        <h2>This page is meant to be used as a display.</h2>
        <p>Please add ?display=true to the URL.</p>
      </div>
    );
  }

  if (!person && isDisplay) {
    return (
      <div className="display-waiting">
        <h2>Waiting for stream data...</h2>
        <p className="debug-info">{debugMessage}</p>
      </div>
    );
  }

  return (
    <div className="display-container" style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: obsMode ? "transparent" : "#111827",
    }}>
      <DisplayView person={person} settings={settings} />
      
      {/* Debug info (only in development) */}
      {process.env.NODE_ENV === "development" && !obsMode && (
        <div className="debug-panel" style={{
          position: "fixed",
          bottom: 10,
          left: 10,
          background: "rgba(0,0,0,0.7)",
          padding: 10,
          color: "white",
          fontSize: 12,
          maxWidth: 300,
          zIndex: 1000,
        }}>
          <p><strong>Debug Info:</strong></p>
          <p>Source: {debugMessage}</p>
          <p>Last Update: {new Date(lastUpdate).toLocaleTimeString()}</p>
          <p>Mode: {isReceiver ? "Receiver" : "Standard"} {obsMode ? "(OBS)" : ""}</p>
        </div>
      )}
    </div>
  );
};

export default DisplayPage; 