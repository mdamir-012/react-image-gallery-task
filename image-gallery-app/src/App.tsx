import React, { useState } from 'react';
import { Provider } from 'react-redux';
import './App.css';
import Collections from './Components/Collections';
import ImageCard from './Components/ImageCard';
import Settings from './Components/Settings';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { store } from './redux/store';
import { Image } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'collections'>('gallery');
  const [showSettings, setShowSettings] = useState(false);

  const handleAddToCollection = (collectionId: string, image: Image) => {

    console.log(`Adding image ${image.id} to collection ${collectionId}`);
  };

  const handleRemoveFromCollection = (collectionId: string, imageId: string) => {
  
    console.log(`Removing image ${imageId} from collection ${collectionId}`);
  };

  return (
    <Provider store={store}>
      <ThemeProvider>
        <SettingsProvider>
          <div className="app-container">
            <nav className="app-nav">
              <div className="nav-left">
                <button
                  className={`nav-button ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gallery')}
                >
                  Gallery
                </button>
                <button
                  className={`nav-button ${activeTab === 'collections' ? 'active' : ''}`}
                  onClick={() => setActiveTab('collections')}
                >
                  Collections
                </button>
              </div>
              <button
                className="settings-button"
                onClick={() => setShowSettings(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </nav>

            <main className="app-main">
              {activeTab === 'gallery' ? (
                <ImageCard />
              ) : (
                <Collections
                  images={[]} // This will be populated from the ImageCard component's state
                  onAddToCollection={handleAddToCollection}
                  onRemoveFromCollection={handleRemoveFromCollection}
                />
              )}
            </main>

            {showSettings && (
              <Settings onClose={() => setShowSettings(false)} />
            )}
          </div>
        </SettingsProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;


