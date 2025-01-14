import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import LaundryMap from '../components/LaundryMap';
import LaundryCard from '../components/LaundryCard';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { RotateCcw } from 'lucide-react';

interface Filters {
  hasContactlessPayment: boolean;
  loadSizes: string[];
}

const loadSizeLabels = {
  'S': 'S',
  'M': 'M',
  'L': 'L',
  'XL': 'XL'
};

// ... keep existing code (Index component definition and state)

const Index = () => {
  const { toast } = useToast();
  const [selectedLaundromat, setSelectedLaundromat] = useState<number | null>(null);
  const laundromatRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [filters, setFilters] = useState<Filters>({
    hasContactlessPayment: false,
    loadSizes: []
  });

  const { data: laundromats, isLoading, error } = useQuery({
    queryKey: ['laundromats', filters],
    queryFn: async () => {
      let query = supabase
        .from('laundromats')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.hasContactlessPayment) {
        query = query.eq('contactless_payment', true);
      }

      if (filters.loadSizes.length > 0) {
        query = query.contains('load_sizes', filters.loadSizes);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Erreur lors de la récupération des laveries",
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

  const handleMarkerClick = (id: number) => {
    setSelectedLaundromat(id);
    const element = laundromatRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleLaundromatSelect = (id: number) => {
    setSelectedLaundromat(id);
  };

  const handleReset = () => {
    setFilters({
      hasContactlessPayment: false,
      loadSizes: []
    });
    setSelectedLaundromat(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-6 animate-fade-in">
          <div className="mb-2">
            <img 
              src="/lovable-uploads/71d04a19-2e97-40c1-b754-835fe624de35.png" 
              alt="Lavomate" 
              className="w-[30%] max-w-xl mx-auto"
            />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Découvrez des laveries pratiques et fiables dans votre quartier. Comparez les équipements et trouvez l'endroit parfait pour votre linge.
          </p>
        </header>

        <div className="glass-card p-6 mb-8 rounded-lg animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Filtres</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="contactless" 
                  checked={filters.hasContactlessPayment}
                  onCheckedChange={(checked) => 
                    setFilters(prev => ({ ...prev, hasContactlessPayment: checked as boolean }))
                  }
                />
                <Label htmlFor="contactless">Paiement sans contact</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tailles de charge</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(loadSizeLabels).map(([size, label]) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`size-${size}`}
                      checked={filters.loadSizes.includes(size)}
                      onCheckedChange={() => handleLoadSizeChange(size)}
                    />
                    <Label htmlFor={`size-${size}`}>{label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <LaundryMap 
            laundromats={laundromats || []} 
            onMarkerClick={handleMarkerClick}
            selectedLaundromat={selectedLaundromat}
          />
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8">Chargement des laveries...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">Erreur lors du chargement des laveries</div>
            ) : laundromats && laundromats.length > 0 ? (
              laundromats.map((laundromat) => (
                <div
                  key={laundromat.id}
                  ref={el => laundromatRefs.current[laundromat.id] = el}
                  className={`transition-colors duration-300 ${
                    selectedLaundromat === laundromat.id ? 'border-2 border-[#0EA5E9] rounded-lg' : ''
                  }`}
                >
                  <LaundryCard 
                    {...laundromat} 
                    isSelected={selectedLaundromat === laundromat.id}
                    onSelect={handleLaundromatSelect}
                  />
                </div>
              ))
            ) : (
              <div className="text-center py-8">Aucune laverie trouvée</div>
            )}
          </div>
        </div>

        <div className="text-center mb-12">
          <Button 
            variant="outline"
            className="bg-white hover:bg-gray-50"
            onClick={() => window.open('https://forms.gle/vY4GcoT7XyM32rQ76', '_blank')}
          >
            Rajouter une laverie manquante
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
