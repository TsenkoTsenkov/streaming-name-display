import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AppContext = createContext();

// Default settings
const defaultSettings = {
  showName: true,
  showTitles: true,
  displayStyle: "gradient", // gradient, solid, transparent, minimal
  textStyle: "bold", // normal, bold, light
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
  // Get initial state from localStorage if available
  const getInitialPeople = () => {
    try {
      const storedPeople = localStorage.getItem("streamingAppPeople");
      if (storedPeople) {
        return JSON.parse(storedPeople);
      }
    } catch (e) {
      console.error("Error loading stored people:", e);
    }
    return defaultPeople;
  };

  const getInitialSettings = () => {
    try {
      const storedSettings = localStorage.getItem("streamingAppSettings");
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
    } catch (e) {
      console.error("Error loading stored settings:", e);
    }
    return defaultSettings;
  };

  // Get initial live person
  const getInitialLivePerson = () => {
    try {
      const storedLivePerson = localStorage.getItem("streamingAppLivePerson");
      if (storedLivePerson) {
        return JSON.parse(storedLivePerson);
      }
    } catch (e) {
      console.error("Error loading stored live person:", e);
    }
    return null;
  };

  // State
  const [people, setPeople] = useState(getInitialPeople);
  const [displaySettings, setDisplaySettings] = useState(getInitialSettings);
  const [liveSettings, setLiveSettings] = useState(getInitialSettings);
  const [livePerson, setLivePerson] = useState(getInitialLivePerson);
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

  // Get selected person
  const selectedPerson = people.find((p) => p.selected) || null;

  // Save to localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem("streamingAppPeople", JSON.stringify(people));
    } catch (e) {
      console.error("Error saving people to localStorage:", e);
    }
  }, [people]);

  useEffect(() => {
    try {
      localStorage.setItem("streamingAppSettings", JSON.stringify(displaySettings));
    } catch (e) {
      console.error("Error saving settings to localStorage:", e);
    }
  }, [displaySettings]);

  // Save live person whenever it changes
  useEffect(() => {
    try {
      if (livePerson) {
        localStorage.setItem("streamingAppLivePerson", JSON.stringify(livePerson));
        localStorage.setItem("streamingAppLiveSettings", JSON.stringify(liveSettings));
      } else {
        // If no live person, store the empty display
        localStorage.setItem("streamingAppLivePerson", JSON.stringify(emptyDisplay));
        localStorage.setItem("streamingAppLiveSettings", JSON.stringify(liveSettings));
      }
      
      // Create a blob URL with the person data for OBS to access
      // This works around the localStorage limitation in OBS browser sources
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
      
      // Trigger an update event
      localStorage.setItem("streamingAppLiveUpdate", Date.now().toString());
    } catch (e) {
      console.error("Error saving live person:", e);
    }
  }, [livePerson, liveSettings]);

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

    const updatedPeople = people.map((p) =>
      p.id === editingPerson.id
        ? {
            ...p,
            name: editingPerson.name.trim(),
            surname: editingPerson.surname.trim(),
            title: editingPerson.title.trim(),
          }
        : p
    );
    
    setPeople(updatedPeople);
    
    // If we edited the live person, update the live person too
    if (editingPerson.streaming) {
      const updatedLivePerson = updatedPeople.find(p => p.id === editingPerson.id);
      setLivePerson(updatedLivePerson);
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
    const updatedSettings = {
      ...displaySettings,
      [setting]: !displaySettings[setting],
    };
    
    setDisplaySettings(updatedSettings);
    
    // If there's a live person, update live settings too
    if (livePerson) {
      setLiveSettings(updatedSettings);
    }
  };

  const handleChangeSetting = (setting, value) => {
    const updatedSettings = {
      ...displaySettings,
      [setting]: value,
    };
    
    setDisplaySettings(updatedSettings);
    
    // If there's a live person, update live settings too
    if (livePerson) {
      setLiveSettings(updatedSettings);
    }
  };

  const handleSizeChange = (setting, value) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const updatedSettings = {
        ...displaySettings,
        [setting]: numValue,
      };
      
      setDisplaySettings(updatedSettings);
      
      // If there's a live person, update live settings too
      if (livePerson) {
        setLiveSettings(updatedSettings);
      }
    }
  };

  const handleGoLive = () => {
    if (!selectedPerson) return;
    
    // Update liveSettings with current display settings
    setLiveSettings(displaySettings);
    
    // Update people to mark selected person as streaming
    const updatedPeople = people.map((p) => ({
      ...p,
      streaming: p.id === selectedPerson.id,
    }));
    
    setPeople(updatedPeople);
    
    // Set the live person
    const newLivePerson = updatedPeople.find(p => p.id === selectedPerson.id);
    setLivePerson(newLivePerson);
  };

  // Function to directly make a person go live
  const handleGoLiveWithPerson = (id) => {
    // Update people to mark this person as streaming
    const updatedPeople = people.map((p) => ({
      ...p,
      streaming: p.id === id,
      selected: p.id === id  // Also select the person
    }));
    
    setPeople(updatedPeople);
    
    // Set the live person
    const newLivePerson = updatedPeople.find(p => p.id === id);
    setLivePerson(newLivePerson);
    
    // Update liveSettings with current display settings
    setLiveSettings(displaySettings);
  };

  // Function to stop streaming
  const handleStopStreaming = () => {
    // Update people to unmark the streaming person
    const updatedPeople = people.map((p) => ({
      ...p,
      streaming: false,
    }));
    
    setPeople(updatedPeople);
    
    // Clear the live person
    setLivePerson(null);
  };

  const value = {
    people,
    setPeople,
    displaySettings,
    setDisplaySettings,
    liveSettings,
    setLiveSettings,
    livePerson,
    setLivePerson,
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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for using the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export default AppContext; 