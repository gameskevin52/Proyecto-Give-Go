import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../store/auth/AuthContext';
import { HomeService } from '../services/home.service';
import { HomeSummaryStats, HomeEventPreview, HomeQuickAction } from '../models/home.models';

export function useHomeController(navigation?: any) {
  const { user } = useAuth();
  const [stats, setStats] = useState<HomeSummaryStats>({
    voluntariosCount: 0,
    eventosActivosCount: 0,
    donacionesCount: 0,
    beneficiariosImpactados: 0,
  });
  const [featuredEvents, setFeaturedEvents] = useState<HomeEventPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statsData, eventsData] = await Promise.all([
        HomeService.getSummaryStats(),
        HomeService.getFeaturedEvents(),
      ]);
      setStats(statsData);
      setFeaturedEvents(eventsData);
    } catch (err) {
      console.error('Error loading home data:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const quickActions: HomeQuickAction[] = [
    {
      id: 'map',
      title: 'Mapa Social',
      subtitle: 'Causas y fundaciones en Kennedy',
      iconName: 'map-pin',
      color: '#0284C7',
      route: 'Mapa',
    },
    {
      id: 'dashboard',
      title: 'Panel de Control',
      subtitle: 'Métricas, impacto y auditoría',
      iconName: 'layout-dashboard',
      color: '#7C3AED',
      route: 'Dashboard',
    },
    {
      id: 'events',
      title: 'Convocatorias',
      subtitle: 'Voluntariado y ayuda social',
      iconName: 'calendar',
      color: '#DC2626',
      route: 'Eventos',
    },
    {
      id: 'donations',
      title: 'Donaciones',
      subtitle: 'Aporta a causas solidarias',
      iconName: 'heart',
      color: '#16A34A',
      route: 'Donaciones',
    },
    {
      id: 'profile',
      title: 'Mi Perfil',
      subtitle: 'Certificados y configuración',
      iconName: 'user',
      color: '#4B5563',
      route: 'Perfil',
    },
  ];

  const handleActionPress = (action: HomeQuickAction) => {
    if (navigation?.navigate) {
      navigation.navigate(action.route);
    }
  };

  const handleEventPress = (eventId: string) => {
    if (navigation?.navigate) {
      const idNum = typeof eventId === 'string' ? parseInt(eventId.replace('evt_', ''), 10) || 1 : eventId;
      navigation.navigate('EventDetail', { eventId: idNum });
    }
  };

  return {
    user,
    stats,
    featuredEvents,
    quickActions,
    isLoading,
    refreshing,
    onRefresh,
    handleActionPress,
    handleEventPress,
  };
}

export default useHomeController;
