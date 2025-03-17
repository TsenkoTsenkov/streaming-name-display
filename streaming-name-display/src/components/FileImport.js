import React from 'react';
import { Upload, AlertCircle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import useDragDrop from '../hooks/useDragDrop';
import { importContainerStyles, modalOverlayStyles, modalContainerStyles, modalHeaderStyles, formButtonStyles } from '../styles/appStyles';
import { getUploadAreaStyles } from '../styles/appStyles';
import { handleExcelFile, isExcelFile } from '../utils/fileUtils';

const FileImport = () => {
  const { 
    isImportModalOpen, 
    setIsImportModalOpen, 
    importedPeople, 
    setImportedPeople, 
    setPeople,
    people,
    errorMessage, 
    setErrorMessage 
  } = useAppContext();

  const handleFileUpload = (file) => {
    // Reset any previous error
    setErrorMessage("");
    
    // Validate file type
    if (!isExcelFile(file)) {
      setErrorMessage("Please upload an Excel file (.xlsx, .xls) or CSV file (.csv)");
      return;
    }
    
    // Process the file
    handleExcelFile(file)
      .then((data) => {
        setImportedPeople(data);
      })
      .catch((error) => {
        setErrorMessage(error);
      });
  };

  const dragDrop = useDragDrop(handleFileUpload);

  const handleImportPeople = () => {
    if (importedPeople && importedPeople.length > 0) {
      // Generate new IDs for the imported people to avoid conflicts
      const newPeople = importedPeople.map((person, index) => ({
        ...person,
        id: Math.max(0, ...people.map((p) => p.id)) + index + 1,
        selected: false,
        streaming: false,
      }));
      
      setPeople([...people, ...newPeople]);
      setImportedPeople([]);
      setIsImportModalOpen(false);
      setErrorMessage('');
    }
  };

  const handleCancelImport = () => {
    setImportedPeople([]);
    setIsImportModalOpen(false);
    setErrorMessage('');
  };

  return (
    <>
      <div style={importContainerStyles}>
        <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Import People</h3>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '0.75rem' 
        }}>
          Import people from an Excel file with columns for Name, Surname, and Title.
        </p>
        
        <button
          onClick={() => setIsImportModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
        >
          <Upload size={16} /> Import from Excel/CSV
        </button>
      </div>

      {isImportModalOpen && (
        <div style={modalOverlayStyles}>
          <div style={modalContainerStyles}>
            <div style={modalHeaderStyles}>
              <h2 style={{ 
                margin: 0, 
                fontSize: '1.25rem', 
                fontWeight: '600'
              }}>
                Import People
              </h2>
              <button
                onClick={handleCancelImport}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div 
                style={getUploadAreaStyles(dragDrop.dragActive)}
                onDragOver={dragDrop.handleDragOver}
                onDragEnter={dragDrop.handleDragEnter}
                onDragLeave={dragDrop.handleDragLeave}
                onDrop={dragDrop.handleDrop}
                onClick={dragDrop.onButtonClick}
              >
                <Upload size={24} style={{ marginBottom: '0.5rem', opacity: 0.7 }} />
                <p style={{ margin: 0, fontSize: '0.875rem' }}>
                  Drag & drop an Excel/CSV file or click to browse
                </p>
                <input
                  type="file"
                  ref={dragDrop.inputRef}
                  style={{ display: 'none' }}
                  accept=".xlsx,.xls,.csv,.txt"
                  onChange={dragDrop.handleChange}
                />
              </div>

              {errorMessage && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  marginTop: '1rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderRadius: '0.375rem',
                  color: '#ef4444'
                }}>
                  <AlertCircle size={16} />
                  <span style={{ fontSize: '0.875rem' }}>{errorMessage}</span>
                </div>
              )}

              {importedPeople && importedPeople.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                    Preview ({importedPeople.length} people found)
                  </h3>
                  <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '0.375rem',
                    padding: '0.5rem'
                  }}>
                    {importedPeople.map((person, index) => (
                      <div
                        key={index}
                        style={{
                          padding: '0.5rem',
                          marginBottom: '0.25rem',
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '0.25rem',
                        }}
                      >
                        <div style={{ fontWeight: '500' }}>
                          {person.surname
                            ? `${person.name} ${person.surname}`
                            : person.name}
                        </div>
                        {person.title && (
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: 'rgba(255, 255, 255, 0.6)'
                          }}>
                            {person.title}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '0.75rem', 
                    marginTop: '1rem', 
                    justifyContent: 'flex-end' 
                  }}>
                    <button
                      onClick={handleCancelImport}
                      style={{
                        ...formButtonStyles,
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.8)',
                      }}
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleImportPeople}
                      style={formButtonStyles}
                    >
                      Import People
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FileImport; 