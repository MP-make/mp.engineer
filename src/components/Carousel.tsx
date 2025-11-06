'use client';

import { useState, useEffect } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  if (images.length === 0) return <div className="w-full h-64 bg-gray-700 rounded flex items-center justify-center text-white">No images available</div>;

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
      <img src={images[current]} alt="Project" className="w-full h-full object-contain" />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full transition border border-white ${
                index === current ? 'bg-primary' : 'bg-black bg-opacity-50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;