import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Trip } from '../types';

// Fix for default marker icons in Leaflet with React
const icon = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconShadow = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  trip: Trip;
}

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export const MapView: React.FC<MapViewProps> = ({ trip }) => {
  const allActivities = trip.days.flatMap(d => d.activities);
  
  if (allActivities.length === 0) return null;

  const center: [number, number] = [allActivities[0].lat, allActivities[0].lng];

  return (
    <div className="h-[400px] w-full rounded-xl overflow-hidden shadow-md border border-black/5">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={12} />
        {trip.days.map((day) => (
          day.activities.map((activity, idx) => (
            <Marker key={`${day.day}-${idx}`} position={[activity.lat, activity.lng]}>
              <Popup>
                <div className="p-1">
                  <p className="font-bold text-sm">{activity.name}</p>
                  <p className="text-xs text-gray-600">{activity.time}</p>
                  <p className="text-xs mt-1">{activity.description}</p>
                </div>
              </Popup>
            </Marker>
          ))
        ))}
      </MapContainer>
    </div>
  );
};
