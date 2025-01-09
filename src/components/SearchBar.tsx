import React from 'react';
import { Search, Sliders } from 'lucide-react';

const SearchBar = () => {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8 animate-fade-in">
      <div className="glass-card rounded-full flex items-center p-2">
        <div className="flex-1 flex items-center px-4">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher des laveries à proximité..."
            className="w-full ml-3 bg-transparent border-none focus:outline-none placeholder-gray-400"
          />
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Sliders className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;