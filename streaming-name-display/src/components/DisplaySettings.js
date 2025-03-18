import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  sliderContainerStyle, 
  sliderStyle, 
  sliderLabelStyle, 
  sectionHeadingStyle,
  buttonGroupStyle,
  styleButtonStyle,
  activeStyleButtonStyle
} from '../styles/appStyles';

const DisplaySettings = () => {
  const {
    displaySettings,
    handleChangeSetting,
    handleSizeChange,
    handleToggleSetting
  } = useAppContext();

  // Color schemes
  const colorSchemes = [
    { id: 'gradient', name: 'Purple Gradient', description: 'Professional purple to blue gradient' },
    { id: 'solid', name: 'Dark', description: 'Solid dark background' },
    { id: 'transparent', name: 'Transparent', description: 'Fully transparent background' },
    { id: 'minimal', name: 'Minimal', description: 'Subtle dark transparent background' },
    { id: 'red', name: 'Red', description: 'Vibrant red gradient' },
    { id: 'green', name: 'Green', description: 'Elegant green gradient' },
  ];

  // Text styles
  const textStyles = [
    { id: 'preserve-case', name: 'Preserve Case', description: 'Keeps original capitalization' },
    { id: 'normal', name: 'Normal', description: 'Regular text weight' },
    { id: 'bold', name: 'Bold', description: 'Heavy text weight' },
    { id: 'light', name: 'Light', description: 'Thin elegant text' },
    { id: 'italic', name: 'Italic', description: 'Slanted text style' },
    { id: 'uppercase', name: 'UPPERCASE', description: 'All capital letters' },
  ];

  // Border styles
  const borderStyles = [
    { id: 'none', name: 'None', description: 'No border' },
    { id: 'thin', name: 'Thin', description: 'Subtle thin border' },
    { id: 'thick', name: 'Thick', description: 'Bold thick border' },
    { id: 'glow', name: 'Glow', description: 'Subtle glowing effect' },
    { id: 'accent', name: 'Accent', description: 'Colored accent border' },
  ];

  // Animation options
  const animationOptions = [
    { id: 'none', name: 'None', description: 'No animation' },
    { id: 'fade', name: 'Fade', description: 'Simple fade in' },
    { id: 'slide', name: 'Slide', description: 'Slide in from left' },
    { id: 'pop', name: 'Pop', description: 'Pop up with scale' },
    { id: 'pulse', name: 'Pulse', description: 'Subtle pulsing effect' },
  ];

  return (
    <div className="display-settings">
      <h2>Display Settings</h2>

      {/* Display Style Selection */}
      <div className="setting-section">
        <h3 style={sectionHeadingStyle}>Display Style</h3>
        <div style={buttonGroupStyle}>
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              onClick={() => handleChangeSetting("displayStyle", scheme.id)}
              style={
                displaySettings.displayStyle === scheme.id
                  ? activeStyleButtonStyle
                  : styleButtonStyle
              }
              title={scheme.description}
            >
              {scheme.name}
            </button>
          ))}
        </div>
      </div>

      {/* Text Style Selection */}
      <div className="setting-section">
        <h3 style={sectionHeadingStyle}>Text Style</h3>
        <div style={buttonGroupStyle}>
          {textStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleChangeSetting("textStyle", style.id)}
              style={
                displaySettings.textStyle === style.id
                  ? activeStyleButtonStyle
                  : styleButtonStyle
              }
              title={style.description}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Text Color Selection */}
      <div className="setting-section">
        <h3 style={sectionHeadingStyle}>Text Color</h3>
        <div style={buttonGroupStyle}>
          {/* Common text colors */}
          <button
            onClick={() => handleChangeSetting("textColor", "white")}
            style={{
              ...styleButtonStyle,
              backgroundColor: displaySettings.textColor === "white" ? "#4f46e5" : "#374151",
              color: "white"
            }}
            title="White text"
          >
            White
          </button>
          <button
            onClick={() => handleChangeSetting("textColor", "#ffeb3b")}
            style={{
              ...styleButtonStyle,
              backgroundColor: displaySettings.textColor === "#ffeb3b" ? "#4f46e5" : "#374151",
              color: "#ffeb3b"
            }}
            title="Yellow text"
          >
            Yellow
          </button>
          <button
            onClick={() => handleChangeSetting("textColor", "#4ade80")}
            style={{
              ...styleButtonStyle,
              backgroundColor: displaySettings.textColor === "#4ade80" ? "#4f46e5" : "#374151",
              color: "#4ade80"
            }}
            title="Green text"
          >
            Green
          </button>
          <button
            onClick={() => handleChangeSetting("textColor", "#60a5fa")}
            style={{
              ...styleButtonStyle,
              backgroundColor: displaySettings.textColor === "#60a5fa" ? "#4f46e5" : "#374151",
              color: "#60a5fa"
            }}
            title="Blue text"
          >
            Blue
          </button>
          <button
            onClick={() => handleChangeSetting("textColor", "#f472b6")}
            style={{
              ...styleButtonStyle,
              backgroundColor: displaySettings.textColor === "#f472b6" ? "#4f46e5" : "#374151",
              color: "#f472b6"
            }}
            title="Pink text"
          >
            Pink
          </button>
        </div>
      </div>

      {/* Border Style Selection */}
      <div className="setting-section">
        <h3 style={sectionHeadingStyle}>Border Style</h3>
        <div style={buttonGroupStyle}>
          {borderStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => handleChangeSetting("borderStyle", style.id)}
              style={
                displaySettings.borderStyle === style.id
                  ? activeStyleButtonStyle
                  : styleButtonStyle
              }
              title={style.description}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      {/* Animation Selection */}
      <div className="setting-section">
        <h3 style={sectionHeadingStyle}>Animation</h3>
        <div style={buttonGroupStyle}>
          {animationOptions.map((anim) => (
            <button
              key={anim.id}
              onClick={() => handleChangeSetting("animation", anim.id)}
              style={
                displaySettings.animation === anim.id
                  ? activeStyleButtonStyle
                  : styleButtonStyle
              }
              title={anim.description}
            >
              {anim.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size and Position Settings */}
      <div className="setting-section">
        <h3 style={sectionHeadingStyle}>Size & Position</h3>
        
        {/* Width Setting */}
        <div style={sliderContainerStyle}>
          <label style={sliderLabelStyle}>
            Width: {displaySettings.displayWidth}px
          </label>
          <input
            type="range"
            min="200"
            max="800"
            value={displaySettings.displayWidth}
            onChange={(e) =>
              handleSizeChange("displayWidth", parseInt(e.target.value))
            }
            style={sliderStyle}
          />
        </div>
        
        {/* Height Setting */}
        <div style={sliderContainerStyle}>
          <label style={sliderLabelStyle}>
            Height: {displaySettings.displayHeight}px
          </label>
          <input
            type="range"
            min="60"
            max="400"
            value={displaySettings.displayHeight}
            onChange={(e) =>
              handleSizeChange("displayHeight", parseInt(e.target.value))
            }
            style={sliderStyle}
          />
        </div>
        
        {/* Font Size Setting */}
        <div style={sliderContainerStyle}>
          <label style={sliderLabelStyle}>
            Name Size: {displaySettings.fontSize}px
          </label>
          <input
            type="range"
            min="16"
            max="72"
            value={displaySettings.fontSize}
            onChange={(e) =>
              handleSizeChange("fontSize", parseInt(e.target.value))
            }
            style={sliderStyle}
          />
        </div>
        
        {/* Title Size Setting */}
        <div style={sliderContainerStyle}>
          <label style={sliderLabelStyle}>
            Title Size: {displaySettings.titleFontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="36"
            value={displaySettings.titleFontSize}
            onChange={(e) =>
              handleSizeChange("titleFontSize", parseInt(e.target.value))
            }
            style={sliderStyle}
          />
        </div>
        
        {/* Corner Radius Setting */}
        <div style={sliderContainerStyle}>
          <label style={sliderLabelStyle}>
            Corner Radius: {displaySettings.cornerRadius || 8}px
          </label>
          <input
            type="range"
            min="0"
            max="24"
            value={displaySettings.cornerRadius || 8}
            onChange={(e) =>
              handleSizeChange("cornerRadius", parseInt(e.target.value))
            }
            style={sliderStyle}
          />
        </div>
        
        {/* Padding Setting */}
        <div style={sliderContainerStyle}>
          <label style={sliderLabelStyle}>
            Padding: {displaySettings.padding || 16}px
          </label>
          <input
            type="range"
            min="0"
            max="40"
            value={displaySettings.padding || 16}
            onChange={(e) =>
              handleSizeChange("padding", parseInt(e.target.value))
            }
            style={sliderStyle}
          />
        </div>
      </div>

      {/* Display Options */}
      <div className="setting-section">
        <h3 style={sectionHeadingStyle}>Display Options</h3>
        
        {/* Name Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <button
            onClick={() =>
              handleToggleSetting("showName")
            }
            style={{
              backgroundColor: displaySettings.showName
                ? "#4c1d95"
                : "rgba(0, 0, 0, 0.2)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "6px 12px",
              cursor: "pointer",
              marginRight: "12px",
              transition: "background-color 0.2s",
            }}
          >
            {displaySettings.showName ? "ON" : "OFF"}
          </button>
          <span>Show Names</span>
        </div>
        
        {/* Title Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <button
            onClick={() =>
              handleToggleSetting("showTitles")
            }
            style={{
              backgroundColor: displaySettings.showTitles
                ? "#4c1d95"
                : "rgba(0, 0, 0, 0.2)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "6px 12px",
              cursor: "pointer",
              marginRight: "12px",
              transition: "background-color 0.2s",
            }}
          >
            {displaySettings.showTitles ? "ON" : "OFF"}
          </button>
          <span>Show Titles</span>
        </div>
        
        {/* Text Shadow Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <button
            onClick={() =>
              handleToggleSetting("textShadow")
            }
            style={{
              backgroundColor: displaySettings.textShadow
                ? "#4c1d95"
                : "rgba(0, 0, 0, 0.2)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "6px 12px",
              cursor: "pointer",
              marginRight: "12px",
              transition: "background-color 0.2s",
            }}
          >
            {displaySettings.textShadow ? "ON" : "OFF"}
          </button>
          <span>Text Shadow</span>
        </div>
        
        {/* Box Shadow Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <button
            onClick={() =>
              handleToggleSetting("boxShadow")
            }
            style={{
              backgroundColor: displaySettings.boxShadow
                ? "#4c1d95"
                : "rgba(0, 0, 0, 0.2)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "6px 12px",
              cursor: "pointer",
              marginRight: "12px",
              transition: "background-color 0.2s",
            }}
          >
            {displaySettings.boxShadow ? "ON" : "OFF"}
          </button>
          <span>Box Shadow</span>
        </div>
        
        {/* Decorative Elements Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <button
            onClick={() =>
              handleToggleSetting("decorativeElements")
            }
            style={{
              backgroundColor: displaySettings.decorativeElements
                ? "#4c1d95"
                : "rgba(0, 0, 0, 0.2)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "6px 12px",
              cursor: "pointer",
              marginRight: "12px",
              transition: "background-color 0.2s",
            }}
          >
            {displaySettings.decorativeElements ? "ON" : "OFF"}
          </button>
          <span>Decorative Elements</span>
        </div>
        
        {/* Centered Text Toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <button
            onClick={() =>
              handleToggleSetting("centeredText")
            }
            style={{
              backgroundColor: displaySettings.centeredText
                ? "#4c1d95"
                : "rgba(0, 0, 0, 0.2)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              padding: "6px 12px",
              cursor: "pointer",
              marginRight: "12px",
              transition: "background-color 0.2s",
            }}
          >
            {displaySettings.centeredText ? "ON" : "OFF"}
          </button>
          <span>Centered Text</span>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings; 