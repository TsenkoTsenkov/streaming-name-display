import React from 'react';
import { Navigate } from 'react-router-dom';

// This file is now a simple redirect to the new pages structure
// It's kept for backward compatibility

const App = () => {
  // Check if we're in display mode
  const urlParams = new URLSearchParams(window.location.search);
  const isDisplayMode = urlParams.get("display") === "true";
  
  // Redirect to the appropriate page
  return <Navigate to={isDisplayMode ? "/?display=true" : "/"} replace />;
};

export default App;