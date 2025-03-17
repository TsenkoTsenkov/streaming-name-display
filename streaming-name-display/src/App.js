// Import necessary icons from Lucide
import {
  X,
  Copy,
  ExternalLink,
  Upload,
  Check,
  AlertCircle,
  Edit,
  Save,
  Eye,
  Sliders,
  ChevronRight,
  Video,
  Palette,
  Type,
  Monitor,
  HelpCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// This component represents what would be displayed on the separate display page
const DisplayView = ({ person, settings }) => {
  if (!person) return null;

  // Format the displayed name based on settings
  const formattedName = settings.showName
    ? person.surname
      ? `${person.name} ${person.surname}`
      : person.name
    : "";

  // Style variables based on settings
  const getBackgroundStyle = () => {
    switch (settings.displayStyle) {
      case "gradient":
        return {
          background:
            "linear-gradient(to right, rgba(49, 46, 129, 0.9), rgba(88, 28, 135, 0.9))",
          backdropFilter: "blur(4px)",
        };
      case "solid":
        return {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(4px)",
        };
      case "transparent":
        return {
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(4px)",
        };
      case "minimal":
        return { backgroundColor: "transparent" };
      default:
        return {
          background:
            "linear-gradient(to right, rgba(49, 46, 129, 0.9), rgba(88, 28, 135, 0.9))",
          backdropFilter: "blur(4px)",
        };
    }
  };

  const getBorderStyle = () => {
    switch (settings.borderStyle) {
      case "none":
        return {};
      case "thin":
        return { border: "1px solid rgba(255, 255, 255, 0.3)" };
      case "glow":
        return { boxShadow: "0 0 0 2px rgba(168, 85, 247, 0.5)" };
      case "accent":
        return {
          borderLeft: "4px solid #ec4899",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          borderRight: "1px solid rgba(255, 255, 255, 0.2)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        };
      default:
        return { border: "1px solid rgba(255, 255, 255, 0.2)" };
    }
  };

  const getTextShadow = () => {
    return settings.textShadow
      ? { textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)" }
      : {};
  };

  const getTextStyle = () => {
    switch (settings.textStyle) {
      case "normal":
        return { fontWeight: 400 };
      case "bold":
        return { fontWeight: 700 };
      case "light":
        return { fontWeight: 300 };
      default:
        return { fontWeight: 400 };
    }
  };

  const containerStyles = {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    padding: "1rem",
  };

  const displayStyles = {
    borderRadius: "0.5rem",
    padding: "1.5rem",
    textAlign: "center",
    width: "100%",
    maxWidth: "28rem",
    transition: "all 0.5s",
    position: "relative",
    overflow: "hidden",
    ...getBackgroundStyle(),
    ...getBorderStyle(),
    boxShadow: settings.boxShadow
      ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
      : "none",
  };

  const nameStyles = {
    fontSize: "1.875rem",
    color: "white",
    marginBottom: "0.5rem",
    position: "relative",
    zIndex: 10,
    ...getTextStyle(),
    ...getTextShadow(),
  };

  const titleStyles = {
    fontSize: "1.25rem",
    color: "rgba(255, 255, 255, 0.9)",
    fontStyle: "italic",
    position: "relative",
    zIndex: 10,
    ...getTextShadow(),
  };

  return (
    <div style={containerStyles}>
      {/* Main display area with styling based on settings */}
      <div style={displayStyles}>
        {/* Decorative elements - optional based on settings */}
        {settings.decorativeElements && (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "1px",
                background: "linear-gradient(to right, #ec4899, #a855f7)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                top: "-5rem",
                left: "-5rem",
                width: "10rem",
                height: "10rem",
                borderRadius: "50%",
                backgroundColor: "rgba(236, 72, 153, 0.2)",
                filter: "blur(64px)",
              }}
            ></div>
            <div
              style={{
                position: "absolute",
                bottom: "-5rem",
                right: "-5rem",
                width: "10rem",
                height: "10rem",
                borderRadius: "50%",
                backgroundColor: "rgba(168, 85, 247, 0.2)",
                filter: "blur(64px)",
              }}
            ></div>
          </>
        )}

        {settings.showName && formattedName && (
          <h1 style={nameStyles}>{formattedName}</h1>
        )}
        {settings.showTitles && person.title && (
          <h2 style={titleStyles}>{person.title}</h2>
        )}
      </div>
    </div>
  );
};

