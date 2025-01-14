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
  selectedLaundromat?: number | null;
}

const LaundromatMarkers = ({ map, laundromats, onMarkersLoaded, onMarkerClick, selectedLaundromat }: LaundromatMarkersProps) => {
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
      let selectedFeature: Feature | null = null;
      
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
                scale: laundromat.id === selectedLaundromat ? 0.2 : 0.15,
              })
            });

            marker.setStyle(markerStyle);
            vectorSource.addFeature(marker);

            if (laundromat.id === selectedLaundromat) {
              selectedFeature = marker;
            }
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

      if (selectedFeature) {
        const geometry = selectedFeature.getGeometry();
        if (geometry && geometry instanceof Point) {
          const coordinates = geometry.getCoordinates();
          map.getView().animate({
            center: coordinates,
            duration: 1000,
            zoom: 15
          });
        }
      } else if (vectorSource.getFeatures().length > 0 && onMarkersLoaded) {
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
            const geometry = feature.getGeometry();
            if (geometry && geometry instanceof Point) {
              const coordinates = geometry.getCoordinates();
              map.getView().animate({
                center: coordinates,
                duration: 1000,
                zoom: 15
              });
            }
          }
        }
      });
    }

    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [map, laundromats, toast, onMarkersLoaded, onMarkerClick, selectedLaundromat]);

  return null;
};

export default LaundromatMarkers;