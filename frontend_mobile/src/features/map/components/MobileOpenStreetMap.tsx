import React, { useMemo, useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MapLocationItem } from '../models/map.models';
import { KENNEDY_COORDS } from '../services/map.service';

interface MobileOpenStreetMapProps {
  items: MapLocationItem[];
  selectedItem: MapLocationItem | null;
  onSelectItem: (item: MapLocationItem) => void;
  userLocation?: { lat: number; lng: number } | null;
  centerCoords?: { lat: number; lng: number; zoom?: number; key: number } | null;
  height?: number | string;
  style?: any;
}

export const MobileOpenStreetMap: React.FC<MobileOpenStreetMapProps> = ({
  items,
  selectedItem,
  onSelectItem,
  userLocation,
  centerCoords,
  height,
  style,
}) => {
  const iframeRef = useRef<any>(null);
  const [webViewError, setWebViewError] = useState(false);
  const [isWebViewLoading, setIsWebViewLoading] = useState(true);
  const [nativeMapMode, setNativeMapMode] = useState<'osm' | 'vector'>('osm');

  // Escuchar mensajes desde el iframe en Web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (data && data.type === 'SELECT_MAP_POINT' && data.id) {
            const found = items.find((it) => String(it.id) === String(data.id));
            if (found) {
              onSelectItem(found);
            }
          }
        } catch {
          // Ignorar mensajes no relacionados
        }
      };

      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, [items, onSelectItem]);

  // Manejar mensajes desde WebView en Android / iOS
  const handleWebViewMessage = (event: any) => {
    try {
      const rawData = event.nativeEvent?.data;
      const data = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
      if (data && data.type === 'SELECT_MAP_POINT' && data.id) {
        const found = items.find((it) => String(it.id) === String(data.id));
        if (found) {
          onSelectItem(found);
        }
      }
    } catch (err) {
      console.warn('Error procesando mensaje de mapa:', err);
    }
  };

  // Generar el HTML interactivo con Leaflet y OpenStreetMap Humanitario (HOT)
  const mapHtml = useMemo(() => {
    const itemsJson = JSON.stringify(
      items.map((it) => ({
        id: it.id,
        tipo: it.tipo,
        titulo: it.titulo,
        direccion: it.direccion,
        barrio: it.barrio || 'Kennedy',
        categoria: it.categoria,
        latitud: it.latitud,
        longitud: it.longitud,
        verificada: it.verificada,
        isSelected: selectedItem?.id === it.id,
      }))
    );

    const selectedId = selectedItem ? String(selectedItem.id) : '';

    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Give&Go Mapa Social</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #F8FAFC; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .custom-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid #FFFFFF;
      box-shadow: 0 4px 10px rgba(0,0,0,0.25);
      cursor: pointer;
      transition: transform 0.15s ease-in-out;
    }
    .custom-marker:hover, .custom-marker.active {
      transform: scale(1.2);
    }
    .marker-org {
      background-color: #2563EB;
      color: white;
    }
    .marker-event {
      background-color: #DC2626;
      color: white;
    }
    .marker-gps {
      background-color: #16A34A;
      color: white;
      box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7);
      animation: pulse-gps 2s infinite;
    }
    @keyframes pulse-gps {
      0% {
        box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.7);
      }
      70% {
        box-shadow: 0 0 0 12px rgba(22, 163, 74, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(22, 163, 74, 0);
      }
    }
    .leaflet-popup-content-wrapper {
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      padding: 6px;
    }
    .leaflet-popup-content {
      margin: 8px 10px;
      line-height: 1.4;
    }
    .popup-badge {
      display: inline-block;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 9999px;
      margin-bottom: 4px;
    }
    .badge-org { background: #DBEAFE; color: #1D4ED8; }
    .badge-event { background: #DCFCE7; color: #15803D; }
    .popup-title { font-weight: 800; font-size: 13px; color: #0F172A; margin-bottom: 3px; }
    .popup-desc { font-size: 11px; color: #64748B; margin-bottom: 8px; }
    .popup-btn {
      display: block;
      width: 100%;
      text-align: center;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      color: #FFFFFF;
      background-color: #DC2626;
      border: none;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    const items = ${itemsJson};
    const selectedId = "${selectedId}";

    // Inicializar el mapa centrado en la mejor coordenada disponible
    const initialLat = ${centerCoords?.lat || (selectedItem ? selectedItem.latitud : userLocation ? userLocation.lat : KENNEDY_COORDS.lat)};
    const initialLng = ${centerCoords?.lng || (selectedItem ? selectedItem.longitud : userLocation ? userLocation.lng : KENNEDY_COORDS.lng)};
    const initialZoom = ${centerCoords?.zoom || (selectedItem ? 15 : 13)};

    const map = L.map('map', {
      zoomControl: true,
      attributionControl: false
    }).setView([initialLat, initialLng], initialZoom);

    // Capa base 1: OpenStreetMap Humanitario (HOT) - 100% libre, sin API key, sin bloqueos
    const osmHot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      maxZoom: 19,
      subdomains: ['a', 'b'],
      attribution: '&copy; OpenStreetMap | HOT'
    }).addTo(map);

    // Capa base 2: Esri Calles
    const esriStreet = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: '&copy; Esri &mdash; OSM'
    });

    L.control.layers({
      '🗺️ OSM Humanitario': osmHot,
      '📍 Calles Esri': esriStreet
    }, null, { position: 'topright' }).addTo(map);

    // Marcador de Ubicación GPS (Verde) del dispositivo actual
    const userLoc = ${userLocation ? JSON.stringify(userLocation) : 'null'};
    if (userLoc && typeof userLoc.lat === 'number' && typeof userLoc.lng === 'number') {
      const gpsIcon = L.divIcon({
        className: 'custom-gps-marker',
        html: \`
          <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
            <div style="position: absolute; width: 36px; height: 36px; border-radius: 50%; background-color: rgba(16, 185, 129, 0.35); animation: pulse-gps 2s infinite;"></div>
            <div style="width: 30px; height: 30px; border-radius: 50%; background-color: #059669; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; z-index: 2;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            </div>
          </div>
        \`,
        iconSize: [36, 36],
        iconAnchor: [18, 18]
      });
      L.marker([userLoc.lat, userLoc.lng], { icon: gpsIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('<strong style="font-size:12px; color:#059669;">Tu Ubicación GPS</strong><br/><span style="font-size:10px;color:#64748B;">Dispositivo móvil actual</span>');
    }

    function notifySelect(id) {
      const payload = JSON.stringify({ type: 'SELECT_MAP_POINT', id: String(id) });
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(payload);
      }
      if (window.parent) {
        window.parent.postMessage(payload, '*');
      }
    }

    // Renderizar marcadores de Organizaciones y Convocatorias
    items.forEach(item => {
      const isOrg = item.tipo === 'organizacion';
      const isSelected = String(item.id) === selectedId;
      const size = isSelected ? 38 : 32;

      const iconHtml = isOrg
        ? \`<div style="width: \${size}px; height: \${size}px; border-radius: 50%; background-color: #2563EB; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 12px rgba(37,99,235,0.4); display: flex; align-items: center; justify-content: center; color: white; transition: transform 0.2s;\${isSelected ? ' transform: scale(1.15); ring: 3px solid #60A5FA;' : ''}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="2" width="18" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="16"/><line x1="15" y1="22" x2="15" y2="16"/><line x1="9" y1="16" x2="15" y2="16"/><path d="M9 10h.01"/><path d="M15 10h.01"/></svg>
           </div>\`
        : \`<div style="width: \${size}px; height: \${size}px; border-radius: 50%; background-color: #DC2626; border: 2.5px solid #FFFFFF; box-shadow: 0 4px 12px rgba(220,38,38,0.4); display: flex; align-items: center; justify-content: center; color: white; transition: transform 0.2s;\${isSelected ? ' transform: scale(1.15); ring: 3px solid #F87171;' : ''}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
           </div>\`;

      const icon = L.divIcon({
        className: 'custom-map-icon',
        html: iconHtml,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
      });

      const marker = L.marker([item.latitud, item.longitud], { icon }).addTo(map);

      const distanceBadge = item.distanciaKm !== undefined 
        ? \`<div style="font-size: 10px; font-weight: 700; color: #0284C7; background-color: #E0F2FE; display: inline-block; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">A \${item.distanciaKm} km de ti</div>\` 
        : '';

      const popupHtml = \`
        <div style="min-width: 170px; font-family: -apple-system, system-ui, sans-serif;">
          <div style="font-size: 9px; font-weight: 800; text-transform: uppercase; padding: 2px 6px; border-radius: 999px; display: inline-block; margin-bottom: 4px; background-color: \${isOrg ? '#DBEAFE' : '#FEE2E2'}; color: \${isOrg ? '#1D4ED8' : '#B91C1C'};">
            \${isOrg ? '🏢 Sede Organización' : '📅 Evento Solidario'}
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0F172A; line-height: 1.25; margin-bottom: 3px;">\${item.titulo}</div>
          <div style="font-size: 10px; color: #64748B; margin-bottom: 4px;">📍 \${item.direccion || 'Kennedy, Bogotá'} • \${item.barrio || 'Kennedy'}</div>
          \${distanceBadge}
          <button style="width: 100%; border: none; background-color: \${isOrg ? '#2563EB' : '#DC2626'}; color: white; font-size: 11px; font-weight: 700; padding: 6px 10px; border-radius: 6px; cursor: pointer; margin-top: 4px;" onclick="notifySelect('\${item.id}')">
            Ver Detalles y Acciones
          </button>
        </div>
      \`;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        notifySelect(item.id);
      });

      if (isSelected) {
        marker.openPopup();
      }
    });

    ${
      centerCoords
        ? `map.setView([${centerCoords.lat}, ${centerCoords.lng}], ${centerCoords.zoom || 15}, { animate: true });`
        : ''
    }
  </script>
</body>
</html>`;
  }, [items, selectedItem, userLocation, centerCoords]);

  // Proyección de coordenadas para mapa vectorial nativo (Kennedy, Bogotá)
  const getVectorPosition = (lat: number, lng: number) => {
    const minLat = 4.580;
    const maxLat = 4.655;
    const minLng = -74.195;
    const maxLng = -74.125;

    const clampedLat = Math.min(Math.max(lat, minLat), maxLat);
    const clampedLng = Math.min(Math.max(lng, minLng), maxLng);

    const leftPct = ((clampedLng - minLng) / (maxLng - minLng)) * 100;
    const topPct = ((maxLat - clampedLat) / (maxLat - minLat)) * 100;

    return {
      left: `${Math.max(6, Math.min(90, leftPct))}%`,
      top: `${Math.max(8, Math.min(86, topPct))}%`,
    };
  };

  // Renderizado de mapa vectorial nativo
  const renderNativeVectorMap = () => (
    <View style={styles.vectorCanvas}>
      {/* Fondo de cuadrícula urbana / barrios de Kennedy */}
      <View style={styles.gridLayer}>
        <View style={styles.roadAmericas}>
          <Text style={styles.roadLabel}>Av. Las Américas</Text>
        </View>
        <View style={styles.roadBoyaca}>
          <Text style={styles.roadLabelVertical}>Av. Boyacá</Text>
        </View>
        <View style={styles.roadCali}>
          <Text style={styles.roadLabelVertical}>Av. Ciudad de Cali</Text>
        </View>
        <View style={styles.roadPrimeroMayo}>
          <Text style={styles.roadLabel}>Av. 1ro de Mayo</Text>
        </View>
      </View>

      {/* Marcador GPS del Usuario (Verde) */}
      {userLocation && (
        <View
          style={[
            styles.gpsMarkerWrapper,
            getVectorPosition(userLocation.lat, userLocation.lng) as any,
          ]}
        >
          <View style={styles.gpsPulse} />
          <View style={styles.gpsDot}>
            <Text style={styles.gpsMarkerIcon}>📍</Text>
          </View>
        </View>
      )}

      {/* Marcadores de Organizaciones (Azul) y Eventos (Rojo) */}
      {items.map((item) => {
        const isOrg = item.tipo === 'organizacion';
        const isSelected = selectedItem?.id === item.id;
        const pos = getVectorPosition(item.latitud, item.longitud);

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => onSelectItem(item)}
            activeOpacity={0.8}
            style={[
              styles.vectorMarker,
              pos as any,
              isOrg ? styles.markerOrg : styles.markerEvent,
              isSelected && styles.markerActive,
            ]}
          >
            <Text style={styles.markerEmoji}>{isOrg ? '🏢' : '📅'}</Text>
          </TouchableOpacity>
        );
      })}

      {/* Botón para alternar a OpenStreetMap si estaba en vector */}
      <View style={styles.vectorMapOverlay}>
        <TouchableOpacity
          style={styles.switchModeBtn}
          onPress={() => {
            setWebViewError(false);
            setNativeMapMode('osm');
          }}
        >
          <Text style={styles.switchModeBtnText}>Cargar OpenStreetMap</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, style, height !== undefined ? { height: height as any } : { flex: 1 }]}>
      {Platform.OS === 'web' ? (
        <iframe
          ref={iframeRef}
          srcDoc={mapHtml}
          title="Give&Go Mapa Social Kennedy"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#F8FAFC',
          }}
        />
      ) : !webViewError && nativeMapMode === 'osm' ? (
        <View style={{ flex: 1 }}>
          <WebView
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            style={{ width: '100%', height: '100%', backgroundColor: '#F8FAFC' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowFileAccess={true}
            allowUniversalAccessFromFileURLs={true}
            mixedContentMode="always"
            startInLoadingState={true}
            scalesPageToFit={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#2563EB" />
                <Text style={styles.loadingText}>Cargando mapa en dispositivo móvil...</Text>
              </View>
            )}
            onError={(syntheticEvent) => {
              console.warn('Error cargando WebView en dispositivo móvil:', syntheticEvent.nativeEvent);
              setWebViewError(true);
            }}
            onMessage={handleWebViewMessage}
          />
        </View>
      ) : (
        renderNativeVectorMap()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    gap: 8,
    zIndex: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  vectorCanvas: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
  },
  gridLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  roadAmericas: {
    position: 'absolute',
    top: '25%',
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#E2E8F0',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  roadPrimeroMayo: {
    position: 'absolute',
    bottom: '28%',
    left: 0,
    right: 0,
    height: 14,
    backgroundColor: '#E2E8F0',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  roadBoyaca: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '35%',
    width: 14,
    backgroundColor: '#E2E8F0',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadCali: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '22%',
    width: 14,
    backgroundColor: '#E2E8F0',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadLabel: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  roadLabelVertical: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
    transform: [{ rotate: '90deg' }],
    width: 80,
    textAlign: 'center',
  },
  vectorMarker: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    transform: [{ translateX: -16 }, { translateY: -16 }],
    zIndex: 5,
  },
  markerOrg: {
    backgroundColor: '#2563EB',
  },
  markerEvent: {
    backgroundColor: '#DC2626',
  },
  markerActive: {
    transform: [{ translateX: -18 }, { translateY: -18 }, { scale: 1.25 }],
    borderColor: '#FEF08A',
    borderWidth: 2.5,
    zIndex: 10,
  },
  markerEmoji: {
    fontSize: 14,
  },
  gpsMarkerWrapper: {
    position: 'absolute',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -16 }, { translateY: -16 }],
    zIndex: 15,
  },
  gpsPulse: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(22, 163, 74, 0.35)',
  },
  gpsDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  gpsMarkerIcon: {
    fontSize: 11,
  },
  vectorMapOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 20,
  },
  switchModeBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  switchModeBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
});
