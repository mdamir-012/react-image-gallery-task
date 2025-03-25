import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { SettingsProvider } from '../../context/SettingsContext';
import { ThemeProvider } from '../../context/ThemeContext';
import Settings from '../Settings';

describe('Settings Component', () => {
  const mockOnClose = jest.fn();

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <ThemeProvider>
        <SettingsProvider>
          {component}
        </SettingsProvider>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders settings modal with all controls', () => {
    renderWithProviders(<Settings onClose={mockOnClose} />);

    // Check for main sections
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();

    // Check for controls
    expect(screen.getByLabelText('Background Color')).toBeInTheDocument();
    expect(screen.getByLabelText('Font Size')).toBeInTheDocument();
    expect(screen.getByLabelText('Layout')).toBeInTheDocument();
  });

  test('handles background color change', () => {
    renderWithProviders(<Settings onClose={mockOnClose} />);

    const colorInput = screen.getByLabelText('Background Color');
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });

    expect(colorInput).toHaveValue('#ff0000');
  });

  test('handles font size change', () => {
    renderWithProviders(<Settings onClose={mockOnClose} />);

    const fontSizeInput = screen.getByLabelText('Font Size');
    fireEvent.change(fontSizeInput, { target: { value: '18' } });

    expect(fontSizeInput).toHaveValue('18');
  });

  test('handles layout change', () => {
    renderWithProviders(<Settings onClose={mockOnClose} />);

    const layoutSelect = screen.getByLabelText('Layout');
    fireEvent.change(layoutSelect, { target: { value: 'list' } });

    expect(layoutSelect).toHaveValue('list');
  });

  test('closes modal when clicking close button', () => {
    renderWithProviders(<Settings onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close settings');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('saves settings to localStorage', () => {
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    renderWithProviders(<Settings onClose={mockOnClose} />);

    // Change settings
    fireEvent.change(screen.getByLabelText('Background Color'), {
      target: { value: '#ff0000' },
    });
    fireEvent.change(screen.getByLabelText('Font Size'), {
      target: { value: '18' },
    });

    // Check if localStorage was updated
    expect(mockLocalStorage.setItem).toHaveBeenCalled();
  });

  test('applies theme changes immediately', () => {
    renderWithProviders(<Settings onClose={mockOnClose} />);

    // Change background color
    fireEvent.change(screen.getByLabelText('Background Color'), {
      target: { value: '#ff0000' },
    });

    // Check if CSS variable was updated
    expect(document.documentElement.style.getPropertyValue('--background-color')).toBe('#ff0000');
  });
}); 