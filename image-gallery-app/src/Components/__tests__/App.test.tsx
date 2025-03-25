import { configureStore } from '@reduxjs/toolkit';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import App from '../../App';
import { SettingsProvider } from '../../context/SettingsContext';
import { ThemeProvider } from '../../context/ThemeContext';


const mockStore = configureStore({
  reducer: {
    images: (state = { items: [], loading: false, error: null }, action) => state,
  },
});

describe('App Component', () => {
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

  test('renders main navigation', () => {
    renderWithProviders(<App />);
    
    expect(screen.getByText('Gallery')).toBeInTheDocument();
    expect(screen.getByText('Collections')).toBeInTheDocument();
  });

  test('switches between gallery and collections', () => {
    renderWithProviders(<App />);
    
    const collectionsButton = screen.getByText('Collections');
    fireEvent.click(collectionsButton);
    expect(screen.getByText('My Collections')).toBeInTheDocument();
    
    const galleryButton = screen.getByText('Gallery');
    fireEvent.click(galleryButton);
    expect(screen.getByText('NASA Image Gallery')).toBeInTheDocument();
  });

  test('opens settings modal', () => {
    renderWithProviders(<App />);
    
    const settingsButton = screen.getByLabelText(/settings/i);
    fireEvent.click(settingsButton);
    
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  test('handles theme toggle', () => {
    renderWithProviders(<App />);
    
    const themeButton = screen.getByLabelText(/toggle theme/i);
    fireEvent.click(themeButton);
    
    expect(document.documentElement).toHaveClass('dark');
    
    fireEvent.click(themeButton);
    expect(document.documentElement).not.toHaveClass('dark');
  });

  test('loads images on mount', () => {
    const mockFetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            collection: {
              items: [
                {
                  data: [
                    {
                      nasa_id: '1',
                      title: 'Test Image',
                      description: 'Test Description',
                      date_created: '2024-01-01',
                    },
                  ],
                  links: [{ href: 'test-url.jpg' }],
                },
              ],
            },
          }),
      })
    );
    global.fetch = mockFetch;

    renderWithProviders(<App />);
    expect(mockFetch).toHaveBeenCalled();
  });

  test('handles search functionality', () => {
    renderWithProviders(<App />);
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'mars' } });
    
    // Wait for debounce
    setTimeout(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('mars')
      );
    }, 500);
  });

  test('handles error states', () => {
    const mockFetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    );
    global.fetch = mockFetch;

    renderWithProviders(<App />);
    
    // Wait for error message
    setTimeout(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    }, 100);
  });
}); 