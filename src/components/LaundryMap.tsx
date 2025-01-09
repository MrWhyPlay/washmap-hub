import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface LaundryMapProps {
  laundromats: Array<{
    id: number;
    name: string;
    address: string;
  }>;
}

const LaundryMap = ({ laundromats }: LaundryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    // Paris coordinates as fallback center
    const parisCoordinates = fromLonLat([2.3522, 48.8566]);

    // Create vector source and layer for markers
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: parisCoordinates,
        zoom: 12
      })
    });

    const geocodeAddress = async (address: string) => {
      try {
        const { data, error } = await supabase.functions.invoke('geocode', {
          body: { address }
        });

        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Geocoding error:', error);
        return null;
      }
    };

    const addMarkers = async () => {
      setIsLoading(true);
      let bounds = [parisCoordinates[0], parisCoordinates[1], parisCoordinates[0], parisCoordinates[1]];
      
      for (const laundromat of laundromats) {
        try {
          const coords = await geocodeAddress(laundromat.address);
          
          if (coords) {
            const markerCoordinates = fromLonLat([coords.lon, coords.lat]);
            
            // Update bounds
            bounds = [
              Math.min(bounds[0], markerCoordinates[0]),
              Math.min(bounds[1], markerCoordinates[1]),
              Math.max(bounds[2], markerCoordinates[0]),
              Math.max(bounds[3], markerCoordinates[1])
            ];

            const marker = new Feature({
              geometry: new Point(markerCoordinates),
              name: laundromat.name,
              address: laundromat.address,
            });

            const markerStyle = new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: 'data:image/svg+xml;utf8,' + encodeURIComponent(`
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                `),
                scale: 2,
                color: '#000000'
              })
            });

            marker.setStyle(markerStyle);
            vectorSource.addFeature(marker);
          }
        } catch (error) {
          console.error('Error adding marker:', error);
          toast({
            title: "Erreur de géocodage",
            description: `Impossible de localiser l'adresse: ${laundromat.address}`,
            variant: "destructive",
          });
        }
      }

      // Fit view to all markers if we have any
      if (vectorSource.getFeatures().length > 0) {
        mapInstance.current?.getView().fit(bounds, {
          padding: [50, 50, 50, 50],
          duration: 1000
        });
      }
      
      setIsLoading(false);
    };

    addMarkers();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, [laundromats, toast]);

  return (
    <div className="relative w-full h-[60vh] rounded-lg overflow-hidden glass-card animate-fade-in">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="text-gray-500">Chargement de la carte...</div>
        </div>
      )}
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};

export default LaundryMap;