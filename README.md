# NASA Image Gallery

## 📝 Project Overview
A modern web-based image gallery application built with React, TypeScript, and the NASA Image and Video Library API. This application allows users to browse, search, and manage NASA's vast collection of space images with features like zoom, fullscreen view, theme customization, and image copying.


## 🚀 Features

### 1. Image Management
- Add and remove images from the library
- Upload custom images with title, description, and date
- Automatic integration with NASA's image database
- Image preview and details view
- Copy images to clipboard

### 2. Reading Interface
- Responsive image grid layout
- Pagination for efficient browsing (20 images per page)
- Zoom In/Out functionality (50% - 200%)
- Fullscreen mode support
- Light/Dark theme toggle
- Smooth transitions and animations
- Copy image URL and share functionality

### 3. Library & Collections
- Advanced search functionality with debounce (500ms)
- Filter images by:
  - Year
  - Media Type (image, video, audio)
  - NASA Center
- Sort and organize images
- Real-time search results
- Collection management

### 4. Settings & Customization
- Theme preferences (Light/Dark mode)
- Background color customization
- Font size adjustments
- Layout options (Grid/List view)
- Persistent user preferences using localStorage

### 5. Accessibility Features
- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- Responsive design for all devices
- High contrast mode support

## 🛠️ Technical Stack

### Frontend
- **Core**: React 18.x + TypeScript
- **State Management**: Redux 
- **Styling**: CSS Modules
- **Build Tool**: Vite
- **Package Manager**: npm

### Testing
- Jest
- React Testing Library
- Coverage reporting

### Code Quality
- ESLint
- Prettier
- TypeScript strict mode

### API Integration
- NASA Image and Video Library API
- Axios for HTTP requests
- Response caching

## 📦 Installation & Setup

1. **Clone the repository**
   ```
   git clone https://github.com/mdamir-012/react-image-gallery-task.git
   cd react-image-gallery-task
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Start development server**
   ```
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production**
   ```
   npm run build
   ```

## 🗂️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ImageCard/      # Image display component
│   ├── ImageGrid/      # Grid layout component
│   ├── SearchBar/      # Search functionality
│   ├── Filters/        # Filter components
│   ├── Settings/       # Settings modal
│   └── __tests__/      # Component tests
├── context/            # React context providers
│   ├── ThemeContext    # Theme management
│   └── SettingsContext # User settings
├── hooks/              # Custom React hooks
│   ├── useDebounce    # Search debouncing
│   ├── useImageLoad    # Image loading
│   └── useTheme       # Theme management
├── redux/              # Redux state management
│   ├── store.ts       # Redux store configuration
│   └── slices/        # Feature slices
├── services/           # API and external services
│   ├── nasa.ts        # NASA API integration
│   └── storage.ts     # Local storage
├── styles/            # Global styles
├── types/             # TypeScript definitions
└── utils/             # Utility functions
```

## 🧪 Testing

### Running Tests
1. **All tests**
   ```
   npm test
   ```

2. **Watch mode**
   ```
   npm run test:watch
   ```

3. **Coverage report**
   ```
   npm run test:coverage
   ```



## ⌨️ Keyboard Shortcuts

| Key           | Action                    |
|---------------|---------------------------|
| ←/→          | Navigate between images   |
| +/-          | Zoom in/out              |
| f            | Toggle fullscreen        |
| Esc          | Exit fullscreen/modal    |
| t            | Toggle theme             |
| c            | Copy image to clipboard  |
| u            | Copy image URL           |
| d            | Download image           |
| Space        | Play/Pause slideshow     |

## 🔄 API Integration

### NASA Image and Video Library API
- Base URL: `https://images-api.nasa.gov`
- Rate Limits: 1000 requests per hour
- Authentication: Not required

### Endpoints Used
1. **Search Images**
   - `GET /search`
   - Parameters:
     - `q`: Search query
     - `media_type`: Filter by media type
     - `year_start`: Filter by year
     - `page`: Pagination
     - `page_size`: Results per page

2. **Get Asset Details**
   - `GET /asset/{nasa_id}`
   - Returns high-resolution image URLs

3. **Get Metadata**
   - `GET /metadata/{nasa_id}`
   - Returns detailed image information

## 🎨 Customization Options

### Theme Settings
- Light Mode
- Dark Mode
- High Contrast Mode
- Custom Background Colors

### Layout Options
- Grid View
  - Small (4 columns)
  - Medium (3 columns)
  - Large (2 columns)
- List View
- Slideshow Mode

### Display Preferences
- Image Size
- Text Size
- Animation Speed
- Loading Preferences

## 📱 Responsive Design

### Breakpoints
- Mobile: 320px - 767px
- Tablet: 768px - 1199px
- Desktop: 1200px+

### Features by Device
- **Mobile**
  - Single column layout
  - Touch gestures
  - Simplified controls
- **Tablet**
  - Two column layout
  - Hybrid touch/mouse controls
- **Desktop**
  - Multi-column layout
  - Full keyboard support

## 🔍 Performance Optimization

### Implemented
- Image lazy loading
- Debounced search (500ms)
- Response caching
- Code splitting

### Metrics
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Score: > 90

## 🐛 Known Issues & Limitations

1. Image download may be slow for high-resolution images
2. Limited support for Internet Explorer
3. NASA API rate limiting during peak hours

## 🔜 Future Enhancements

1. Offline support with Service Workers
2. Social sharing integration
3. Advanced image editing features
4. User collections and favorites
5. Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create feature branch:
   ```
   git checkout -b feature/NewFeature
   ```
3. Commit changes:
   ```
   git commit -m 'Add NewFeature'
   ```
4. Push to branch:
   ```
   git push origin feature/NewFeature
   ```
5. Submit a Pull Request

### Contribution Guidelines
- Follow existing code style
- Add tests for new features
- Update documentation
- Reference issues in commits


## 🙏 Acknowledgments

- NASA for providing the Image and Video Library API
- React and TypeScript communities
- Contributors and testers


