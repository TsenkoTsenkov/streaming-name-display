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
                href="https://example.com"
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

      {/* Custom CSS */}
      <style jsx global>{`
        body {
          margin: 0;
          padding: 0;
          font-family:
            -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
            Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
        }

        /* CSS for all the utility classes in the app */
        .flex {
          display: flex;
        }
        .h-screen {
          height: 100vh;
        }
        .bg-gradient-to-br {
          background-image: linear-gradient(
            to bottom right,
            var(--tw-gradient-stops)
          );
        }
        .from-purple-900 {
          --tw-gradient-from: #581c87;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(88, 28, 135, 0));
        }
        .via-purple-700 {
          --tw-gradient-via: #7e22ce;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-via),
            var(--tw-gradient-to, rgba(126, 34, 206, 0));
        }
        .to-indigo-800 {
          --tw-gradient-to: #3730a3;
        }
        .text-white {
          color: white;
        }
        .font-sans {
          font-family: ui-sans-serif, system-ui, sans-serif;
        }
        .overflow-hidden {
          overflow: hidden;
        }

        /* Width classes */
        .w-1 4 {
          width: 25%;
        }
        .w-2 4 {
          width: 50%;
        }
        .w-full {
          width: 100%;
        }
        .max-w-md {
          max-width: 28rem;
        }
        .max-w-lg {
          max-width: 32rem;
        }
        .max-w-2xl {
          max-width: 42rem;
        }

        /* Height classes */
        .h-1 {
          height: 0.25rem;
        }
        .h-2 {
          height: 0.5rem;
        }
        .h-4 {
          height: 1rem;
        }
        .h-5 {
          height: 1.25rem;
        }
        .h-6 {
          height: 1.5rem;
        }
        .h-20 {
          height: 5rem;
        }
        .h-40 {
          height: 10rem;
        }
        .h-full {
          height: 100%;
        }
        .min-h-32 {
          min-height: 8rem;
        }
        .max-h-\\[80vh\\] {
          max-height: 80vh;
        }
        .max-h-\\[calc\\(100vh-400px\\)\\] {
          max-height: calc(100vh - 400px);
        }

        /* Padding classes */
        .p-1 {
          padding: 0.25rem;
        }
        .p-2 {
          padding: 0.5rem;
        }
        .p-3 {
          padding: 0.75rem;
        }
        .p-4 {
          padding: 1rem;
        }
        .p-6 {
          padding: 1.5rem;
        }
        .p-8 {
          padding: 2rem;
        }
        .px-4 {
          padding-left: 1rem;
          padding-right: 1rem;
        }
        .px-8 {
          padding-left: 2rem;
          padding-right: 2rem;
        }
        .py-2 {
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
        }
        .py-4 {
          padding-top: 1rem;
          padding-bottom: 1rem;
        }
        .py-6 {
          padding-top: 0.5rem;
          padding-bottom: 1.5rem;
        }
        .pb-6 {
          padding-bottom: 1.5rem;
        }
        .pt-5 {
          padding-top: 1.25rem;
        }

        /* Margin classes */
        .m-0 {
          margin: 0;
        }
        .mb-1 {
          margin-bottom: 0.25rem;
        }
        .mb-2 {
          margin-bottom: 0.5rem;
        }
        .mb-3 {
          margin-bottom: 0.75rem;
        }
        .mb-4 {
          margin-bottom: 1rem;
        }
        .mb-6 {
          margin-bottom: 1.5rem;
        }
        .mb-10 {
          margin-bottom: 2.5rem;
        }
        .mr-1 {
          margin-right: 0.25rem;
        }
        .mr-2 {
          margin-right: 0.5rem;
        }
        .mt-1 {
          margin-top: 0.25rem;
        }
        .mt-2 {
          margin-top: 0.5rem;
        }
        .mt-4 {
          margin-top: 1rem;
        }
        .mt-6 {
          margin-top: 1.5rem;
        }
        .mt-8 {
          margin-top: 2rem;
        }
        .mt-10 {
          margin-top: 2.5rem;
        }

        /* Background classes */
        .bg-transparent {
          background-color: transparent;
        }
        .bg-black {
          background-color: black;
        }
        .bg-white l5 {
          background-color: rgba(255, 255, 255, 0.05);
        }
        .bg-white 10 {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .bg-white 15 {
          background-color: rgba(255, 255, 255, 0.15);
        }
        .bg-white 20 {
          background-color: rgba(255, 255, 255, 0.2);
        }
        .bg-black 20 {
          background-color: rgba(0, 0, 0, 0.2);
        }
        .bg-black 30 {
          background-color: rgba(0, 0, 0, 0.3);
        }
        .bg-black 40 {
          background-color: rgba(0, 0, 0, 0.4);
        }
        .bg-black 70 {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .bg-black 80 {
          background-color: rgba(0, 0, 0, 0.8);
        }
        .bg-red-500 20 {
          background-color: rgba(239, 68, 68, 0.2);
        }
        .bg-green-500 20 {
          background-color: rgba(34, 197, 94, 0.2);
        }
        .bg-pink-500 20 {
          background-color: rgba(236, 72, 153, 0.2);
        }
        .bg-purple-500 20 {
          background-color: rgba(168, 85, 247, 0.2);
        }
        .bg-gray-700 50 {
          background-color: rgba(55, 65, 81, 0.5);
        }
        .bg-red-600 {
          background-color: #dc2626;
        }
        .bg-green-600 80 {
          background-color: rgba(22, 163, 74, 0.8);
        }

        /* Border classes */
        .border {
          border-width: 1px;
        }
        .border-0 {
          border-width: 0;
        }
        .border-2 {
          border-width: 2px;
        }
        .border-t-2 {
          border-top-width: 2px;
        }
        .border-r-2 {
          border-right-width: 2px;
        }
        .border-b-2 {
          border-bottom-width: 2px;
        }
        .border-l-4 {
          border-left-width: 4px;
        }
        .border-dashed {
          border-style: dashed;
        }
        .border-solid {
          border-style: solid;
        }
        .border-white {
          border-color: white;
        }
        .border-white 0 {
          border-color: rgba(255, 255, 255, 0);
        }
        .border-white/10 {
          border-color: rgba(255, 255, 255, 0.1);
        }
        .border-white 20 {
          border-color: rgba(255, 255, 255, 0.2);
        }
        .border-pink-500 {
          border-color: #ec4899;
        }
        .border-pink-50050 {
          border-color: rgba(236, 72, 153, 0.5);
        }
        .border-green-500 30 {
          border-color: rgba(34, 197, 94, 0.3);
        }

        /* Text classes */
        .text-xs {
          font-size: 0.75rem;
        }
        .text-sm {
          font-size: 0.875rem;
        }
        .text-lg {
          font-size: 1.125rem;
        }
        .text-xl {
          font-size: 1.25rem;
        }
        .text-2xl {
          font-size: 1.5rem;
        }
        .text-3xl {
          font-size: 1.875rem;
        }
        .text-4xl {
          font-size: 2.25rem;
        }
        .font-medium {
          font-weight: 500;
        }
        .font-semibold {
          font-weight: 600;
        }
        .font-bold {
          font-weight: 700;
        }
        .italic {
          font-style: italic;
        }
        .text-center {
          text-align: center;
        }
        .text-left {
          text-align: left;
        }
        .text-right {
          text-align: right;
        }
        .text-transparent {
          color: transparent;
        }
        .text-white 40 {
          color: rgba(255, 255, 255, 0.4);
        }
        .text-white 50 {
          color: rgba(255, 255, 255, 0.5);
        }
        .text-white60 {
          color: rgba(255, 255, 255, 0.6);
        }
        .text-white 70 {
          color: rgba(255, 255, 255, 0.7);
        }
        .text-white 80 {
          color: rgba(255, 255, 255, 0.8);
        }
        .text-white90 {
          color: rgba(255, 255, 255, 0.9);
        }
        .text-red-100 {
          color: #fee2e2;
        }
        .text-green-100 {
          color: #dcfce7;
        }
        .text-red-400 {
          color: #f87171;
        }
        .underline {
          text-decoration: underline;
        }

        /* Flex classes */
        .flex-1 {
          flex: 1 1 0%;
        }
        .flex-col {
          flex-direction: column;
        }
        .items-center {
          align-items: center;
        }
        .justify-between {
          justify-content: space-between;
        }
        .justify-center {
          justify-content: center;
        }
        .justify-end {
          justify-content: flex-end;
        }
        .space-y-2 > * + * {
          margin-top: 0.5rem;
        }
        .space-y-4 > * + * {
          margin-top: 1rem;
        }

        /* Gradient classes */
        .bg-gradient-to-r {
          background-image: linear-gradient(to right, var(--tw-gradient-stops));
        }
        .bg-gradient-to-b {
          background-image: linear-gradient(
            to bottom,
            var(--tw-gradient-stops)
          );
        }
        .from-pink-300 {
          --tw-gradient-from: #f9a8d4;
          --tw-gradient-stops:
            var(--tw-gradient-from),
            var(--tw-gradient-to, rgba(249, 168, 212, 0));
        }
        .from-red-300 {
          --tw-gradient-from: #fca5a5;
          --tw-gradient-stops:
            var(--tw-gradient-from),
            var(--tw-gradient-to, rgba(252, 165, 165, 0));
        }
        .from-orange-300 {
          --tw-gradient-from: #fdba74;
          --tw-gradient-stops:
            var(--tw-gradient-from),
            var(--tw-gradient-to, rgba(253, 186, 116, 0));
        }
        .from-pink-500 {
          --tw-gradient-from: #ec4899;
          --tw-gradient-stops:
            var(--tw-gradient-from),
            var(--tw-gradient-to, rgba(236, 72, 153, 0));
        }
        .from-pink-600 {
          --tw-gradient-from: #db2777;
          --tw-gradient-stops:
            var(--tw-gradient-from),
            var(--tw-gradient-to, rgba(219, 39, 119, 0));
        }
        .from-blue-600 {
          --tw-gradient-from: #2563eb;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0));
        }
        .from-blue-700 {
          --tw-gradient-from: #1d4ed8;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(29, 78, 216, 0));
        }
        .from-green-600 {
          --tw-gradient-from: #16a34a;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(22, 163, 74, 0));
        }
        .from-green-700 {
          --tw-gradient-from: #15803d;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(21, 128, 61, 0));
        }
        .from-green-900 40 {
          --tw-gradient-from: rgba(20, 83, 45, 0.4);
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(20, 83, 45, 0));
        }
        .from-green-900 60 {
          --tw-gradient-from: rgba(20, 83, 45, 0.6);
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(20, 83, 45, 0));
        }
        .from-gray-900 {
          --tw-gradient-from: #111827;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(17, 24, 39, 0));
        }
        .from-red-600 {
          --tw-gradient-from: #dc2626;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(220, 38, 38, 0));
        }
        .from-indigo-900 90 {
          --tw-gradient-from: rgba(49, 46, 129, 0.9);
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(49, 46, 129, 0));
        }
        .to-black {
          --tw-gradient-to: #000000;
        }
        .to-pink-300 {
          --tw-gradient-to: #f9a8d4;
        }
        .to-red-800 {
          --tw-gradient-to: #991b1b;
        }
        .to-blue-800 {
          --tw-gradient-to: #1e40af;
        }
        .to-blue-900 {
          --tw-gradient-to: #1e3a8a;
        }
        .to-green-800 {
          --tw-gradient-to: #166534;
        }
        .to-green-800 40 {
          --tw-gradient-to: rgba(22, 101, 52, 0.4);
        }
        .to-green-800 60 {
          --tw-gradient-to: rgba(22, 101, 52, 0.6);
        }
        .to-green-900 {
          --tw-gradient-to: #14532d;
        }
        .to-purple-300 {
          --tw-gradient-to: #d8b4fe;
        }
        .to-purple-600 {
          --tw-gradient-to: #9333ea;
        }
        .to-purple-700 {
          --tw-gradient-to: #7e22ce;
        }
        .to-purple-900 90 {
          --tw-gradient-to: rgba(88, 28, 135, 0.9);
        }
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }

        /* Positioning */
        .relative {
          position: relative;
        }
        .absolute {
          position: absolute;
        }
        .fixed {
          position: fixed;
        }
        .inset-0 {
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
        .top-0 {
          top: 0;
        }
        .right-0 {
          right: 0;
        }
        .bottom-0 {
          bottom: 0;
        }
        .left-0 {
          left: 0;
        }
        .top-4 {
          top: 1rem;
        }
        .right-4 {
          right: 1rem;
        }
        .top-\\[2px\\] {
          top: 2px;
        }
        .left-\\[2px\\] {
          left: 2px;
        }
        .-top-20 {
          top: -5rem;
        }
        .-left-20 {
          left: -5rem;
        }
        .-bottom-20 {
          bottom: -5rem;
        }
        .-right-20 {
          right: -5rem;
        }
        .z-10 {
          z-index: 10;
        }
        .z-50 {
          z-index: 50;
        }

        /* Rounded corners */
        .rounded {
          border-radius: 0.25rem;
        }
        .rounded-none {
          border-radius: 0;
        }
        .rounded-lg {
          border-radius: 0.5rem;
        }
        .rounded-t-lg {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
        }
        .rounded-b-lg {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .rounded-l-lg {
          border-top-left-radius: 0.5rem;
          border-bottom-left-radius: 0.5rem;
        }
        .rounded-r-lg {
          border-top-right-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
        }
        .rounded-full {
          border-radius: 9999px;
        }

        /* Shadow */
        .shadow-lg {
          box-shadow:
            0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }
        .shadow-red-700 30 {
          --tw-shadow-color: rgba(185, 28, 28, 0.3);
          box-shadow:
            var(--tw-ring-offset-shadow, 0 0 #0000),
            var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        }
        .shadow-purple-700 20 {
          --tw-shadow-color: rgba(126, 34, 206, 0.2);
          box-shadow:
            var(--tw-ring-offset-shadow, 0 0 #0000),
            var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
        }

        /* Transitions */
        .transition {
          transition-property:
            color, background-color, border-color, text-decoration-color, fill,
            stroke, opacity, box-shadow, transform, filter, backdrop-filter;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .transition-colors {
          transition-property:
            color, background-color, border-color, text-decoration-color, fill,
            stroke;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 150ms;
        }
        .duration-300 {
          transition-duration: 300ms;
        }
        .duration-500 {
          transition-duration: 500ms;
        }

        /* Transforms */
        .transform {
          transform: translate(var(--tw-translate-x), var(--tw-translate-y))
            rotate(var(--tw-rotate)) skewX(var(--tw-skew-x))
            skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
            scaleY(var(--tw-scale-y));
        }
        .scale-105 {
          --tw-scale-x: 1.05;
          --tw-scale-y: 1.05;
        }
        .hover\\:scale-105:hover {
          --tw-scale-x: 1.05;
          --tw-scale-y: 1.05;
        }
        .after\\:translate-x-full::after {
          --tw-translate-x: 100%;
          transform: translate(var(--tw-translate-x), var(--tw-translate-y))
            rotate(var(--tw-rotate)) skewX(var(--tw-skew-x))
            skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
            scaleY(var(--tw-scale-y));
        }

        /* Blur */
        .backdrop-blur-sm {
          backdrop-filter: blur(4px);
        }
        .blur-3xl {
          filter: blur(64px);
        }

        /* Overflow */
        .overflow-y-auto {
          overflow-y: auto;
        }
        .overflow-x-auto {
          overflow-x: auto;
        }

        /* Cursor */
        .cursor-pointer {
          cursor: pointer;
        }
        .cursor-not-allowed {
          cursor: not-allowed;
        }

        /* Display */
        .hidden {
          display: none;
        }
        .block {
          display: block;
        }
        .inline-flex {
          display: inline-flex;
        }

        /* Focus */
        .focus\\:outline-none:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }
        .focus\\:ring-2:focus {
          --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0
            var(--tw-ring-offset-width) var(--tw-ring-offset-color);
          --tw-ring-shadow: var(--tw-ring-inset) 0 0 0
            calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
          box-shadow:
            var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
            var(--tw-shadow, 0 0 #0000);
        }
        .focus\\:ring-pink-500:focus {
          --tw-ring-color: #ec4899;
        }
        .peer-focus\\:outline-none:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
        }

        /* Hover states */
        .hover\\:bg-red-700:hover {
          background-color: #b91c1c;
        }
        .hover\\:bg-white\\/10:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .hover\\:bg-white\\/15:hover {
          background-color: rgba(255, 255, 255, 0.15);
        }
        .hover\\:border-white\\/20:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
        .hover\\:text-white:hover {
          color: white;
        }
        .hover\\:text-red-400:hover {
          color: #f87171;
        }
        .hover\\:from-pink-600:hover {
          --tw-gradient-from: #db2777;
          --tw-gradient-stops:
            var(--tw-gradient-from),
            var(--tw-gradient-to, rgba(219, 39, 119, 0));
        }
        .hover\\:from-blue-700:hover {
          --tw-gradient-from: #1d4ed8;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(29, 78, 216, 0));
        }
        .hover\\:from-green-700:hover {
          --tw-gradient-from: #15803d;
          --tw-gradient-stops:
            var(--tw-gradient-from), var(--tw-gradient-to, rgba(21, 128, 61, 0));
        }
        .hover\\:to-purple-700:hover {
          --tw-gradient-to: #7e22ce;
        }
        .hover\\:to-blue-900:hover {
          --tw-gradient-to: #1e3a8a;
        }
        .hover\\:to-green-900:hover {
          --tw-gradient-to: #14532d;
        }

        /* Animations */
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        /* Custom styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Prose styles for the modal */
        .prose {
          color: inherit;
          max-width: 65ch;
          font-size: 1rem;
          line-height: 1.75;
        }

        .prose h3 {
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-size: 1.25rem;
        }

        .prose-invert {
          color: rgba(255, 255, 255, 0.9);
        }

        .prose ol,
        .prose ul {
          padding-left: 1.25rem;
        }

        .prose li {
          margin-top: 0.25em;
          margin-bottom: 0.25em;
        }

        .after\\:content-\\[\\'\\'\\]::after {
          content: "";
        }

        .peer-checked\\:after\\:translate-x-full:checked::after {
          --tw-translate-x: 100%;
          transform: translate(var(--tw-translate-x), var(--tw-translate-y))
            rotate(var(--tw-rotate)) skewX(var(--tw-skew-x))
            skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
            scaleY(var(--tw-scale-y));
        }

        .peer-checked\\:bg-green-600\\/80:checked {
          background-color: rgba(22, 163, 74, 0.8);
        }
      `}</style>
    </div>
  );
};

export default StreamingApp;
