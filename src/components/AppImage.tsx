import React, { useState } from 'react';
import { FoodVisual } from './FoodVisual';

interface AppImageProps {
  src?: string;
  alt: string;
  fallbackFoodType: string;
  className?: string;
  imgClassName?: string;
}

export const AppImage: React.FC<AppImageProps> = ({
  src,
  alt,
  fallbackFoodType,
  className = '',
  imgClassName = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // If no src or error occurred, show the rich FoodVisual
  if (!src || imageError) {
    return <FoodVisual foodType={fallbackFoodType} className={className} altText={alt} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Background placeholder while loading */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
          <FoodVisual foodType={fallbackFoodType} className="w-full h-full opacity-60" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  );
};
