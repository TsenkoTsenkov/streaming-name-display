import React from 'react';
import { useAppContext } from '../context/AppContext';
import DisplayView from '../components/DisplayView';
import PersonList from '../components/PersonList';
import AddPersonForm from '../components/AddPersonForm';
import EditPersonModal from '../components/EditPersonModal';
import DisplaySettings from '../components/DisplaySettings';
import DisplayControls from '../components/DisplayControls';
import FileImport from '../components/FileImport';
import { layoutStyles, sidebarStyles, mainContentStyles, sectionStyles, getTabButtonStyles } from '../styles/appStyles';

const App = () => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedPerson, 
    displaySettings
  } = useAppContext();

  return (
    <div style={layoutStyles}>
      {/* Left sidebar - People Management */}
      <div style={sidebarStyles}>
        <div
          style={{
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '600',
            }}
          >
            Streaming Display
          </h2>
        </div>

        <div style={sectionStyles}>
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setActiveTab('people')}
              style={getTabButtonStyles('people', activeTab)}
            >
              People
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              style={getTabButtonStyles('settings', activeTab)}
            >
              Settings
            </button>
          </div>

          {activeTab === 'people' && (
            <>
              <PersonList />
              <AddPersonForm />
              <FileImport />
              <DisplayControls />
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <DisplaySettings />
            </>
          )}
        </div>
      </div>

      {/* Main content area - Preview & Help */}
      <div style={mainContentStyles}>
        <div style={sectionStyles}>
          <h2
            style={{
              margin: '0 0 1rem 0',
              fontSize: '1.25rem',
              fontWeight: '600',
            }}
          >
            Display Preview
          </h2>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '2rem',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
            }}
          >
            <DisplayView person={selectedPerson} settings={displaySettings} />
          </div>

          <div>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '0.75rem',
              }}
            >
              How to Use
            </h3>
            <ol
              style={{
                paddingLeft: '1.5rem',
                color: 'rgba(255, 255, 255, 0.7)',
                lineHeight: '1.6',
              }}
            >
              <li>Add people using the form in the sidebar</li>
              <li>Select a person from the list by clicking on them</li>
              <li>Click the "GO LIVE" button next to a person to make them live</li>
              <li>Customize the display appearance in the Settings tab</li>
              <li>Copy the display URL for use in OBS or other streaming software</li>
              <li>The display content will update automatically when you change settings or the live person</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Edit person modal */}
      <EditPersonModal />
    </div>
  );
};

export default App; 