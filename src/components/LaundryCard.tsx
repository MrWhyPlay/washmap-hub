import React from 'react';
import { Clock, MapPin, Package, CreditCard, Camera, Droplets } from 'lucide-react';

interface LaundryCardProps {
  id: number;
  name: string;
  address: string;
  rating?: number;
  opening_hours: string;
  load_sizes: string[];
  contactless_payment: boolean;
  price_s: number | null;
  price_m: number | null;
  price_l: number | null;
  price_xl: number | null;
  detergent_price: number | null;
  isSelected?: boolean;
  onSelect?: (id: number) => void;
}

const LaundryCard = ({ 
  id, 
  name, 
  address,
  opening_hours,
  load_sizes,
  contactless_payment,
  price_s,
  price_m,
  price_l,
  price_xl,
  detergent_price,
  isSelected,
  onSelect
}: LaundryCardProps) => {
  const formatPrice = (price: number | null) => {
    if (price === null) return '-';
    return `${price.toFixed(2)}€`;
  };

  return (
    <div className="glass-card rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl animate-fade-in">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 
            className={`text-lg font-semibold cursor-pointer hover:text-blue-500 transition-colors ${
              isSelected ? 'text-blue-500' : ''
            }`}
            onClick={() => onSelect?.(id)}
          >
            {name}
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="flex items-center text-sm text-gray-600">
              <Droplets className="w-4 h-4 mr-2" />
              <span>Lessive: {detergent_price ? `${detergent_price.toFixed(2)}€` : 'Inclus'}</span>
            </div>
          </div>

          <div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left py-1">Taille</th>
                  <th className="text-right py-1">Prix</th>
                </tr>
              </thead>
              <tbody>
                {load_sizes.map((size) => (
                  <tr key={size}>
                    <td className="py-1">{size}</td>
                    <td className="text-right py-1">
                      {size === 'S' && formatPrice(price_s)}
                      {size === 'M' && formatPrice(price_m)}
                      {size === 'L' && formatPrice(price_l)}
                      {size === 'XL' && formatPrice(price_xl)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaundryCard;