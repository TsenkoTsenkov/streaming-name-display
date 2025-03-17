import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formInputStyles, formButtonStyles } from '../styles/appStyles';

const AddPersonForm = () => {
  const { 
    newPerson, 
    setNewPerson, 
    handleAddPerson, 
    errorMessage 
  } = useAppContext();

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Add New Person</h3>
      
      <form onSubmit={(e) => { e.preventDefault(); handleAddPerson(); }}>
        <input
          type="text"
          placeholder="Name (required)"
          value={newPerson.name}
          onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
          style={formInputStyles}
        />
        
        <input
          type="text"
          placeholder="Surname (optional)"
          value={newPerson.surname}
          onChange={(e) => setNewPerson({ ...newPerson, surname: e.target.value })}
          style={formInputStyles}
        />
        
        <input
          type="text"
          placeholder="Title (optional)"
          value={newPerson.title}
          onChange={(e) => setNewPerson({ ...newPerson, title: e.target.value })}
          style={formInputStyles}
        />
        
        {errorMessage && (
          <div style={{ 
            color: '#ef4444', 
            fontSize: '0.875rem', 
            marginBottom: '0.75rem' 
          }}>
            {errorMessage}
          </div>
        )}
        
        <button 
          type="submit" 
          style={formButtonStyles}
        >
          Add Person
        </button>
      </form>
    </div>
  );
};

export default AddPersonForm; 