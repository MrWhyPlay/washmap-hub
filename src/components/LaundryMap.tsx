import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import UserLocationLayer from './map/UserLocationLayer';
import LaundromatMarkers from './map/LaundromatMarkers';

interface LaundryMapProps {
  laundromats: Array<{
    id: number;
    name: string;
    address: string;
  }>;
  onMarkerClick?: (id: number) => void;
  onUserLocation?: (coords: { lat: number; lon: number } | null) => void;
}

const LaundryMap = ({ laundromats, onMarkerClick, onUserLocation }: LaundryMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;

    const parisCoordinates = fromLonLat([2.3522, 48.8566]);

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: parisCoordinates,
        zoom: 12
      })
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, []);

  const handleUserLocation = (coordinates: number[]) => {
    if (mapInstance.current) {
      mapInstance.current.getView().setCenter(coordinates);
      mapInstance.current.getView().setZoom(14);
      
      if (onUserLocation) {
        const [lon, lat] = coordinates;
        onUserLocation({ lat, lon });
      }
    }
  };

  const handleLocationError = () => {
    if (onUserLocation) {
      onUserLocation(null);
    }
  };

  const handleMarkersLoaded = (bounds: number[]) => {
    if (mapInstance.current) {
      mapInstance.current.getView().fit(bounds, {
        padding: [50, 50, 50, 50],
        duration: 1000
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-[60vh] rounded-lg overflow-hidden glass-card animate-fade-in">
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
          <div className="text-gray-500">Chargement de la carte...</div>
        </div>
      )}
      <div ref={mapRef} className="absolute inset-0" />
      {mapInstance.current && (
        <>
          <UserLocationLayer 
            map={mapInstance.current} 
            onLocationFound={handleUserLocation}
            onLocationError={handleLocationError}
          />
          <LaundromatMarkers 
            map={mapInstance.current}
            laundromats={laundromats}
            onMarkersLoaded={handleMarkersLoaded}
            onMarkerClick={onMarkerClick}
          />
        </>
      )}
    </div>
  );
};

export default LaundryMap;