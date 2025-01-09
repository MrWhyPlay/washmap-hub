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
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface LaundryMapProps {
  laundromats: Array<{
    id: number;
    name: string;
    address: string;
  }>;
  onMarkerClick?: (id: number) => void;
}

const LaundryMap = ({ laundromats, onMarkerClick }: LaundryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const userLocationSource = useRef(new VectorSource());

  useEffect(() => {
    if (!mapRef.current) return;

    // Paris coordinates as fallback center
    const parisCoordinates = fromLonLat([2.3522, 48.8566]);

    // Create vector source and layer for markers
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Create user location layer
    const userLocationLayer = new VectorLayer({
      source: userLocationSource.current,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: '#4299e1', // Blue color
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      }),
    });

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        userLocationLayer,
        vectorLayer
      ],
      view: new View({
        center: parisCoordinates,
        zoom: 12
      })
    });

    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoordinates = fromLonLat([position.coords.longitude, position.coords.latitude]);
          
          // Add user location marker
          const userLocationFeature = new Feature({
            geometry: new Point(userCoordinates),
            name: 'Your location'
          });
          
          userLocationSource.current.clear();
          userLocationSource.current.addFeature(userLocationFeature);

          if (mapInstance.current) {
            mapInstance.current.getView().setCenter(userCoordinates);
            mapInstance.current.getView().setZoom(14);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast({
            title: "Erreur de géolocalisation",
            description: "Impossible d'obtenir votre position. Utilisation de la position par défaut.",
            variant: "destructive",
          });
        }
      );
    }

    // Add click handler to the map with increased hitbox tolerance
    mapInstance.current.on('click', (event) => {
      const feature = mapInstance.current?.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
        {
          hitTolerance: 25
        }
      );
      if (feature) {
        const laundromatId = feature.get('id');
        if (laundromatId && onMarkerClick) {
          onMarkerClick(laundromatId);
        }
      }
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
              id: laundromat.id
            });

            const markerStyle = new Style({
              image: new Icon({
                anchor: [0.5, 1],
                src: '/lovable-uploads/6d5cd576-9d23-4765-989a-6a4c8559dda0.png',
                scale: 0.15,
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
  }, [laundromats, toast, onMarkerClick]);

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