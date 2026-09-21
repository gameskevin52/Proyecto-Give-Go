import { apiClient } from '../../../services/api/apiClient';
import { MapLocationItem } from '../models/map.models';

// Haversine formula to compute distance in km
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

// Kennedy reference centroid
export const KENNEDY_COORDS = {
  lat: 4.6215,
  lng: -74.128,
};

export const mapService = {
  async getMapPoints(userLat?: number, userLng?: number): Promise<MapLocationItem[]> {
    const points: MapLocationItem[] = [];

    try {
      // 1. Fetch Organizations
      const orgsRes = await apiClient.get('/organizations');
      const orgs = orgsRes.data?.data || [];

      orgs.forEach((org: any, idx: number) => {
        // Use coordinates or spread around Kennedy center for realistic visualization
        const lat = org.latitud
          ? parseFloat(org.latitud)
          : KENNEDY_COORDS.lat + ((idx % 5) - 2) * 0.008;
        const lng = org.longitud
          ? parseFloat(org.longitud)
          : KENNEDY_COORDS.lng + (((idx * 2) % 5) - 2) * 0.008;

        const dist =
          userLat && userLng
            ? calculateDistance(userLat, userLng, lat, lng)
            : calculateDistance(KENNEDY_COORDS.lat, KENNEDY_COORDS.lng, lat, lng);

        points.push({
          id: org.id_organizacion || org.id || `org_${idx}`,
          tipo: 'organizacion',
          titulo: org.nombre || 'Organización Social',
          subtitulo: org.descripcion || 'Entidad sin ánimo de lucro',
          categoria: org.categoria || 'Comunitaria',
          direccion: org.direccion || 'Sede Local Kennedy',
          barrio: org.barrio || 'Timiza',
          localidad: org.localidad || 'Kennedy',
          ciudad: org.ciudad || 'Bogotá',
          latitud: lat,
          longitud: lng,
          telefono: org.telefono,
          correo: org.correo,
          verificada: !!org.verificada,
          distanciaKm: dist,
        });
      });
    } catch (e) {
      console.warn('Error fetching organizations for map:', e);
    }

    try {
      // 2. Fetch Events
      const evtsRes = await apiClient.get('/events');
      const evts = evtsRes.data?.data || [];

      evts.forEach((evt: any, idx: number) => {
        const lat = evt.latitud
          ? parseFloat(evt.latitud)
          : KENNEDY_COORDS.lat + (((idx + 2) % 6) - 2.5) * 0.007;
        const lng = evt.longitud
          ? parseFloat(evt.longitud)
          : KENNEDY_COORDS.lng + (((idx * 3 + 1) % 6) - 2.5) * 0.007;

        const dist =
          userLat && userLng
            ? calculateDistance(userLat, userLng, lat, lng)
            : calculateDistance(KENNEDY_COORDS.lat, KENNEDY_COORDS.lng, lat, lng);

        points.push({
          id: evt.id_evento || evt.id || `evt_${idx}`,
          tipo: 'evento',
          titulo: evt.nombre || evt.titulo || 'Jornada Social',
          subtitulo: evt.descripcion || 'Convocatoria comunitaria abierta',
          categoria: evt.categoria || evt.nombre_categoria || 'Social',
          direccion: evt.direccion || evt.nombre_lugar || 'Punto de Encuentro',
          barrio: evt.barrio || 'Castilla',
          localidad: evt.localidad || 'Kennedy',
          ciudad: evt.ciudad || 'Bogotá',
          latitud: lat,
          longitud: lng,
          cupos_disponibles: evt.cupos_disponibles ?? evt.vacantesVoluntarios ?? 15,
          fecha: evt.fecha || evt.fecha_inicio,
          hora: evt.hora_inicio || '08:00',
          ayuda_ofrecida: evt.ayudaOfrecida || evt.ayuda_ofrecida,
          distanciaKm: dist,
        });
      });
    } catch (e) {
      console.warn('Error fetching events for map:', e);
    }

    return points;
  },
};
