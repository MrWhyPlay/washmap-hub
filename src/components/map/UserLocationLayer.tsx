import { useEffect, useRef } from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';

interface UserLocationLayerProps {
  map: Map;
  onLocationFound?: (coordinates: number[]) => void;
}

const UserLocationLayer = ({ map, onLocationFound }: UserLocationLayerProps) => {
  const userLocationSource = useRef(new VectorSource());

  useEffect(() => {
    const userLocationLayer = new VectorLayer({
      source: userLocationSource.current,
      style: new Style({
        image: new Circle({
          radius: 8,
          fill: new Fill({
            color: '#4299e1',
          }),
          stroke: new Stroke({
            color: '#fff',
            width: 2,
          }),
        }),
      }),
    });

    map.addLayer(userLocationLayer);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoordinates = fromLonLat([position.coords.longitude, position.coords.latitude]);
          
          const userLocationFeature = new Feature({
            geometry: new Point(userCoordinates),
            name: 'Your location'
          });
          
          userLocationSource.current.clear();
          userLocationSource.current.addFeature(userLocationFeature);

          if (onLocationFound) {
            onLocationFound(userCoordinates);
          }
        },
        () => {
          console.log('Geolocation denied or unavailable');
        }
      );
    }

    return () => {
      map.removeLayer(userLocationLayer);
    };
  }, [map, onLocationFound]);

  return null;
};

export default UserLocationLayer;