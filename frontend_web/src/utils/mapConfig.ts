import L from 'leaflet';

/**
 * Configuración centralizada de mapas para Give&Go.
 * Utiliza OpenStreetMap Humanitario (HOT) y Esri World Street Map.
 * Son capas 100% gratuitas, de acceso público, sin requerimiento de API Key y sin marcas de agua ni bloqueos HTTP 403.
 */

export const MAP_CONFIG = {
  defaultCoords: {
    lat: 4.6215,
    lng: -74.1280,
    zoom: 13,
    locality: 'Kennedy, Bogotá D.C.'
  },
  // OpenStreetMap Humanitario (HOT) - Ideal para proyectos sociales y comunitarios
  osmHot: {
    name: 'OpenStreetMap Humanitario',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    options: {
      subdomains: ['a', 'b'],
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors | Tiles: <a href="https://www.hotosm.org/" target="_blank" rel="noopener">HOT</a>',
    }
  },
  // Esri World Street Map - Calles y avenidas nítidas de alta disponibilidad
  esriStreet: {
    name: 'Esri Calles y Avenidas',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    options: {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.esri.com" target="_blank" rel="noopener">Esri</a> &mdash; OpenStreetMap &amp; contributors',
    }
  },
  // OpenStreetMap Francia - Servidor de respaldo de alto rendimiento
  osmFr: {
    name: 'OpenStreetMap Estándar',
    url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
    options: {
      subdomains: ['a', 'b', 'c'],
      maxZoom: 20,
      attribution: '&copy; OpenStreetMap France | &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
    }
  }
};

/**
 * Crea la capa de mosaicos por defecto (OpenStreetMap Humanitario HOT).
 * No requiere API key y no tiene bloqueos.
 */
export const createAppTileLayer = (): L.TileLayer => {
  return L.tileLayer(MAP_CONFIG.osmHot.url, MAP_CONFIG.osmHot.options);
};

/**
 * Crea un control de capas base para permitir al usuario cambiar de estilo de mapa.
 */
export const createBaseTileLayers = () => {
  const hotLayer = L.tileLayer(MAP_CONFIG.osmHot.url, MAP_CONFIG.osmHot.options);
  const esriLayer = L.tileLayer(MAP_CONFIG.esriStreet.url, MAP_CONFIG.esriStreet.options);
  const osmFrLayer = L.tileLayer(MAP_CONFIG.osmFr.url, MAP_CONFIG.osmFr.options);

  return {
    defaultLayer: hotLayer,
    baseMaps: {
      '🗺️ OpenStreetMap Humanitario': hotLayer,
      '📍 Calles y Avenidas (Esri)': esriLayer,
      '🌐 OpenStreetMap Estándar': osmFrLayer
    }
  };
};

/**
 * Icono interactivo personalizado para selección de coordenadas (LocationPicker).
 * Basado en SVG puro para evitar problemas con rutas de imágenes estáticas en Vite.
 */
export const createLocationPickerIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-picker-pin-wrapper',
    html: `
      <div class="relative flex items-center justify-center transform -translate-x-1/2 -translate-y-full group cursor-grab active:cursor-grabbing">
        <div class="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-red-500/20 transition-transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="absolute -bottom-1 w-3 h-1.5 bg-neutral-900/30 rounded-full blur-[1px]"></div>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
  });
};

/**
 * Icono para eventos solidarios en el mapa (Rojo).
 */
export const createEventMarkerIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-event-marker-wrapper',
    html: `
      <div class="w-9 h-9 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all cursor-pointer ring-2 ring-red-400/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
          <line x1="16" x2="16" y1="2" y2="6"/>
          <line x1="8" x2="8" y1="2" y2="6"/>
          <line x1="3" x2="21" y1="10" y2="10"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

/**
 * Icono para sedes de organizaciones sociales en el mapa (Azul).
 */
export const createOrgMarkerIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-org-marker-wrapper',
    html: `
      <div class="w-9 h-9 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all cursor-pointer ring-2 ring-blue-400/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="2" width="18" height="20" rx="2" ry="2"/>
          <line x1="9" y1="22" x2="9" y2="16"/>
          <line x1="15" y1="22" x2="15" y2="16"/>
          <line x1="9" y1="16" x2="15" y2="16"/>
          <path d="M9 10h.01"/>
          <path d="M15 10h.01"/>
          <path d="M9 14h.01"/>
          <path d="M15 14h.01"/>
          <path d="M9 6h.01"/>
          <path d="M15 6h.01"/>
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

/**
 * Icono para la ubicación actual del dispositivo/GPS (Verde).
 */
export const createUserLocationMarkerIcon = (): L.DivIcon => {
  return L.divIcon({
    className: 'custom-gps-marker-wrapper',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="absolute w-8 h-8 rounded-full bg-emerald-500 animate-ping opacity-45"></div>
        <div class="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all cursor-pointer ring-2 ring-emerald-400/40 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="3 11 22 2 13 21 11 13 3 11"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

