import { useState, useEffect, useMemo, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import { mapService, KENNEDY_COORDS, calculateDistance } from '../services/map.service';
import { MapLocationItem } from '../models/map.models';
import { useAuth } from '../../../store/auth/AuthContext';

export type MapFilterType =
  | 'all'
  | 'organizacion'
  | 'evento'
  | 'evento_beneficiarios'
  | 'evento_voluntarios';

export function useMapController(navigation?: any) {
  const { user } = useAuth();
  const viewerRole = (user?.rol || '').toLowerCase();
  const isBeneficiary = viewerRole === 'beneficiario';
  const isVolunteer = viewerRole === 'voluntario';

  const [rawItems, setRawItems] = useState<MapLocationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MapLocationItem | null>(null);
  const [filterType, setFilterType] = useState<MapFilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(0); // 0 = all
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [centerCoords, setCenterCoords] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
    key: number;
  } | null>(null);

  // Solicitar ubicación GPS real con permiso nativo en Android/iOS o navegador en Web
  const requestUserLocation = useCallback(async (showAlertOnDeny = false) => {
    setIsLocating(true);
    setLocationError(null);

    try {
      if (Platform.OS === 'web') {
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
          const coords = await new Promise<{ lat: number; lng: number }>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (pos) =>
                resolve({
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude,
                }),
              (err) => reject(err),
              { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
            );
          });
          setUserLocation(coords);
          setCenterCoords({
            lat: coords.lat,
            lng: coords.lng,
            zoom: 15,
            key: Date.now(),
          });
          return;
        }
        throw new Error('Geolocalización no disponible en este navegador.');
      }

      // Nativo Android / iOS usando expo-location
      const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permiso de ubicación denegado. Actívalo para ver tu marcador rojo en el mapa.');
        if (showAlertOnDeny) {
          Alert.alert(
            'Permiso de Ubicación Requerido',
            canAskAgain
              ? 'Give&Go necesita acceso a tu ubicación para mostrar tu posición actual (punto rojo) y calcular la distancia a los eventos cercanos.'
              : 'El permiso de ubicación está desactivado. Puedes habilitarlo desde la configuración de tu dispositivo.',
            [
              { text: 'Cancelar', style: 'cancel' },
              ...(!canAskAgain
                ? [{ text: 'Abrir Ajustes', onPress: () => Linking.openSettings?.() }]
                : [{ text: 'Reintentar', onPress: () => requestUserLocation(false) }]),
            ]
          );
        }
        return;
      }

      let coords: { lat: number; lng: number } | null = null;
      try {
        const currentPos = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        coords = {
          lat: currentPos.coords.latitude,
          lng: currentPos.coords.longitude,
        };
      } catch {
        const lastKnown = await Location.getLastKnownPositionAsync();
        if (lastKnown) {
          coords = {
            lat: lastKnown.coords.latitude,
            lng: lastKnown.coords.longitude,
          };
        }
      }

      if (coords) {
        setUserLocation(coords);
        setCenterCoords({
          lat: coords.lat,
          lng: coords.lng,
          zoom: 15,
          key: Date.now(),
        });
      } else {
        setLocationError('No se pudo obtener señal GPS. Verifica que el GPS del teléfono esté activado.');
        if (showAlertOnDeny) {
          Alert.alert(
            'Señal GPS no disponible',
            'Asegúrate de tener la ubicación del dispositivo activada e inténtalo nuevamente.'
          );
        }
      }
    } catch (err: any) {
      console.warn('GPS no disponible o permiso denegado:', err?.message || err);
      setLocationError('Activa el permiso de ubicación para mostrar tu ubicación actual en rojo.');
      if (showAlertOnDeny && Platform.OS !== 'web') {
        Alert.alert(
          'Ubicación no disponible',
          'No pudimos acceder a tu GPS. Revisa los permisos de ubicación de la aplicación.'
        );
      }
    } finally {
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    requestUserLocation(false);
  }, [requestUserLocation]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mapService.getMapPoints(KENNEDY_COORDS.lat, KENNEDY_COORDS.lng);
      setRawItems(data);
    } catch (err) {
      console.error('Error fetching map points:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Recalcular distancias y filtrar estrictamente según el rol del usuario
  const items = useMemo(() => {
    const refLat = userLocation ? userLocation.lat : KENNEDY_COORDS.lat;
    const refLng = userLocation ? userLocation.lng : KENNEDY_COORDS.lng;

    return rawItems
      .filter((item) => {
        if (isBeneficiary) {
          // Beneficiario solo ve eventos habilitados para beneficiarios (nunca sedes ni eventos solo-voluntarios)
          if (item.tipo !== 'evento') return false;
          const aud = item.publicoObjetivo || 'ambos';
          return aud === 'beneficiarios' || aud === 'ambos';
        }
        if (isVolunteer) {
          if (item.tipo === 'evento') {
            const aud = item.publicoObjetivo || 'ambos';
            return aud === 'voluntarios' || aud === 'ambos';
          }
          return true;
        }
        return true;
      })
      .map((item) => ({
        ...item,
        distanciaKm: calculateDistance(refLat, refLng, item.latitud, item.longitud),
      }));
  }, [rawItems, userLocation, isBeneficiary, isVolunteer]);

  // Ajustar filtro inicial / selección por defecto cuando cambia el rol o llegan datos
  useEffect(() => {
    if (isBeneficiary && (filterType === 'organizacion' || filterType === 'evento_voluntarios')) {
      setFilterType('all');
    }
    if (isVolunteer && filterType === 'evento_beneficiarios') {
      setFilterType('all');
    }
  }, [isBeneficiary, isVolunteer, filterType]);

  useEffect(() => {
    if (items.length === 0) {
      setSelectedItem(null);
      return;
    }
    if (!selectedItem || !items.some((it) => String(it.id) === String(selectedItem.id))) {
      setSelectedItem(items[0]);
    } else {
      const updated = items.find((it) => String(it.id) === String(selectedItem.id));
      if (updated && updated.distanciaKm !== selectedItem.distanciaKm) {
        setSelectedItem(updated);
      }
    }
  }, [items, selectedItem]);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((it) => {
      if (it.categoria && it.categoria.trim()) {
        cats.add(it.categoria.trim());
      }
    });
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Type / Audience filter
      if (filterType === 'organizacion' && item.tipo !== 'organizacion') {
        return false;
      }
      if (filterType === 'evento' && item.tipo !== 'evento') {
        return false;
      }
      if (filterType === 'evento_beneficiarios') {
        if (item.tipo !== 'evento') return false;
        const aud = item.publicoObjetivo || 'ambos';
        if (aud !== 'beneficiarios' && aud !== 'ambos') return false;
      }
      if (filterType === 'evento_voluntarios') {
        if (item.tipo !== 'evento') return false;
        const aud = item.publicoObjetivo || 'ambos';
        if (aud !== 'voluntarios' && aud !== 'ambos') return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        if (item.tipo === 'evento') {
          if (!item.categoria || item.categoria.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        } else if (item.tipo === 'organizacion') {
          if (filterType === 'all') {
            return false;
          }
          if (!item.categoria || item.categoria.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }
      }

      // 3. Distance filter
      if (maxDistance > 0 && item.distanciaKm !== undefined && item.distanciaKm > maxDistance) {
        return false;
      }

      // 4. Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.titulo.toLowerCase().includes(query);
        const matchBarrio = item.barrio?.toLowerCase().includes(query) || false;
        const matchLoc = item.localidad?.toLowerCase().includes(query) || false;
        const matchDir = item.direccion.toLowerCase().includes(query);
        if (!matchTitle && !matchBarrio && !matchLoc && !matchDir) {
          return false;
        }
      }

      return true;
    });
  }, [items, filterType, selectedCategory, maxDistance, searchQuery]);

  const resetFilters = useCallback(() => {
    setFilterType('all');
    setSelectedCategory('all');
    setMaxDistance(0);
    setSearchQuery('');
  }, []);

  const closestItem = useMemo(() => {
    if (items.length === 0) return null;
    const sorted = [...items].sort((a, b) => {
      const distA = a.distanciaKm !== undefined ? a.distanciaKm : 9999;
      const distB = b.distanciaKm !== undefined ? b.distanciaKm : 9999;
      return distA - distB;
    });
    return sorted[0] || null;
  }, [items]);

  const orgsCount = useMemo(
    () => items.filter((i) => i.tipo === 'organizacion').length,
    [items]
  );
  const eventsCount = useMemo(
    () => items.filter((i) => i.tipo === 'evento').length,
    [items]
  );
  const beneficiaryEventsCount = useMemo(
    () =>
      items.filter((i) => {
        if (i.tipo !== 'evento') return false;
        if (isBeneficiary) return true;
        return i.publicoObjetivo === 'beneficiarios';
      }).length,
    [items, isBeneficiary]
  );
  const volunteerEventsCount = useMemo(
    () =>
      items.filter((i) => {
        if (i.tipo !== 'evento') return false;
        if (isBeneficiary) return false;
        return isVolunteer || i.publicoObjetivo !== 'beneficiarios';
      }).length,
    [items, isBeneficiary, isVolunteer]
  );

  const focusOnItem = useCallback((item: MapLocationItem) => {
    setSelectedItem(item);
    setCenterCoords({
      lat: item.latitud,
      lng: item.longitud,
      zoom: 15,
      key: Date.now(),
    });
  }, []);

  const focusOnClosestItem = useCallback(() => {
    if (closestItem) {
      focusOnItem(closestItem);
    }
  }, [closestItem, focusOnItem]);

  const focusOnUserLocation = useCallback(() => {
    requestUserLocation(true);
  }, [requestUserLocation]);

  const handleSelectItem = (item: MapLocationItem) => {
    setSelectedItem(item);
    setCenterCoords({
      lat: item.latitud,
      lng: item.longitud,
      zoom: 15,
      key: Date.now(),
    });
  };

  const handleDonateToOrg = (orgId: string | number) => {
    if (navigation?.navigate) {
      navigation.navigate('CreateDonation', { defaultOrgId: orgId });
    }
  };

  const handleViewEvent = (eventId: string | number) => {
    if (navigation?.navigate) {
      const idNum = typeof eventId === 'string' ? parseInt(eventId.replace('evt_', ''), 10) || 1 : eventId;
      navigation.navigate('EventDetail', { eventId: idNum });
    }
  };

  return {
    viewerRole,
    isBeneficiary,
    isVolunteer,
    items: filteredItems,
    allItems: items,
    allItemsCount: items.length,
    orgsCount,
    eventsCount,
    beneficiaryEventsCount,
    volunteerEventsCount,
    closestItem,
    selectedItem,
    setSelectedItem,
    centerCoords,
    setCenterCoords,
    focusOnItem,
    focusOnClosestItem,
    focusOnUserLocation,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    maxDistance,
    setMaxDistance,
    selectedCategory,
    setSelectedCategory,
    availableCategories,
    resetFilters,
    viewMode,
    setViewMode,
    isLoading,
    userLocation,
    isLocating,
    locationError,
    requestUserLocation,
    isFilterModalVisible,
    setIsFilterModalVisible,
    refresh: loadData,
    handleSelectItem,
    handleDonateToOrg,
    handleViewEvent,
  };
}
