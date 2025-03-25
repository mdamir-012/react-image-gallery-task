# NASA Image Gallery

A modern web-based image gallery application built with React, TypeScript, and the NASA Image and Video Library API. This application allows users to browse, search, and manage NASA's vast collection of space images with features like zoom, fullscreen view, and theme customization.

## 🚀 Features

### 1. Image Management
- Add and remove images from the library
- Upload custom images with title, description, and date
- Automatic integration with NASA's image database
- Image preview and details view

### 2. Reading Interface
- Responsive image grid layout
- Pagination for efficient browsing
- Zoom In/Out functionality (50% - 200%)
- Fullscreen mode support
- Light/Dark theme toggle
- Smooth transitions and animations

### 3. Library & Collections
- Advanced search functionality with debounce
- Filter images by:
  - Year
  - Media Type
  - NASA Center
- Sort and organize images
- Real-time search results

### 4. Settings & Customization
- Theme preferences (Light/Dark mode)
- Background color customization
- Font size adjustments
- Layout options (Grid/List view)
- Persistent user preferences

### 5. Accessibility Features
- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- Responsive design for all devices

## 🛠️ Technical Stack

- **Frontend Framework**: React 18.x
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: CSS with CSS Modules
- **Testing**: Jest + React Testing Library
- **API Integration**: NASA Image and Video Library API
- **Build Tool**: Vite
- **Code Quality**: ESLint + Prettier

## 📦 Project Setup

1. Clone the repository:
\`\`\`bash
git clone [https://github.com/mdamir-012/react-image-gallery-task.git]
cd image-gallery-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

The application will be available at \`http://localhost:5173\`

## 🗂️ Project Structure

\`\`\`
src/
├── components/          # React components
│   ├── ImageCard/      # Image card component
│   ├── Settings/       # Settings modal
│   └── __tests__/      # Component tests
├── context/            # React context providers
│   ├── ThemeContext    # Theme management
│   └── SettingsContext # User settings
├── hooks/              # Custom React hooks
├── redux/              # Redux state management
│   ├── store.ts       # Redux store configuration
│   └── slices/        # Redux slices
├── services/          # API and external services
├── styles/            # Global styles
├── types/             # TypeScript type definitions
└── utils/            # Utility functions
\`\`\`

## 🧪 Testing

The project includes comprehensive test coverage using Jest and React Testing Library.

### Running Tests

1. Run all tests:
\`\`\`bash
npm test
\`\`\`

2. Run tests in watch mode:
\`\`\`bash
npm run test:watch
\`\`\`

3. Generate coverage report:
\`\`\`bash
npm run test:coverage
\`\`\`

### Test Coverage

- Components: Unit tests for all components
- Integration: API integration tests
- User Interactions: Event handling tests
- State Management: Redux state tests
- Accessibility: A11y compliance tests

## ⌨️ Keyboard Shortcuts

- `←/→`: Navigate between images
- `+/-`: Zoom in/out
- `f`: Toggle fullscreen
- `Esc`: Exit fullscreen/close modal
- `t`: Toggle theme (light/dark)

## 🔄 API Integration

The application uses the NASA Image and Video Library API:
- Base URL: https://images-api.nasa.gov
- Endpoints used:
  - Search: \`/search\`
  - Asset metadata: \`/asset\`
  - Image details: \`/metadata\`

## 🎨 Customization

Users can customize their experience through:
1. Theme selection (Light/Dark)
2. Background color preferences
3. Font size adjustments
4. Layout options
5. Display preferences

## 📱 Responsive Design

The application is fully responsive and tested on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔍 Performance Optimization

- Image lazy loading
- Debounced search
- Optimized re-renders
- Efficient state management
- Caching mechanisms

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: \`git checkout -b feature/AmazingFeature\`
3. Commit your changes: \`git commit -m 'Add some AmazingFeature'\`
4. Push to the branch: \`git push origin feature/AmazingFeature\`
5. Open a Pull Request


## 🙏 Acknowledgments

- NASA for providing the Image and Video Library API
- React and TypeScript communities

