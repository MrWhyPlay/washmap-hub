import React, { useEffect, useRef } from 'react';
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
import { MapPin } from 'lucide-react';

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

  useEffect(() => {
    if (!mapRef.current) return;

    // Paris coordinates
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

    // Add markers for each laundromat
    // Note: In a real application, you would want to geocode the addresses
    // For now, we'll add markers at slightly offset positions around Paris
    laundromats.forEach((laundromat, index) => {
      // Create offset positions around Paris for demonstration
      const offset = 0.002 * index;
      const markerCoordinates = fromLonLat([
        2.3522 + offset - (0.004 * Math.floor(index / 4)),
        48.8566 + offset - (0.004 * Math.floor(index / 4))
      ]);

      const marker = new Feature({
        geometry: new Point(markerCoordinates),
        name: laundromat.name,
        address: laundromat.address,
      });

      // Create a style for the marker
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
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, [laundromats]);

  return (
    <div className="relative w-full h-[60vh] rounded-lg overflow-hidden glass-card animate-fade-in">
      <div ref={mapRef} className="absolute inset-0" />
    </div>
  );
};

export default LaundryMap;