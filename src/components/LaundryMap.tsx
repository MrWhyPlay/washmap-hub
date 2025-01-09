import React from 'react';
import { MapPin } from 'lucide-react';

const LaundryMap = () => {
  return (
    <div className="relative w-full h-[60vh] rounded-lg overflow-hidden glass-card animate-fade-in">
      <div className="absolute inset-0 bg-gray-100">
        {/* Map placeholder - will be replaced with actual map implementation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-gray-400" />
          <span className="ml-2 text-gray-500">Map loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LaundryMap;