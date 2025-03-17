import React, { useState, useEffect } from "react";
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
        return "bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-sm";
      case "solid":
        return "bg-black/80 backdrop-blur-sm";
      case "transparent":
        return "bg-black/40 backdrop-blur-sm";
      case "minimal":
        return "bg-transparent";
      default:
        return "bg-gradient-to-r from-indigo-900/90 to-purple-900/90 backdrop-blur-sm";
    }
  };

  const getBorderStyle = () => {
    switch (settings.borderStyle) {
      case "none":
        return "";
      case "thin":
        return "border border-white/30";
      case "glow":
        return "ring-2 ring-purple-500/50";
      case "accent":
        return "border-l-4 border-l-pink-500 border-t border-r border-b border-white/20";
      default:
        return "border border-white/20";
    }
  };

  const getTextShadow = () => {
    return settings.textShadow ? "text-shadow-lg" : "";
  };

  const getTextStyle = () => {
    switch (settings.textStyle) {
      case "normal":
        return "font-normal";
      case "bold":
        return "font-bold";
      case "light":
        return "font-light";
      default:
        return "font-normal";
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent p-4">
      {/* Main display area with styling based on settings */}
      <div
        className={`rounded-lg p-6 text-center w-full max-w-md transform transition-all duration-500 relative overflow-hidden ${getBackgroundStyle()} ${getBorderStyle()}`}
        style={{
          boxShadow: settings.boxShadow
            ? "0 10px 25px -5px rgba(0, 0, 0, 0.3)"
            : "none",
        }}
      >
        {/* Decorative elements - optional based on settings */}
        {settings.decorativeElements && (
          <>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
            <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-pink-500/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl"></div>
          </>
        )}

        {settings.showName && formattedName && (
          <h1
            className={`text-3xl ${getTextStyle()} text-white mb-2 relative z-10 ${getTextShadow()}`}
          >
            {formattedName}
          </h1>
        )}
        {settings.showTitles && person.title && (
          <h2
            className={`text-xl text-white/90 italic relative z-10 ${getTextShadow()}`}
          >
            {person.title}
          </h2>
        )}
      </div>
    </div>
  );
};

// Mock SheetJS implementation for Excel parsing
const XLSX = {
  read: (data, options) => {
    return {
      SheetNames: ["Sheet1"],
      Sheets: {
        Sheet1: {},
      },
    };
  },
  utils: {
    sheet_to_json: (worksheet) => {
      return [
        { Name: "John", Surname: "Doe", Title: "Guest Speaker" },
        { Name: "Jane", Surname: "Smith", Title: "Host" },
        { Name: "Mike", Surname: "Johnson", Title: "Panelist" },
      ];
    },
  },
};

