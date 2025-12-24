import React from 'react';
import { ChevronDown } from 'lucide-react';

interface LaptopMockupProps {
  imageSrc?: string;
}

const LaptopMockup: React.FC<LaptopMockupProps> = ({ imageSrc }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-96 h-64 bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Laptop Base */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-900 rounded-b-2xl"></div>

        {/* Screen Frame */}
        <div className="w-full h-full bg-black rounded-t-2xl overflow-hidden relative">
          {/* Screen Bezel */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gray-800"></div>

          {/* Screen */}
          <div className="w-full h-full bg-gray-900 rounded-t-xl overflow-hidden pt-2">
            <div className="w-full h-full overflow-y-auto no-scrollbar">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt="Desktop View"
                  className="w-full h-auto"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-lg">
                  No Image Available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopMockup;
