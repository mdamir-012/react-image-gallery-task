import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { SettingsProvider } from '../../context/SettingsContext';
import { ThemeProvider } from '../../context/ThemeContext';
import ImageCard from '../ImageCard';

// Mock store
const mockStore = configureStore({
  reducer: {
    images: (state = { items: [], loading: false, error: null }) => state,
  },
});

// Mock image data
const mockImage = {
  id: '1',
  title: 'Test Image',
  description: 'Test Description',
  url: 'test-url.jpg',
  date_created: '2024-01-01',
  nasa_id: 'NASA_001',
  media_type: 'image',
  center: 'NASA HQ'
};

describe('ImageCard Component', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <Provider store={mockStore}>
        <ThemeProvider>
          <SettingsProvider>
            {component}
          </SettingsProvider>
        </ThemeProvider>
      </Provider>
    );
  };

  test('renders image card with correct data', () => {
    renderWithProviders(<ImageCard image={mockImage} />);
    
    expect(screen.getByText('Test Image')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByAltText('Test Image')).toHaveAttribute('src', 'test-url.jpg');
  });

  test('handles zoom controls correctly', () => {
    renderWithProviders(<ImageCard image={mockImage} />);
    
    // Open image modal
    fireEvent.click(screen.getByAltText('Test Image'));
    
    const zoomInButton = screen.getByLabelText('Zoom in');
    const zoomOutButton = screen.getByLabelText('Zoom out');
    
    // Test zoom in
    fireEvent.click(zoomInButton);
    expect(screen.getByRole('img')).toHaveStyle({ transform: 'scale(1.1)' });
    
    // Test zoom out
    fireEvent.click(zoomOutButton);
    expect(screen.getByRole('img')).toHaveStyle({ transform: 'scale(1)' });
  });

  test('handles keyboard navigation', () => {
    renderWithProviders(<ImageCard image={mockImage} />);
    
    // Open image modal
    fireEvent.click(screen.getByAltText('Test Image'));
    
    // Test keyboard shortcuts
    fireEvent.keyDown(document, { key: '+' });
    expect(screen.getByRole('img')).toHaveStyle({ transform: 'scale(1.1)' });
    
    fireEvent.keyDown(document, { key: '-' });
    expect(screen.getByRole('img')).toHaveStyle({ transform: 'scale(1)' });
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('shows keyboard shortcuts modal on hover', async () => {
    renderWithProviders(<ImageCard image={mockImage} />);
    
    // Open image modal
    fireEvent.click(screen.getByAltText('Test Image'));
    
    const shortcutsButton = screen.getByLabelText('Show keyboard shortcuts');
    fireEvent.mouseEnter(shortcutsButton);
    
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
    expect(screen.getByText('← Previous image')).toBeInTheDocument();
    expect(screen.getByText('→ Next image')).toBeInTheDocument();
  });

  test('handles fullscreen mode', () => {
    renderWithProviders(<ImageCard image={mockImage} />);
    
    // Mock fullscreen API
    const mockFullscreen = {
      requestFullscreen: jest.fn(),
      exitFullscreen: jest.fn(),
    };
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: mockFullscreen.requestFullscreen,
    });
    Object.defineProperty(document, 'exitFullscreen', {
      value: mockFullscreen.exitFullscreen,
    });
    
    // Open image modal
    fireEvent.click(screen.getByAltText('Test Image'));
    
    // Test fullscreen button
    const fullscreenButton = screen.getByLabelText('Enter fullscreen');
    fireEvent.click(fullscreenButton);
    expect(mockFullscreen.requestFullscreen).toHaveBeenCalled();
  });

  test('handles theme toggle', () => {
    renderWithProviders(<ImageCard image={mockImage} />);
    
    const themeButton = screen.getByLabelText(/toggle theme/i);
    fireEvent.click(themeButton);
    
    expect(document.documentElement).toHaveClass('dark');
    
    fireEvent.click(themeButton);
    expect(document.documentElement).not.toHaveClass('dark');
  });
}); 