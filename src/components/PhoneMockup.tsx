import React from 'react';

interface PhoneMockupProps {
  imageSrc?: string;
}

const PhoneMockup: React.FC<PhoneMockupProps> = ({ imageSrc }) => {
  return (
    <div className="flex justify-center items-center">
      <div className="relative w-64 h-[500px] bg-black rounded-3xl border-4 border-gray-800 shadow-2xl overflow-hidden">
        {/* Phone Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10"></div>
        
        {/* Screen */}
        <div className="w-full h-full bg-gray-900 rounded-2xl overflow-hidden">
          <div className="w-full h-full overflow-y-auto no-scrollbar">
            {imageSrc ? (
              <img 
                src={imageSrc} 
                alt="Mobile View" 
                className="w-full h-auto"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-lg">
                No Image Available
              </div>
            )}
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default PhoneMockup;