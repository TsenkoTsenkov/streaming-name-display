import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import PersonList from './PersonList';
import DisplayPreview from './DisplayPreview';
import DisplayControls from './DisplayControls';
import AddPersonForm from './AddPersonForm';
import FileImport from './FileImport';
import DisplaySettings from './DisplaySettings';
import { layoutStyles, sidebarStyles, mainContentStyles, toolbarStyles, previewContainerStyles, resizerStyles } from '../styles/appStyles';

const AppLayout = () => {
  const { sidebarWidth, setSidebarWidth } = useAppContext();
  const [isResizing, setIsResizing] = useState(false);

  // Handle mouse events for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      // Calculate new width based on mouse position
      const newWidth = Math.max(250, Math.min(500, e.clientX));
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, setSidebarWidth]);

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  return (
    <div style={layoutStyles}>
      {/* Left sidebar */}
      <div style={{
        ...sidebarStyles,
        width: `${sidebarWidth}px`,
        position: 'relative'
      }}>
        <AddPersonForm />
        <FileImport />
        <PersonList />
        <DisplaySettings />
        
        {/* Resizer */}
        <div 
          style={resizerStyles}
          onMouseDown={handleResizeStart}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        />
      </div>

      {/* Main content area */}
      <div style={{
        ...mainContentStyles,
        width: `calc(100% - ${sidebarWidth}px)`
      }}>
        {/* Toolbar at the top */}
        <div style={toolbarStyles}>
          <DisplayControls />
        </div>

        {/* Preview container in the center */}
        <div style={previewContainerStyles}>
          <DisplayPreview />
        </div>
      </div>
    </div>
  );
};

export default AppLayout; 