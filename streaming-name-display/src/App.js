import React, { useState } from "react";
import {
  Settings,
  X,
  Copy,
  ExternalLink,
  Upload,
  Check,
  AlertCircle,
} from "lucide-react";

// This component represents what would be displayed on the separate display page
const DisplayView = ({ person, settings }) => {
  if (!person) return null;

  // Format the displayed name based on settings
  const formattedName = settings.showName
    ? person.surname
      ? `${person.name}/${person.surname}`
      : person.name
    : "";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent p-4">
      {/* Main display area with nice styling */}
      <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 rounded-lg p-6 shadow-lg backdrop-blur-sm border border-white/20 text-center w-full max-w-md transform transition-all duration-500 hover:scale-105 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-purple-500"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-pink-500/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl"></div>

        {settings.showName && formattedName && (
          <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
            {formattedName}
          </h1>
        )}
        {settings.showTitles && person.title && (
          <h2 className="text-xl text-white/90 italic relative z-10">
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
    { id: 1, name: "Name1", surname: "", title: "Title 1", selected: true },
    { id: 2, name: "Name2", surname: "", title: "", selected: false },
    { id: 3, name: "Name3", surname: "", title: "", selected: false },
    { id: 4, name: "Name4", surname: "", title: "", selected: false },
    { id: 5, name: "Name5", surname: "", title: "", selected: false },
    { id: 6, name: "Name6", surname: "", title: "", selected: false },
  ]);
  const [newPerson, setNewPerson] = useState({
    name: "",
    surname: "",
    title: "",
  });
  const [displaySettings, setDisplaySettings] = useState({
    showName: true,
    showTitles: true,
  });
  const [isDisplayActive, setIsDisplayActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [animate, setAnimate] = useState({
    nameAdded: false,
    displayToggled: false,
  });
  const [showModal, setShowModal] = useState(false);

  // For demo purposes, generate a display URL
  const displayUrl = window.location.href.split("?")[0] + "?display=true";

  // Currently selected person
  const selectedPerson = people.find((person) => person.selected) || people[0];

  // Handle selecting a person
  const handleSelectPerson = (id) => {
    setPeople(
      people.map((person) => ({
        ...person,
        selected: person.id === id,
      })),
    );
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
      },
    ]);
    setNewPerson({ name: "", surname: "", title: "" });

    // Show animation
    setAnimate({ ...animate, nameAdded: true });
    setTimeout(() => setAnimate({ ...animate, nameAdded: false }), 1000);
  };

  // Handle removing a person
  const handleRemovePerson = (id) => {
    setPeople(people.filter((person) => person.id !== id));
  };

  // Handle toggling display settings
  const handleToggleSetting = (setting) => {
    setDisplaySettings({
      ...displaySettings,
      [setting]: !displaySettings[setting],
    });
  };

  // Handle toggling display view with animation
  const handleDisplayToggle = () => {
    setIsDisplayActive(!isDisplayActive);

    // Show animation
    setAnimate({ ...animate, displayToggled: true });
    setTimeout(() => setAnimate({ ...animate, displayToggled: false }), 1000);
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
        };
      });

      // Add new people to our list
      setPeople([...people, ...newPeople]);
      setUploadStatus({
        success: true,
        message: `Successfully imported ${newPeople.length} people from Excel`,
      });

      // Show success animation
      setAnimate({ ...animate, nameAdded: true });
      setTimeout(() => setAnimate({ ...animate, nameAdded: false }), 1000);
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

  // Format the displayed name based on settings
  const getFormattedName = (person) => {
    if (displaySettings.showName) {
      return person.surname ? `${person.name}/${person.surname}` : person.name;
    }
    return "";
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 text-white font-sans overflow-hidden">
      {/* Left sidebar */}
      <div className="w-1/4 p-4 flex flex-col bg-black/20 backdrop-blur-sm border-r border-white/10">
        <div className="mb-6">
          <h2 className="text-2xl mb-4 font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
            Names
          </h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 mb-2 flex justify-between items-center">
            <button className="text-xs text-white/70 hover:text-white transition">
              Choose sidebar display
            </button>

            {/* Display simulation */}
            {isDisplayActive && (
              <div className="fixed top-4 right-4 z-50 bg-black/80 p-4 rounded-lg border border-white/20 shadow-lg animate-fade-in">
                <DisplayView
                  person={selectedPerson}
                  settings={displaySettings}
                />
                <button
                  onClick={handleDisplayToggle}
                  className="mt-2 p-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 w-full transition-colors"
                >
                  Close Display Preview
                </button>
              </div>
            )}
          </div>

          {/* People list */}
          <div className="space-y-2 mb-4 max-h-[calc(100vh-400px)] overflow-y-auto custom-scrollbar">
            {people.length === 0 ? (
              <div className="text-center p-4 border border-dashed border-white/20 rounded-lg bg-white/5">
                <p className="text-white/60">No people added yet</p>
                <p className="text-white/40 text-sm mt-1">
                  Add people manually or import from Excel
                </p>
              </div>
            ) : (
              people.map((person) => (
                <div
                  key={person.id}
                  className={`flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                    person.selected
                      ? "border-l-4 border-pink-500 bg-white/15"
                      : "border-l-4 border-transparent"
                  } ${animate.nameAdded ? "animate-pulse" : ""}`}
                  onClick={() => handleSelectPerson(person.id)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {person.name} {person.surname && `${person.surname}`}
                    </span>
                    {person.title && (
                      <span className="text-sm text-white/70 italic">
                        {person.title}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovePerson(person.id);
                    }}
                    className="text-white/50 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-white/10"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Excel Import */}
          <div className="mb-4">
            <div className="border border-dashed border-white/20 rounded-lg p-4 bg-white/5 text-center">
              <h3 className="font-bold mb-2 text-white">Import from Excel</h3>
              <p className="text-white/70 text-sm mb-2">
                Upload an Excel sheet with columns for Name, Surname, and Title
              </p>

              <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed rounded-lg cursor-pointer hover:bg-white/10 bg-white/5 border-white/20 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload
                    className={`w-6 h-6 mb-1 text-white/70 ${isUploading ? "animate-bounce" : ""}`}
                  />
                  <p className="text-sm text-white/70">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-white/50">
                    Excel files only (.xlsx, .xls)
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

          {/* Add new person form */}
          <div className="p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white">
            <h3 className="font-bold mb-2 text-white">Add New Person</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 rounded border border-white/20 bg-white/5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/50 transition-all"
                value={newPerson.name}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Surname (optional)"
                className="w-full p-2 rounded border border-white/20 bg-white/5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/50 transition-all"
                value={newPerson.surname}
                onChange={(e) =>
                  setNewPerson({ ...newPerson, surname: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Title (optional)"
                className="w-full p-2 rounded border border-white/20 bg-white/5 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-white/50 transition-all"
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
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                }`}
              >
                Add Person
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center content */}
      <div className="w-2/4 p-4 flex flex-col items-center">
        <h1 className="text-4xl mb-10 font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-300">
          Streaming
        </h1>

        {/* Display control button */}
        <div className="relative mt-10">
          <button
            onClick={handleDisplayToggle}
            className={`px-8 py-4 text-2xl rounded-lg font-bold transition-all duration-300 ${
              isDisplayActive
                ? "bg-gradient-to-r from-red-600 to-red-800 shadow-lg shadow-red-700/30"
                : "bg-gradient-to-r from-gray-900 to-black shadow-lg shadow-purple-700/20"
            } text-white ${animate.displayToggled ? "animate-pulse" : ""}`}
          >
            {isDisplayActive ? "Hide Display" : "Show Display"}
          </button>

          {/* Decorative lines */}
          <div
            className="absolute top-0 right-0 w-40 h-40 border-t-2 border-r-2 border-pink-500/50"
            style={{ transform: "translate(100%, -50%)" }}
          ></div>
          <div
            className="absolute bottom-0 right-0 w-40 h-40 border-b-2 border-r-2 border-pink-500/50"
            style={{ transform: "translate(100%, 50%)" }}
          ></div>
        </div>

        {/* Preview section */}
        <div className="mt-10 w-full max-w-lg">
          <div className="bg-gradient-to-r from-gray-900 to-black text-white px-8 py-4 text-xl rounded-t-lg font-medium flex items-center justify-center border-b border-white/10">
            <span className="mr-2">Preview</span>
          </div>

          <div className="bg-black/40 backdrop-blur-sm rounded-b-lg p-6 w-full border border-white/10 shadow-lg">
            <div className="border border-dashed border-white/20 p-8 rounded-lg flex flex-col items-center justify-center min-h-32">
              {/* Preview of what will be shown on the display page */}
              <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 rounded-lg p-6 shadow-lg border border-white/20 text-center w-full transform transition-all duration-300 hover:scale-105">
                {displaySettings.showName && (
                  <div className="text-2xl font-bold text-white mb-2">
                    {getFormattedName(selectedPerson)}
                  </div>
                )}
                {displaySettings.showTitles && selectedPerson.title && (
                  <div className="text-lg text-white/90 italic">
                    {selectedPerson.title}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Display URL */}
          <div className="mt-6">
            <label className="block mb-2 font-medium text-white/80">
              Display Page URL (add as browser source in OBS)
            </label>
            <div className="flex">
              <input
                type="text"
                className="flex-1 p-2 rounded-l-lg bg-black/30 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500"
                value={displayUrl}
                readOnly
              />
              <button
                onClick={handleCopyDisplayUrl}
                className="p-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 flex items-center transition-colors rounded-none"
              >
                <Copy size={16} className="mr-1" /> Copy
              </button>
              <a
                href="www.example.com"
                className="p-2 bg-gradient-to-r from-green-600 to-green-800 text-white hover:from-green-700 hover:to-green-900 flex items-center transition-colors rounded-r-lg"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(displayUrl, "_blank", "width=800,height=200");
                }}
              >
                <ExternalLink size={16} className="mr-1" /> Open
              </a>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowModal(true)}
                className="text-sm text-white/70 hover:text-white underline transition-colors"
              >
                View setup instructions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right settings */}
      <div className="w-1/4 p-4 bg-black/20 backdrop-blur-sm border-l border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-pink-300">
            Shape
          </h2>
          <Settings size={24} className="text-white/70" />
        </div>

        {/* Display settings */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-900/40 to-green-800/40 p-4 rounded-lg border border-green-500/30 backdrop-blur-sm transition-all duration-300 hover:from-green-900/60 hover:to-green-800/60">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white font-medium">Name</div>
                <div className="text-white/70">
                  {getFormattedName(selectedPerson) || "No name selected"}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={displaySettings.showName}
                  onChange={() => handleToggleSetting("showName")}
                />
                <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600/80"></div>
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-900/40 to-green-800/40 p-4 rounded-lg border border-green-500/30 backdrop-blur-sm transition-all duration-300 hover:from-green-900/60 hover:to-green-800/60">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-white font-medium">Titles</div>
                <div className="text-white/70">
                  {selectedPerson.title || "No title"}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={displaySettings.showTitles}
                  onChange={() => handleToggleSetting("showTitles")}
                />
                <div className="w-11 h-6 bg-gray-700/50 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600/80"></div>
              </label>
            </div>
          </div>
        </div>

        {/* More settings */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3 text-white/90">
            Display Style
          </h3>

          <div className="space-y-2">
            <div className="bg-white/10 p-3 rounded-lg flex items-center cursor-pointer transition-all hover:bg-white/15 border border-white/0 hover:border-white/20">
              <div className="w-4 h-4 rounded-full border-2 border-white mr-2 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </div>
              <span>Gradient Background</span>
            </div>

            <div className="bg-white/5 p-3 rounded-lg flex items-center cursor-pointer transition-all hover:bg-white/15 border border-white/0 hover:border-white/20">
              <div className="w-4 h-4 rounded-full border-2 border-white mr-2"></div>
              <span>Solid Background</span>
            </div>

            <div className="bg-white/5 p-3 rounded-lg flex items-center cursor-pointer transition-all hover:bg-white/15 border border-white/0 hover:border-white/20">
              <div className="w-4 h-4 rounded-full border-2 border-white mr-2"></div>
              <span>Transparent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gradient-to-b from-gray-900 to-black border border-white/20 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">OBS Setup Instructions</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="prose prose-invert">
              <h3>Adding the Name Display to OBS</h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li>In OBS Studio, click the + button in the Sources panel</li>
                <li>Select "Browser" from the list of sources</li>
                <li>Name your source (e.g., "Name Display") and click OK</li>
                <li>
                  In the URL field, paste the Display URL you copied from this
                  app
                </li>
                <li>Set the width and height (recommended: 800×200)</li>
                <li>Check "Refresh browser when scene becomes active"</li>
                <li>Click OK to add the browser source</li>
              </ol>

              <h3 className="mt-4">Tips for Best Results</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  Position the browser source where you want names to appear in
                  your stream
                </li>
                <li>
                  Use this control panel to switch between different people
                  during your stream
                </li>
                <li>
                  The display updates in real-time as you select different
                  people
                </li>
                <li>
                  You may want to add a small border or drop shadow in OBS for
                  better visibility
                </li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamingApp;
