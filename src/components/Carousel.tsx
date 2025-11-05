'use client';

import { useState } from 'react';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return <div className="w-full h-48 bg-gray-700 rounded flex items-center justify-center text-white">No images available</div>;

  const next = () => setCurrent((current + 1) % images.length);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-48 overflow-hidden rounded">
      <img src={images[current]} alt="Project" className="w-full h-full object-cover" />
      {images.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-75 transition">
            ‹
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded hover:bg-opacity-75 transition">
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default Carousel;