import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { createAppTileLayer, createEventMarkerIcon } from '../utils/mapConfig';

interface EventLocationMapProps {
  lat: number;
  lng: number;
  title: string;
}

export const EventLocationMap: React.FC<EventLocationMapProps> = ({ lat, lng, title }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) return;

    // Initialize map
    const map = L.map(containerRef.current, {
      zoomControl: true,
      dragging: true,
      scrollWheelZoom: false,
    }).setView([lat, lng], 15);

    mapRef.current = map;

    // Add Reliable Tile Layer
    createAppTileLayer().addTo(map);

    // Add Custom Marker
    L.marker([lat, lng], { icon: createEventMarkerIcon() })
      .addTo(map)
      .bindPopup(`<strong class="text-xs font-bold text-neutral-900">${title}</strong><br/><span class="text-[11px] text-neutral-500">Ubicación del evento solidario</span>`)
      .openPopup();

    // Invalidate size once to guarantee it renders correctly if container resized
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lng, title]);

  return (
    <div className="relative border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
      <div ref={containerRef} className="w-full h-48 z-0" />
    </div>
  );
};
