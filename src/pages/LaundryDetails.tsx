import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, MapPin, Clock } from 'lucide-react';

const LaundryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in a real app, this would fetch from an API based on the ID
  const laundromat = {
    id: parseInt(id || '1'),
    name: "Clean & Fresh Laundry",
    address: "123 Main St, City",
    rating: 4.8,
    distance: "0.3 mi",
    isOpen: true,
    imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363",
    description: "A modern laundromat with state-of-the-art machines and amenities for all your laundry needs.",
    hours: "6:00 AM - 10:00 PM"
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2" />
          Back
        </Button>

        <div className="glass-card rounded-lg overflow-hidden">
          <div className="relative h-64">
            <img 
              src={laundromat.imageUrl} 
              alt={laundromat.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold">{laundromat.name}</h1>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="text-lg">{laundromat.rating}</span>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{laundromat.address}</span>
            </div>

            <div className="flex items-center text-gray-600 mb-6">
              <Clock className="w-5 h-5 mr-2" />
              <span>{laundromat.hours}</span>
            </div>

            <p className="text-gray-700 mb-6">{laundromat.description}</p>

            <div className={`inline-flex items-center px-4 py-2 rounded-full ${
              laundromat.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                laundromat.isOpen ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {laundromat.isOpen ? 'Open Now' : 'Closed'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaundryDetails;