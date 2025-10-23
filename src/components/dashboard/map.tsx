'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { merchants } from '@/lib/merchants';

// Corrige o problema com o ícone padrão do marcador
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

const Map = () => {
  return (
    <MapContainer center={[-23.5505, -46.6333]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {merchants.map(merchant => (
        <Marker key={merchant.id} position={[merchant.latitude, merchant.longitude]}>
          <Popup>
            {merchant.name}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
