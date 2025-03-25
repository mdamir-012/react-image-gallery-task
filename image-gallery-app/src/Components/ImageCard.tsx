import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../context/ThemeContext.tsx';
import { addImage, clearImages, removeImage, setError, setLoading } from '../redux/actions/imageActions.ts';
import { AppDispatch, RootState } from '../redux/store.ts';
import { AddImageFormData, Image, NasaImageResponse } from '../types';
import './ImageCard.css';

const ImageCard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode, toggleTheme } = useTheme();
  const { images, loading, error } = useSelector((state: RootState) => state.images);
  const [, setNasaImages] = useState<Image[]>([]);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showAddImageModal, setShowAddImageModal] = useState<boolean>(false);
  const [newImage, setNewImage] = useState<AddImageFormData>({
    title: '',
    description: '',
    url: '',
    date: new Date().toISOString()
  });
  const imagesPerPage = 20;

  const getData = async (page: number = 1): Promise<void> => {
    try {
      dispatch(setLoading(true));
      const response = await fetch(`https://images-api.nasa.gov/search?media_type=image&page_size=${imagesPerPage}&page=${page}`);
      const data: NasaImageResponse = await response.json();
      
      if (data.collection && data.collection.items) {
        const formattedImages = await Promise.all(data.collection.items.map(async (item) => {
          const imageUrl = item.links ? item.links[0].href : '';
          return {
            id: item.data[0].nasa_id,
            title: item.data[0].title,
            description: item.data[0].description || 'No description available',
            date: item.data[0].date_created,
            url: imageUrl
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
  }, [currentPage]);

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

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    setCurrentPage(1);
   
  };

  return (
    <div className="image-gallery-container">
      <div className="hero-section">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="hero-title">NASA Image Gallery</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowAddImageModal(true)}
                className="add-image-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Image
              </button>
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
          </div>
          <div className="search-container">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search NASA images..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <div className="image-grid">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="image-card"
            >
              <div className="image-container" onClick={() => setSelectedImage(image)}>
                <img
                  src={image.url}
                  alt={image.title}
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                  }}
                />
                <div className="image-overlay"></div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{image.title}</h3>
                <p className="card-description">{image.description}</p>
                <div className="card-footer">
                  <span className="date-text">
                    {new Date(image.date).toLocaleDateString()}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(image.id);
                    }}
                    className="remove-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="remove-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {!loading && images.length > 0 && (
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
        )}

        {/* Empty State */}
        {!loading && images.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="empty-state-title">No images available</h3>
            <p className="empty-state-text">Please try again later or adjust your search criteria.</p>
          </div>
        )}
      </div>

      {/* Add Image Modal */}
      {showAddImageModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4">Add New Image</h2>
              <form onSubmit={handleAddImage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newImage.url}
                    onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                    className="modal-input"
                    required
                    placeholder="Enter image URL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={newImage.title}
                    onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                    className="modal-input"
                    required
                    placeholder="Enter image title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={newImage.description}
                    onChange={(e) => setNewImage({ ...newImage, description: e.target.value })}
                    className="modal-input"
                    rows={3}
                    placeholder="Enter image description"
                  />
                </div>
                <div className="flex justify-end gap-2">
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
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="p-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.title}
                className="modal-image"
              />
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-2">{selectedImage.title}</h2>
                <p className="text-gray-600">{selectedImage.description}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="modal-close-button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
