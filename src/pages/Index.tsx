import React from 'react';
import LaundryMap from '../components/LaundryMap';
import LaundryCard from '../components/LaundryCard';
import SearchBar from '../components/SearchBar';

const mockLaundromats = [
  {
    id: 1,
    name: "Clean & Fresh Laundry",
    address: "123 Main St, City",
    rating: 4.8,
    distance: "0.3 mi",
    isOpen: true,
    imageUrl: "https://images.unsplash.com/photo-1527576539890-dfa815648363"
  },
  {
    id: 2,
    name: "Quick Wash Express",
    address: "456 Oak Ave, City",
    rating: 4.5,
    distance: "0.7 mi",
    isOpen: true,
    imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833"
  },
  {
    id: 3,
    name: "Sparkle Laundromat",
    address: "789 Pine St, City",
    rating: 4.2,
    distance: "1.2 mi",
    isOpen: false,
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Find a Laundromat Near You</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover convenient and reliable laundromats in your area. Compare prices, check availability, and find the perfect spot for your laundry needs.
          </p>
        </header>

        <SearchBar />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <LaundryMap />
          <div className="space-y-6">
            {mockLaundromats.map((laundromat) => (
              <LaundryCard key={laundromat.id} {...laundromat} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;