export const StreamingApp = () => {
  // Check if we're in display mode from the URL
  const isDisplayMode = useMemo(() => {
    return window.location.search.includes("display=true");
  }, []);

  // Get stored settings and people from localStorage if available
  const getInitialPeople = () => {
    try {
      const storedPeople = localStorage.getItem("streamingAppPeople");
      if (storedPeople) {
        return JSON.parse(storedPeople);
      }
    } catch (e) {
      console.error("Error loading stored people:", e);
    }

    return [
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

    return {
      showName: true,
      showTitles: true,
      displayStyle: "gradient", // gradient, solid, transparent, minimal
      textStyle: "bold", // normal, bold, light
      borderStyle: "thin", // none, thin, glow, accent
      textShadow: true,
      boxShadow: true,
      decorativeElements: true,
    };
  };

  // All state definitions grouped together at the top
  const [people, setPeople] = useState(getInitialPeople);
  const [displaySettings, setDisplaySettings] = useState(getInitialSettings);
  const [newPerson, setNewPerson] = useState({
    name: "",
    surname: "",
    title: "",
  });
  const [isDisplayActive, setIsDisplayActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    surname: "",
    title: "",
  });
  const [currentTab, setCurrentTab] = useState("people"); // people, appearance, preview
  const [previewWindow, setPreviewWindow] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);

  // For demo purposes, generate a display URL
  const displayUrl = window.location.href.split("?")[0] + "?display=true";

  // Currently streaming person
  const streamingPerson = people.find((person) => person.streaming) || null;

  // Save to localStorage whenever people or settings change
  useEffect(() => {
    try {
      localStorage.setItem("streamingAppPeople", JSON.stringify(people));
    } catch (e) {
      console.error("Error saving people to localStorage:", e);
    }
  }, [people]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "streamingAppSettings",
        JSON.stringify(displaySettings),
      );
    } catch (e) {
      console.error("Error saving settings to localStorage:", e);
    }
  }, [displaySettings]);

  // Handle selecting a person
  const handleSelectPerson = (id) => {
    setPeople(
      people.map((person) => ({
        ...person,
        selected: person.id === id,
      })),
    );
  };

  // Handle streaming a person
  const handleStreamPerson = (id) => {
    setPeople(
      people.map((person) => ({
        ...person,
        streaming: person.id === id ? !person.streaming : false,
      })),
    );
    // Make sure preview is active when streaming
    if (!isDisplayActive) {
      setIsDisplayActive(true);
    }
  };

  // Handle adding a new person
  const handleAddPerson = () => {
    if (newPerson.name.trim() === "") return;

    const newId = Math.max(...people.map((p) => p.id), 0) + 1;
    setPeople([
      ...people,
      {
        id: newId,
        name: newPerson.name,
        surname: newPerson.surname,
        title: newPerson.title,
        selected: false,
        streaming: false,
      },
    ]);
    setNewPerson({ name: "", surname: "", title: "" });
  };

  // Start editing a person
  const handleStartEdit = (person) => {
    setEditingId(person.id);
    setEditForm({
      name: person.name,
      surname: person.surname,
      title: person.title,
    });
  };

  // Save edits to a person
  const handleSaveEdit = () => {
    if (editForm.name.trim() === "") return;

    setPeople(
      people.map((person) =>
        person.id === editingId
          ? {
              ...person,
              name: editForm.name,
              surname: editForm.surname,
              title: editForm.title,
            }
          : person,
      ),
    );
    setEditingId(null);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
  };

  // Handle removing a person
  const handleRemovePerson = (id) => {
    // If we're removing the currently streaming person, stop streaming
    const personToRemove = people.find((person) => person.id === id);
    if (personToRemove && personToRemove.streaming) {
      setIsDisplayActive(false);
    }
    setPeople(people.filter((person) => person.id !== id));
  };

  // Handle toggling display settings
  const handleToggleSetting = (setting) => {
    setDisplaySettings({
      ...displaySettings,
      [setting]: !displaySettings[setting],
    });
  };

  // Handle changing a display setting
  const handleChangeSetting = (setting, value) => {
    setDisplaySettings({
      ...displaySettings,
      [setting]: value,
    });
  };

  // Handle toggling display view with animation
  const handleDisplayToggle = () => {
    setIsDisplayActive(!isDisplayActive);
  };

  // Handle copying display URL
  const handleCopyDisplayUrl = () => {
    navigator.clipboard
      .writeText(displayUrl)
      .then(() => {
        alert("Display URL copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy URL: ", err);
      });
  };

  // Open a new window with the display
  const handleOpenDisplayWindow = () => {
    const width = 800;
    const height = 200;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const features = `width=${width},height=${height},left=${left},top=${top}`;

    // Close previous window if it exists
    if (previewWindow && !previewWindow.closed) {
      previewWindow.close();
    }

    // Open new window
    const newWindow = window.open(displayUrl, "displayPreview", features);
    setPreviewWindow(newWindow);
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Since we can't actually read Excel files in this demo,
      // we'll just pretend we uploaded some data
      setTimeout(() => {
        const mockData = [
          { Name: "John", Surname: "Doe", Title: "Guest Speaker" },
          { Name: "Jane", Surname: "Smith", Title: "Host" },
          { Name: "Mike", Surname: "Johnson", Title: "Panelist" },
        ];

        // Map Excel data to our people structure
        const newPeople = mockData.map((row, index) => {
          return {
            id: Math.max(...people.map((p) => p.id), 0) + index + 1,
            name: row.Name || `Person ${index + 1}`,
            surname: row.Surname || "",
            title: row.Title || "",
            selected: false,
            streaming: false,
          };
        });

        // Add new people to our list
        setPeople([...people, ...newPeople]);
        setUploadStatus({
          success: true,
          message: `Successfully imported ${newPeople.length} people from Excel`,
        });

        setIsUploading(false);
      }, 1000);
    } catch (error) {
      console.error("Error processing Excel file:", error);
      setUploadStatus({
        success: false,
        message:
          "Error processing the file. Make sure it's a valid Excel spreadsheet.",
      });
      setIsUploading(false);
    }

    // Reset the file input
    event.target.value = "";
  };

  // Styles for display mode - shown when display=true is in URL
  const displayModeStyles = {
    width: "100%",
    height: "100%",
    background: "transparent",
    margin: 0,
    padding: 0,
  };

  // If we're in display mode, only render the DisplayView component
  if (isDisplayMode) {
    return (
      <div style={displayModeStyles}>
        {streamingPerson ? (
          <DisplayView person={streamingPerson} settings={displaySettings} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <div
              style={{
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.7)",
                padding: "1rem",
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                No one is currently streaming
              </div>
              <div style={{ fontSize: "0.875rem" }}>
                Select a person and click "Stream" to display them
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main app styles
  const appStyles = {
    display: "flex",
    height: "100vh",
    background: "linear-gradient(to bottom right, #111827, #1F2937, #111827)",
    color: "white",
    fontFamily: "sans-serif",
    overflow: "hidden",
  };

  // Sidebar styles
  const sidebarStyles = {
    width: "25%",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    background: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(4px)",
    borderRight: "1px solid rgba(255, 255, 255, 0.1)",
    overflowY: "auto",
  };

  // Center content styles
  const centerContentStyles = {
    width: "50%",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  // Title styles
  const titleStyles = {
    fontSize: "1.875rem",
    marginBottom: "2rem",
    fontWeight: "bold",
    background: "linear-gradient(to right, #93C5FD, #D8B4FE)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    color: "transparent",
  };

  // Tab navigation styles
  const tabNavStyles = {
    display: "flex",
    marginBottom: "1rem",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "0.5rem",
    padding: "0.25rem",
  };

  // Tab button styles
  const getTabButtonStyles = (tab) => ({
    flex: 1,
    padding: "0.5rem 0",
    borderRadius: "0.375rem",
    transition: "all 0.2s",
    backgroundColor:
      currentTab === tab ? "rgba(255, 255, 255, 0.2)" : "transparent",
    color: currentTab === tab ? "white" : "rgba(255, 255, 255, 0.5)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });

  // Person card styles
  const getPersonCardStyles = (person) => ({
    padding: "1rem",
    backgroundColor: person.streaming
      ? "rgba(20, 83, 45, 0.3)"
      : "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(4px)",
    borderRadius: "0.5rem",
    color: "white",
    transition: "all 0.3s",
    marginBottom: "0.5rem",
    border: person.selected
      ? "4px solid #3B82F6"
      : person.streaming
        ? "1px solid rgba(34, 197, 94, 0.5)"
        : "1px solid rgba(255, 255, 255, 0.1)",
  });

  // Button styles
  const buttonStyles = {
    primary: {
      padding: "0.5rem 1rem",
      backgroundColor: "#3B82F6",
      color: "white",
      border: "none",
      borderRadius: "0.375rem",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    secondary: {
      padding: "0.5rem 1rem",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: "rgba(255, 255, 255, 0.7)",
      border: "none",
      borderRadius: "0.375rem",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    danger: {
      padding: "0.5rem 1rem",
      backgroundColor: "#DC2626",
      color: "white",
      border: "none",
      borderRadius: "0.375rem",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    success: {
      padding: "0.5rem 1rem",
      backgroundColor: "#16A34A",
      color: "white",
      border: "none",
      borderRadius: "0.375rem",
      cursor: "pointer",
      transition: "background-color 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    icon: {
      padding: "0.5rem",
      backgroundColor: "transparent",
      color: "rgba(255, 255, 255, 0.5)",
      border: "none",
      borderRadius: "0.375rem",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  // Input styles
  const inputStyles = {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "0.375rem",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    backgroundColor: "#1F2937",
    color: "white",
    outline: "none",
    marginBottom: "0.5rem",
  };

  // Preview container styles
  const previewContainerStyles = {
    marginTop: "1rem",
    width: "100%",
    maxWidth: "36rem",
  };

  // Preview header styles
  const previewHeaderStyles = {
    background: "linear-gradient(to right, #1F2937, #111827)",
    color: "white",
    padding: "0.75rem 1.5rem",
    fontSize: "1.125rem",
    borderTopLeftRadius: "0.5rem",
    borderTopRightRadius: "0.5rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  };

  // Preview content styles
  const previewContentStyles = {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(4px)",
    borderBottomLeftRadius: "0.5rem",
    borderBottomRightRadius: "0.5rem",
    padding: "1.5rem",
    width: "100%",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  };

  // Preview area styles
  const previewAreaStyles = {
    border: "1px dashed rgba(255, 255, 255, 0.2)",
    padding: "2rem",
    borderRadius: "0.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "10rem",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  };

  // Quick settings container styles
  const quickSettingsContainerStyles = {
    marginTop: "1.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "1rem",
  };

  // Style presets container styles
  const stylePresetsContainerStyles = {
    marginTop: "1.5rem",
  };

  // Style preset button styles
  const stylePresetButtonStyles = (preset) => ({
    padding: "0.75rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    transition: "all 0.2s",
    textAlign: "center",
    cursor: "pointer",
    background:
      preset === "gradient"
        ? "linear-gradient(to right, rgba(49, 46, 129, 0.9), rgba(88, 28, 135, 0.9))"
        : preset === "minimal"
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(0, 0, 0, 0.4)",
    borderLeft: preset === "accented" ? "4px solid #EC4899" : undefined,
  });

  // Settings section styles
  const settingsSectionStyles = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    marginBottom: "1rem",
  };

  // Settings heading styles
  const settingsHeadingStyles = {
    fontSize: "1.125rem",
    fontWeight: "500",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
  };

  // Settings option styles
  const settingsOptionStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem",
    borderRadius: "0.5rem",
    transition: "background-color 0.2s",
    marginBottom: "0.75rem",
  };

  // Toggle switch container styles
  const toggleSwitchContainerStyles = {
    display: "inline-flex",
    alignItems: "center",
    cursor: "pointer",
  };

  // Toggle switch styles
  const toggleSwitchStyles = (isActive) => ({
    width: "2.75rem",
    height: "1.5rem",
    backgroundColor: isActive
      ? "rgba(37, 99, 235, 0.8)"
      : "rgba(55, 65, 81, 0.5)",
    borderRadius: "9999px",
    position: "relative",
    transition: "background-color 0.2s",
  });

  // Toggle switch knob styles
  const toggleSwitchKnobStyles = (isActive) => ({
    position: "absolute",
    top: "2px",
    left: isActive ? "calc(100% - 1.25rem - 2px)" : "2px",
    backgroundColor: "white",
    border: "1px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "9999px",
    height: "1.25rem",
    width: "1.25rem",
    transition: "all 0.2s",
  });

  // Import container styles
  const importContainerStyles = {
    border: "1px dashed rgba(255, 255, 255, 0.2)",
    borderRadius: "0.5rem",
    padding: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    textAlign: "center",
    marginTop: "1rem",
  };

  // Upload area styles
  const uploadAreaStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "5rem",
    border: "2px dashed rgba(255, 255, 255, 0.2)",
    borderRadius: "0.5rem",
    cursor: "pointer",
    backgroundColor: "rgba(31, 41, 55, 0.5)",
    transition: "background-color 0.2s",
  };

  // Modal overlay styles
  const modalOverlayStyles = {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    backdropFilter: "blur(4px)",
  };

  // Modal container styles
  const modalContainerStyles = {
    background: "linear-gradient(to bottom, #111827, #000000)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "0.5rem",
    padding: "1.5rem",
    maxWidth: "42rem",
    width: "100%",
    maxHeight: "80vh",
    overflowY: "auto",
  };

  // Modal header styles
  const modalHeaderStyles = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  };

  // Fixed preview styles
  const fixedPreviewStyles = {
    position: "fixed",
    top: "1rem",
    right: "1rem",
    zIndex: 50,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    animation: "fadeIn 0.5s ease-in",
  };

  // Render main app
  return (
    <div style={appStyles}>
      {/* Left sidebar - People Management */}
      <div style={sidebarStyles}>
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              background: "linear-gradient(to right, #93C5FD, #D8B4FE)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Streamer
          </h2>
          <button
            onClick={() => setShowTutorial(true)}
            style={{ ...buttonStyles.icon, color: "rgba(255, 255, 255, 0.6)" }}
          >
            <HelpCircle size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={tabNavStyles}>
          <button
            style={getTabButtonStyles("people")}
            onClick={() => setCurrentTab("people")}
          >
            <Type size={16} style={{ marginRight: "0.5rem" }} />
            People
          </button>
          <button
            style={getTabButtonStyles("appearance")}
            onClick={() => setCurrentTab("appearance")}
          >
            <Palette size={16} style={{ marginRight: "0.5rem" }} />
            Style
          </button>
          <button
            style={getTabButtonStyles("preview")}
            onClick={() => setCurrentTab("preview")}
          >
            <Monitor size={16} style={{ marginRight: "0.5rem" }} />
            Preview
          </button>
        </div>

        {/* People Tab Content */}
        {currentTab === "people" && (
          <>
            {/* People list */}
            <div
              style={{
                marginBottom: "1rem",
                maxHeight: "calc(100vh - 280px)",
                overflowY: "auto",
              }}
            >
              {people.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "1.5rem",
                    border: "1px dashed rgba(255, 255, 255, 0.2)",
                    borderRadius: "0.5rem",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <p style={{ color: "rgba(255, 255, 255, 0.6)" }}>
                    No people added yet
                  </p>
                  <p
                    style={{
                      color: "rgba(255, 255, 255, 0.4)",
                      fontSize: "0.875rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    Add people manually or import from Excel
                  </p>
                </div>
              ) : (
                people.map((person) => (
                  <div key={person.id} style={getPersonCardStyles(person)}>
                    {editingId === person.id ? (
                      // Edit mode
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Name"
                          style={inputStyles}
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Surname (optional)"
                          style={inputStyles}
                          value={editForm.surname}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              surname: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Title (optional)"
                          style={inputStyles}
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={handleSaveEdit}
                            style={{ ...buttonStyles.primary, flex: 1 }}
                          >
                            <Save size={16} style={{ marginRight: "0.5rem" }} />{" "}
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            style={{ ...buttonStyles.secondary, flex: 1 }}
                          >
                            <X size={16} style={{ marginRight: "0.5rem" }} />{" "}
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <span
                            style={{ fontWeight: "500", fontSize: "1.125rem" }}
                          >
                            {person.name} {person.surname && person.surname}
                          </span>
                          {person.title && (
                            <span
                              style={{
                                fontSize: "0.875rem",
                                color: "rgba(255, 255, 255, 0.7)",
                                fontStyle: "italic",
                              }}
                            >
                              {person.title}
                            </span>
                          )}
                        </div>

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "0.75rem",
                          }}
                        >
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => handleSelectPerson(person.id)}
                              style={
                                person.selected
                                  ? buttonStyles.primary
                                  : buttonStyles.secondary
                              }
                            >
                              <Eye
                                size={14}
                                style={{ marginRight: "0.25rem" }}
                              />{" "}
                              Select
                            </button>
                            <button
                              onClick={() => handleStreamPerson(person.id)}
                              style={
                                person.streaming
                                  ? buttonStyles.success
                                  : buttonStyles.secondary
                              }
                            >
                              <Video
                                size={14}
                                style={{ marginRight: "0.25rem" }}
                              />{" "}
                              {person.streaming ? "Live" : "Stream"}
                            </button>
                          </div>

                          <div style={{ display: "flex", gap: "0.25rem" }}>
                            <button
                              onClick={() => handleStartEdit(person)}
                              style={buttonStyles.icon}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleRemovePerson(person.id)}
                              style={{
                                ...buttonStyles.icon,
                                color: "rgba(255, 255, 255, 0.5)",
                                ":hover": { color: "#F87171" },
                              }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add new person form */}
            <div style={{ ...settingsSectionStyles, marginBottom: "1rem" }}>
              <h3
                style={{
                  fontWeight: "bold",
                  marginBottom: "0.75rem",
                  color: "white",
                }}
              >
                Add New Person
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  style={inputStyles}
                  value={newPerson.name}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Surname (optional)"
                  style={inputStyles}
                  value={newPerson.surname}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, surname: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Title (optional)"
                  style={inputStyles}
                  value={newPerson.title}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, title: e.target.value })
                  }
                />
                <button
                  onClick={handleAddPerson}
                  disabled={!newPerson.name.trim()}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    fontWeight: "500",
                    transition: "all 0.2s",
                    cursor: newPerson.name.trim() ? "pointer" : "not-allowed",
                    background: newPerson.name.trim()
                      ? "linear-gradient(to right, #2563EB, #7C3AED)"
                      : "rgba(255, 255, 255, 0.1)",
                    color: newPerson.name.trim()
                      ? "white"
                      : "rgba(255, 255, 255, 0.5)",
                    border: "none",
                  }}
                >
                  Add Person
                </button>
              </div>
            </div>

            {/* Excel Import */}
            <div style={importContainerStyles}>
              <h3
                style={{
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  color: "white",
                }}
              >
                Import from Excel
              </h3>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: "0.875rem",
                  marginBottom: "0.5rem",
                }}
              >
                Upload an Excel sheet with columns for Name, Surname, and Title
              </p>

              <label style={uploadAreaStyles}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem 0",
                  }}
                >
                  <Upload
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      marginBottom: "0.25rem",
                      color: "rgba(255, 255, 255, 0.7)",
                      animation: isUploading ? "bounce 1s infinite" : "none",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <span style={{ fontWeight: "600" }}>Click to upload</span>
                  </p>
                </div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
              </label>

              {uploadStatus && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                    backgroundColor: uploadStatus.success
                      ? "rgba(34, 197, 94, 0.2)"
                      : "rgba(239, 68, 68, 0.2)",
                    color: uploadStatus.success ? "#DCFCE7" : "#FEE2E2",
                  }}
                >
                  {uploadStatus.success ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Check size={14} style={{ marginRight: "0.25rem" }} />
                      {uploadStatus.message}
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <AlertCircle
                        size={14}
                        style={{ marginRight: "0.25rem" }}
                      />
                      {uploadStatus.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Appearance Tab Content */}
        {currentTab === "appearance" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={settingsSectionStyles}>
              <h3 style={{ ...settingsHeadingStyles, color: "white" }}>
                <Palette
                  size={18}
                  style={{ marginRight: "0.5rem", color: "#C084FC" }}
                />{" "}
                Display Style
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Background
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() =>
                        handleChangeSetting("displayStyle", "gradient")
                      }
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background:
                          "linear-gradient(to right, #312E81, #581C87)",
                        boxShadow:
                          displaySettings.displayStyle === "gradient"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Gradient
                    </button>
                    <button
                      onClick={() =>
                        handleChangeSetting("displayStyle", "solid")
                      }
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "black",
                        boxShadow:
                          displaySettings.displayStyle === "solid"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Solid
                    </button>
                    <button
                      onClick={() =>
                        handleChangeSetting("displayStyle", "transparent")
                      }
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        boxShadow:
                          displaySettings.displayStyle === "transparent"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Transparent
                    </button>
                    <button
                      onClick={() =>
                        handleChangeSetting("displayStyle", "minimal")
                      }
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "transparent",
                        boxShadow:
                          displaySettings.displayStyle === "minimal"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Minimal
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Text Style
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => handleChangeSetting("textStyle", "normal")}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          displaySettings.textStyle === "normal"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          displaySettings.textStyle === "normal"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => handleChangeSetting("textStyle", "bold")}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          displaySettings.textStyle === "bold"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          displaySettings.textStyle === "bold"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        border: "none",
                        color: "white",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Bold
                    </button>
                    <button
                      onClick={() => handleChangeSetting("textStyle", "light")}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          displaySettings.textStyle === "light"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          displaySettings.textStyle === "light"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        border: "none",
                        color: "white",
                        fontWeight: "lighter",
                        cursor: "pointer",
                      }}
                    >
                      Light
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <label
                    style={{
                      fontSize: "0.875rem",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    Border Style
                  </label>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0.5rem",
                    }}
                  >
                    <button
                      onClick={() => handleChangeSetting("borderStyle", "none")}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          displaySettings.borderStyle === "none"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          displaySettings.borderStyle === "none"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      None
                    </button>
                    <button
                      onClick={() => handleChangeSetting("borderStyle", "thin")}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          displaySettings.borderStyle === "thin"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          displaySettings.borderStyle === "thin"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        border: "1px solid rgba(255, 255, 255, 0.3)",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Thin
                    </button>
                    <button
                      onClick={() => handleChangeSetting("borderStyle", "glow")}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          displaySettings.borderStyle === "glow"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          displaySettings.borderStyle === "glow"
                            ? "0 0 0 2px rgba(168, 85, 247, 0.7), 0 10px 15px -3px rgba(168, 85, 247, 0.3)"
                            : "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Glow
                    </button>
                    <button
                      onClick={() =>
                        handleChangeSetting("borderStyle", "accent")
                      }
                      style={{
                        padding: "0.5rem",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor:
                          displaySettings.borderStyle === "accent"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                        boxShadow:
                          displaySettings.borderStyle === "accent"
                            ? "0 0 0 2px #A855F7"
                            : "none",
                        borderLeft: "4px solid #EC4899",
                        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
                        borderRight: "1px solid rgba(255, 255, 255, 0.2)",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "white",
                        cursor: "pointer",
                      }}
                    >
                      Accent
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={settingsSectionStyles}>
              <h3 style={{ ...settingsHeadingStyles, color: "white" }}>
                <Sliders
                  size={18}
                  style={{ marginRight: "0.5rem", color: "#C084FC" }}
                />{" "}
                Effects
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    ...settingsOptionStyles,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div>
                    <div style={{ color: "white" }}>Text Shadow</div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Add shadow to text for better visibility
                    </div>
                  </div>
                  <label style={toggleSwitchContainerStyles}>
                    <div style={toggleSwitchStyles(displaySettings.textShadow)}>
                      <div
                        style={toggleSwitchKnobStyles(
                          displaySettings.textShadow,
                        )}
                      ></div>
                    </div>
                    <input
                      type="checkbox"
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        borderWidth: 0,
                      }}
                      checked={displaySettings.textShadow}
                      onChange={() => handleToggleSetting("textShadow")}
                    />
                  </label>
                </div>

                <div
                  style={{
                    ...settingsOptionStyles,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div>
                    <div style={{ color: "white" }}>Box Shadow</div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Add shadow to container
                    </div>
                  </div>
                  <label style={toggleSwitchContainerStyles}>
                    <div style={toggleSwitchStyles(displaySettings.boxShadow)}>
                      <div
                        style={toggleSwitchKnobStyles(
                          displaySettings.boxShadow,
                        )}
                      ></div>
                    </div>
                    <input
                      type="checkbox"
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        borderWidth: 0,
                      }}
                      checked={displaySettings.boxShadow}
                      onChange={() => handleToggleSetting("boxShadow")}
                    />
                  </label>
                </div>

                <div
                  style={{
                    ...settingsOptionStyles,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div>
                    <div style={{ color: "white" }}>Decorative Elements</div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Add gradient line and blurred orbs
                    </div>
                  </div>
                  <label style={toggleSwitchContainerStyles}>
                    <div
                      style={toggleSwitchStyles(
                        displaySettings.decorativeElements,
                      )}
                    >
                      <div
                        style={toggleSwitchKnobStyles(
                          displaySettings.decorativeElements,
                        )}
                      ></div>
                    </div>
                    <input
                      type="checkbox"
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        borderWidth: 0,
                      }}
                      checked={displaySettings.decorativeElements}
                      onChange={() => handleToggleSetting("decorativeElements")}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div style={settingsSectionStyles}>
              <h3 style={{ ...settingsHeadingStyles, color: "white" }}>
                <Type
                  size={18}
                  style={{ marginRight: "0.5rem", color: "#C084FC" }}
                />{" "}
                Content
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <div
                  style={{
                    ...settingsOptionStyles,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div>
                    <div style={{ color: "white" }}>Show Name</div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Display person's name
                    </div>
                  </div>
                  <label style={toggleSwitchContainerStyles}>
                    <div style={toggleSwitchStyles(displaySettings.showName)}>
                      <div
                        style={toggleSwitchKnobStyles(displaySettings.showName)}
                      ></div>
                    </div>
                    <input
                      type="checkbox"
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        borderWidth: 0,
                      }}
                      checked={displaySettings.showName}
                      onChange={() => handleToggleSetting("showName")}
                    />
                  </label>
                </div>

                <div
                  style={{
                    ...settingsOptionStyles,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                >
                  <div>
                    <div style={{ color: "white" }}>Show Titles</div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "0.875rem",
                      }}
                    >
                      Display person's title or role
                    </div>
                  </div>
                  <label style={toggleSwitchContainerStyles}>
                    <div style={toggleSwitchStyles(displaySettings.showTitles)}>
                      <div
                        style={toggleSwitchKnobStyles(
                          displaySettings.showTitles,
                        )}
                      ></div>
                    </div>
                    <input
                      type="checkbox"
                      style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0, 0, 0, 0)",
                        whiteSpace: "nowrap",
                        borderWidth: 0,
                      }}
                      checked={displaySettings.showTitles}
                      onChange={() => handleToggleSetting("showTitles")}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab Content */}
        {currentTab === "preview" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div style={settingsSectionStyles}>
              <h3 style={{ ...settingsHeadingStyles, color: "white" }}>
                <Monitor
                  size={18}
                  style={{ marginRight: "0.5rem", color: "#C084FC" }}
                />{" "}
                Preview Control
              </h3>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <button
                  onClick={handleDisplayToggle}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s",
                    background: isDisplayActive
                      ? "linear-gradient(to right, #DC2626, #991B1B)"
                      : "linear-gradient(to right, #111827, rgba(0, 0, 0, 0.5))",
                    boxShadow: isDisplayActive
                      ? "0 10px 15px -3px rgba(220, 38, 38, 0.3)"
                      : "0 10px 15px -3px rgba(126, 34, 206, 0.2)",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <Monitor size={18} style={{ marginRight: "0.5rem" }} />
                  {isDisplayActive ? "Hide Preview" : "Show Preview"}
                </button>

                {streamingPerson ? (
                  <div
                    style={{
                      backgroundColor: "rgba(20, 83, 45, 0.2)",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          width: "0.5rem",
                          height: "0.5rem",
                          borderRadius: "9999px",
                          backgroundColor: "#22C55E",
                          marginRight: "0.5rem",
                          animation:
                            "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                        }}
                      ></div>
                      <span style={{ fontWeight: "500" }}>Now Streaming:</span>
                    </div>
                    <div
                      style={{
                        paddingLeft: "1rem",
                        borderLeft: "2px solid rgba(34, 197, 94, 0.3)",
                      }}
                    >
                      <div style={{ fontWeight: "500" }}>
                        {streamingPerson.name} {streamingPerson.surname}
                      </div>
                      {streamingPerson.title && (
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "rgba(255, 255, 255, 0.7)",
                            fontStyle: "italic",
                          }}
                        >
                          {streamingPerson.title}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      backgroundColor: "rgba(31, 41, 55, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem",
                      textAlign: "center",
                      color: "rgba(255, 255, 255, 0.6)",
                    }}
                  >
                    No one is currently being streamed.
                    <div
                      style={{
                        marginTop: "0.25rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      Click the "Stream" button next to a person to start.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={settingsSectionStyles}>
              <h3 style={{ ...settingsHeadingStyles, color: "white" }}>
                <ExternalLink
                  size={18}
                  style={{ marginRight: "0.5rem", color: "#C084FC" }}
                />{" "}
                OBS Setup
              </h3>

              <div style={{ marginBottom: "1rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.875rem",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Display URL (add as browser source in OBS)
                </label>
                <div style={{ display: "flex" }}>
                  <input
                    type="text"
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      borderTopLeftRadius: "0.5rem",
                      borderBottomLeftRadius: "0.5rem",
                      backgroundColor: "#1F2937",
                      color: "white",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      outline: "none",
                    }}
                    value={displayUrl}
                    readOnly
                  />
                  <button
                    onClick={handleCopyDisplayUrl}
                    style={{
                      padding: "0.5rem",
                      background: "linear-gradient(to right, #2563EB, #1E40AF)",
                      color: "white",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      transition: "background-color 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    <Copy size={16} style={{ marginRight: "0.25rem" }} /> Copy
                  </button>
                  <button
                    onClick={handleOpenDisplayWindow}
                    style={{
                      padding: "0.5rem",
                      background: "linear-gradient(to right, #16A34A, #166534)",
                      color: "white",
                      border: "none",
                      borderTopRightRadius: "0.5rem",
                      borderBottomRightRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      transition: "background-color 0.2s",
                      cursor: "pointer",
                    }}
                  >
                    <ExternalLink
                      size={16}
                      style={{ marginRight: "0.25rem" }}
                    />{" "}
                    Open
                  </button>
                </div>
              </div>

              <div
                style={{
                  fontSize: "0.875rem",
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                <p style={{ marginBottom: "0.5rem" }}>
                  Quick Setup Instructions:
                </p>
                <ol
                  style={{
                    listStyleType: "decimal",
                    paddingLeft: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <li>In OBS Studio, add a "Browser" source to your scene</li>
                  <li>Paste the Display URL above as the URL</li>
                  <li>Set width to 800 and height to 200</li>
                  <li>Check "Refresh browser when scene becomes active"</li>
                  <li>Position the source where names should appear</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center content - Preview */}
      <div style={centerContentStyles}>
        <h1 style={titleStyles}>Name Display Control</h1>

        {/* Preview Display */}
        <div style={previewContainerStyles}>
          <div style={previewHeaderStyles}>
            <span>Live Preview</span>
            {streamingPerson && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  color: "#4ADE80",
                }}
              >
                <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    borderRadius: "9999px",
                    backgroundColor: "#22C55E",
                    marginRight: "0.5rem",
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                  }}
                ></div>
                Streaming
              </div>
            )}
          </div>

          <div style={previewContentStyles}>
            <div style={previewAreaStyles}>
              {/* Main preview component */}
              {streamingPerson ? (
                <DisplayView
                  person={streamingPerson}
                  settings={displaySettings}
                />
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    color: "rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <div
                    style={{
                      marginBottom: "0.5rem",
                      fontSize: "1.125rem",
                    }}
                  >
                    No content streaming
                  </div>
                  <div style={{ fontSize: "0.875rem" }}>
                    Click "Stream" next to a person to display them
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick settings under preview */}
          <div style={quickSettingsContainerStyles}>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "500",
                marginBottom: "0.75rem",
              }}
            >
              Quick Settings
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <label style={toggleSwitchContainerStyles}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "1.25rem",
                      backgroundColor: displaySettings.showName
                        ? "rgba(37, 99, 235, 0.8)"
                        : "rgba(55, 65, 81, 0.5)",
                      borderRadius: "9999px",
                      position: "relative",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "2px",
                        left: displaySettings.showName
                          ? "calc(100% - 1rem - 2px)"
                          : "2px",
                        backgroundColor: "white",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "9999px",
                        height: "1rem",
                        width: "1rem",
                        transition: "all 0.2s",
                      }}
                    ></div>
                  </div>
                  <input
                    type="checkbox"
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: 0,
                    }}
                    checked={displaySettings.showName}
                    onChange={() => handleToggleSetting("showName")}
                  />
                </label>
                <span style={{ fontSize: "0.875rem" }}>Show Name</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <label style={toggleSwitchContainerStyles}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "1.25rem",
                      backgroundColor: displaySettings.showTitles
                        ? "rgba(37, 99, 235, 0.8)"
                        : "rgba(55, 65, 81, 0.5)",
                      borderRadius: "9999px",
                      position: "relative",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "2px",
                        left: displaySettings.showTitles
                          ? "calc(100% - 1rem - 2px)"
                          : "2px",
                        backgroundColor: "white",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "9999px",
                        height: "1rem",
                        width: "1rem",
                        transition: "all 0.2s",
                      }}
                    ></div>
                  </div>
                  <input
                    type="checkbox"
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: 0,
                    }}
                    checked={displaySettings.showTitles}
                    onChange={() => handleToggleSetting("showTitles")}
                  />
                </label>
                <span style={{ fontSize: "0.875rem" }}>Show Title</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <label style={toggleSwitchContainerStyles}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "1.25rem",
                      backgroundColor: displaySettings.textShadow
                        ? "rgba(37, 99, 235, 0.8)"
                        : "rgba(55, 65, 81, 0.5)",
                      borderRadius: "9999px",
                      position: "relative",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "2px",
                        left: displaySettings.textShadow
                          ? "calc(100% - 1rem - 2px)"
                          : "2px",
                        backgroundColor: "white",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "9999px",
                        height: "1rem",
                        width: "1rem",
                        transition: "all 0.2s",
                      }}
                    ></div>
                  </div>
                  <input
                    type="checkbox"
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: 0,
                    }}
                    checked={displaySettings.textShadow}
                    onChange={() => handleToggleSetting("textShadow")}
                  />
                </label>
                <span style={{ fontSize: "0.875rem" }}>Text Shadow</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <label style={toggleSwitchContainerStyles}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "1.25rem",
                      backgroundColor: displaySettings.decorativeElements
                        ? "rgba(37, 99, 235, 0.8)"
                        : "rgba(55, 65, 81, 0.5)",
                      borderRadius: "9999px",
                      position: "relative",
                      transition: "background-color 0.2s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "2px",
                        left: displaySettings.decorativeElements
                          ? "calc(100% - 1rem - 2px)"
                          : "2px",
                        backgroundColor: "white",
                        border: "1px solid rgba(0, 0, 0, 0.1)",
                        borderRadius: "9999px",
                        height: "1rem",
                        width: "1rem",
                        transition: "all 0.2s",
                      }}
                    ></div>
                  </div>
                  <input
                    type="checkbox"
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: "hidden",
                      clip: "rect(0, 0, 0, 0)",
                      whiteSpace: "nowrap",
                      borderWidth: 0,
                    }}
                    checked={displaySettings.decorativeElements}
                    onChange={() => handleToggleSetting("decorativeElements")}
                  />
                </label>
                <span style={{ fontSize: "0.875rem" }}>Decorations</span>
              </div>
            </div>
          </div>

          {/* Display style presets */}
          <div style={stylePresetsContainerStyles}>
            <h3
              style={{
                fontSize: "1.125rem",
                fontWeight: "500",
                marginBottom: "0.75rem",
              }}
            >
              Style Presets
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "0.75rem",
              }}
            >
              <button
                style={stylePresetButtonStyles("gradient")}
                onClick={() => {
                  setDisplaySettings({
                    ...displaySettings,
                    displayStyle: "gradient",
                    borderStyle: "thin",
                    textStyle: "bold",
                    textShadow: true,
                    boxShadow: true,
                    decorativeElements: true,
                  });
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.25rem",
                  }}
                >
                  Gradient
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Classic style
                </div>
              </button>

              <button
                style={stylePresetButtonStyles("minimal")}
                onClick={() => {
                  setDisplaySettings({
                    ...displaySettings,
                    displayStyle: "solid",
                    borderStyle: "none",
                    textStyle: "light",
                    textShadow: false,
                    boxShadow: true,
                    decorativeElements: false,
                  });
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.25rem",
                  }}
                >
                  Minimal
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  Clean look
                </div>
              </button>

              <button
                style={stylePresetButtonStyles("accented")}
                onClick={() => {
                  setDisplaySettings({
                    ...displaySettings,
                    displayStyle: "transparent",
                    borderStyle: "accent",
                    textStyle: "bold",
                    textShadow: true,
                    boxShadow: false,
                    decorativeElements: false,
                  });
                }}
              >
                <div
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    marginBottom: "0.25rem",
                  }}
                >
                  Accented
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  With color highlight
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Display simulation */}
      {isDisplayActive && (
        <div style={fixedPreviewStyles}>
          {streamingPerson ? (
            <DisplayView person={streamingPerson} settings={displaySettings} />
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "rgba(255, 255, 255, 0.7)",
                padding: "1rem",
              }}
            >
              <div style={{ marginBottom: "0.5rem" }}>
                No one is currently streaming
              </div>
              <div style={{ fontSize: "0.875rem" }}>
                Select a person and click "Stream" to display them
              </div>
            </div>
          )}
          <button
            onClick={handleDisplayToggle}
            style={{
              marginTop: "0.5rem",
              padding: "0.5rem",
              backgroundColor: "#DC2626",
              color: "white",
              fontSize: "0.875rem",
              borderRadius: "0.375rem",
              width: "100%",
              transition: "background-color 0.2s",
              border: "none",
              cursor: "pointer",
            }}
          >
            Close Preview
          </button>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div style={modalOverlayStyles}>
          <div style={modalContainerStyles}>
            <div style={modalHeaderStyles}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
                How to Use the Name Display Tool
              </h2>
              <button
                onClick={() => setShowTutorial(false)}
                style={buttonStyles.icon}
              >
                <X size={24} />
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ChevronRight
                    size={18}
                    style={{ marginRight: "0.5rem", color: "#60A5FA" }}
                  />{" "}
                  Adding People
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    paddingLeft: "1.5rem",
                  }}
                >
                  Add individuals manually by filling out the form at the bottom
                  of the People tab, or import multiple people from an Excel
                  spreadsheet.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ChevronRight
                    size={18}
                    style={{ marginRight: "0.5rem", color: "#60A5FA" }}
                  />{" "}
                  Selecting vs Streaming
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    paddingLeft: "1.5rem",
                  }}
                >
                  <span style={{ color: "#60A5FA", fontWeight: "500" }}>
                    Select
                  </span>{" "}
                  a person to view them in the preview.{" "}
                  <span style={{ color: "#4ADE80", fontWeight: "500" }}>
                    Stream
                  </span>{" "}
                  a person to display their name in OBS and other tools.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ChevronRight
                    size={18}
                    style={{ marginRight: "0.5rem", color: "#60A5FA" }}
                  />{" "}
                  Customizing Display
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    paddingLeft: "1.5rem",
                  }}
                >
                  Use the Style tab to customize how names will appear. Try
                  different background styles, text options, and effects for
                  optimal visibility.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ChevronRight
                    size={18}
                    style={{ marginRight: "0.5rem", color: "#60A5FA" }}
                  />{" "}
                  OBS Integration
                </h3>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    paddingLeft: "1.5rem",
                  }}
                >
                  Add the display URL as a Browser Source in OBS. The display
                  will update automatically when you stream different people.
                  Size recommendation: 800×200px.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ChevronRight
                    size={18}
                    style={{ marginRight: "0.5rem", color: "#60A5FA" }}
                  />{" "}
                  Tips for Video Overlay
                </h3>
                <ul
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    paddingLeft: "2rem",
                    listStyleType: "disc",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <li>
                    Use text shadows when displaying over busy backgrounds
                  </li>
                  <li>Transparent styles work well over video feeds</li>
                  <li>
                    For better legibility, use bold text on gradient backgrounds
                  </li>
                  <li>Position the display in the lower third of your video</li>
                </ul>
              </div>
            </div>

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowTutorial(false)}
                style={{
                  padding: "0.5rem 1rem",
                  background: "linear-gradient(to right, #2563EB, #7C3AED)",
                  color: "white",
                  borderRadius: "0.5rem",
                  transition: "background-color 0.2s",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS keyframes for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
      `,
        }}
      />
    </div>
  );
};
