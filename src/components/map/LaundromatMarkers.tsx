import { useEffect } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Style, Icon } from 'ol/style';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import { useToast } from '@/components/ui/use-toast';
import { geocodeAddress } from '@/utils/geocoding';

interface LaundromatMarkersProps {
  map: Map;
  laundromats: Array<{
    id: number;
    name: string;
    address: string;
  }>;
  onMarkersLoaded?: (bounds: number[]) => void;
  onMarkerClick?: (id: number) => void;
}

const LaundromatMarkers = ({ map, laundromats, onMarkersLoaded, onMarkerClick }: LaundromatMarkersProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    map.addLayer(vectorLayer);

    const addMarkers = async () => {
      const parisCoordinates = fromLonLat([2.3522, 48.8566]);
      let bounds = [parisCoordinates[0], parisCoordinates[1], parisCoordinates[0], parisCoordinates[1]];
      
      for (const laundromat of laundromats) {
        try {
          const coords = await geocodeAddress(laundromat.address);
          
          if (coords) {
            const markerCoordinates = fromLonLat([coords.lon, coords.lat]);
            
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

      if (vectorSource.getFeatures().length > 0 && onMarkersLoaded) {
        onMarkersLoaded(bounds);
      }
    };

    addMarkers();

    if (onMarkerClick) {
      map.on('click', (event) => {
        const feature = map.forEachFeatureAtPixel(
          event.pixel,
          (feature) => feature,
          {
            hitTolerance: 25
          }
        );
        if (feature) {
          const laundromatId = feature.get('id');
          if (laundromatId) {
            onMarkerClick(laundromatId);
          }
        }
      });
    }

    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [map, laundromats, toast, onMarkersLoaded, onMarkerClick]);

  return null;
};

export default LaundromatMarkers;