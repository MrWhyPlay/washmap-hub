import React, { useState } from 'react';
import LaundryMap from '../components/LaundryMap';
import LaundryCard from '../components/LaundryCard';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface Filters {
  hasContactlessPayment: boolean;
  priceRange: string;
  loadSizes: string[];
}

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
  const [filters, setFilters] = useState<Filters>({
    hasContactlessPayment: false,
    priceRange: 'all',
    loadSizes: []
  });

  const handleLoadSizeChange = (size: string) => {
    setFilters(prev => ({
      ...prev,
      loadSizes: prev.loadSizes.includes(size)
        ? prev.loadSizes.filter(s => s !== size)
        : [...prev.loadSizes, size]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold mb-4">Find a Laundromat Near You</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover convenient and reliable laundromats in your area. Compare prices, check availability, and find the perfect spot for your laundry needs.
          </p>
        </header>

        <div className="glass-card p-6 mb-8 rounded-lg animate-fade-in">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contactless" 
                  checked={filters.hasContactlessPayment}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, hasContactlessPayment: checked as boolean }))
                  }
                />
                <Label htmlFor="contactless">Contactless Payment</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceRange">Price Range</Label>
              <Select 
                value={filters.priceRange}
                onValueChange={(value) => 
                  setFilters(prev => ({ ...prev, priceRange: value }))
                }
              >
                <SelectTrigger id="priceRange">
                  <SelectValue placeholder="Select price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">$ Economy (Under $2/load)</SelectItem>
                  <SelectItem value="medium">$$ Standard ($2-4/load)</SelectItem>
                  <SelectItem value="high">$$$ Premium ($4+/load)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Load Sizes</Label>
              <div className="grid grid-cols-2 gap-2">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`size-${size}`}
                      checked={filters.loadSizes.includes(size)}
                      onCheckedChange={() => handleLoadSizeChange(size)}
                    />
                    <Label htmlFor={`size-${size}`}>{size}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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