const StreamingApp = () => {
  // All state definitions grouped together at the top
  const [people, setPeople] = useState([
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
  ]);

  const [newPerson, setNewPerson] = useState({
    name: "",
    surname: "",
    title: "",
  });

  const [displaySettings, setDisplaySettings] = useState({
    showName: true,
    showTitles: true,
    displayStyle: "gradient", // gradient, solid, transparent, minimal
    textStyle: "bold", // normal, bold, light
    borderStyle: "thin", // none, thin, glow, accent
    textShadow: true,
    boxShadow: true,
    decorativeElements: true,
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
    const newWindow = window.open("", "displayPreview", features);
    setPreviewWindow(newWindow);

    // Write content to the new window
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Name Display</title>
            <style>
              body, html {
                margin: 0;
                padding: 0;
                height: 100%;
                overflow: hidden;
                font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background-color: transparent;
              }
              .container {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
              }
              .name-display {
                ${
                  displaySettings.displayStyle === "gradient"
                    ? "background: linear-gradient(to right, rgba(49, 46, 129, 0.9), rgba(88, 28, 135, 0.9));"
                    : displaySettings.displayStyle === "solid"
                      ? "background-color: rgba(0, 0, 0, 0.8);"
                      : displaySettings.displayStyle === "transparent"
                        ? "background-color: rgba(0, 0, 0, 0.4);"
                        : "background-color: transparent;"
                }
                ${
                  displaySettings.borderStyle === "none"
                    ? ""
                    : displaySettings.borderStyle === "thin"
                      ? "border: 1px solid rgba(255, 255, 255, 0.3);"
                      : displaySettings.borderStyle === "glow"
                        ? "box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.5);"
                        : displaySettings.borderStyle === "accent"
                          ? "border-left: 4px solid #ec4899; border-top: 1px solid rgba(255, 255, 255, 0.2); border-right: 1px solid rgba(255, 255, 255, 0.2); border-bottom: 1px solid rgba(255, 255, 255, 0.2);"
                          : "border: 1px solid rgba(255, 255, 255, 0.2);"
                }
                border-radius: 0.5rem;
                padding: 1.5rem;
                text-align: center;
                max-width: 400px;
                width: 100%;
                backdrop-filter: blur(4px);
                ${displaySettings.boxShadow ? "box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);" : ""}
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
              }
              .decoration-top {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: linear-gradient(to right, #ec4899, #a855f7);
              }
              .decoration-blob-1 {
                position: absolute;
                top: -80px;
                left: -80px;
                width: 160px;
                height: 160px;
                border-radius: 50%;
                background-color: rgba(236, 72, 153, 0.2);
                filter: blur(64px);
              }
              .decoration-blob-2 {
                position: absolute;
                bottom: -80px;
                right: -80px;
                width: 160px;
                height: 160px;
                border-radius: 50%;
                background-color: rgba(168, 85, 247, 0.2);
                filter: blur(64px);
              }
              .name {
                font-size: 1.875rem;
                color: white;
                margin-bottom: 0.5rem;
                position: relative;
                z-index: 10;
                ${
                  displaySettings.textStyle === "normal"
                    ? "font-weight: 400;"
                    : displaySettings.textStyle === "bold"
                      ? "font-weight: 700;"
                      : "font-weight: 300;"
                }
                ${displaySettings.textShadow ? "text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);" : ""}
              }
              .title {
                font-size: 1.25rem;
                color: rgba(255, 255, 255, 0.9);
                font-style: italic;
                position: relative;
                z-index: 10;
                ${displaySettings.textShadow ? "text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);" : ""}
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="name-display">
                ${
                  displaySettings.decorativeElements
                    ? `
                  <div class="decoration-top"></div>
                  <div class="decoration-blob-1"></div>
                  <div class="decoration-blob-2"></div>
                `
                    : ""
                }
                ${
                  displaySettings.showName && streamingPerson
                    ? `
                  <div class="name">${streamingPerson.surname ? `${streamingPerson.name} ${streamingPerson.surname}` : streamingPerson.name}</div>
                `
                    : ""
                }
                ${
                  displaySettings.showTitles &&
                  streamingPerson &&
                  streamingPerson.title
                    ? `
                  <div class="title">${streamingPerson.title}</div>
                `
                    : ""
                }
              </div>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus(null);

    try {
      // Read the file
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      // Use SheetJS to parse the Excel file
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        setUploadStatus({
          success: false,
          message: "No data found in the spreadsheet",
        });
        setIsUploading(false);
        return;
      }

      // Map Excel data to our people structure
      const newPeople = jsonData.map((row, index) => {
        // Try various common column names for name, surname, and title
        const name =
          row.Name ||
          row.name ||
          row.FirstName ||
          row.firstname ||
          row.first_name ||
          "";
        const surname =
          row.Surname ||
          row.surname ||
          row.LastName ||
          row.lastname ||
          row.last_name ||
          "";
        const title =
          row.Title ||
          row.title ||
          row.Position ||
          row.position ||
          row.Role ||
          row.role ||
          "";

        return {
          id: Math.max(...people.map((p) => p.id), 0) + index + 1,
          name: name || `Person ${index + 1}`,
          surname: surname || "",
          title: title || "",
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
    } catch (error) {
      console.error("Error processing Excel file:", error);
      setUploadStatus({
        success: false,
        message:
          "Error processing the file. Make sure it's a valid Excel spreadsheet.",
      });
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = "";
    }
  };

  // Update the preview window when streaming person or settings change
  useEffect(() => {
    if (previewWindow && !previewWindow.closed && streamingPerson) {
      handleOpenDisplayWindow();
    }
  });

  // Close the preview window when component unmounts
  useEffect(() => {
    return () => {
      if (previewWindow && !previewWindow.closed) {
        previewWindow.close();
      }
    };
  });

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white font-sans overflow-hidden">
      {/* Left sidebar - People Management */}
      <div className="w-1/4 p-4 flex flex-col bg-black/20 backdrop-blur-sm border-r border-white/10 overflow-y-auto">
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
            Streamer
          </h2>
          <button
            onClick={() => setShowTutorial(true)}
            className="text-white/60 hover:text-white/90 transition p-1 rounded-full hover:bg-white/10"
          >
            <HelpCircle size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex mb-4 bg-black/30 rounded-lg p-1">
          <button
            className={`flex-1 py-2 rounded-md transition-all ${
              currentTab === "people"
                ? "bg-white/20 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => setCurrentTab("people")}
          >
            <div className="flex items-center justify-center">
              <Type size={16} className="mr-2" />
              People
            </div>
          </button>
          <button
            className={`flex-1 py-2 rounded-md transition-all ${
              currentTab === "appearance"
                ? "bg-white/20 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => setCurrentTab("appearance")}
          >
            <div className="flex items-center justify-center">
              <Palette size={16} className="mr-2" />
              Style
            </div>
          </button>
          <button
            className={`flex-1 py-2 rounded-md transition-all ${
              currentTab === "preview"
                ? "bg-white/20 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
            onClick={() => setCurrentTab("preview")}
          >
            <div className="flex items-center justify-center">
              <Monitor size={16} className="mr-2" />
              Preview
            </div>
          </button>
        </div>

        {/* People Tab Content */}
        {currentTab === "people" && (
          <>
            {/* People list */}
            <div className="space-y-2 mb-4 max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
              {people.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-white/20 rounded-lg bg-white/5">
                  <p className="text-white/60">No people added yet</p>
                  <p className="text-white/40 text-sm mt-2">
                    Add people manually or import from Excel
                  </p>
                </div>
              ) : (
                people.map((person) => (
                  <div
                    key={person.id}
                    className={`p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white transition-all duration-300 hover:bg-white/15 ${
                      person.selected
                        ? "border-l-4 border-l-blue-500 border-t border-r border-b border-white/20"
                        : "border border-white/10"
                    } ${person.streaming ? "bg-gradient-to-r from-green-900/40 to-green-800/40 border-green-500/50" : ""}`}
                  >
                    {editingId === person.id ? (
                      // Edit mode
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Name"
                          className="w-full p-2 rounded border border-white/30 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 transition-all"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Surname (optional)"
                          className="w-full p-2 rounded border border-white/30 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 transition-all"
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
                          className="w-full p-2 rounded border border-white/30 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 transition-all"
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveEdit}
                            className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 transition-colors rounded text-white flex items-center justify-center"
                          >
                            <Save size={16} className="mr-2" /> Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 transition-colors rounded text-white flex items-center justify-center"
                          >
                            <X size={16} className="mr-2" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View mode
                      <>
                        <div className="flex flex-col mb-2">
                          <span className="font-medium text-lg">
                            {person.name} {person.surname && person.surname}
                          </span>
                          {person.title && (
                            <span className="text-sm text-white/70 italic">
                              {person.title}
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSelectPerson(person.id)}
                              className={`p-2 rounded text-xs flex items-center ${
                                person.selected
                                  ? "bg-blue-600 text-white"
                                  : "bg-white/10 text-white/70 hover:bg-white/20"
                              }`}
                            >
                              <Eye size={14} className="mr-1" /> Select
                            </button>
                            <button
                              onClick={() => handleStreamPerson(person.id)}
                              className={`p-2 rounded text-xs flex items-center ${
                                person.streaming
                                  ? "bg-green-600 text-white"
                                  : "bg-white/10 text-white/70 hover:bg-white/20"
                              }`}
                            >
                              <Video size={14} className="mr-1" />{" "}
                              {person.streaming ? "Live" : "Stream"}
                            </button>
                          </div>

                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleStartEdit(person)}
                              className="p-2 text-white/50 hover:text-blue-400 transition-colors hover:bg-white/10 rounded"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleRemovePerson(person.id)}
                              className="p-2 text-white/50 hover:text-red-400 transition-colors hover:bg-white/10 rounded"
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
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white border border-white/10">
              <h3 className="font-bold mb-3 text-white">Add New Person</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full p-2 rounded border border-white/30 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 transition-all"
                  value={newPerson.name}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Surname (optional)"
                  className="w-full p-2 rounded border border-white/30 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 transition-all"
                  value={newPerson.surname}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, surname: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Title (optional)"
                  className="w-full p-2 rounded border border-white/30 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-white/50 transition-all"
                  value={newPerson.title}
                  onChange={(e) =>
                    setNewPerson({ ...newPerson, title: e.target.value })
                  }
                />
                <button
                  onClick={handleAddPerson}
                  disabled={!newPerson.name.trim()}
                  className={`w-full p-2 rounded font-medium transition-all ${
                    newPerson.name.trim()
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      : "bg-white/10 text-white/50 cursor-not-allowed"
                  }`}
                >
                  Add Person
                </button>
              </div>
            </div>

            {/* Excel Import */}
            <div className="mt-4">
              <div className="border border-dashed border-white/20 rounded-lg p-4 bg-white/5 text-center">
                <h3 className="font-bold mb-2 text-white">Import from Excel</h3>
                <p className="text-white/70 text-sm mb-2">
                  Upload an Excel sheet with columns for Name, Surname, and
                  Title
                </p>

                <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/10 bg-gray-800/50 border-white/20 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-4 pb-4">
                    <Upload
                      className={`w-6 h-6 mb-1 text-white/70 ${isUploading ? "animate-bounce" : ""}`}
                    />
                    <p className="text-sm text-white/70">
                      <span className="font-semibold">Click to upload</span>
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>

                {uploadStatus && (
                  <div
                    className={`mt-2 p-2 rounded text-sm ${
                      uploadStatus.success
                        ? "bg-green-500/20 text-green-100"
                        : "bg-red-500/20 text-red-100"
                    }`}
                  >
                    {uploadStatus.success ? (
                      <div className="flex items-center">
                        <Check size={14} className="mr-1" />
                        {uploadStatus.message}
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <AlertCircle size={14} className="mr-1" />
                        {uploadStatus.message}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Appearance Tab Content */}
        {currentTab === "appearance" && (
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Palette size={18} className="mr-2 text-purple-400" /> Display
                Style
              </h3>

              <div className="space-y-3">
                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-white/70">Background</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        handleChangeSetting("displayStyle", "gradient")
                      }
                      className={`p-2 rounded-lg flex items-center justify-center ${
                        displaySettings.displayStyle === "gradient"
                          ? "bg-gradient-to-r from-indigo-900 to-purple-900 ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      Gradient
                    </button>
                    <button
                      onClick={() =>
                        handleChangeSetting("displayStyle", "solid")
                      }
                      className={`p-2 rounded-lg flex items-center justify-center ${
                        displaySettings.displayStyle === "solid"
                          ? "bg-black ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      Solid
                    </button>
                    <button
                      onClick={() =>
                        handleChangeSetting("displayStyle", "transparent")
                      }
                      className={`p-2 rounded-lg flex items-center justify-center ${
                        displaySettings.displayStyle === "transparent"
                          ? "bg-black/40 ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      Transparent
                    </button>
                    <button
                      onClick={() =>
                        handleChangeSetting("displayStyle", "minimal")
                      }
                      className={`p-2 rounded-lg flex items-center justify-center ${
                        displaySettings.displayStyle === "minimal"
                          ? "bg-transparent ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      Minimal
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-white/70">Text Style</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleChangeSetting("textStyle", "normal")}
                      className={`p-2 rounded-lg flex items-center justify-center ${
                        displaySettings.textStyle === "normal"
                          ? "bg-white/20 ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => handleChangeSetting("textStyle", "bold")}
                      className={`p-2 rounded-lg flex items-center justify-center font-bold ${
                        displaySettings.textStyle === "bold"
                          ? "bg-white/20 ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      Bold
                    </button>
                    <button
                      onClick={() => handleChangeSetting("textStyle", "light")}
                      className={`p-2 rounded-lg flex items-center justify-center font-light ${
                        displaySettings.textStyle === "light"
                          ? "bg-white/20 ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      Light
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-sm text-white/70">Border Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleChangeSetting("borderStyle", "none")}
                      className={`p-2 rounded-lg flex items-center justify-center ${
                        displaySettings.borderStyle === "none"
                          ? "bg-white/20 ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      None
                    </button>
                    <button
                      onClick={() => handleChangeSetting("borderStyle", "thin")}
                      className={`p-2 rounded-lg flex items-center justify-center border border-white/30 ${
                        displaySettings.borderStyle === "thin"
                          ? "bg-white/20 ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      Thin
                    </button>
                    <button
                      onClick={() => handleChangeSetting("borderStyle", "glow")}
                      className={`p-2 rounded-lg flex items-center justify-center ${
                        displaySettings.borderStyle === "glow"
                          ? "bg-white/20 ring-2 ring-purple-500/70 shadow-lg shadow-purple-500/30"
                          : "bg-white/10"
                      }`}
                    >
                      Glow
                    </button>
                    <button
                      onClick={() =>
                        handleChangeSetting("borderStyle", "accent")
                      }
                      className={`p-2 rounded-lg flex items-center justify-center border-l-4 border-l-pink-500 border-t border-r border-b border-white/20 ${
                        displaySettings.borderStyle === "accent"
                          ? "bg-white/20 ring-2 ring-purple-500"
                          : "bg-white/10"
                      }`}
                    >
                      Accent
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Sliders size={18} className="mr-2 text-purple-400" /> Effects
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div>
                    <div className="text-white">Text Shadow</div>
                    <div className="text-white/60 text-sm">
                      Add shadow to text for better visibility
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={displaySettings.textShadow}
                      onChange={() => handleToggleSetting("textShadow")}
                    />
                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600/80"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div>
                    <div className="text-white">Box Shadow</div>
                    <div className="text-white/60 text-sm">
                      Add shadow to container
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={displaySettings.boxShadow}
                      onChange={() => handleToggleSetting("boxShadow")}
                    />
                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600/80"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div>
                    <div className="text-white">Decorative Elements</div>
                    <div className="text-white/60 text-sm">
                      Add gradient line and blurred orbs
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={displaySettings.decorativeElements}
                      onChange={() => handleToggleSetting("decorativeElements")}
                    />
                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600/80"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Type size={18} className="mr-2 text-purple-400" /> Content
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div>
                    <div className="text-white">Show Name</div>
                    <div className="text-white/60 text-sm">
                      Display person's name
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={displaySettings.showName}
                      onChange={() => handleToggleSetting("showName")}
                    />
                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600/80"></div>
                  </label>
                </div>

                <div className="flex justify-between items-center p-2 hover:bg-white/5 rounded-lg transition-colors">
                  <div>
                    <div className="text-white">Show Titles</div>
                    <div className="text-white/60 text-sm">
                      Display person's title or role
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={displaySettings.showTitles}
                      onChange={() => handleToggleSetting("showTitles")}
                    />
                    <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600/80"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preview Tab Content */}
        {currentTab === "preview" && (
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Monitor size={18} className="mr-2 text-purple-400" /> Preview
                Control
              </h3>

              <div className="space-y-4">
                <button
                  onClick={handleDisplayToggle}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all ${
                    isDisplayActive
                      ? "bg-gradient-to-r from-red-600 to-red-800 shadow-lg shadow-red-700/30"
                      : "bg-gradient-to-r from-gray-900 to-black/50 shadow-lg shadow-purple-700/20"
                  }`}
                >
                  <Monitor size={18} className="mr-2" />
                  {isDisplayActive ? "Hide Preview" : "Show Preview"}
                </button>

                {streamingPerson ? (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                      <span className="font-medium">Now Streaming:</span>
                    </div>
                    <div className="pl-4 border-l-2 border-green-500/30">
                      <div className="font-medium">
                        {streamingPerson.name} {streamingPerson.surname}
                      </div>
                      {streamingPerson.title && (
                        <div className="text-sm text-white/70 italic">
                          {streamingPerson.title}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-800/50 border border-white/10 rounded-lg p-3 text-center text-white/60">
                    No one is currently being streamed.
                    <div className="mt-1 text-sm">
                      Click the "Stream" button next to a person to start.
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white/10 p-4 rounded-lg border border-white/10">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <ExternalLink size={18} className="mr-2 text-purple-400" /> OBS
                Setup
              </h3>

              <div className="mb-4">
                <label className="block mb-2 text-sm text-white/80">
                  Display URL (add as browser source in OBS)
                </label>
                <div className="flex">
                  <input
                    type="text"
                    className="flex-1 p-2 rounded-l-lg bg-gray-800 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={displayUrl}
                    readOnly
                  />
                  <button
                    onClick={handleCopyDisplayUrl}
                    className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 flex items-center transition-colors"
                  >
                    <Copy size={16} className="mr-1" /> Copy
                  </button>
                  <button
                    onClick={handleOpenDisplayWindow}
                    className="p-2 bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 flex items-center transition-colors rounded-r-lg"
                  >
                    <ExternalLink size={16} className="mr-1" /> Open
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-white/80">
                <p className="mb-2">Quick Setup Instructions:</p>
                <ol className="list-decimal pl-5 space-y-1">
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
      <div className="w-2/4 p-6 flex flex-col items-center">
        <h1 className="text-3xl mb-8 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
          Name Display Control
        </h1>

        {/* Preview Display */}
        <div className="mt-4 w-full max-w-xl">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-3 text-lg rounded-t-lg font-medium flex items-center justify-between border-b border-white/10">
            <span>Live Preview</span>
            {streamingPerson && (
              <div className="flex items-center text-sm text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                Streaming
              </div>
            )}
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-b-lg p-6 w-full border border-white/10 shadow-lg">
            <div className="border border-dashed border-white/20 p-8 rounded-lg flex flex-col items-center justify-center min-h-40 bg-black/40">
              {/* Main preview component */}
              {streamingPerson ? (
                <DisplayView
                  person={streamingPerson}
                  settings={displaySettings}
                />
              ) : (
                <div className="text-center text-white/50">
                  <div className="mb-2 text-lg">No content streaming</div>
                  <div className="text-sm">
                    Click "Stream" next to a person to display them
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick settings under preview */}
          <div className="mt-6 bg-white/5 rounded-lg border border-white/10 p-4">
            <h3 className="text-lg font-medium mb-3">Quick Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={displaySettings.showName}
                    onChange={() => handleToggleSetting("showName")}
                  />
                  <div className="w-10 h-5 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600/80"></div>
                </label>
                <span className="text-sm">Show Name</span>
              </div>

              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={displaySettings.showTitles}
                    onChange={() => handleToggleSetting("showTitles")}
                  />
                  <div className="w-10 h-5 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600/80"></div>
                </label>
                <span className="text-sm">Show Title</span>
              </div>

              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={displaySettings.textShadow}
                    onChange={() => handleToggleSetting("textShadow")}
                  />
                  <div className="w-10 h-5 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600/80"></div>
                </label>
                <span className="text-sm">Text Shadow</span>
              </div>

              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={displaySettings.decorativeElements}
                    onChange={() => handleToggleSetting("decorativeElements")}
                  />
                  <div className="w-10 h-5 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600/80"></div>
                </label>
                <span className="text-sm">Decorations</span>
              </div>
            </div>
          </div>

          {/* Display style presets */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Style Presets</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                className="p-3 rounded-lg bg-gradient-to-r from-indigo-900/90 to-purple-900/90 border border-white/20 shadow-md hover:shadow-lg transition-all text-center"
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
                <div className="text-sm font-medium mb-1">Gradient</div>
                <div className="text-xs text-white/60">Classic style</div>
              </button>

              <button
                className="p-3 rounded-lg bg-black/80 border border-white/20 shadow-md hover:shadow-lg transition-all text-center"
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
                <div className="text-sm font-medium mb-1">Minimal</div>
                <div className="text-xs text-white/60">Clean look</div>
              </button>

              <button
                className="p-3 rounded-lg bg-black/40 border-l-4 border-l-pink-500 border-t border-r border-b border-white/20 shadow-md hover:shadow-lg transition-all text-center"
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
                <div className="text-sm font-medium mb-1">Accented</div>
                <div className="text-xs text-white/60">
                  With color highlight
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Display simulation */}
      {isDisplayActive && (
        <div className="fixed top-4 right-4 z-50 bg-black/80 p-4 rounded-lg border border-white/20 shadow-lg animate-fade-in">
          {streamingPerson ? (
            <DisplayView person={streamingPerson} settings={displaySettings} />
          ) : (
            <div className="text-center text-white/70 p-4">
              <div className="mb-2">No one is currently streaming</div>
              <div className="text-sm">
                Select a person and click "Stream" to display them
              </div>
            </div>
          )}
          <button
            onClick={handleDisplayToggle}
            className="mt-2 p-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 w-full transition-colors"
          >
            Close Preview
          </button>
        </div>
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                How to Use the Name Display Tool
              </h2>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <ChevronRight size={18} className="mr-2 text-blue-400" />{" "}
                  Adding People
                </h3>
                <p className="text-white/80 pl-6">
                  Add individuals manually by filling out the form at the bottom
                  of the People tab, or import multiple people from an Excel
                  spreadsheet.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <ChevronRight size={18} className="mr-2 text-blue-400" />{" "}
                  Selecting vs Streaming
                </h3>
                <p className="text-white/80 pl-6">
                  <span className="text-blue-400 font-medium">Select</span> a
                  person to view them in the preview.{" "}
                  <span className="text-green-400 font-medium">Stream</span> a
                  person to display their name in OBS and other tools.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <ChevronRight size={18} className="mr-2 text-blue-400" />{" "}
                  Customizing Display
                </h3>
                <p className="text-white/80 pl-6">
                  Use the Style tab to customize how names will appear. Try
                  different background styles, text options, and effects for
                  optimal visibility.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <ChevronRight size={18} className="mr-2 text-blue-400" /> OBS
                  Integration
                </h3>
                <p className="text-white/80 pl-6">
                  Add the display URL as a Browser Source in OBS. The display
                  will update automatically when you stream different people.
                  Size recommendation: 800×200px.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium flex items-center">
                  <ChevronRight size={18} className="mr-2 text-blue-400" /> Tips
                  for Video Overlay
                </h3>
                <ul className="text-white/80 pl-8 list-disc space-y-1">
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

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowTutorial(false)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert all necessary CSS directly in the component */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Core Styles */
        body, html {
          margin: 0 !important;
          padding: 0 !important;
          height: 100% !important;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
        }

        /* Text and Effects */
        .text-shadow-lg {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5) !important;
        }

        /* Animations */
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite !important;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in !important;
        }

        /* Scrollbar Styling */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px !important;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1) !important;
          border-radius: 10px !important;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 10px !important;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3) !important;
        }

        /* Netflix-compatible Layout Classes */
        .flex { display: flex !important; }
        .flex-col { flex-direction: column !important; }
        .flex-1 { flex: 1 1 0% !important; }
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        .justify-between { justify-content: space-between !important; }
        .justify-end { justify-content: flex-end !important; }
        .space-x-1 > * + * { margin-left: 0.25rem !important; }
        .space-x-2 > * + * { margin-left: 0.5rem !important; }
        .space-y-1 > * + * { margin-top: 0.25rem !important; }
        .space-y-2 > * + * { margin-top: 0.5rem !important; }
        .space-y-3 > * + * { margin-top: 0.75rem !important; }
        .space-y-4 > * + * { margin-top: 1rem !important; }

        /* Width and Height Classes */
        .w-full { width: 100% !important; }
        .w-1\\/4 { width: 25% !important; }
        .w-2\\/4 { width: 50% !important; }
        .h-screen { height: 100vh !important; }
        .min-h-40 { min-height: 10rem !important; }
        .max-h-\\[80vh\\] { max-height: 80vh !important; }
        .max-h-\\[calc\\(100vh-280px\\)\\] { max-height: calc(100vh - 280px) !important; }
        .max-w-md { max-width: 28rem !important; }
        .max-w-xl { max-width: 36rem !important; }
        .max-w-2xl { max-width: 42rem !important; }

        /* Background Classes */
        .bg-transparent { background-color: transparent !important; }
        .bg-black\\/20 { background-color: rgba(0, 0, 0, 0.2) !important; }
        .bg-black\\/30 { background-color: rgba(0, 0, 0, 0.3) !important; }
        .bg-black\\/40 { background-color: rgba(0, 0, 0, 0.4) !important; }
        .bg-black\\/70 { background-color: rgba(0, 0, 0, 0.7) !important; }
        .bg-black\\/80 { background-color: rgba(0, 0, 0, 0.8) !important; }
        .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05) !important; }
        .bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1) !important; }
        .bg-white\\/15 { background-color: rgba(255, 255, 255, 0.15) !important; }
        .bg-white\\/20 { background-color: rgba(255, 255, 255, 0.2) !important; }
        .bg-gray-800 { background-color: rgb(31, 41, 55) !important; }
        .bg-gray-800\\/50 { background-color: rgba(31, 41, 55, 0.5) !important; }
        .bg-gray-900 { background-color: rgb(17, 24, 39) !important; }
        .bg-blue-600 { background-color: rgb(37, 99, 235) !important; }
        .bg-green-600 { background-color: rgb(22, 163, 74) !important; }
        .bg-red-600 { background-color: rgb(220, 38, 38) !important; }
        .bg-green-900\\/20 { background-color: rgba(20, 83, 45, 0.2) !important; }

        /* Gradient Backgrounds */
        .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)) !important; }
        .bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--tw-gradient-stops)) !important; }
        .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)) !important; }
        .from-gray-800 { --tw-gradient-from: rgb(31, 41, 55) !important; }
        .from-gray-900 { --tw-gradient-from: rgb(17, 24, 39) !important; }
        .from-blue-300 { --tw-gradient-from: rgb(147, 197, 253) !important; }
        .from-blue-600 { --tw-gradient-from: rgb(37, 99, 235) !important; }
        .from-indigo-900 { --tw-gradient-from: rgb(49, 46, 129) !important; }
        .from-indigo-900\\/90 { --tw-gradient-from: rgba(49, 46, 129, 0.9) !important; }
        .from-green-900\\/40 { --tw-gradient-from: rgba(20, 83, 45, 0.4) !important; }
        .from-red-600 { --tw-gradient-from: rgb(220, 38, 38) !important; }
        .via-gray-800 { --tw-gradient-via: rgb(31, 41, 55) !important; }
        .to-gray-900 { --tw-gradient-to: rgb(17, 24, 39) !important; }
        .to-black { --tw-gradient-to: rgb(0, 0, 0) !important; }
        .to-black\\/50 { --tw-gradient-to: rgba(0, 0, 0, 0.5) !important; }
        .to-blue-800 { --tw-gradient-to: rgb(30, 64, 175) !important; }
        .to-blue-900 { --tw-gradient-to: rgb(30, 58, 138) !important; }
        .to-green-800 { --tw-gradient-to: rgb(22, 101, 52) !important; }
        .to-green-900 { --tw-gradient-to: rgb(20, 83, 45) !important; }
        .to-purple-300 { --tw-gradient-to: rgb(216, 180, 254) !important; }
        .to-purple-600 { --tw-gradient-to: rgb(147, 51, 234) !important; }
        .to-purple-700 { --tw-gradient-to: rgb(126, 34, 206) !important; }
        .to-purple-900\\/90 { --tw-gradient-to: rgba(88, 28, 135, 0.9) !important; }
        .to-red-800 { --tw-gradient-to: rgb(153, 27, 27) !important; }
        .to-green-800\\/40 { --tw-gradient-to: rgba(22, 101, 52, 0.4) !important; }

        /* Text Colors */
        .text-white { color: white !important; }
        .text-white\\/40 { color: rgba(255, 255, 255, 0.4) !important; }
        .text-white\\/50 { color: rgba(255, 255, 255, 0.5) !important; }
        .text-white\\/60 { color: rgba(255, 255, 255, 0.6) !important; }
        .text-white\\/70 { color: rgba(255, 255, 255, 0.7) !important; }
        .text-white\\/80 { color: rgba(255, 255, 255, 0.8) !important; }
        .text-white\\/90 { color: rgba(255, 255, 255, 0.9) !important; }
        .text-blue-400 { color: rgb(96, 165, 250) !important; }
        .text-green-400 { color: rgb(74, 222, 128) !important; }
        .text-green-500 { color: rgb(34, 197, 94) !important; }
        .text-purple-400 { color: rgb(192, 132, 252) !important; }
        .text-red-100 { color: rgb(254, 226, 226) !important; }
        .text-green-100 { color: rgb(220, 252, 231) !important; }
        .text-transparent { color: transparent !important; }

        /* Font Classes */
        .font-sans { font-family: ui-sans-serif, system-ui, sans-serif !important; }
        .text-xs { font-size: 0.75rem !important; }
        .text-sm { font-size: 0.875rem !important; }
        .text-lg { font-size: 1.125rem !important; }
        .text-xl { font-size: 1.25rem !important; }
        .text-2xl { font-size: 1.5rem !important; }
        .text-3xl { font-size: 1.875rem !important; }
        .font-light { font-weight: 300 !important; }
        .font-normal { font-weight: 400 !important; }
        .font-medium { font-weight: 500 !important; }
        .font-semibold { font-weight: 600 !important; }
        .font-bold { font-weight: 700 !important; }
        .italic { font-style: italic !important; }
        .text-center { text-align: center !important; }

        /* Borders */
        .border { border-width: 1px !important; }
        .border-l { border-left-width: 1px !important; }
        .border-r { border-right-width: 1px !important; }
        .border-t { border-top-width: 1px !important; }
        .border-b { border-bottom-width: 1px !important; }
        .border-l-4 { border-left-width: 4px !important; }
        .border-0 { border-width: 0 !important; }
        .border-2 { border-width: 2px !important; }
        .border-dashed { border-style: dashed !important; }
        .border-white\\/0 { border-color: rgba(255, 255, 255, 0) !important; }
        .border-white\\/10 { border-color: rgba(255, 255, 255, 0.1) !important; }
        .border-white\\/20 { border-color: rgba(255, 255, 255, 0.2) !important; }
        .border-white\\/30 { border-color: rgba(255, 255, 255, 0.3) !important; }
        .border-blue-500 { border-color: rgb(59, 130, 246) !important; }
        .border-green-500\\/30 { border-color: rgba(34, 197, 94, 0.3) !important; }
        .border-green-500\\/50 { border-color: rgba(34, 197, 94, 0.5) !important; }
        .border-l-blue-500 { border-left-color: rgb(59, 130, 246) !important; }
        .border-l-pink-500 { border-left-color: rgb(236, 72, 153) !important; }
        .border-l-green-500\\/30 { border-left-color: rgba(34, 197, 94, 0.3) !important; }

        /* Padding */
        .p-1 { padding: 0.25rem !important; }
        .p-2 { padding: 0.5rem !important; }
        .p-3 { padding: 0.75rem !important; }
        .p-4 { padding: 1rem !important; }
        .p-6 { padding: 1.5rem !important; }
        .p-8 { padding: 2rem !important; }
        .px-3 { padding-left: 0.75rem !important; padding-right: 0.75rem !important; }
        .px-4 { padding-left: 1rem !important; padding-right: 1rem !important; }
        .px-6 { padding-left: 1.5rem !important; padding-right: 1.5rem !important; }
        .py-2 { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
        .py-3 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
        .py-4 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
        .pl-4 { padding-left: 1rem !important; }
        .pl-5 { padding-left: 1.25rem !important; }
        .pl-6 { padding-left: 1.5rem !important; }
        .pl-8 { padding-left: 2rem !important; }

        /* Margin */
        .m-0 { margin: 0 !important; }
        .mb-1 { margin-bottom: 0.25rem !important; }
        .mb-2 { margin-bottom: 0.5rem !important; }
        .mb-3 { margin-bottom: 0.75rem !important; }
        .mb-4 { margin-bottom: 1rem !important; }
        .mb-8 { margin-bottom: 2rem !important; }
        .ml-1 { margin-left: 0.25rem !important; }
        .ml-2 { margin-left: 0.5rem !important; }
        .mr-1 { margin-right: 0.25rem !important; }
        .mr-2 { margin-right: 0.5rem !important; }
        .mt-1 { margin-top: 0.25rem !important; }
        .mt-2 { margin-top: 0.5rem !important; }
        .mt-3 { margin-top: 0.75rem !important; }
        .mt-4 { margin-top: 1rem !important; }
        .mt-6 { margin-top: 1.5rem !important; }

        /* Positioning */
        .relative { position: relative !important; }
        .absolute { position: absolute !important; }
        .fixed { position: fixed !important; }
        .inset-0 { top: 0 !important; right: 0 !important; bottom: 0 !important; left: 0 !important; }
        .top-0 { top: 0 !important; }
        .left-0 { left: 0 !important; }
        .bottom-0 { bottom: 0 !important; }
        .right-0 { right: 0 !important; }
        .top-4 { top: 1rem !important; }
        .right-4 { right: 1rem !important; }
        .-top-20 { top: -5rem !important; }
        .-left-20 { left: -5rem !important; }
        .-bottom-20 { bottom: -5rem !important; }
        .-right-20 { right: -5rem !important; }
        .z-10 { z-index: 10 !important; }
        .z-50 { z-index: 50 !important; }

        /* Borders and Shadows */
        .rounded { border-radius: 0.25rem !important; }
        .rounded-md { border-radius: 0.375rem !important; }
        .rounded-lg { border-radius: 0.5rem !important; }
        .rounded-full { border-radius: 9999px !important; }
        .rounded-t-lg { border-top-left-radius: 0.5rem !important; border-top-right-radius: 0.5rem !important; }
        .rounded-b-lg { border-bottom-left-radius: 0.5rem !important; border-bottom-right-radius: 0.5rem !important; }
        .rounded-l-lg { border-top-left-radius: 0.5rem !important; border-bottom-left-radius: 0.5rem !important; }
        .rounded-r-lg { border-top-right-radius: 0.5rem !important; border-bottom-right-radius: 0.5rem !important; }
        .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1) !important; }
        .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1) !important; }
        .shadow-red-700\\/30 { --tw-shadow-color: rgba(185, 28, 28, 0.3) !important; }
        .shadow-purple-700\\/20 { --tw-shadow-color: rgba(126, 34, 206, 0.2) !important; }
        .shadow-purple-500\\/30 { --tw-shadow-color: rgba(168, 85, 247, 0.3) !important; }
        .ring-2 { box-shadow: 0 0 0 2px var(--tw-ring-color) !important; }
        .ring-blue-500 { --tw-ring-color: rgb(59, 130, 246) !important; }
        .ring-purple-500 { --tw-ring-color: rgb(168, 85, 247) !important; }
        .ring-purple-500\\/70 { --tw-ring-color: rgba(168, 85, 247, 0.7) !important; }

        /* Transforms */
        .transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)) !important; }

        /* Overflow */
        .overflow-hidden { overflow: hidden !important; }
        .overflow-y-auto { overflow-y: auto !important; }
        .overflow-x-hidden { overflow-x: hidden !important; }

        /* Display */
        .hidden { display: none !important; }
        .block { display: block !important; }
        .inline-flex { display: inline-flex !important; }

        /* Transitions */
        .transition { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
        .transition-all { transition-property: all !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
        .transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }
        .duration-300 { transition-duration: 300ms !important; }
        .duration-500 { transition-duration: 500ms !important; }

        /* Grid */
        .grid { display: grid !important; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        .gap-2 { gap: 0.5rem !important; }
        .gap-3 { gap: 0.75rem !important; }
        .gap-4 { gap: 1rem !important; }

        /* List Styles */
        .list-disc { list-style-type: disc !important; }
        .list-decimal { list-style-type: decimal !important; }

        /* Backdrop Filter */
        .backdrop-blur-sm { backdrop-filter: blur(4px) !important; }
        .blur-3xl { filter: blur(64px) !important; }

        /* Hover & Focus States */
        .hover\\:bg-white\\/5:hover { background-color: rgba(255, 255, 255, 0.05) !important; }
        .hover\\:bg-white\\/10:hover { background-color: rgba(255, 255, 255, 0.1) !important; }
        .hover\\:bg-white\\/15:hover { background-color: rgba(255, 255, 255, 0.15) !important; }
        .hover\\:bg-white\\/20:hover { background-color: rgba(255, 255, 255, 0.2) !important; }
        .hover\\:bg-blue-700:hover { background-color: rgb(29, 78, 216) !important; }
        .hover\\:bg-gray-700:hover { background-color: rgb(55, 65, 81) !important; }
        .hover\\:bg-red-700:hover { background-color: rgb(185, 28, 28) !important; }
        .hover\\:bg-green-700:hover { background-color: rgb(21, 128, 61) !important; }
        .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1) !important; }
        .hover\\:text-white:hover { color: white !important; }
        .hover\\:text-white\\/80:hover { color: rgba(255, 255, 255, 0.8) !important; }
        .hover\\:text-white\\/90:hover { color: rgba(255, 255, 255, 0.9) !important; }
        .hover\\:text-blue-400:hover { color: rgb(96, 165, 250) !important; }
        .hover\\:text-red-400:hover { color: rgb(248, 113, 113) !important; }
        .hover\\:from-blue-700:hover { --tw-gradient-from: rgb(29, 78, 216) !important; }
        .hover\\:from-green-700:hover { --tw-gradient-from: rgb(21, 128, 61) !important; }
        .hover\\:to-purple-700:hover { --tw-gradient-to: rgb(126, 34, 206) !important; }
        .hover\\:to-blue-900:hover { --tw-gradient-to: rgb(30, 58, 138) !important; }
        .hover\\:to-green-900:hover { --tw-gradient-to: rgb(20, 83, 45) !important; }
        .focus\\:outline-none:focus { outline: 2px solid transparent !important; outline-offset: 2px !important; }
        .focus\\:ring-2:focus { box-shadow: 0 0 0 2px var(--tw-ring-color) !important; }
        .focus\\:ring-blue-500:focus { --tw-ring-color: rgb(59, 130, 246) !important; }

        /* Peer States */
        .peer-checked\\:after\\:translate-x-full:checked::after { --tw-translate-x: 100% !important; }
        .peer-checked\\:bg-blue-600\\/80:checked { background-color: rgba(37, 99, 235, 0.8) !important; }
        .peer:checked ~ .peer-checked\\:bg-blue-600\\/80 { background-color: rgba(37, 99, 235, 0.8) !important; }

        /* After Elements */
        .after\\:content-[\\'\\']::after { content: "" !important; }
        .after\\:absolute::after { position: absolute !important; }
        .after\\:top-\\[2px\\]::after { top: 2px !important; }
        .after\\:left-\\[2px\\]::after { left: 2px !important; }
        .after\\:bg-white::after { background-color: white !important; }
        .after\\:border::after { border-width: 1px !important; }
        .after\\:rounded-full::after { border-radius: 9999px !important; }
        .after\\:h-4::after { height: 1rem !important; }
        .after\\:h-5::after { height: 1.25rem !important; }
        .after\\:w-4::after { width: 1rem !important; }
        .after\\:w-5::after { width: 1.25rem !important; }
        .after\\:transition-all::after { transition-property: all !important; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) !important; transition-duration: 150ms !important; }

        /* Custom Background Clip */
        .bg-clip-text {
          -webkit-background-clip: text !important;
          background-clip: text !important;
        }

        /* Additional utility classes */
        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border-width: 0 !important;
        }

        /* Cursor */
        .cursor-pointer { cursor: pointer !important; }
        .cursor-not-allowed { cursor: not-allowed !important; }
      `,
        }}
      />
    </div>
  );
};

export default StreamingApp;
