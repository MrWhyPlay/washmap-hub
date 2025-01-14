import React, { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import LaundryMap from '../components/LaundryMap';
import LaundryFilters from '../components/LaundryFilters';
import LaundryList from '../components/LaundryList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Filters {
  hasContactlessPayment: boolean;
  loadSizes: string[];
}

const Index = () => {
  const { toast } = useToast();
  const [selectedLaundromat, setSelectedLaundromat] = useState<number | null>(null);
  const [filters, setFilters] = useState<Filters>({
    hasContactlessPayment: false,
    loadSizes: []
  });

  // Create a record of refs for each laundromat
  const refs: { [key: number]: React.RefObject<HTMLDivElement> } = {};

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

      // Initialize refs for each laundromat
      data?.forEach(laundromat => {
        refs[laundromat.id] = React.createRef<HTMLDivElement>();
      });

      return data;
    },
  });

  const handleMarkerClick = (id: number) => {
    setSelectedLaundromat(id);
    const element = refs[id]?.current;
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

        <LaundryFilters 
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleReset}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <LaundryMap 
            laundromats={laundromats || []} 
            onMarkerClick={handleMarkerClick}
            selectedLaundromat={selectedLaundromat}
          />
          <LaundryList
            laundromats={laundromats || []}
            isLoading={isLoading}
            error={error as Error}
            selectedLaundromat={selectedLaundromat}
            onSelect={handleLaundromatSelect}
            refs={refs}
          />
        </div>

        <div className="text-center mb-12">
          <a 
            href="https://forms.gle/vY4GcoT7XyM32rQ76" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Rajouter une laverie manquante
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;