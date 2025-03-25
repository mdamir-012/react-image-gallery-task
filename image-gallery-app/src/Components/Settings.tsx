import React from 'react';
import { useSettings } from '../context/SettingsContext';
import './Settings.css';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const { settings, updateSettings } = useSettings();

  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ backgroundColor: e.target.value });
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({ fontSize: parseInt(e.target.value) });
  };

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ layout: e.target.value as 'grid' | 'list' });
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({ theme: e.target.value as 'light' | 'dark' });
  };

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <div className="settings-header">
          <h2>Settings</h2>
          <button onClick={onClose} className="close-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label htmlFor="backgroundColor">Background Color</label>
            <div className="color-picker-container">
              <input
                type="color"
                id="backgroundColor"
                value={settings.backgroundColor}
                onChange={handleBackgroundColorChange}
                className="color-picker"
              />
              <input
                type="text"
                value={settings.backgroundColor}
                onChange={handleBackgroundColorChange}
                className="color-input"
              />
            </div>
          </div>

          <div className="setting-item">
            <label htmlFor="fontSize">Font Size</label>
            <input
              type="range"
              id="fontSize"
              min="12"
              max="24"
              value={settings.fontSize}
              onChange={handleFontSizeChange}
              className="range-input"
            />
            <span className="range-value">{settings.fontSize}px</span>
          </div>

          <div className="setting-item">
            <label htmlFor="layout">Layout</label>
            <select
              id="layout"
              value={settings.layout}
              onChange={handleLayoutChange}
              className="select-input"
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
            </select>
          </div>

          <div className="setting-item">
            <label htmlFor="theme">Theme</label>
            <select
              id="theme"
              value={settings.theme}
              onChange={handleThemeChange}
              className="select-input"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>

        <div className="settings-footer">
          <button onClick={onClose} className="save-button">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 