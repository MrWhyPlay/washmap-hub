import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import LaundryMap from '../components/LaundryMap';
import LaundryCard from '../components/LaundryCard';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Filters {
  hasContactlessPayment: boolean;
  priceRange: string;
  loadSizes: string[];
}

const Index = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<Filters>({
    hasContactlessPayment: false,
    priceRange: 'all',
    loadSizes: []
  });

  const { data: laundromats, isLoading, error } = useQuery({
    queryKey: ['laundromats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('laundromats')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching laundromats",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
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
            {isLoading ? (
              <div className="text-center py-8">Loading laundromats...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Error loading laundromats</div>
            ) : laundromats && laundromats.length > 0 ? (
              laundromats.map((laundromat) => (
                <LaundryCard key={laundromat.id} {...laundromat} />
              ))
            ) : (
              <div className="text-center py-8">No laundromats found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;