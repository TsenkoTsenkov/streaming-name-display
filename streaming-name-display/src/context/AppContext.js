import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveData, getData, listenToData } from '../utils/firebaseConfig';

// Create the context
const AppContext = createContext();

// Default settings
const defaultSettings = {
  showName: true,
  showTitles: true,
  displayStyle: "gradient", // gradient, solid, transparent, minimal
  textStyle: "bold", // normal, bold, light
  textColor: "white", // new setting for text color
  borderStyle: "thin", // none, thin, glow, accent
  textShadow: true,
  boxShadow: true,
  decorativeElements: true,
  displayWidth: 400, // Default width in pixels
  displayHeight: 120, // Default height in pixels
  fontSize: 30, // Default font size in pixels
  titleFontSize: 20, // Default title font size in pixels
  cornerRadius: 8,
  padding: 16,
  animation: "fade",
  centeredText: false,
};

// Default people
const defaultPeople = [
  {
    id: 1,
    name: "Name1",
    surname: "Surname1",
    title: "Guest Speaker",
    selected: true,
    streaming: false,
  },
  {
    id: 2,
    name: "Name2",
    surname: "Surname2",
    title: "Host",
    selected: false,
    streaming: false,
  },
  {
    id: 3,
    name: "Name3",
    surname: "Surname3",
    title: "Panelist",
    selected: false,
    streaming: false,
  },
  {
    id: 4,
    name: "Name4",
    surname: "Surname4",
    title: "Moderator",
    selected: false,
    streaming: false,
  },
];

// Placeholder for empty (no one streaming) display
const emptyDisplay = {
  id: 0,
  name: "",
  surname: "",
  title: "",
  selected: false,
  streaming: false,
  isEmpty: true, // Special flag to indicate empty state
};

