import React from 'react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { RotateCcw } from 'lucide-react';

interface FiltersProps {
  filters: {
    hasContactlessPayment: boolean;
    loadSizes: string[];
  };
  onFilterChange: (newFilters: {
    hasContactlessPayment: boolean;
    loadSizes: string[];
  }) => void;
  onReset: () => void;
}

const loadSizeLabels = {
  'S': 'S (5 - 6,5 kg)',
  'M': 'M (7 - 10 kg)',
  'L': 'L (11 - 13 kg)',
  'XL': 'XL (16 - 18 kg)'
};

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
}) => {
  const handleLoadSizeChange = (size: string) => {
    onFilterChange({
      ...filters,
      loadSizes: filters.loadSizes.includes(size)
        ? filters.loadSizes.filter(s => s !== size)
        : [...filters.loadSizes, size]
    });
  };

  return (
    <div className="glass-card p-6 mb-8 rounded-lg animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Filtres</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
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
                onFilterChange({ ...filters, hasContactlessPayment: checked as boolean })
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
  );
};