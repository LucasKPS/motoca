'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// HACK: Workaround for a leaflet issue with webpack
// https://github.com/Leaflet/Leaflet/issues/4968
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

const Map = () => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !mapRef.current) {
      L.Marker.prototype.options.icon = L.icon({
        iconUrl: iconUrl.src,
        iconRetinaUrl: iconRetinaUrl.src,
        shadowUrl: shadowUrl.src,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const map = L.map(containerRef.current, {
        center: [-23.0333, -45.55],
        zoom: 13,
        scrollWheelZoom: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      map.locate({ setView: true, maxZoom: 16 });

      function onLocationFound(e: L.LocationEvent) {
        const radius = e.accuracy;

        L.marker(e.latlng).addTo(map)
          .bindPopup("You are within " + radius + " meters from this point").openPopup();

        L.circle(e.latlng, radius).addTo(map);
      }

      map.on('locationfound', onLocationFound);


      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} style={{ height: '100%', width: '100%' }} />;
};

export default Map;
