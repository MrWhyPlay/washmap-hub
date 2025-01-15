import React from 'react';
import LaundryCard from './LaundryCard';
import { Database } from '@/integrations/supabase/types';

type Laundromat = Database['public']['Tables']['laundromats']['Row'];

interface LaundryListProps {
  laundromats: Laundromat[] | null;
  isLoading: boolean;
  error: Error | null;
  selectedLaundromat: number | null;
  onLaundromatSelect: (id: number) => void;
  laundromatRefs: React.MutableRefObject<{ [key: number]: HTMLDivElement | null }>;
}

export const LaundryList: React.FC<LaundryListProps> = ({
  laundromats,
  isLoading,
  error,
  selectedLaundromat,
  onLaundromatSelect,
  laundromatRefs,
}) => {
  if (isLoading) {
    return <div className="text-center py-8">Chargement des laveries...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Erreur lors du chargement des laveries</div>;
  }

  if (!laundromats || laundromats.length === 0) {
    return <div className="text-center py-8">Aucune laverie trouvée</div>;
  }

  return (
    <div className="h-[60vh] overflow-y-auto pr-4 space-y-6">
      {laundromats.map((laundromat) => (
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
            onSelect={onLaundromatSelect}
          />
        </div>
      ))}
    </div>
  );
};