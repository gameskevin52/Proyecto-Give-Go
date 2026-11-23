import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  HeartHandshake,
  ClipboardList,
  Calendar,
  MapPin,
  Building2,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  Trash2,
  Compass,
  Tag,
  Gift,
  X,
} from 'lucide-react-native';
import { useAuth } from '../../../store/auth/AuthContext';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminStatCard } from '../../admin/components/AdminStatCard';
import {
  beneficiaryService,
  BeneficiaryEventItem,
  BeneficiaryPostulacionItem,
  extractBeneficiaryUserId,
} from '../services/beneficiary.service';

interface BeneficiaryDashboardViewProps {
  navigation: any;
}

type BeneficiaryTab = 'principal' | 'postulaciones';

export const BeneficiaryDashboardView: React.FC<BeneficiaryDashboardViewProps> = ({
  navigation,
}) => {
  const { user } = useAuth();
  const cleanUserId = useMemo(() => extractBeneficiaryUserId(user), [user]);

  const [activeTab, setActiveTab] = useState<BeneficiaryTab>('principal');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [activeEvents, setActiveEvents] = useState<BeneficiaryEventItem[]>([]);
  const [postulaciones, setPostulaciones] = useState<BeneficiaryPostulacionItem[]>([]);

  // Filters: Principal (Jornadas Disponibles)
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategory, setEventCategory] = useState('Todas');

  // Filters: Mis Postulaciones
  const [postSearch, setPostSearch] = useState('');
  const [postStatusFilter, setPostStatusFilter] = useState<string>('todos');

  // Apply Modal
  const [applyModalEvent, setApplyModalEvent] = useState<BeneficiaryEventItem | null>(null);
  const [observacionesInput, setObservacionesInput] = useState('');
  const [isSubmittingApply, setIsSubmittingApply] = useState(false);

  // Action busy state
  const [actionBusyId, setActionBusyId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [eventsList, myApps] = await Promise.all([
        beneficiaryService.getActiveEvents().catch(() => []),
        cleanUserId ? beneficiaryService.getMyPostulaciones(cleanUserId).catch(() => []) : Promise.resolve([]),
      ]);
      setActiveEvents(eventsList);
      setPostulaciones(myApps);
    } catch (err) {
      console.warn('Error loading beneficiary dashboard:', err);
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

  // KPIs - always read p.estadoPostulacion
  const totalPostulaciones = postulaciones.length;
  const ayudasAprobadas = useMemo(
    () =>
      postulaciones.filter(
        (p) => p.estadoPostulacion === 'aprobado' || p.estadoPostulacion === 'confirmado'
      ).length,
    [postulaciones]
  );
  const enRevision = useMemo(
    () => postulaciones.filter((p) => p.estadoPostulacion === 'pendiente').length,
    [postulaciones]
  );

  // Match event to existing postulacion
  const findPostulacionForEvent = useCallback(
    (evt: BeneficiaryEventItem): BeneficiaryPostulacionItem | undefined => {
      const evtIds = [String(evt.id), String(evt.id_evento || '')].filter(Boolean);
      return postulaciones.find(
        (p) =>
          evtIds.includes(String(p.eventoId)) && p.estadoPostulacion !== 'cancelado'
      );
    },
    [postulaciones]
  );

  const eventCategories = useMemo(() => {
    const set = new Set<string>();
    activeEvents.forEach((e) => {
      if (e.categoria) set.add(e.categoria);
    });
    return ['Todas', ...Array.from(set)];
  }, [activeEvents]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    return activeEvents.filter((evt) => {
      const matchesCat =
        eventCategory === 'Todas' || (evt.categoria || '') === eventCategory;
      const matchesSearch =
        !q ||
        (evt.nombre || '').toLowerCase().includes(q) ||
        (evt.ayudaOfrecida || '').toLowerCase().includes(q) ||
        (evt.organizacionNombre || '').toLowerCase().includes(q) ||
        (evt.direccion || '').toLowerCase().includes(q) ||
        (evt.barrio || '').toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [activeEvents, eventSearch, eventCategory]);

  const filteredPostulaciones = useMemo(() => {
    const q = postSearch.trim().toLowerCase();
    return postulaciones.filter((p) => {
      const matchesStatus =
        postStatusFilter === 'todos' || p.estadoPostulacion === postStatusFilter;
      const matchesSearch =
        !q ||
        (p.eventoNombre || '').toLowerCase().includes(q) ||
        (p.organizacionNombre || '').toLowerCase().includes(q) ||
        (p.ayudaOfrecida || '').toLowerCase().includes(q) ||
        (p.observaciones || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [postulaciones, postSearch, postStatusFilter]);

  const handleOpenApplyModal = (evt: BeneficiaryEventItem) => {
    setApplyModalEvent(evt);
    setObservacionesInput('');
  };

  const handleSubmitApply = async () => {
    if (!applyModalEvent || !cleanUserId) return;
    try {
      setIsSubmittingApply(true);
      const targetEvtId = applyModalEvent.id_evento || String(applyModalEvent.id).replace('evt_', '');
      const res = await beneficiaryService.applyToEvent({
        id_evento: targetEvtId,
        id_usuario: cleanUserId,
        observaciones:
          observacionesInput.trim() || 'Solicitud de ayuda registrada desde la aplicación móvil.',
      });
      if (res.success !== false) {
        setApplyModalEvent(null);
        setObservacionesInput('');
        await loadData();
        Alert.alert(
          'Postulación en Revisión',
          'Tu solicitud fue enviada. La organización revisará y aprobará tu postulación próximamente.'
        );
      } else {
        Alert.alert('Aviso', res.message || 'No se pudo enviar tu postulación.');
      }
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Ocurrió un error al registrar tu postulación.'
      );
    } finally {
      setIsSubmittingApply(false);
    }
  };

  const handleConfirmAttendance = async (item: BeneficiaryPostulacionItem) => {
    try {
      setActionBusyId(item.id);
      const res = await beneficiaryService.confirmAttendance(item.id);
      if (res.success !== false) {
        await loadData();
        Alert.alert('Asistencia Confirmada', 'Tu asistencia a la jornada ha sido confirmada.');
      } else {
        Alert.alert('Aviso', res.message || 'No se pudo confirmar la asistencia.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Error al confirmar asistencia.');
    } finally {
      setActionBusyId(null);
    }
  };

  const handleWithdraw = (postulacionId: string, eventName: string) => {
    Alert.alert(
      'Retirar Postulación',
      `¿Deseas retirar tu postulación a "${eventName}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Retirar',
          style: 'destructive',
          onPress: async () => {
            try {
              setActionBusyId(postulacionId);
              const res = await beneficiaryService.withdrawPostulacion(postulacionId);
              if (res.success !== false) {
                setPostulaciones((prev) =>
                  prev.filter((p) => String(p.id) !== String(postulacionId))
                );
                Alert.alert('Postulación Retirada', 'Tu postulación fue retirada correctamente.');
              } else {
                Alert.alert('Aviso', res.message || 'No se pudo retirar la postulación.');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'Error al retirar postulación.');
            } finally {
              setActionBusyId(null);
            }
          },
        },
      ]
    );
  };

  const getStatusBadgeConfig = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return { label: 'Aprobada', bg: '#DCFCE7', text: '#166534' };
      case 'confirmado':
        return { label: 'Asistencia Confirmada', bg: '#DBEAFE', text: '#1D4ED8' };
      case 'rechazado':
        return { label: 'Rechazada', bg: '#FEE2E2', text: '#991B1B' };
      case 'pendiente':
      default:
        return { label: 'En Revisión', bg: '#FEF3C7', text: '#92400E' };
    }
  };

  if (isLoading) {
    return <AppLoader fullScreen message="Cargando red de apoyo social..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Red de Apoyo Social</Text>
            <Text style={styles.subtitle}>
              Hola, {user?.nombre1 || 'Beneficiario'} · Jornadas y ayudas comunitarias
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

        {/* Horizontal 2-Tab Switcher */}
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
            <HeartHandshake size={14} color={activeTab === 'principal' ? '#FFFFFF' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'principal' && styles.tabTextActive]}>
              Principal · Jornadas ({activeEvents.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('postulaciones')}
            style={[styles.tabPill, activeTab === 'postulaciones' && styles.tabPillActive]}
          >
            <ClipboardList
              size={14}
              color={activeTab === 'postulaciones' ? '#FFFFFF' : '#64748B'}
            />
            <Text style={[styles.tabText, activeTab === 'postulaciones' && styles.tabTextActive]}>
              Mis Postulaciones ({totalPostulaciones})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Top 4 KPI Cards (always visible across tabs) */}
        <View style={styles.kpiGrid}>
          <AdminStatCard label="Total Postulaciones" value={totalPostulaciones} color="#0F172A" />
          <AdminStatCard label="Ayudas Aprobadas" value={ayudasAprobadas} color="#16A34A" />
          <AdminStatCard label="En Revisión" value={enRevision} color="#D97706" />
          <AdminStatCard
            label="Jornadas Disponibles"
            value={activeEvents.length}
            color="#DC2626"
          />
        </View>

        {/* ======================================================= */}
        {/* TAB 1: PRINCIPAL (JORNADAS DISPONIBLES)                 */}
        {/* ======================================================= */}
        {activeTab === 'principal' && (
          <View style={styles.sectionStack}>
            <View style={styles.infoBanner}>
              <Clock size={16} color="#92400E" />
              <Text style={styles.infoBannerText}>
                Al postularte a una jornada, tu solicitud entra en revisión hasta que la organización apruebe el beneficio.
              </Text>
            </View>

            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar jornada, ayuda ofrecida o barrio..."
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
                <Text style={styles.emptyTitle}>No hay jornadas disponibles</Text>
                <Text style={styles.emptySub}>
                  No encontramos eventos activos que coincidan con los filtros actuales.
                </Text>
              </View>
            ) : (
              filteredEvents.map((evt) => {
                const existingApp = findPostulacionForEvent(evt);
                const badge = existingApp
                  ? getStatusBadgeConfig(existingApp.estadoPostulacion)
                  : null;
                const canWithdraw =
                  existingApp &&
                  (existingApp.estadoPostulacion === 'pendiente' ||
                    existingApp.estadoPostulacion === 'aprobado');

                return (
                  <View key={evt.id} style={styles.card}>
                    <View style={styles.cardTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{evt.nombre}</Text>
                        <View style={styles.tagRow}>
                          <Tag size={11} color="#DC2626" />
                          <Text style={styles.tagText}>{evt.categoria || 'Apoyo Social'}</Text>
                        </View>
                      </View>
                      {badge ? (
                        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                          <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                            {badge.label}
                          </Text>
                        </View>
                      ) : null}
                    </View>

                    {evt.descripcion ? (
                      <Text style={styles.cardDesc} numberOfLines={2}>
                        {evt.descripcion}
                      </Text>
                    ) : null}

                    {evt.ayudaOfrecida ? (
                      <View style={styles.benefitBox}>
                        <Gift size={14} color="#15803D" />
                        <Text style={styles.benefitText}>Ayuda: {evt.ayudaOfrecida}</Text>
                      </View>
                    ) : null}

                    <View style={styles.metaRow}>
                      <Building2 size={13} color="#64748B" />
                      <Text style={styles.metaText}>
                        {evt.organizacionNombre || 'Organización Aliada'}
                      </Text>
                    </View>

                    <View style={styles.metaRow}>
                      <Calendar size={13} color="#64748B" />
                      <Text style={styles.metaText}>
                        {evt.fecha
                          ? new Date(evt.fecha).toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'Por confirmar'}
                      </Text>
                    </View>

                    <View style={styles.metaRow}>
                      <MapPin size={13} color="#64748B" />
                      <Text style={styles.metaText} numberOfLines={1}>
                        {evt.direccion} {evt.barrio ? `· ${evt.barrio}` : ''}
                      </Text>
                    </View>

                    <View style={styles.cardActions}>
                      {!existingApp ? (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          style={styles.applyBtn}
                          onPress={() => handleOpenApplyModal(evt)}
                        >
                          <Send size={14} color="#FFFFFF" />
                          <Text style={styles.applyBtnText}>
                            Postularme para Recibir Ayuda
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TouchableOpacity
                            style={styles.secondaryBtn}
                            onPress={() => setActiveTab('postulaciones')}
                          >
                            <ClipboardList size={14} color="#475569" />
                            <Text style={styles.secondaryBtnText}>Ver en Mis Postulaciones</Text>
                          </TouchableOpacity>

                          {canWithdraw && existingApp ? (
                            <TouchableOpacity
                              style={styles.withdrawBtn}
                              disabled={actionBusyId === existingApp.id}
                              onPress={() => handleWithdraw(existingApp.id, evt.nombre)}
                            >
                              <Trash2 size={14} color="#DC2626" />
                              <Text style={styles.withdrawBtnText}>
                                {actionBusyId === existingApp.id
                                  ? 'Retirando...'
                                  : 'Retirar Postulación'}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </>
                      )}
                    </View>
                  </View>
                );
              })
            )}
          </View>
        )}

        {/* ======================================================= */}
        {/* TAB 2: MIS POSTULACIONES (HISTORIAL)                    */}
        {/* ======================================================= */}
        {activeTab === 'postulaciones' && (
          <View style={styles.sectionStack}>
            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar en mi historial de postulaciones..."
                placeholderTextColor="#94A3B8"
                value={postSearch}
                onChangeText={setPostSearch}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {[
                { key: 'todos', label: 'Todas' },
                { key: 'pendiente', label: 'En Revisión' },
                { key: 'aprobado', label: 'Aprobadas' },
                { key: 'confirmado', label: 'Confirmadas' },
                { key: 'rechazado', label: 'Rechazadas' },
              ].map((st) => (
                <TouchableOpacity
                  key={st.key}
                  onPress={() => setPostStatusFilter(st.key)}
                  style={[
                    styles.filterChip,
                    postStatusFilter === st.key && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      postStatusFilter === st.key && styles.filterChipTextActive,
                    ]}
                  >
                    {st.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredPostulaciones.length === 0 ? (
              <View style={styles.emptyBox}>
                <ClipboardList size={30} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Sin postulaciones en este estado</Text>
                <Text style={styles.emptySub}>
                  Postúlate en la pestaña Principal a las jornadas disponibles de las organizaciones.
                </Text>
              </View>
            ) : (
              filteredPostulaciones.map((app) => {
                const badge = getStatusBadgeConfig(app.estadoPostulacion);
                const isApproved = app.estadoPostulacion === 'aprobado';
                const canWithdraw =
                  app.estadoPostulacion === 'pendiente' ||
                  app.estadoPostulacion === 'aprobado';

                return (
                  <View key={app.id} style={styles.card}>
                    <View style={styles.cardTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{app.eventoNombre || 'Jornada Social'}</Text>
                        <Text style={styles.orgLine}>
                          {app.organizacionNombre || 'Organización Comunitaria'}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {app.ayudaOfrecida ? (
                      <View style={styles.benefitBox}>
                        <Gift size={14} color="#15803D" />
                        <Text style={styles.benefitText}>Ayuda: {app.ayudaOfrecida}</Text>
                      </View>
                    ) : null}

                    <View style={styles.metaRow}>
                      <Calendar size={13} color="#64748B" />
                      <Text style={styles.metaText}>
                        Evento:{' '}
                        {app.eventoFecha
                          ? new Date(app.eventoFecha).toLocaleDateString('es-CO', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Por definir'}{' '}
                        · Postulado:{' '}
                        {app.fechaPostulacion
                          ? new Date(app.fechaPostulacion).toLocaleDateString('es-CO')
                          : 'Reciente'}
                      </Text>
                    </View>

                    {app.eventoDireccion ? (
                      <View style={styles.metaRow}>
                        <MapPin size={13} color="#64748B" />
                        <Text style={styles.metaText} numberOfLines={1}>
                          {app.eventoDireccion}
                        </Text>
                      </View>
                    ) : null}

                    {app.observaciones ? (
                      <View style={styles.obsBox}>
                        <Text style={styles.obsLabel}>Observaciones:</Text>
                        <Text style={styles.obsText}>{app.observaciones}</Text>
                      </View>
                    ) : null}

                    {(isApproved || canWithdraw) && (
                      <View style={styles.cardActions}>
                        {isApproved && (
                          <TouchableOpacity
                            style={styles.confirmBtn}
                            disabled={actionBusyId === app.id}
                            onPress={() => handleConfirmAttendance(app)}
                          >
                            <CheckCircle2 size={14} color="#FFFFFF" />
                            <Text style={styles.confirmBtnText}>
                              {actionBusyId === app.id
                                ? 'Confirmando...'
                                : 'Confirmar mi Asistencia'}
                            </Text>
                          </TouchableOpacity>
                        )}

                        {canWithdraw && (
                          <TouchableOpacity
                            style={styles.withdrawBtn}
                            disabled={actionBusyId === app.id}
                            onPress={() => handleWithdraw(app.id, app.eventoNombre)}
                          >
                            <Trash2 size={14} color="#DC2626" />
                            <Text style={styles.withdrawBtnText}>
                              {actionBusyId === app.id
                                ? 'Retirando...'
                                : 'Retirar Postulación'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>
                );
              })
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal: Postularme para recibir ayuda */}
      <Modal
        visible={!!applyModalEvent}
        transparent
        animationType="slide"
        onRequestClose={() => setApplyModalEvent(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalTitle}>Postularme para Recibir Ayuda</Text>
                <Text style={styles.modalSubtitle} numberOfLines={2}>
                  {applyModalEvent?.nombre}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setApplyModalEvent(null)}
                style={styles.closeBtn}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>
              Observaciones o Necesidad Específica (opcional)
            </Text>
            <TextInput
              style={styles.modalTextArea}
              placeholder="Ej. Familia de 4 personas en Kennedy Central, requiero apoyo alimentario..."
              placeholderTextColor="#94A3B8"
              value={observacionesInput}
              onChangeText={setObservacionesInput}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <AppButton
                title="Cancelar"
                variant="outline"
                onPress={() => setApplyModalEvent(null)}
                style={{ flex: 1 }}
              />
              <AppButton
                title="Enviar Postulación"
                variant="primary"
                loading={isSubmittingApply}
                onPress={handleSubmitApply}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  sectionStack: {
    gap: 12,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: '#92400E',
    lineHeight: 17,
    fontWeight: '500',
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 7,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  orgLine: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
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
  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  cardDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
  },
  benefitBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  benefitText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
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
  obsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  obsLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  obsText: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  applyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 10,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#16A34A',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 9,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 9,
  },
  secondaryBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  withdrawBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 9,
  },
  withdrawBtnText: {
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
    gap: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  modalTextArea: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    height: 100,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default BeneficiaryDashboardView;
