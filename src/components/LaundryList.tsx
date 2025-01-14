import React from 'react';
import LaundryCard from './LaundryCard';

interface Laundromat {
  id: number;
  name: string;
  address: string;
  opening_hours: string;
  load_sizes: string[];
  contactless_payment: boolean;
  price_s: number | null;
  price_m: number | null;
  price_l: number | null;
  price_xl: number | null;
  detergent_price: number | null;
}

interface LaundryListProps {
  laundromats: Laundromat[];
  isLoading: boolean;
  error: Error | null;
  selectedLaundromat: number | null;
  onSelect: (id: number) => void;
  refs: { [key: number]: React.RefObject<HTMLDivElement> };
}

const LaundryList = ({ 
  laundromats, 
  isLoading, 
  error, 
  selectedLaundromat,
  onSelect,
  refs 
}: LaundryListProps) => {
  return (
    <div className="h-[60vh] overflow-y-auto pr-4 space-y-6 shadow-lg rounded-lg bg-white p-4">
      {isLoading ? (
        <div className="text-center py-8">Chargement des laveries...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Erreur lors du chargement des laveries</div>
      ) : laundromats && laundromats.length > 0 ? (
        laundromats.map((laundromat) => (
          <div
            key={laundromat.id}
            ref={el => {
              if (refs[laundromat.id]) {
                (refs[laundromat.id] as any).current = el;
              }
            }}
            className={`transition-colors duration-300 ${
              selectedLaundromat === laundromat.id ? 'border-2 border-[#0EA5E9] rounded-lg' : ''
            }`}
          >
            <LaundryCard 
              {...laundromat} 
              isSelected={selectedLaundromat === laundromat.id}
              onSelect={onSelect}
            />
          </div>
        ))
      ) : (
        <div className="text-center py-8">Aucune laverie trouvée</div>
      )}
    </div>
  );
};

export default LaundryList;