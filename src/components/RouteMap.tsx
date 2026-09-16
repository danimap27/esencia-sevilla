'use client';

import { useEffect, useRef } from 'react';

interface MapStop {
  name: string;
  lat: number;
  lng: number;
}

/**
 * Mapa Leaflet con TODAS las paradas de una ruta:
 * markers numerados, línea del recorrido y popups con enlace a Google Maps.
 */
export default function RouteMap({ stops }: { stops: MapStop[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (!mapRef.current || leafletMapRef.current) return;

      delete (L.Icon.Default.prototype as Record<string, unknown>)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });

      const first = stops[0];
      const map = L.map(mapRef.current, { center: [first.lat, first.lng], zoom: 14, zoomControl: true });
      leafletMapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const coords: [number, number][] = [];

      stops.forEach((stop, i) => {
        coords.push([stop.lat, stop.lng]);
        const isStart = i === 0;
        const icon = L.divIcon({
          html: isStart
            ? `<div style="background:#C25A3A;color:white;width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);font-size:15px;">
                <span style="transform:rotate(45deg)">🏠</span></div>`
            : `<div style="background:#2A5A8C;color:white;width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:13px;font-weight:700;">${i + 1}</div>`,
          className: '',
          iconSize: isStart ? [34, 34] : [30, 30],
          iconAnchor: isStart ? [17, 34] : [15, 15],
          popupAnchor: isStart ? [0, -38] : [0, -18],
        });

        L.marker([stop.lat, stop.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<div style="min-width:170px;">
              <strong style="font-size:13px;">${i + 1}. ${stop.name}</strong><br/>
              <a href="https://maps.google.com/?q=${stop.lat},${stop.lng}" target="_blank" rel="noopener"
                 style="font-size:12px;color:#2A5A8C;text-decoration:none;">🗺️ Google Maps</a>
            </div>`
          );
      });

      // Línea del recorrido
      if (coords.length > 1) {
        L.polyline(coords, { color: '#C25A3A', weight: 3, opacity: 0.75, dashArray: '6 6' }).addTo(map);
        map.fitBounds(L.latLngBounds(coords), { padding: [40, 40] });
      }

      // Etiqueta flotante "Punto de partida"
      L.control.scale({ imperial: false }).addTo(map);
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={mapRef}
      className="w-full h-full rounded-2xl overflow-hidden"
      style={{ minHeight: '320px' }}
      aria-label="Mapa de la ruta"
    />
  );
}
