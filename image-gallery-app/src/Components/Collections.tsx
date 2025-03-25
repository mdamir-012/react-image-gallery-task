import React, { useState } from 'react';
import { Image } from '../types';

interface Collection {
  id: string;
  name: string;
  description: string;
  images: Image[];
}

interface CollectionsProps {
  images: Image[];
  onAddToCollection: (collectionId: string, image: Image) => void;
  onRemoveFromCollection: (collectionId: string, imageId: string) => void;
}

const Collections: React.FC<CollectionsProps> = ({ images, onAddToCollection, onRemoveFromCollection }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCollection, setNewCollection] = useState({
    name: '',
    description: ''
  });

  const createCollection = () => {
    if (newCollection.name.trim()) {
      const collection: Collection = {
        id: Date.now().toString(),
        name: newCollection.name,
        description: newCollection.description,
        images: []
      };
      setCollections([...collections, collection]);
      setNewCollection({ name: '', description: '' });
      setShowCreateModal(false);
    }
  };

  const deleteCollection = (collectionId: string) => {
    setCollections(collections.filter(c => c.id !== collectionId));
  };

  return (
    <div className="collections-container">
      <div className="collections-header">
        <h2>My Collections</h2>
        <button 
          className="create-collection-button"
          onClick={() => setShowCreateModal(true)}
        >
          Create Collection
        </button>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Collection</h3>
            <input
              type="text"
              placeholder="Collection Name"
              value={newCollection.name}
              onChange={(e) => setNewCollection({ ...newCollection, name: e.target.value })}
            />
            <textarea
              placeholder="Description (optional)"
              value={newCollection.description}
              onChange={(e) => setNewCollection({ ...newCollection, description: e.target.value })}
            />
            <div className="modal-actions">
              <button onClick={createCollection}>Create</button>
              <button onClick={() => setShowCreateModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="collections-grid">
        {collections.map(collection => (
          <div key={collection.id} className="collection-card">
            <div className="collection-header">
              <h3>{collection.name}</h3>
              <button 
                className="delete-collection-button"
                onClick={() => deleteCollection(collection.id)}
              >
                Delete
              </button>
            </div>
            <p className="collection-description">{collection.description}</p>
            <div className="collection-images">
              {collection.images.map(image => (
                <div key={image.id} className="collection-image">
                  <img src={image.url} alt={image.title} />
                  <button 
                    className="remove-from-collection"
                    onClick={() => onRemoveFromCollection(collection.id, image.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="add-to-collection">
              <select
                onChange={(e) => {
                  const selectedImage = images.find(img => img.id === e.target.value);
                  if (selectedImage) {
                    onAddToCollection(collection.id, selectedImage);
                  }
                }}
              >
                <option value="">Add Image to Collection</option>
                {images
                  .filter(img => !collection.images.some(ci => ci.id === img.id))
                  .map(img => (
                    <option key={img.id} value={img.id}>
                      {img.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections; 