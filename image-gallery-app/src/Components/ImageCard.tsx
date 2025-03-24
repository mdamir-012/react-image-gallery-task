import React from 'react';

interface ImageCardProps {
  title?: string;
  description?: string;
}

const ImageCard: React.FC<ImageCardProps> = () => {
  return (
    <div>
      <h1>Image Card</h1>
    </div>
  );
};

export default ImageCard;
