// Styles for the app

// Layout styles
export const layoutStyles = {
  display: 'flex',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: '#121212',
  color: '#fff',
  fontFamily: 'Inter, system-ui, sans-serif',
};

// Sidebar styles
export const sidebarStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  backgroundColor: '#1e1e1e',
  padding: '1.5rem',
  overflowY: 'auto',
  position: 'relative',
};

// Resizer styles
export const resizerStyles = {
  position: 'absolute',
  top: 0,
  right: 0,
  width: '8px',
  height: '100%',
  cursor: 'col-resize',
  backgroundColor: 'transparent',
  transition: 'background-color 0.2s',
  zIndex: 10,
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
};

// Main content styles
export const mainContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
};

// Preview container styles
export const previewContainerStyles = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
  backgroundColor: '#000',
  padding: '2rem',
};

// Toolbar styles
export const toolbarStyles = {
  padding: '1rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  backgroundColor: '#1e1e1e',
};

// Form input styles
export const formInputStyles = {
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '0.375rem',
  color: 'white',
  padding: '0.5rem 0.75rem',
  width: '100%',
  fontSize: '0.875rem',
  marginBottom: '0.5rem',
};

// Form button styles
export const formButtonStyles = {
  backgroundColor: '#3b82f6',
  color: 'white',
  border: 'none',
  borderRadius: '0.375rem',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  cursor: 'pointer',
};

// Import container styles
export const importContainerStyles = {
  padding: '1rem',
  backgroundColor: '#272727',
  borderRadius: '0.5rem',
};

// Upload area styles
export const getUploadAreaStyles = (isDragActive) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '2rem',
  borderRadius: '0.375rem',
  border: isDragActive 
    ? '2px dashed #3b82f6' 
    : '2px dashed rgba(255, 255, 255, 0.2)',
  backgroundColor: isDragActive 
    ? 'rgba(59, 130, 246, 0.1)' 
    : 'rgba(255, 255, 255, 0.03)',
  cursor: 'pointer',
});

// Person card styles
export const getPersonCardStyles = (person) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem',
  marginBottom: '0.5rem',
  borderRadius: '0.375rem',
  backgroundColor: person.selected 
    ? 'rgba(59, 130, 246, 0.2)' 
    : 'rgba(255, 255, 255, 0.05)',
  border: person.selected 
    ? '1px solid rgba(59, 130, 246, 0.4)' 
    : '1px solid transparent',
  ...(person.streaming && {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  }),
});

// Modal styles
export const modalOverlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

export const modalContainerStyles = {
  backgroundColor: '#1e1e1e',
  borderRadius: '0.5rem',
  padding: '1.5rem',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '90vh',
  overflowY: 'auto',
};

export const modalHeaderStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem',
};

// Slider styles
export const sliderContainerStyles = {
  marginBottom: '1rem',
};

export const sliderLabelStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem',
};

export const sliderStyles = {
  width: '100%',
  accentColor: '#3b82f6',
  height: '4px',
  marginRight: '0.5rem',
};

// Tab styles
export const tabContainerStyles = {
  display: 'flex',
  marginBottom: '1rem',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
};

export const getTabStyles = (isActive) => ({
  padding: '0.5rem 0.75rem',
  cursor: 'pointer',
  borderBottom: isActive 
    ? '2px solid #3b82f6' 
    : '2px solid transparent',
  color: isActive 
    ? 'white' 
    : 'rgba(255, 255, 255, 0.6)',
  fontWeight: isActive 
    ? '500' 
    : 'normal',
});

// Section styles
export const sectionStyles = {
  marginBottom: "2rem",
};

// Tab button styles
export const getTabButtonStyles = (tab, activeTab) => ({
  padding: "0.75rem 1rem",
  marginRight: "0.5rem",
  borderRadius: "0.375rem",
  backgroundColor: tab === activeTab ? "#3b82f6" : "transparent",
  color: tab === activeTab ? "white" : "rgba(255, 255, 255, 0.7)",
  border: "none",
  cursor: "pointer",
  transition: "all 0.2s",
  fontWeight: tab === activeTab ? "600" : "400",
});

// Style preset button styles
export const stylePresetButtonStyles = (preset, currentStyle) => ({
  padding: "0.5rem 0.75rem",
  margin: "0 0.25rem 0.5rem 0",
  borderRadius: "0.375rem",
  backgroundColor:
    preset === currentStyle ? "#3b82f6" : "rgba(255, 255, 255, 0.05)",
  color: preset === currentStyle ? "white" : "rgba(255, 255, 255, 0.7)",
  border: "none",
  cursor: "pointer",
  fontSize: "0.875rem",
  transition: "all 0.2s",
});