// Create provider component
export const AppProvider = ({ children }) => {
  // Get initial state from Firebase if available
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // State
  const [people, setPeople] = useState(defaultPeople);
  const [displaySettings, setDisplaySettings] = useState(defaultSettings);
  const [liveSettings, setLiveSettings] = useState(defaultSettings);
  const [livePerson, setLivePerson] = useState(null);
  const [activeTab, setActiveTab] = useState("people");
  const [newPerson, setNewPerson] = useState({
    name: "",
    surname: "",
    title: "",
  });
  const [editingPerson, setEditingPerson] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewWindowRef, setPreviewWindowRef] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importedPeople, setImportedPeople] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(300); // Default sidebar width

  // Load initial data from Firebase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Load people from Firebase
        const storedPeople = await getData('people');
        if (storedPeople) {
          setPeople(storedPeople);
        }

        // Load settings from Firebase
        const storedSettings = await getData('settings');
        if (storedSettings) {
          setDisplaySettings(storedSettings);
          setLiveSettings(storedSettings);
        }

        // Load live person from Firebase
        const storedLivePerson = await getData('livePerson');
        if (storedLivePerson) {
          setLivePerson(storedLivePerson);
        }

        setInitialLoadComplete(true);
      } catch (error) {
        console.error("Error loading initial data from Firebase:", error);
        setInitialLoadComplete(true); // Still mark as complete to avoid blocking the app
      }
    };

    loadInitialData();
  }, []);

  // Set up real-time listeners for data changes once initial load is complete
  useEffect(() => {
    if (!initialLoadComplete) return;

    // Listen for live person updates
    const unsubscribeLivePerson = listenToData('livePerson', (data) => {
      if (data) {
        setLivePerson(data);
      } else {
        setLivePerson(emptyDisplay);
      }
    });

    // Listen for live settings updates
    const unsubscribeLiveSettings = listenToData('liveSettings', (data) => {
      if (data) {
        setLiveSettings(data);
      }
    });

    return () => {
      unsubscribeLivePerson();
      unsubscribeLiveSettings();
    };
  }, [initialLoadComplete]);

  // Get selected person
  const selectedPerson = people.find((p) => p.selected) || null;

  // Save to Firebase when people state changes
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    saveData('people', people).catch(error => {
      console.error("Error saving people to Firebase:", error);
    });
  }, [people, initialLoadComplete]);

  // Save settings when they change
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    saveData('settings', displaySettings).catch(error => {
      console.error("Error saving settings to Firebase:", error);
    });
  }, [displaySettings, initialLoadComplete]);

  // Save live person whenever it changes
  useEffect(() => {
    if (!initialLoadComplete) return;
    
    try {
      if (livePerson) {
        saveData('livePerson', livePerson);
        saveData('liveSettings', liveSettings);
      } else {
        // If no live person, store the empty display
        saveData('livePerson', emptyDisplay);
        saveData('liveSettings', liveSettings);
      }
      
      // Create a blob URL with the person data for OBS to access
      // This works as a backup for direct DOM access
      const liveData = {
        person: livePerson || emptyDisplay,
        settings: liveSettings,
        timestamp: Date.now()
      };
      
      const dataBlob = new Blob([JSON.stringify(liveData)], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Store the data URL in a hidden div element
      const dataEl = document.getElementById('liveStreamData');
      if (dataEl) {
        dataEl.setAttribute('data-json', JSON.stringify(liveData));
        dataEl.setAttribute('data-url', url);
      } else {
        // Create the element if it doesn't exist
        const newEl = document.createElement('div');
        newEl.id = 'liveStreamData';
        newEl.style.display = 'none';
        newEl.setAttribute('data-json', JSON.stringify(liveData));
        newEl.setAttribute('data-url', url);
        document.body.appendChild(newEl);
      }
      
      // Update all open windows with postMessage
      if (window.opener) {
        window.opener.postMessage({
          type: 'stream-update',
          data: liveData
        }, '*');
      }
      
      // Also store in localStorage as a fallback
      localStorage.setItem("streamingAppLivePerson", JSON.stringify(livePerson || emptyDisplay));
      localStorage.setItem("streamingAppLiveSettings", JSON.stringify(liveSettings));
      localStorage.setItem("streamingAppLiveUpdate", Date.now().toString());
    } catch (e) {
      console.error("Error saving live person:", e);
    }
  }, [livePerson, liveSettings, initialLoadComplete]);

  // Functions for updating state
  const handleSelectPerson = (id) => {
    setPeople(
      people.map((p) => ({
        ...p,
        selected: p.id === id,
      }))
    );
  };

  const handleAddPerson = () => {
    if (!newPerson.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    const newId = Math.max(0, ...people.map((p) => p.id)) + 1;
    
    setPeople([
      ...people,
      {
        id: newId,
        name: newPerson.name.trim(),
        surname: newPerson.surname.trim(),
        title: newPerson.title.trim(),
        selected: false,
        streaming: false,
      },
    ]);
    
    setNewPerson({ name: "", surname: "", title: "" });
    setErrorMessage("");
  };

  const handleRemovePerson = (id) => {
    // Check if this is the live person
    const isLivePerson = people.find(p => p.id === id && p.streaming);
    
    if (isLivePerson) {
      // Stop streaming first
      handleStopStreaming();
    }
    
    setPeople(people.filter((p) => p.id !== id));
  };

  const handleStartEdit = (person) => {
    setEditingPerson({ ...person });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingPerson.name.trim()) {
      setErrorMessage("Name is required");
      return;
    }

    setPeople(
      people.map((p) =>
        p.id === editingPerson.id
          ? {
              ...p,
              name: editingPerson.name.trim(),
              surname: editingPerson.surname.trim(),
              title: editingPerson.title.trim(),
            }
          : p
      )
    );
    
    // If the edited person is live, update the live person too
    if (livePerson && livePerson.id === editingPerson.id) {
      setLivePerson({
        ...livePerson,
        name: editingPerson.name.trim(),
        surname: editingPerson.surname.trim(),
        title: editingPerson.title.trim(),
      });
    }
    
    setIsEditModalOpen(false);
    setEditingPerson(null);
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingPerson(null);
    setErrorMessage("");
  };

  const handleToggleSetting = (setting) => {
    setDisplaySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleChangeSetting = (setting, value) => {
    setDisplaySettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSizeChange = (setting, value) => {
    // Make sure value is a number and within range
    const numValue = Number(value);
    
    let finalValue = numValue;
    if (isNaN(numValue)) {
      finalValue = displaySettings[setting];
    }
    
    setDisplaySettings((prev) => ({
      ...prev,
      [setting]: finalValue,
    }));
  };

  const handleGoLive = () => {
    if (!selectedPerson) return;
    
    // Update the live person with the selected person
    setLivePerson(selectedPerson);
    
    // Update liveSettings with current display settings
    setLiveSettings({ ...displaySettings });
    
    // Mark the person as streaming
    setPeople(
      people.map((p) => ({
        ...p,
        streaming: p.id === selectedPerson.id,
      }))
    );
    
    // Also update Firebase with real-time streaming state
    saveData('streamingState', {
      active: true,
      personId: selectedPerson.id,
      timestamp: Date.now()
    });
    
    // Update preview window
    updatePreviewWindow();
  };

  // New function to stop streaming and show nothing
  const handleStopStreaming = () => {
    // Set empty person as the live person
    setLivePerson(emptyDisplay);
    
    // Update liveSettings with current display settings
    setLiveSettings({ ...displaySettings });
    
    // Mark all people as not streaming
    setPeople(
      people.map((p) => ({
        ...p,
        streaming: false,
      }))
    );
    
    // Also update Firebase with empty streaming state
    saveData('streamingState', {
      active: false,
      personId: null,
      timestamp: Date.now()
    });
    
    // Update preview window
    updatePreviewWindow();
  };

  const handleGoLiveWithPerson = (id) => {
    const personToStream = people.find((p) => p.id === id);
    if (!personToStream) return;
    
    // First select this person
    setPeople(
      people.map((p) => ({
        ...p,
        selected: p.id === id,
        streaming: p.id === id,
      }))
    );
    
    // Then set as live
    setLivePerson(personToStream);
    
    // Update liveSettings with current display settings
    setLiveSettings({ ...displaySettings });
    
    // Also update Firebase with real-time streaming state
    saveData('streamingState', {
      active: true,
      personId: id,
      timestamp: Date.now()
    });
    
    // Update preview window
    updatePreviewWindow();
  };

  const updatePreviewWindow = () => {
    if (previewWindowRef && !previewWindowRef.closed) {
      try {
        // Send a message to the preview window to update
        previewWindowRef.postMessage({
          type: 'stream-update',
          data: {
            person: livePerson || emptyDisplay,
            settings: liveSettings,
            timestamp: Date.now()
          }
        }, '*');
      } catch (e) {
        console.error("Error updating preview window:", e);
      }
    }
  };

  // Functions for importing people
  const handleImportPeople = (peopleArray) => {
    // Generate new IDs for imported people
    let nextId = Math.max(0, ...people.map(p => p.id)) + 1;
    
    const newPeople = peopleArray.map(person => ({
      ...person,
      id: nextId++,
      selected: false,
      streaming: false
    }));
    
    setPeople([...people, ...newPeople]);
    setIsImportModalOpen(false);
    setImportedPeople([]);
  };

  return (
    <AppContext.Provider
      value={{
        people,
        setPeople,
        displaySettings,
        setDisplaySettings,
        livePerson,
        setLivePerson,
        liveSettings,
        setLiveSettings,
        activeTab,
        setActiveTab,
        newPerson,
        setNewPerson,
        editingPerson,
        setEditingPerson,
        isEditModalOpen,
        setIsEditModalOpen,
        dragActive,
        setDragActive,
        previewWindowRef,
        setPreviewWindowRef,
        isImportModalOpen,
        setIsImportModalOpen,
        importedPeople,
        setImportedPeople,
        errorMessage,
        setErrorMessage,
        sidebarWidth,
        setSidebarWidth,
        selectedPerson,
        handleSelectPerson,
        handleAddPerson,
        handleRemovePerson,
        handleStartEdit,
        handleSaveEdit,
        handleCancelEdit,
        handleToggleSetting,
        handleChangeSetting,
        handleSizeChange,
        handleGoLive,
        handleGoLiveWithPerson,
        handleStopStreaming,
        handleImportPeople,
        updatePreviewWindow,
        initialLoadComplete,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  return useContext(AppContext);
};

export default AppContext; 