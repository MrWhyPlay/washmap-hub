import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LaundryCardProps {
  id: number;
  name: string;
  address: string;
  rating: number;
  distance: string;
  is_open: boolean;
  image_url: string;
}

const LaundryCard = ({ id, name, address, rating, distance, is_open, image_url }: LaundryCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image_url} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <div className="glass-card px-3 py-1 rounded-full text-sm">
            {distance}
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm">{rating}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{address}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span className={`text-sm ${is_open ? 'text-green-600' : 'text-red-600'}`}>
              {is_open ? 'Open Now' : 'Closed'}
            </span>
          </div>
          <button 
            className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors"
            onClick={() => navigate(`/laundry/${id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default LaundryCard;