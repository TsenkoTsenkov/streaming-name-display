import React from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formInputStyles, formButtonStyles, modalOverlayStyles, modalContainerStyles, modalHeaderStyles } from '../styles/appStyles';

const EditPersonModal = () => {
  const { 
    isEditModalOpen, 
    editingPerson, 
    setEditingPerson, 
    handleSaveEdit, 
    handleCancelEdit, 
    errorMessage 
  } = useAppContext();

  if (!isEditModalOpen) return null;

  return (
    <div style={modalOverlayStyles}>
      <div style={modalContainerStyles}>
        <div style={modalHeaderStyles}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.25rem', 
            fontWeight: '600'
          }}>
            Edit Person
          </h2>
          <button
            onClick={handleCancelEdit}
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

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}
          style={{ marginTop: '1rem' }}
        >
          <div style={{ marginBottom: '0.75rem' }}>
            <label 
              htmlFor="edit-name"
              style={{ 
                display: 'block', 
                marginBottom: '0.25rem', 
                fontSize: '0.875rem'
              }}
            >
              Name (required)
            </label>
            <input
              id="edit-name"
              type="text"
              value={editingPerson?.name || ''}
              onChange={(e) => setEditingPerson({
                ...editingPerson,
                name: e.target.value,
              })}
              style={formInputStyles}
            />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label 
              htmlFor="edit-surname"
              style={{ 
                display: 'block', 
                marginBottom: '0.25rem', 
                fontSize: '0.875rem'
              }}
            >
              Surname (optional)
            </label>
            <input
              id="edit-surname"
              type="text"
              value={editingPerson?.surname || ''}
              onChange={(e) => setEditingPerson({
                ...editingPerson,
                surname: e.target.value,
              })}
              style={formInputStyles}
            />
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label 
              htmlFor="edit-title"
              style={{ 
                display: 'block', 
                marginBottom: '0.25rem', 
                fontSize: '0.875rem'
              }}
            >
              Title (optional)
            </label>
            <input
              id="edit-title"
              type="text"
              value={editingPerson?.title || ''}
              onChange={(e) => setEditingPerson({
                ...editingPerson,
                title: e.target.value,
              })}
              style={formInputStyles}
            />
          </div>

          {errorMessage && (
            <div style={{ 
              color: '#ef4444', 
              fontSize: '0.875rem', 
              marginBottom: '0.75rem' 
            }}>
              {errorMessage}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button 
              type="submit" 
              style={formButtonStyles}
            >
              Save Changes
            </button>
            <button 
              type="button"
              onClick={handleCancelEdit}
              style={{
                ...formButtonStyles,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPersonModal; 