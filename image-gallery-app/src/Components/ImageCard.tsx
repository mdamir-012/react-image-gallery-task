import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext';
import useDebounce from '../hooks/useDebounce';
import { addImage, clearImages, removeImage, setError, setLoading } from '../redux/reducers/imageReducer';
import { AppDispatch, RootState } from '../redux/store';
import { AddImageFormData, Image, NasaImageResponse } from '../types';
import './ImageCard.css';

const ImageCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode, toggleTheme } = useTheme();
  const { images, loading, error } = useSelector((state: RootState) => state.images);
  const [, setNasaImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500); // 500ms delay
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showAddImageModal, setShowAddImageModal] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [, setIsFullscreen] = useState<boolean>(false);
  const [copySuccessMap, setCopySuccessMap] = useState<{ [key: string]: string }>({});
  const [filters, setFilters] = useState({
    year: '',
    mediaType: '',
    center: ''
  });
  const [newImage, setNewImage] = useState<AddImageFormData>({
    title: '',
    description: '',
    url: '',
    date: new Date().toISOString()
  });
  const imagesPerPage = 20;

  
  const nasaCenters = [
    'JPL', 'Johnson Space Center', 'Kennedy Space Center', 'Goddard Space Flight Center',
    'Marshall Space Flight Center', 'Ames Research Center', 'Langley Research Center',
    'Glenn Research Center', 'Dryden Flight Research Center', 'Stennis Space Center'
  ];

  // Media types for filtering
  const mediaTypes = ['image', 'video', 'audio'];

  // Filter images based on search query and filters
  const filteredImages = images.filter((image) => {
    const matchesSearch = image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         image.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesYear = !filters.year || image.date.startsWith(filters.year);
    const matchesMediaType = !filters.mediaType || image.media_type === filters.mediaType;
    const matchesCenter = !filters.center || image.center === filters.center;
    
    return matchesSearch && matchesYear && matchesMediaType && matchesCenter;
  });

  const getData = async (page: number = 1): Promise<void> => {
    try {
      dispatch(setLoading(true));
      let apiUrl = `https://images-api.nasa.gov/search?media_type=image&page_size=${imagesPerPage}&page=${page}`;
      
      // Add search query to API URL if it exists
      if (debouncedSearchQuery) {
        apiUrl += `&q=${encodeURIComponent(debouncedSearchQuery)}`;
      }
      
      // Add filters to API URL if they are set
      if (filters.year) apiUrl += `&year_start=${filters.year}`;
      if (filters.mediaType) apiUrl += `&media_type=${filters.mediaType}`;
      if (filters.center) apiUrl += `&center=${encodeURIComponent(filters.center)}`;

      const response = await fetch(apiUrl);
      const data: NasaImageResponse = await response.json();
      
      if (data.collection && data.collection.items) {
        const formattedImages = await Promise.all(data.collection.items.map(async (item) => {
          const imageUrl = item.links ? item.links[0].href : '';
          return {
            id: item.data[0].nasa_id,
            title: item.data[0].title,
            description: item.data[0].description || 'No description available',
            date: item.data[0].date_created,
            url: imageUrl,
            media_type: item.data[0].media_type,
            center: item.data[0].center
          };
        }));
        setNasaImages(formattedImages);
        dispatch(clearImages());
        formattedImages.forEach((image: Image) => {
          dispatch(addImage(image));
        });
        
        const totalHits = data.collection.metadata.total_hits;
        setTotalPages(Math.ceil(totalHits / imagesPerPage));
      }
    } catch (error) {
      console.error('Error fetching NASA images:', error);
      dispatch(setError('Failed to fetch images. Please try again later.'));
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage, filters, debouncedSearchQuery]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      let newIndex: number;
      switch (e.key.toLowerCase()) {
        case 'arrowleft':
          newIndex = images.findIndex(img => img.id === selectedImage.id) - 1;
          if (newIndex >= 0) setSelectedImage(images[newIndex]);
          break;
        case 'arrowright':
          newIndex = images.findIndex(img => img.id === selectedImage.id) + 1;
          if (newIndex < images.length) setSelectedImage(images[newIndex]);
          break;
        case 'escape':
          setSelectedImage(null);
          setIsFullscreen(false);
          break;
        case '+':
          setZoomLevel(prev => Math.min(prev + 10, 200));
          break;
        case '-':
          setZoomLevel(prev => Math.max(prev - 10, 50));
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'c':
          if (selectedImage) {
            handleCopyImage(selectedImage.url, selectedImage.id);
          }
          break;
        case 'u':
          if (selectedImage) {
            handleCopyUrl(selectedImage.url, selectedImage.id);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, images]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  const handleAddImage = (e: React.FormEvent): void => {
    e.preventDefault();
    if (newImage.url && newImage.title) {
      const imageToAdd: Image = {
        ...newImage,
        id: Date.now().toString(),
      };
      dispatch(addImage(imageToAdd));
      setShowAddImageModal(false);
      setNewImage({
        title: '',
        description: '',
        url: '',
        date: new Date().toISOString()
      });
    }
  };

  const handleRemoveImage = (imageId: string): void => {
    dispatch(removeImage(imageId));
  };

  const handlePageChange = (page: number): void => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };


  const uniqueYears = Array.from(new Set(images.map(image => image.date.substring(0, 4)))).sort().reverse();

  const handleCopyUrl = async (url: string, imageId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccessMap(prev => ({ ...prev, [imageId]: 'URL copied!' }));
      setTimeout(() => {
        setCopySuccessMap(prev => {
          const newMap = { ...prev };
          delete newMap[imageId];
          return newMap;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      setCopySuccessMap(prev => ({ ...prev, [imageId]: 'Failed to copy' }));
    }
  };

  const handleCopyImage = async (url: string, imageId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopySuccessMap(prev => ({ ...prev, [imageId]: 'Image URL copied to clipboard!' }));
      setTimeout(() => {
        setCopySuccessMap(prev => {
          const newMap = { ...prev };
          delete newMap[imageId];
          return newMap;
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to copy image URL:', error);
      setCopySuccessMap(prev => ({ ...prev, [imageId]: 'Failed to copy image. Please try copying the URL instead.' }));
    }
  };

  return (
    <div className="image-gallery-container">
      <div className="hero-section">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="hero-title">NASA Image Gallery</h1>
            <button
              onClick={() => setShowAddImageModal(true)}
              className="add-image-button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Image
            </button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={toggleTheme}
              className="theme-toggle-button"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
          <div className="search-container">
            <div className="search-form">
              <div className="search-input-container">
                <div className="search-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search NASA images..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="search-input"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setCurrentPage(1);
                    }}
                    className="clear-search-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="filter-container">
              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Years</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <select
                name="mediaType"
                value={filters.mediaType}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Media Types</option>
                {mediaTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <select
                name="center"
                value={filters.center}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Centers</option>
                {nasaCenters.map(center => (
                  <option key={center} value={center}>{center}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : filteredImages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="empty-state-title">No Images Found</h2>
            <p className="empty-state-text">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        ) : (
          <>
            <div className="image-grid">
              {filteredImages.map((image) => (
                <div key={image.id} className="image-card">
                  <div className="image-container">
                    <img
                      src={image.url}
                      alt={image.title}
                      onClick={() => setSelectedImage(image)}
                    />
                    <div className="image-overlay"></div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{image.title}</h3>
                    <p className="card-description">{image.description}</p>
                    <div className="card-footer">
                      <span className="date-text">{new Date(image.date).toLocaleDateString()}</span>
                      <div className="card-actions">
                        <button
                          className="action-button"
                          onClick={() => handleCopyImage(image.url, image.id)}
                          title="Copy image URL"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                            />
                          </svg>
                        </button>
                        <button
                          className="action-button"
                          onClick={() => handleCopyUrl(image.url, image.id)}
                          title="Copy image URL"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRemoveImage(image.id)}
                          className="action-button remove-button"
                          title="Remove image"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    {copySuccessMap[image.id] && (
                      <div className="copy-success-message">
                        {copySuccessMap[image.id]}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination-container">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                Previous
              </button>
              <span className="pagination-current">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{selectedImage.title}</h2>
              <button
                onClick={() => setSelectedImage(null)}
                className="modal-close-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                style={{ transform: `scale(${zoomLevel / 100})` }}
              />
              <div className="zoom-controls">
                <button
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                  className="zoom-button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="zoom-level">{zoomLevel}%</span>
                <button
                  onClick={handleZoomIn}
                  disabled={zoomLevel >= 200}
                  className="zoom-button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <button
                onClick={toggleFullscreen}
                className="fullscreen-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddImageModal && (
        <div className="modal-overlay" onClick={() => setShowAddImageModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Add New Image</h2>
              <button
                onClick={() => setShowAddImageModal(false)}
                className="modal-close-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddImage} className="modal-body">
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  value={newImage.description}
                  onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                  className="form-input"
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label htmlFor="url" className="form-label">Image URL</label>
                <input
                  type="url"
                  id="url"
                  value={newImage.url}
                  onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date" className="form-label">Date</label>
                <input
                  type="date"
                  id="date"
                  value={newImage.date.split('T')[0]}
                  onChange={(e) => setNewImage({ ...newImage, date: e.target.value })}
                  className="form-input"
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => setShowAddImageModal(false)}
                  className="modal-cancel-button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-submit-button"
                >
                  Add Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
