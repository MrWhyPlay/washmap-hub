import React from 'react';
import { Clock, MapPin, Package, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LaundryCardProps {
  id: number;
  name: string;
  address: string;
  rating: number;
  distance: string;
  opening_hours: string;
  load_sizes: string[];
  contactless_payment: boolean;
  price_s: number | null;
  price_m: number | null;
  price_l: number | null;
  price_xl: number | null;
  detergent_price: number | null;
}

const LaundryCard = ({ 
  id, 
  name, 
  address, 
  distance, 
  opening_hours,
  load_sizes,
  contactless_payment,
  price_s,
  price_m,
  price_l,
  price_xl,
  detergent_price
}: LaundryCardProps) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="glass-card px-3 py-1 rounded-full text-sm">
            {distance}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Info */}
          <div className="space-y-3">
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span>{address}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span>{opening_hours}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <CreditCard className="w-4 h-4 mr-2" />
              <span>{contactless_payment ? 'Sans contact' : 'Paiement classique'}</span>
            </div>
          </div>

          {/* Right column: Prices and Button */}
          <div className="flex flex-col justify-between">
            <div className="space-y-2 mb-4">
              {price_s && <div className="text-sm">Petite charge (S): {price_s}€</div>}
              {price_m && <div className="text-sm">Charge moyenne (M): {price_m}€</div>}
              {price_l && <div className="text-sm">Grande charge (L): {price_l}€</div>}
              {price_xl && <div className="text-sm">Très grande charge (XL): {price_xl}€</div>}
              {detergent_price && (
                <div className="text-sm text-gray-600 mt-1">
                  Lessive: {detergent_price}€
                </div>
              )}
            </div>
            
            <button 
              className="px-4 py-2 bg-black text-white rounded-full text-sm hover:bg-gray-800 transition-colors w-full md:w-auto md:self-end"
              onClick={() => navigate(`/laundry/${id}`)}
            >
              Voir les détails
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaundryCard;