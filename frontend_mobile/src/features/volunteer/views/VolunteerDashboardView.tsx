import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Calendar,
  MapPin,
  Heart,
  Award,
  Search,
  LogOut,
  Clock,
  Tag,
  Building2,
  Eye,
  Compass,
  Plus,
} from 'lucide-react-native';
import { useAuth } from '../../../store/auth/AuthContext';
import { colors } from '../../../config/theme';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';
import { AdminStatCard } from '../../admin/components/AdminStatCard';
import { AdminDonationCard } from '../../admin/components/AdminDonationCard';
import { DonationDetailModal } from '../../admin/components/DonationDetailModal';
import { downloadDonationReceipt } from '../../admin/utils/donationReceipt';
import { AdminDonationItem } from '../../admin/models/admin.models';
import {
  volunteerService,
  VolunteerEventItem,
  extractCleanUserId,
} from '../services/volunteer.service';

interface VolunteerDashboardViewProps {
  navigation: any;
}

type VolunteerTab = 'principal' | 'eventos' | 'donaciones';

export const VolunteerDashboardView: React.FC<VolunteerDashboardViewProps> = ({ navigation }) => {
  const { user } = useAuth();
  const cleanUserId = useMemo(() => extractCleanUserId(user), [user]);

  const [activeTab, setActiveTab] = useState<VolunteerTab>('principal');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [myEvents, setMyEvents] = useState<VolunteerEventItem[]>([]);
  const [myDonations, setMyDonations] = useState<AdminDonationItem[]>([]);

  // Filters: Principal / Eventos Inscritos
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategory, setEventCategory] = useState<string>('Todas');

  // Filters: Donaciones
  const [donationSearch, setDonationSearch] = useState('');
  const [donationTypeFilter, setDonationTypeFilter] = useState<'todos' | 'monetaria' | 'objeto'>('todos');
  const [donationCategory, setDonationCategory] = useState<string>('Todas');

  // Modals / action states
  const [selectedDonation, setSelectedDonation] = useState<AdminDonationItem | null>(null);
  const [unregisteringId, setUnregisteringId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!cleanUserId) {
      setIsLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const [eventsList, donationsList] = await Promise.all([
        volunteerService.getEnrolledEvents(cleanUserId).catch(() => []),
        volunteerService.getVolunteerDonations(cleanUserId).catch(() => []),
      ]);
      setMyEvents(eventsList);
      setMyDonations(donationsList);
    } catch (err) {
      console.warn('Error loading volunteer dashboard:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [cleanUserId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Metrics
  const totalHoras = myEvents.length * 4;
  const totalMonetario = useMemo(
    () =>
      myDonations
        .filter((d) => d.tipo === 'monetaria')
        .reduce((acc, d) => acc + Number(d.monetaria?.valor || 0), 0),
    [myDonations]
  );
  const badgesCount = useMemo(() => {
    let count = 0;
    if (myEvents.length >= 1) count += 1;
    if (myEvents.length >= 3) count += 1;
    if (myDonations.length >= 1) count += 1;
    if (totalMonetario >= 50000) count += 1;
    return count;
  }, [myEvents.length, myDonations.length, totalMonetario]);

  // Derived filter options
  const eventCategories = useMemo(() => {
    const set = new Set<string>();
    myEvents.forEach((e) => {
      if (e.categoria) set.add(e.categoria);
    });
    return ['Todas', ...Array.from(set)];
  }, [myEvents]);

  const donationCategories = useMemo(() => {
    const set = new Set<string>();
    myDonations.forEach((d) => {
      if (d.categoria) set.add(d.categoria);
    });
    return ['Todas', ...Array.from(set)];
  }, [myDonations]);

  // Filtered lists
  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    return myEvents.filter((evt) => {
      const matchesSearch =
        !q ||
        (evt.nombre || '').toLowerCase().includes(q) ||
        (evt.categoria || '').toLowerCase().includes(q) ||
        (evt.direccion || '').toLowerCase().includes(q) ||
        (evt.barrio || '').toLowerCase().includes(q) ||
        (evt.organizacionNombre || '').toLowerCase().includes(q);
      const matchesCat =
        eventCategory === 'Todas' || (evt.categoria || '') === eventCategory;
      return matchesSearch && matchesCat;
    });
  }, [myEvents, eventSearch, eventCategory]);

  const filteredDonations = useMemo(() => {
    const q = donationSearch.trim().toLowerCase();
    return myDonations.filter((don) => {
      const matchesType =
        donationTypeFilter === 'todos' || don.tipo === donationTypeFilter;
      const matchesCat =
        donationCategory === 'Todas' || (don.categoria || '') === donationCategory;
      const matchesSearch =
        !q ||
        (don.organizacionNombre || '').toLowerCase().includes(q) ||
        (don.categoria || '').toLowerCase().includes(q) ||
        (don.objeto?.descripcion || '').toLowerCase().includes(q) ||
        (don.monetaria?.metodo || '').toLowerCase().includes(q);
      return matchesType && matchesCat && matchesSearch;
    });
  }, [myDonations, donationSearch, donationTypeFilter, donationCategory]);

  const handleUnregister = (event: VolunteerEventItem) => {
    Alert.alert(
      'Darse de baja del evento',
      `¿Estás seguro de que deseas cancelar tu inscripción en "${event.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar baja',
          style: 'destructive',
          onPress: async () => {
            try {
              setUnregisteringId(event.id);
              const targetId = event.id_evento || event.id;
              const res = await volunteerService.unregisterEvent(targetId, cleanUserId);
              if (res.success !== false) {
                setMyEvents((prev) => prev.filter((e) => String(e.id) !== String(event.id)));
                Alert.alert('Inscripción cancelada', 'Te has dado de baja correctamente de la jornada.');
              } else {
                Alert.alert('Aviso', res.message || 'No se pudo cancelar la inscripción.');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'Error al cancelar la inscripción.');
            } finally {
              setUnregisteringId(null);
            }
          },
        },
      ]
    );
  };

  const navigateToEventDetail = (event: VolunteerEventItem) => {
    const numericId = Number(event.id_evento || String(event.id).replace('evt_', ''));
    navigation?.navigate('EventDetail', { eventId: numericId || event.id });
  };

  if (isLoading) {
    return <AppLoader fullScreen message="Cargando tu panel de voluntario..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Panel de Voluntario</Text>
            <Text style={styles.subtitle}>
              Hola, {user?.nombre1 || 'Voluntario'} · Tu impacto solidario en Kennedy
            </Text>
          </View>
          <TouchableOpacity
            style={styles.mapQuickBtn}
            activeOpacity={0.8}
            onPress={() => navigation?.navigate('MapaSocial')}
          >
            <Compass size={16} color="#DC2626" />
            <Text style={styles.mapQuickBtnText}>Mapa</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal 3-Tab Switcher */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('principal')}
            style={[styles.tabPill, activeTab === 'principal' && styles.tabPillActive]}
          >
            <Award size={14} color={activeTab === 'principal' ? '#FFFFFF' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'principal' && styles.tabTextActive]}>
              Principal
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('eventos')}
            style={[styles.tabPill, activeTab === 'eventos' && styles.tabPillActive]}
          >
            <Calendar size={14} color={activeTab === 'eventos' ? '#FFFFFF' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'eventos' && styles.tabTextActive]}>
              Eventos Inscritos ({myEvents.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('donaciones')}
            style={[styles.tabPill, activeTab === 'donaciones' && styles.tabPillActive]}
          >
            <Heart size={14} color={activeTab === 'donaciones' ? '#FFFFFF' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'donaciones' && styles.tabTextActive]}>
              Donaciones ({myDonations.length})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ======================================================= */}
        {/* TAB 1: PRINCIPAL                                        */}
        {/* ======================================================= */}
        {activeTab === 'principal' && (
          <View style={styles.sectionStack}>
            {/* Hero + Quick Actions */}
            <View style={styles.heroCard}>
              <Text style={styles.heroTitle}>Tu Huella de Solidaridad</Text>
              <Text style={styles.heroSubtitle}>
                Consulta tus jornadas activas, horas comunitarias certificadas y aportes realizados.
              </Text>
              <View style={styles.quickActionRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.quickBtn, { backgroundColor: colors.primary }]}
                  onPress={() => navigation?.navigate('Eventos')}
                >
                  <Calendar size={15} color="#FFFFFF" />
                  <Text style={styles.quickBtnText}>Explorar Eventos</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.quickBtn, { backgroundColor: '#16A34A' }]}
                  onPress={() => navigation?.navigate('CreateDonation')}
                >
                  <Plus size={15} color="#FFFFFF" />
                  <Text style={styles.quickBtnText}>Realizar Aporte</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 4 KPI Cards */}
            <View style={styles.kpiGrid}>
              <AdminStatCard
                label="Eventos Inscritos"
                value={myEvents.length}
                color="#DC2626"
              />
              <AdminStatCard
                label="Horas de Voluntariado"
                value={`${totalHoras}h`}
                color="#2563EB"
              />
              <AdminStatCard
                label="Donaciones Económicas"
                value={`$${totalMonetario.toLocaleString('es-CO')}`}
                color="#16A34A"
              />
              <AdminStatCard
                label="Insignias & Certificados"
                value={badgesCount}
                color="#D97706"
              />
            </View>

            {/* Mis Próximas Campañas */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Mis Próximas Campañas</Text>
              <TouchableOpacity onPress={() => setActiveTab('eventos')}>
                <Text style={styles.sectionLink}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar campaña por nombre, barrio o categoría..."
                placeholderTextColor="#94A3B8"
                value={eventSearch}
                onChangeText={setEventSearch}
              />
            </View>

            {eventCategories.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {eventCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setEventCategory(cat)}
                    style={[
                      styles.filterChip,
                      eventCategory === cat && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        eventCategory === cat && styles.filterChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {filteredEvents.length === 0 ? (
              <View style={styles.emptyBox}>
                <Calendar size={28} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No tienes campañas próximas registradas</Text>
                <Text style={styles.emptySub}>
                  Explora convocatorias en Kennedy e inscríbete para comenzar a sumar horas.
                </Text>
              </View>
            ) : (
              filteredEvents.slice(0, 4).map((evt) => (
                <View key={evt.id} style={styles.eventCard}>
                  <View style={styles.eventCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.eventTitle}>{evt.nombre}</Text>
                      <View style={styles.tagRow}>
                        <Tag size={11} color="#DC2626" />
                        <Text style={styles.tagText}>{evt.categoria || 'Comunitario'}</Text>
                      </View>
                    </View>
                    <View style={styles.hoursPill}>
                      <Clock size={11} color="#2563EB" />
                      <Text style={styles.hoursPillText}>+4h</Text>
                    </View>
                  </View>

                  <View style={styles.metaRow}>
                    <Calendar size={13} color="#64748B" />
                    <Text style={styles.metaText}>
                      {evt.fecha
                        ? new Date(evt.fecha).toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Por definir'}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <MapPin size={13} color="#64748B" />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {evt.direccion} {evt.barrio ? `· ${evt.barrio}` : ''}
                    </Text>
                  </View>
                  {evt.organizacionNombre ? (
                    <View style={styles.metaRow}>
                      <Building2 size={13} color="#64748B" />
                      <Text style={styles.metaText} numberOfLines={1}>
                        {evt.organizacionNombre}
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.detailBtn}
                      onPress={() => navigateToEventDetail(evt)}
                    >
                      <Eye size={14} color="#475569" />
                      <Text style={styles.detailBtnText}>Ver detalle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.leaveBtn}
                      disabled={unregisteringId === evt.id}
                      onPress={() => handleUnregister(evt)}
                    >
                      <LogOut size={14} color="#DC2626" />
                      <Text style={styles.leaveBtnText}>
                        {unregisteringId === evt.id ? 'Saliendo...' : 'Darse de baja'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}

            {/* Mi Historial de Donaciones (Preview en Principal) */}
            <View style={[styles.sectionHeaderRow, { marginTop: 8 }]}>
              <Text style={styles.sectionHeading}>Mi Historial de Donaciones</Text>
              <TouchableOpacity onPress={() => setActiveTab('donaciones')}>
                <Text style={styles.sectionLink}>Ver historial</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar donación por organización o causa..."
                placeholderTextColor="#94A3B8"
                value={donationSearch}
                onChangeText={setDonationSearch}
              />
            </View>

            <View style={styles.typeFilterRow}>
              {(['todos', 'monetaria', 'objeto'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setDonationTypeFilter(t)}
                  style={[
                    styles.filterChip,
                    donationTypeFilter === t && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      donationTypeFilter === t && styles.filterChipTextActive,
                    ]}
                  >
                    {t === 'todos' ? 'Todas' : t === 'monetaria' ? 'Monetarias' : 'En Especie'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {filteredDonations.length === 0 ? (
              <View style={styles.emptyBox}>
                <Heart size={28} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Sin donaciones registradas</Text>
                <Text style={styles.emptySub}>
                  Realiza tu primer aporte monetario o en especie para apoyar a las fundaciones locales.
                </Text>
              </View>
            ) : (
              filteredDonations.slice(0, 3).map((don) => (
                <AdminDonationCard
                  key={don.id}
                  donation={don}
                  onConsult={(item) => setSelectedDonation(item)}
                  onDownloadReceipt={(item) => downloadDonationReceipt(item)}
                />
              ))
            )}
          </View>
        )}

        {/* ======================================================= */}
        {/* TAB 2: EVENTOS INSCRITOS                                */}
        {/* ======================================================= */}
        {activeTab === 'eventos' && (
          <View style={styles.sectionStack}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>
                Mis Eventos Inscritos ({filteredEvents.length})
              </Text>
              <TouchableOpacity
                style={styles.smallPrimaryBtn}
                onPress={() => navigation?.navigate('Eventos')}
              >
                <Plus size={13} color="#FFFFFF" />
                <Text style={styles.smallPrimaryBtnText}>Explorar</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Filtrar eventos inscritos..."
                placeholderTextColor="#94A3B8"
                value={eventSearch}
                onChangeText={setEventSearch}
              />
            </View>

            {eventCategories.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {eventCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setEventCategory(cat)}
                    style={[
                      styles.filterChip,
                      eventCategory === cat && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        eventCategory === cat && styles.filterChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {filteredEvents.length === 0 ? (
              <View style={styles.emptyBox}>
                <Calendar size={30} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No hay eventos inscritos que coincidan</Text>
                <Text style={styles.emptySub}>
                  Inscríbete en las convocatorias comunitarias disponibles para participar como voluntario.
                </Text>
              </View>
            ) : (
              filteredEvents.map((evt) => (
                <View key={evt.id} style={styles.eventCard}>
                  <View style={styles.eventCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.eventTitle}>{evt.nombre}</Text>
                      <View style={styles.tagRow}>
                        <Tag size={11} color="#DC2626" />
                        <Text style={styles.tagText}>{evt.categoria || 'Comunitario'}</Text>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            evt.estado === 'activo' ? '#DCFCE7' : '#F1F5F9',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          {
                            color: evt.estado === 'activo' ? '#16A34A' : '#64748B',
                          },
                        ]}
                      >
                        {evt.estado === 'activo' ? 'Activo' : evt.estado}
                      </Text>
                    </View>
                  </View>

                  {evt.descripcion ? (
                    <Text style={styles.eventDesc} numberOfLines={2}>
                      {evt.descripcion}
                    </Text>
                  ) : null}

                  <View style={styles.metaRow}>
                    <Calendar size={13} color="#64748B" />
                    <Text style={styles.metaText}>
                      {evt.fecha
                        ? new Date(evt.fecha).toLocaleDateString('es-CO', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          })
                        : 'Fecha por confirmar'}
                    </Text>
                  </View>

                  <View style={styles.metaRow}>
                    <MapPin size={13} color="#64748B" />
                    <Text style={styles.metaText} numberOfLines={1}>
                      {evt.direccion} {evt.barrio ? `· ${evt.barrio}` : ''}
                    </Text>
                  </View>

                  {evt.organizacionNombre ? (
                    <View style={styles.metaRow}>
                      <Building2 size={13} color="#64748B" />
                      <Text style={styles.metaText}>{evt.organizacionNombre}</Text>
                    </View>
                  ) : null}

                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={styles.detailBtn}
                      onPress={() => navigateToEventDetail(evt)}
                    >
                      <Eye size={14} color="#475569" />
                      <Text style={styles.detailBtnText}>Ver detalle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.leaveBtn}
                      disabled={unregisteringId === evt.id}
                      onPress={() => handleUnregister(evt)}
                    >
                      <LogOut size={14} color="#DC2626" />
                      <Text style={styles.leaveBtnText}>
                        {unregisteringId === evt.id ? 'Procesando...' : 'Darse de baja'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* ======================================================= */}
        {/* TAB 3: DONACIONES                                       */}
        {/* ======================================================= */}
        {activeTab === 'donaciones' && (
          <View style={styles.sectionStack}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>
                Historial de Donaciones ({filteredDonations.length})
              </Text>
              <TouchableOpacity
                style={[styles.smallPrimaryBtn, { backgroundColor: '#16A34A' }]}
                onPress={() => navigation?.navigate('CreateDonation')}
              >
                <Plus size={13} color="#FFFFFF" />
                <Text style={styles.smallPrimaryBtnText}>Nuevo Aporte</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por organización, método o descripción..."
                placeholderTextColor="#94A3B8"
                value={donationSearch}
                onChangeText={setDonationSearch}
              />
            </View>

            <View style={styles.typeFilterRow}>
              {(['todos', 'monetaria', 'objeto'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setDonationTypeFilter(t)}
                  style={[
                    styles.filterChip,
                    donationTypeFilter === t && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      donationTypeFilter === t && styles.filterChipTextActive,
                    ]}
                  >
                    {t === 'todos' ? 'Todos los tipos' : t === 'monetaria' ? 'Monetarias' : 'En Especie'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {donationCategories.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {donationCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setDonationCategory(cat)}
                    style={[
                      styles.filterChip,
                      donationCategory === cat && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        donationCategory === cat && styles.filterChipTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {filteredDonations.length === 0 ? (
              <View style={styles.emptyBox}>
                <Heart size={30} color="#94A3B8" />
                <Text style={styles.emptyTitle}>No hay donaciones registradas</Text>
                <Text style={styles.emptySub}>
                  Cuando realices un aporte económico o en especie, aparecerá aquí con su comprobante descargable.
                </Text>
              </View>
            ) : (
              filteredDonations.map((don) => (
                <AdminDonationCard
                  key={don.id}
                  donation={don}
                  onConsult={(item) => setSelectedDonation(item)}
                  onDownloadReceipt={(item) => downloadDonationReceipt(item)}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      <DonationDetailModal
        visible={!!selectedDonation}
        donation={selectedDonation}
        onClose={() => setSelectedDonation(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  mapQuickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  mapQuickBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    paddingBottom: 2,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  tabPillActive: {
    backgroundColor: '#DC2626',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  sectionStack: {
    gap: 12,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  heroTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 17,
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  quickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  quickBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  smallPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 2,
  },
  chipRow: {
    gap: 8,
    paddingVertical: 2,
  },
  typeFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#DC2626',
    fontWeight: '700',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  eventCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  hoursPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hoursPillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  eventDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginVertical: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  detailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  leaveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  leaveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginTop: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 17,
  },
});

export default VolunteerDashboardView;
