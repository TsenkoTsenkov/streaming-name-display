import React from 'react';
import { X, Edit, Radio, StopCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getPersonCardStyles } from '../styles/appStyles';

const PersonList = () => {
  const { 
    people, 
    handleSelectPerson, 
    handleStartEdit, 
    handleRemovePerson,
    handleGoLiveWithPerson,
    handleStopStreaming
  } = useAppContext();

  return (
    <div>
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>People List</h3>
      
      {people.length === 0 ? (
        <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.875rem' }}>
          No people added yet. Add someone using the form below.
        </p>
      ) : (
        people.map((person) => (
          <div key={person.id} style={getPersonCardStyles(person)}>
            <div 
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => handleSelectPerson(person.id)}
            >
              <div style={{ 
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center'
              }}>
                {person.streaming && (
                  <span style={{
                    display: 'inline-flex',
                    marginRight: '0.5rem',
                    color: '#ef4444'
                  }}>
                    <Radio size={14} />
                  </span>
                )}
                {person.surname
                  ? `${person.name} ${person.surname}`
                  : person.name}
                {person.streaming && (
                  <span style={{
                    fontSize: '0.7rem',
                    marginLeft: '0.5rem',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '0.1rem 0.3rem',
                    borderRadius: '0.25rem'
                  }}>
                    LIVE
                  </span>
                )}
              </div>
              {person.title && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: person.selected 
                    ? 'rgba(255, 255, 255, 0.8)' 
                    : 'rgba(255, 255, 255, 0.5)'
                }}>
                  {person.title}
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {person.streaming ? (
                <button
                  onClick={() => handleStopStreaming()}
                  style={{
                    backgroundColor: '#ef4444',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <StopCircle size={14} /> STOP
                </button>
              ) : (
                <button
                  onClick={() => handleGoLiveWithPerson(person.id)}
                  style={{
                    backgroundColor: 'rgba(39, 174, 96, 0.2)',
                    border: 'none',
                    color: 'rgba(39, 174, 96, 0.8)',
                    cursor: 'pointer',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.7rem',
                    fontWeight: 'bold'
                  }}
                >
                  GO LIVE
                </button>
              )}
              
              <button
                onClick={() => handleStartEdit(person)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: person.selected 
                    ? 'white' 
                    : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Edit size={16} />
              </button>
              
              <button
                onClick={() => handleRemovePerson(person.id)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: person.selected 
                    ? 'white' 
                    : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  padding: '0.25rem',
                  borderRadius: '0.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PersonList; 