import React, { useEffect, useState } from 'react';

const DisplayView = ({ person, settings }) => {
  const [animate, setAnimate] = useState(false);
  
  // Trigger animations on mount or when person changes
  useEffect(() => {
    setAnimate(false);
    setTimeout(() => {
      setAnimate(true);
    }, 50);
  }, [person?.id]);
  
  if (!person || !settings) {
    return null;
  }

  // Generate styles based on settings
  const getContainerStyles = () => {
    const { 
      displayWidth, 
      displayHeight, 
      displayStyle,
      borderStyle,
      boxShadow,
      cornerRadius = 8,
      padding = 16
    } = settings;

    const baseStyles = {
      position: 'relative',
      width: `${displayWidth}px`,
      height: `${displayHeight}px`,
      overflow: 'hidden',
      borderRadius: `${cornerRadius}px`,
      padding: `${padding}px`,
      color: 'white',
      fontFamily: "'Inter', system-ui, sans-serif",
      transition: 'all 0.3s ease',
    };

    // Apply styles based on displayStyle
    switch (displayStyle) {
      case 'gradient':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #4c1d95 0%, #2563eb 100%)',
          boxShadow: boxShadow ? '0 10px 25px rgba(0, 0, 0, 0.2)' : 'none',
          border: borderStyle === 'thin' ? '1px solid rgba(255, 255, 255, 0.2)' : 
                 borderStyle === 'thick' ? '3px solid rgba(255, 255, 255, 0.3)' : 
                 borderStyle === 'glow' ? '1px solid rgba(255, 255, 255, 0.5)' : 
                 borderStyle === 'accent' ? '2px solid #3b82f6' : 'none',
        };
      case 'solid':
        return {
          ...baseStyles,
          backgroundColor: '#111827',
          boxShadow: boxShadow ? '0 10px 15px rgba(0, 0, 0, 0.3)' : 'none',
          border: borderStyle === 'thin' ? '1px solid rgba(255, 255, 255, 0.1)' : 
                 borderStyle === 'thick' ? '3px solid rgba(255, 255, 255, 0.2)' : 
                 borderStyle === 'glow' ? '1px solid rgba(255, 255, 255, 0.3)' : 
                 borderStyle === 'accent' ? '2px solid #3b82f6' : 'none',
        };
      case 'transparent':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          boxShadow: 'none',
          border: borderStyle === 'thin' ? '1px solid rgba(255, 255, 255, 0.1)' : 
                 borderStyle === 'thick' ? '3px solid rgba(255, 255, 255, 0.2)' : 
                 borderStyle === 'glow' ? '1px solid rgba(255, 255, 255, 0.3)' : 
                 borderStyle === 'accent' ? '2px solid #3b82f6' : 'none',
        };
      case 'minimal':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
          boxShadow: boxShadow ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none',
          border: borderStyle === 'thin' ? '1px solid rgba(255, 255, 255, 0.1)' : 
                 borderStyle === 'thick' ? '2px solid rgba(255, 255, 255, 0.15)' : 
                 borderStyle === 'glow' ? '1px solid rgba(255, 255, 255, 0.2)' : 
                 borderStyle === 'accent' ? '1px solid #3b82f6' : 'none',
        };
      case 'red':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #7f1d1d 0%, #ef4444 100%)',
          boxShadow: boxShadow ? '0 10px 25px rgba(239, 68, 68, 0.3)' : 'none',
          border: borderStyle === 'thin' ? '1px solid rgba(255, 255, 255, 0.2)' : 
                 borderStyle === 'thick' ? '3px solid rgba(255, 255, 255, 0.3)' : 
                 borderStyle === 'glow' ? '1px solid rgba(255, 255, 255, 0.5)' : 
                 borderStyle === 'accent' ? '2px solid #f87171' : 'none',
        };
      case 'green':
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #064e3b 0%, #10b981 100%)',
          boxShadow: boxShadow ? '0 10px 25px rgba(16, 185, 129, 0.3)' : 'none',
          border: borderStyle === 'thin' ? '1px solid rgba(255, 255, 255, 0.2)' : 
                 borderStyle === 'thick' ? '3px solid rgba(255, 255, 255, 0.3)' : 
                 borderStyle === 'glow' ? '1px solid rgba(255, 255, 255, 0.5)' : 
                 borderStyle === 'accent' ? '2px solid #34d399' : 'none',
        };
      case 'custom':
        // Custom color scheme could be implemented with color pickers
        return {
          ...baseStyles,
          background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
          boxShadow: boxShadow ? '0 10px 25px rgba(0, 0, 0, 0.3)' : 'none',
          border: borderStyle === 'thin' ? '1px solid rgba(255, 255, 255, 0.2)' : 
                 borderStyle === 'thick' ? '3px solid rgba(255, 255, 255, 0.3)' : 
                 borderStyle === 'glow' ? '1px solid rgba(255, 255, 255, 0.5)' : 
                 borderStyle === 'accent' ? '2px solid #3b82f6' : 'none',
        };
      default:
        return baseStyles;
    }
  };

  // Get styles for the name text based on settings
  const getNameStyles = () => {
    const { 
      fontSize, 
      textStyle,
      textShadow,
      centeredText
    } = settings;

    const baseStyles = {
      fontSize: `${fontSize}px`,
      lineHeight: '1.2',
      margin: 0,
      transition: 'all 0.3s ease',
      textAlign: centeredText ? 'center' : 'left',
    };

    // Apply styles based on textStyle
    switch (textStyle) {
      case 'normal':
        return {
          ...baseStyles,
          fontWeight: '400',
          textShadow: textShadow ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none',
        };
      case 'bold':
        return {
          ...baseStyles,
          fontWeight: '700',
          textShadow: textShadow ? '0 2px 4px rgba(0, 0, 0, 0.4)' : 'none',
        };
      case 'light':
        return {
          ...baseStyles,
          fontWeight: '300',
          letterSpacing: '0.025em',
          textShadow: textShadow ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none',
        };
      case 'italic':
        return {
          ...baseStyles,
          fontWeight: '400',
          fontStyle: 'italic',
          textShadow: textShadow ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none',
        };
      case 'uppercase':
        return {
          ...baseStyles,
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          textShadow: textShadow ? '0 2px 4px rgba(0, 0, 0, 0.4)' : 'none',
        };
      default:
        return baseStyles;
    }
  };

  // Get styles for the title text based on settings
  const getTitleStyles = () => {
    const { 
      titleFontSize, 
      textStyle,
      textShadow,
      centeredText
    } = settings;

    const baseStyles = {
      fontSize: `${titleFontSize}px`,
      lineHeight: '1.4',
      color: 'rgba(255, 255, 255, 0.8)',
      margin: '4px 0 0 0',
      transition: 'all 0.3s ease',
      textAlign: centeredText ? 'center' : 'left',
    };

    // Apply styles based on textStyle
    switch (textStyle) {
      case 'normal':
        return {
          ...baseStyles,
          fontWeight: '400',
          textShadow: textShadow ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none',
        };
      case 'bold':
        return {
          ...baseStyles,
          fontWeight: '600',
          textShadow: textShadow ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none',
        };
      case 'light':
        return {
          ...baseStyles,
          fontWeight: '300',
          letterSpacing: '0.025em',
          textShadow: textShadow ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none',
        };
      case 'italic':
        return {
          ...baseStyles,
          fontWeight: '400',
          fontStyle: 'italic',
          textShadow: textShadow ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none',
        };
      case 'uppercase':
        return {
          ...baseStyles,
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: `${titleFontSize - 2}px`,
          textShadow: textShadow ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none',
        };
      default:
        return baseStyles;
    }
  };

  // Get animation styles based on settings
  const getAnimationStyles = () => {
    const { animation } = settings;
    
    if (!animate) {
      // Initial state before animation starts
      switch (animation) {
        case 'fade':
          return { opacity: 0 };
        case 'slide':
          return { transform: 'translateX(-20px)', opacity: 0 };
        case 'pop':
          return { transform: 'scale(0.95)', opacity: 0 };
        case 'pulse':
          return {}; // Pulse has no initial state difference
        default:
          return {};
      }
    }
    
    // Animated state
    switch (animation) {
      case 'fade':
        return { 
          opacity: 1,
          transition: 'opacity 0.5s ease-out'
        };
      case 'slide':
        return { 
          transform: 'translateX(0)',
          opacity: 1,
          transition: 'transform 0.5s ease-out, opacity 0.5s ease-out'
        };
      case 'pop':
        return { 
          transform: 'scale(1)',
          opacity: 1,
          transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.4s ease-out'
        };
      case 'pulse':
        return { 
          animation: 'pulse 2s infinite'
        };
      default:
        return {};
    }
  };

  // Apply all styles
  const containerStyles = {
    ...getContainerStyles(),
    ...getAnimationStyles(),
    position: 'relative', // Ensure position is set for decorative elements
  };
  
  const nameStyles = getNameStyles();
  const titleStyles = getTitleStyles();

  // Special case for text style uppercase
  const displayName = settings.textStyle === 'uppercase' 
    ? `${person.name} ${person.surname || ''}`.toUpperCase() 
    : `${person.name} ${person.surname || ''}`;

  // Get the accent color based on display style for decorative elements
  const getAccentColor = () => {
    const { displayStyle } = settings;
    switch(displayStyle) {
      case 'red': return 'rgba(239, 68, 68, 0.7)';
      case 'green': return 'rgba(16, 185, 129, 0.7)';
      default: return 'rgba(59, 130, 246, 0.7)';
    }
  };

  // Create decorative elements as actual DOM elements
  const renderDecorativeElements = () => {
    if (!settings.decorativeElements) return null;
    
    const accentColor = getAccentColor();
    
    return (
      <>
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '15px',
          right: '15px',
          width: '30px',
          height: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
        }}></div>
        {settings.displayStyle !== 'transparent' && (
          <div style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            background: accentColor,
            filter: 'blur(20px)',
            zIndex: -1,
            opacity: 0.7,
          }}></div>
        )}
      </>
    );
  };
  
  return (
    <div style={containerStyles}>
      {settings.showName && (
        <h1 style={nameStyles}>{displayName}</h1>
      )}
      {settings.showTitles && person.title && (
        <div style={titleStyles}>{settings.textStyle === 'uppercase' ? person.title.toUpperCase() : person.title}</div>
      )}
      
      {/* Render decorative elements */}
      {renderDecorativeElements()}
    </div>
  );
};

export default DisplayView; 