// Toggle switch container styles
export const toggleSwitchStyles = (isActive) => ({
  position: "relative",
  display: "inline-block",
  width: "2.5rem",
  height: "1.5rem",
  backgroundColor: isActive ? "#3b82f6" : "rgba(255, 255, 255, 0.1)",
  borderRadius: "9999px",
  cursor: "pointer",
  transition: "all 0.2s",
});

// Toggle switch knob styles
export const toggleSwitchKnobStyles = (isActive) => ({
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

// Fixed preview styles
export const fixedPreviewStyles = {
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
  maxWidth: "400px",
};

// Main application styles

// Container styles
export const mainContainerStyle = {
  display: "flex",
  height: "100vh",
  backgroundColor: "#111827",
  color: "#f9fafb",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
};

export const leftPanelStyle = {
  width: "300px",
  minWidth: "300px",
  height: "100%",
  backgroundColor: "#1f2937",
  borderRight: "1px solid #374151",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
};

export const resizeHandleStyle = {
  position: "absolute",
  top: 0,
  right: "-5px",
  width: "10px",
  height: "100%",
  cursor: "col-resize",
  zIndex: 10,
};

export const mainContentStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  padding: "1rem",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
};

export const centerAreaStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  position: "relative",
};

export const personListContainerStyle = {
  flex: 1,
  overflow: "auto",
  padding: "0.5rem",
};

export const personItemStyle = {
  padding: "0.75rem",
  marginBottom: "0.5rem",
  backgroundColor: "rgba(31, 41, 55, 0.5)",
  borderRadius: "0.375rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
  border: "1px solid transparent",
};

export const personItemSelectedStyle = {
  ...personItemStyle,
  backgroundColor: "rgba(59, 130, 246, 0.2)",
  borderColor: "#3b82f6",
};

export const personItemLiveStyle = {
  ...personItemStyle,
  backgroundColor: "rgba(16, 185, 129, 0.2)",
  borderColor: "#10b981",
};

export const personItemLiveSelectedStyle = {
  ...personItemStyle,
  backgroundColor: "rgba(16, 185, 129, 0.3)",
  borderColor: "#10b981",
};

export const actionButtonStyle = {
  backgroundColor: "#4c1d95",
  color: "white",
  border: "none",
  borderRadius: "0.375rem",
  padding: "0.5rem 1rem",
  cursor: "pointer",
  marginRight: "0.5rem",
  transition: "background-color 0.2s",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.875rem",
  fontWeight: 500,
};

export const dangerButtonStyle = {
  ...actionButtonStyle,
  backgroundColor: "#ef4444",
};

export const successButtonStyle = {
  ...actionButtonStyle,
  backgroundColor: "#10b981",
};

export const secondaryButtonStyle = {
  ...actionButtonStyle,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.8)",
};

export const iconButtonStyle = {
  backgroundColor: "transparent",
  color: "rgba(255, 255, 255, 0.7)",
  border: "none",
  borderRadius: "0.375rem",
  padding: "0.375rem",
  cursor: "pointer",
  transition: "background-color 0.2s",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
};

// Sliders and toggles
export const sliderContainerStyle = {
  marginBottom: "0.875rem",
};

export const sliderLabelStyle = {
  fontSize: "0.875rem",
  marginBottom: "0.375rem",
  display: "block",
  color: "rgba(255, 255, 255, 0.8)",
};

export const sliderStyle = {
  width: "100%",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  height: "8px",
  borderRadius: "4px",
  appearance: "none",
  outline: "none",
  transition: "background-color 0.2s",
};

// Button groups and style selectors
export const sectionHeadingStyle = {
  fontSize: "0.875rem",
  fontWeight: 500,
  marginBottom: "0.625rem",
  color: "rgba(255, 255, 255, 0.8)",
};

export const buttonGroupStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  marginBottom: "1rem",
};

export const styleButtonStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "rgba(255, 255, 255, 0.8)",
  border: "none",
  borderRadius: "0.375rem",
  padding: "0.375rem 0.75rem",
  fontSize: "0.8125rem",
  cursor: "pointer",
  transition: "all 0.2s ease",
};

export const activeStyleButtonStyle = {
  ...styleButtonStyle,
  backgroundColor: "#4c1d95",
  color: "white",
};

// Form elements
export const inputStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  color: "white",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "0.375rem",
  padding: "0.5rem",
  width: "100%",
  fontSize: "0.875rem",
  marginBottom: "0.75rem",
};

export const labelStyle = {
  display: "block",
  marginBottom: "0.25rem",
  fontSize: "0.875rem",
  color: "rgba(255, 255, 255, 0.8)",
}; 