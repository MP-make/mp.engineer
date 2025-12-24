import React, { useState, useEffect } from 'react';
import ScrollContainer from 'react-indiana-drag-scroll';
import { ChevronDown } from 'lucide-react';

interface PhoneMockupProps {
  imageSrc: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ imageSrc }) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);

  const handleScroll = () => {
    setShowScrollIndicator(false);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="relative w-64 h-[500px] bg-black rounded-3xl border-4 border-gray-800 shadow-2xl overflow-hidden">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
        
        {/* Screen */}
        <div className="w-full h-full bg-gray-900 rounded-2xl overflow-hidden">
          <ScrollContainer className="w-full h-full" onScroll={handleScroll}>
            <img 
              src={imageSrc} 
              alt="Mobile View" 
              className="w-full h-auto"
            />
          </ScrollContainer>
        </div>
        
        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-20 animate-pulse">
            <div className="text-center text-white">
              <ChevronDown size={32} className="mx-auto mb-2 animate-bounce" />
              <p className="text-sm font-medium">Scroll</p>
            </div>
          </div>
        )}
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default PhoneMockup;