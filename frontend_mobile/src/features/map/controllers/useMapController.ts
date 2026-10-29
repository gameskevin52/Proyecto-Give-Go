import { useState, useEffect, useMemo, useCallback } from 'react';
import { mapService, KENNEDY_COORDS, calculateDistance } from '../services/map.service';
import { MapLocationItem } from '../models/map.models';

export function useMapController(navigation?: any) {
  const [items, setItems] = useState<MapLocationItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MapLocationItem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'organizacion' | 'evento'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(0); // 0 = all
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [centerCoords, setCenterCoords] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
    key: number;
  } | null>(null);

  // Solicitar ubicación GPS del dispositivo actual
  const requestUserLocation = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setUserLocation(coords);
          setIsLocating(false);
          setCenterCoords({
            lat: coords.lat,
            lng: coords.lng,
            zoom: 15,
            key: Date.now(),
          });
        },
        (err) => {
          console.warn('GPS no disponible o denegado, usando coordenadas de referencia:', err);
          setUserLocation({
            lat: KENNEDY_COORDS.lat,
            lng: KENNEDY_COORDS.lng,
          });
          setIsLocating(false);
          setCenterCoords({
            lat: KENNEDY_COORDS.lat,
            lng: KENNEDY_COORDS.lng,
            zoom: 14,
            key: Date.now(),
          });
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setUserLocation({
        lat: KENNEDY_COORDS.lat,
        lng: KENNEDY_COORDS.lng,
      });
      setCenterCoords({
        lat: KENNEDY_COORDS.lat,
        lng: KENNEDY_COORDS.lng,
        zoom: 14,
        key: Date.now(),
      });
    }
  }, []);

  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const refLat = userLocation ? userLocation.lat : KENNEDY_COORDS.lat;
      const refLng = userLocation ? userLocation.lng : KENNEDY_COORDS.lng;
      const data = await mapService.getMapPoints(refLat, refLng);
      setItems(data);
      if (data.length > 0 && !selectedItem) {
        setSelectedItem(data[0]);
      }
    } catch (err) {
      console.error('Error fetching map points:', err);
    } finally {
      setIsLoading(false);
    }
  }, [userLocation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract distinct categories from events
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    items.forEach((it) => {
      if (it.categoria && it.categoria.trim()) {
        cats.add(it.categoria.trim());
      }
    });
    return Array.from(cats).sort();
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Type filter
      if (filterType !== 'all' && item.tipo !== filterType) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all') {
        if (item.tipo === 'evento') {
          if (!item.categoria || item.categoria.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        } else if (item.tipo === 'organizacion') {
          // If filtering specifically by category, hide orgs when in 'all' mode or if org category doesn't match
          if (filterType === 'all') {
            return false;
          }
          if (!item.categoria || item.categoria.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }
      }

      // 3. Distance filter (0 = all / sin límite)
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

  // Closest item (headquarters or event) based on distance
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
    requestUserLocation();
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
    items: filteredItems,
    allItems: items,
    allItemsCount: items.length,
    orgsCount,
    eventsCount,
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
    requestUserLocation,
    isFilterModalVisible,
    setIsFilterModalVisible,
    refresh: loadData,
    handleSelectItem,
    handleDonateToOrg,
    handleViewEvent,
  };
}
