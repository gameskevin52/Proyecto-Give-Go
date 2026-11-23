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
  Building2,
  Calendar,
  Heart,
  Users,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Compass,
  Mail,
  Phone,
  Trash2,
  Eye,
  X,
  UserCheck,
} from 'lucide-react-native';
import { useAuth } from '../../../store/auth/AuthContext';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminStatCard } from '../../admin/components/AdminStatCard';
import { AdminEventCard } from '../../admin/components/AdminEventCard';
import { AdminDonationCard } from '../../admin/components/AdminDonationCard';
import { CreateEventModal } from '../../admin/components/CreateEventModal';
import { EditEventModal } from '../../admin/components/EditEventModal';
import { EventDetailModal } from '../../admin/components/EventDetailModal';
import { DonationDetailModal } from '../../admin/components/DonationDetailModal';
import { downloadDonationReceipt } from '../../admin/utils/donationReceipt';
import {
  AdminEventItem,
  AdminDonationItem,
  AdminCategoryItem,
} from '../../admin/models/admin.models';
import {
  orgService,
  OrgPostulacionItem,
  OrgVolunteerAssoc,
  isMyOrgEvent,
  resolveOrgId,
} from '../services/org.service';

interface OrgDashboardViewProps {
  navigation: any;
}

type OrgTab = 'principal' | 'eventos' | 'donaciones' | 'personas';
type LinkedSubTab = 'voluntarios' | 'beneficiarios';

export const OrgDashboardView: React.FC<OrgDashboardViewProps> = ({ navigation }) => {
  const { user } = useAuth();
  const orgId = useMemo(() => resolveOrgId(user), [user]);
  const cleanOrgId = useMemo(
    () => String(orgId).replace('org_', '').replace('usr_', ''),
    [orgId]
  );

  const [activeTab, setActiveTab] = useState<OrgTab>('principal');
  const [linkedSubTab, setLinkedSubTab] = useState<LinkedSubTab>('voluntarios');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Core data
  const [myEvents, setMyEvents] = useState<AdminEventItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [orgDonations, setOrgDonations] = useState<AdminDonationItem[]>([]);
  const [beneficiaryApps, setBeneficiaryApps] = useState<OrgPostulacionItem[]>([]);
  const [volunteersList, setVolunteersList] = useState<OrgVolunteerAssoc[]>([]);

  // Verification status
  const [verificada, setVerificada] = useState<boolean>(!!user?.verificada);
  const [estadoVerif, setEstadoVerif] = useState<
    'no_solicitado' | 'pendiente' | 'aprobada' | 'rechazada'
  >(user?.verificada ? 'aprobada' : 'no_solicitado');
  const [isVerifModalOpen, setIsVerifModalOpen] = useState(false);
  const [nitInput, setNitInput] = useState(user?.nit || '');
  const [mensajeInput, setMensajeInput] = useState('');
  const [documentosInput, setDocumentosInput] = useState('');
  const [isSubmittingVerif, setIsSubmittingVerif] = useState(false);

  // Event modals & filters
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AdminEventItem | null>(null);
  const [consultEvent, setConsultEvent] = useState<AdminEventItem | null>(null);
  const [eventSearch, setEventSearch] = useState('');
  const [eventCategoryFilter, setEventCategoryFilter] = useState('Todas');
  const [eventStatusFilter, setEventStatusFilter] = useState<string>('todos');

  // Donation modal & filters
  const [consultDonation, setConsultDonation] = useState<AdminDonationItem | null>(null);
  const [donationSearch, setDonationSearch] = useState('');
  const [donationTypeFilter, setDonationTypeFilter] = useState<'todos' | 'monetaria' | 'objeto'>(
    'todos'
  );
  const [donationCatFilter, setDonationCatFilter] = useState('Todas');

  // People / Postulaciones filters & modals
  const [benSearch, setBenSearch] = useState('');
  const [benStatusFilter, setBenStatusFilter] = useState<string>('todos');
  const [personSearch, setPersonSearch] = useState('');
  const [personEventFilter, setPersonEventFilter] = useState('Todos');
  const [detailBeneficiary, setDetailBeneficiary] = useState<OrgPostulacionItem | null>(null);
  const [detailVolunteer, setDetailVolunteer] = useState<OrgVolunteerAssoc | null>(null);
  const [busyAppId, setBusyAppId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!orgId) {
      setIsLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const [allEvents, cats, donations, verifStatus, benApps, volApps] = await Promise.all([
        orgService.getAllEvents().catch(() => []),
        orgService.getCategories().catch(() => []),
        orgService.getOrgDonations(orgId).catch(() => []),
        orgService.getVerificationStatus(orgId).catch(() => ({
          verificada: !!user?.verificada,
          estadoVerificacion: 'no_solicitado' as const,
          activeRequest: null,
        })),
        orgService.getOrgPostulaciones(orgId, 'beneficiario').catch(() => []),
        orgService.getOrgPostulaciones(orgId, 'voluntario').catch(() => []),
      ]);

      const ownedEvents = allEvents.filter((e) => isMyOrgEvent(e.organizacionId, user));
      setMyEvents(ownedEvents);
      setCategories(cats);
      setOrgDonations(donations);
      setVerificada(!!verifStatus.verificada);
      setEstadoVerif(verifStatus.estadoVerificacion || 'no_solicitado');
      setBeneficiaryApps(benApps);

      // Deduplicate volunteers from postulaciones + /events/:id/participants
      const volMap = new Map<string, OrgVolunteerAssoc>();
      volApps.forEach((p) => {
        const key = `${p.eventoId}_${p.usuarioId || p.usuarioCorreo}`;
        volMap.set(key, {
          id: key,
          postulacionId: p.id,
          eventoId: p.eventoId,
          usuarioId: p.usuarioId,
          nombre: p.usuarioNombre || 'Voluntario',
          correo: p.usuarioCorreo || 'Sin correo',
          telefono: p.usuarioTelefono || 'N/A',
          eventoNombre: p.eventoNombre || 'Evento',
          fechaPostulacion: p.fechaPostulacion,
          estado: p.estadoPostulacion,
          observaciones: p.observaciones,
        });
      });

      if (ownedEvents.length > 0) {
        const participantResults = await Promise.all(
          ownedEvents.slice(0, 12).map(async (evt) => {
            const list = await orgService.getEventParticipants(evt.id_evento || evt.id).catch(() => []);
            return { evt, list };
          })
        );
        participantResults.forEach(({ evt, list }) => {
          list.forEach((pt: any) => {
            const uId = String(pt.usuarioId || pt.id_usuario || pt.id || '').replace('usr_', '');
            const key = `${evt.id_evento || evt.id}_${uId || pt.correo}`;
            if (!volMap.has(key)) {
              volMap.set(key, {
                id: key,
                eventoId: String(evt.id_evento || evt.id),
                usuarioId: uId,
                nombre:
                  pt.nombre ||
                  [pt.nombre1, pt.apellido1].filter(Boolean).join(' ') ||
                  'Voluntario Inscrito',
                correo: pt.correo || 'Sin correo',
                telefono: pt.telefono || 'N/A',
                eventoNombre: evt.nombre,
                fechaPostulacion: pt.fechaInscripcion || pt.fecha,
                estado: 'inscrito',
              });
            }
          });
        });
      }
      setVolunteersList(Array.from(volMap.values()));
    } catch (err) {
      console.warn('Error loading organization dashboard:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [orgId, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const totalFondosCOP = useMemo(
    () =>
      orgDonations
        .filter((d) => d.tipo === 'monetaria')
        .reduce((acc, d) => acc + Number(d.monetaria?.valor || 0), 0),
    [orgDonations]
  );

  // Filters
  const filteredBeneficiariesPrincipal = useMemo(() => {
    const q = benSearch.trim().toLowerCase();
    return beneficiaryApps.filter((p) => {
      const matchesStatus =
        benStatusFilter === 'todos' || p.estadoPostulacion === benStatusFilter;
      const matchesSearch =
        !q ||
        (p.usuarioNombre || '').toLowerCase().includes(q) ||
        (p.eventoNombre || '').toLowerCase().includes(q) ||
        (p.usuarioCorreo || '').toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [beneficiaryApps, benSearch, benStatusFilter]);

  const filteredEvents = useMemo(() => {
    const q = eventSearch.trim().toLowerCase();
    return myEvents.filter((evt) => {
      const matchesCat =
        eventCategoryFilter === 'Todas' || (evt.categoria || '') === eventCategoryFilter;
      const matchesStatus =
        eventStatusFilter === 'todos' || evt.estado === eventStatusFilter;
      const matchesSearch =
        !q ||
        (evt.nombre || '').toLowerCase().includes(q) ||
        (evt.direccion || '').toLowerCase().includes(q) ||
        (evt.barrio || '').toLowerCase().includes(q);
      return matchesCat && matchesStatus && matchesSearch;
    });
  }, [myEvents, eventSearch, eventCategoryFilter, eventStatusFilter]);

  const donationCategories = useMemo(() => {
    const set = new Set<string>();
    orgDonations.forEach((d) => {
      if (d.categoria) set.add(d.categoria);
    });
    return ['Todas', ...Array.from(set)];
  }, [orgDonations]);

  const filteredDonations = useMemo(() => {
    const q = donationSearch.trim().toLowerCase();
    return orgDonations.filter((don) => {
      const matchesType =
        donationTypeFilter === 'todos' || don.tipo === donationTypeFilter;
      const matchesCat =
        donationCatFilter === 'Todas' || (don.categoria || '') === donationCatFilter;
      const matchesSearch =
        !q ||
        (don.usuarioNombre || '').toLowerCase().includes(q) ||
        (don.categoria || '').toLowerCase().includes(q) ||
        (don.objeto?.descripcion || '').toLowerCase().includes(q);
      return matchesType && matchesCat && matchesSearch;
    });
  }, [orgDonations, donationSearch, donationTypeFilter, donationCatFilter]);

  const filteredVolunteers = useMemo(() => {
    const q = personSearch.trim().toLowerCase();
    return volunteersList.filter((v) => {
      const matchesEvt =
        personEventFilter === 'Todos' || v.eventoNombre === personEventFilter;
      const matchesSearch =
        !q ||
        v.nombre.toLowerCase().includes(q) ||
        v.correo.toLowerCase().includes(q) ||
        v.eventoNombre.toLowerCase().includes(q);
      return matchesEvt && matchesSearch;
    });
  }, [volunteersList, personSearch, personEventFilter]);

  const filteredBeneficiariesLinked = useMemo(() => {
    const q = personSearch.trim().toLowerCase();
    return beneficiaryApps.filter((b) => {
      const matchesEvt =
        personEventFilter === 'Todos' || b.eventoNombre === personEventFilter;
      const matchesStatus =
        benStatusFilter === 'todos' || b.estadoPostulacion === benStatusFilter;
      const matchesSearch =
        !q ||
        (b.usuarioNombre || '').toLowerCase().includes(q) ||
        (b.usuarioCorreo || '').toLowerCase().includes(q) ||
        (b.eventoNombre || '').toLowerCase().includes(q);
      return matchesEvt && matchesStatus && matchesSearch;
    });
  }, [beneficiaryApps, personSearch, personEventFilter, benStatusFilter]);

  // Handlers
  const handleSendVerification = async () => {
    if (!nitInput.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el NIT de tu organización.');
      return;
    }
    try {
      setIsSubmittingVerif(true);
      const res = await orgService.requestVerification({
        organizacionId: orgId,
        nit: nitInput.trim(),
        mensaje: mensajeInput.trim() || 'Solicitud de verificación oficial.',
        documentos: documentosInput.trim() || 'Documentación adjunta por organización',
      });
      if (res.success !== false) {
        setEstadoVerif('pendiente');
        setIsVerifModalOpen(false);
        Alert.alert(
          'Solicitud Enviada',
          'Tu solicitud de verificación fue enviada a revisión administrativa.'
        );
      } else {
        Alert.alert('Aviso', res.message || 'No se pudo enviar la solicitud.');
      }
    } catch (err: any) {
      Alert.alert(
        'Error',
        err?.response?.data?.message || 'Error al enviar la solicitud de verificación.'
      );
    } finally {
      setIsSubmittingVerif(false);
    }
  };

  const handleUpdateBeneficiaryStatus = async (
    app: OrgPostulacionItem,
    nextStatus: 'aprobado' | 'rechazado'
  ) => {
    try {
      setBusyAppId(app.id);
      const res = await orgService.updatePostulacionStatus(app.id, nextStatus);
      if (res.success !== false) {
        setBeneficiaryApps((prev) =>
          prev.map((item) =>
            String(item.id) === String(app.id)
              ? { ...item, estadoPostulacion: nextStatus }
              : item
          )
        );
        if (detailBeneficiary && String(detailBeneficiary.id) === String(app.id)) {
          setDetailBeneficiary({ ...detailBeneficiary, estadoPostulacion: nextStatus });
        }
        Alert.alert(
          nextStatus === 'aprobado' ? 'Beneficiario Aprobado' : 'Postulación Rechazada',
          `La solicitud de ${app.usuarioNombre} fue marcada como ${nextStatus}.`
        );
      } else {
        Alert.alert('Aviso', res.message || 'No se pudo actualizar el estado.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Error al actualizar postulación.');
    } finally {
      setBusyAppId(null);
    }
  };

  const handleDeleteBeneficiaryPostulacion = (app: OrgPostulacionItem) => {
    Alert.alert(
      'Desvincular Beneficiario',
      `¿Deseas eliminar la postulación de "${app.usuarioNombre}" en "${app.eventoNombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setBusyAppId(app.id);
              const res = await orgService.deletePostulacion(app.id);
              if (res.success !== false) {
                setBeneficiaryApps((prev) =>
                  prev.filter((item) => String(item.id) !== String(app.id))
                );
                setDetailBeneficiary(null);
                Alert.alert('Eliminado', 'La postulación del beneficiario ha sido eliminada.');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'No se pudo eliminar.');
            } finally {
              setBusyAppId(null);
            }
          },
        },
      ]
    );
  };

  const handleUnlinkVolunteer = (vol: OrgVolunteerAssoc) => {
    Alert.alert(
      'Desvincular Voluntario',
      `¿Deseas desvincular a "${vol.nombre}" del evento "${vol.eventoNombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desvincular',
          style: 'destructive',
          onPress: async () => {
            try {
              setBusyAppId(vol.id);
              if (vol.postulacionId) {
                await orgService.deletePostulacion(vol.postulacionId);
              } else if (vol.eventoId && vol.usuarioId) {
                await orgService.unregisterVolunteer(vol.eventoId, vol.usuarioId);
              }
              setVolunteersList((prev) => prev.filter((item) => item.id !== vol.id));
              setDetailVolunteer(null);
              Alert.alert('Desvinculado', 'El voluntario fue desvinculado del evento.');
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'No se pudo desvincular.');
            } finally {
              setBusyAppId(null);
            }
          },
        },
      ]
    );
  };

  const handleCreateEvent = async (payload: any) => {
    const res = await orgService.createEvent({
      ...payload,
      organizacionId: orgId,
      id_organizacion: user?.id_organizacion,
    });
    if (res.success !== false) {
      await loadData();
      return { success: true, message: 'Evento publicado correctamente.' };
    }
    return { success: false, message: res.message || 'No se pudo crear el evento.' };
  };

  const handleUpdateEvent = async (id: string | number, payload: any) => {
    const res = await orgService.updateEvent(id, payload);
    if (res.success !== false) {
      await loadData();
      return { success: true, message: 'Evento actualizado correctamente.' };
    }
    return { success: false, message: res.message || 'No se pudo actualizar.' };
  };

  const handleDeleteEvent = (eventId: string | number) => {
    Alert.alert(
      'Eliminar Evento',
      '¿Estás seguro de eliminar este evento? Se eliminarán las inscripciones asociadas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await orgService.deleteEvent(eventId);
              if (res.success !== false) {
                setMyEvents((prev) => prev.filter((e) => String(e.id) !== String(eventId)));
                Alert.alert('Evento Eliminado', 'El evento fue eliminado correctamente.');
              }
            } catch (err: any) {
              Alert.alert('Error', err?.response?.data?.message || 'No se pudo eliminar el evento.');
            }
          },
        },
      ]
    );
  };

  const getAppStatusConfig = (estado: string) => {
    switch (estado) {
      case 'aprobado':
        return { label: 'Aprobado', bg: '#DCFCE7', text: '#166534' };
      case 'confirmado':
        return { label: 'Confirmado', bg: '#DBEAFE', text: '#1D4ED8' };
      case 'rechazado':
        return { label: 'Rechazado', bg: '#FEE2E2', text: '#991B1B' };
      case 'pendiente':
      default:
        return { label: 'Pendiente', bg: '#FEF3C7', text: '#92400E' };
    }
  };

  if (isLoading) {
    return <AppLoader fullScreen message="Cargando panel de organización..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={styles.title} numberOfLines={1}>
                {user?.nombre1 || 'Mi Organización'}
              </Text>
              {verificada && <ShieldCheck size={17} color="#1D4ED8" />}
            </View>
            <Text style={styles.subtitle}>
              Panel de Gestión Social · Kennedy Solidario
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

        {/* Horizontal 4-Tab Switcher */}
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
            <Building2 size={14} color={activeTab === 'principal' ? '#FFFFFF' : '#64748B'} />
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
              Gestionar Eventos ({myEvents.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('donaciones')}
            style={[styles.tabPill, activeTab === 'donaciones' && styles.tabPillActive]}
          >
            <Heart size={14} color={activeTab === 'donaciones' ? '#FFFFFF' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'donaciones' && styles.tabTextActive]}>
              Donaciones Recibidas ({orgDonations.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setActiveTab('personas')}
            style={[styles.tabPill, activeTab === 'personas' && styles.tabPillActive]}
          >
            <Users size={14} color={activeTab === 'personas' ? '#FFFFFF' : '#64748B'} />
            <Text style={[styles.tabText, activeTab === 'personas' && styles.tabTextActive]}>
              Personas Vinculadas
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
            {/* Verification Banner */}
            {verificada ? (
              <View style={styles.verifSuccessBanner}>
                <ShieldCheck size={20} color="#1D4ED8" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.verifSuccessTitle}>Organización Verificada</Text>
                  <Text style={styles.verifSuccessSub}>
                    Tu entidad cuenta con el sello oficial de confianza en Give&Go.
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.verifPendingBanner}>
                <AlertCircle size={20} color="#B45309" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.verifPendingTitle}>
                    {estadoVerif === 'pendiente'
                      ? 'Verificación en Revisión'
                      : estadoVerif === 'rechazada'
                      ? 'Solicitud Rechazada - Puedes Reenviar'
                      : 'Solicita el Sello de Verificación'}
                  </Text>
                  <Text style={styles.verifPendingSub}>
                    {estadoVerif === 'pendiente'
                      ? 'El equipo administrador está auditando tu documentación.'
                      : 'Acredita tu organización para fortalecer la confianza de donantes y voluntarios.'}
                  </Text>
                </View>
                {estadoVerif !== 'pendiente' && (
                  <TouchableOpacity
                    style={styles.verifActionBtn}
                    onPress={() => setIsVerifModalOpen(true)}
                  >
                    <Text style={styles.verifActionBtnText}>Solicitar</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* Quick Actions */}
            <View style={styles.quickActionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.quickBtn, { backgroundColor: '#DC2626' }]}
                onPress={() => setIsCreateEventOpen(true)}
              >
                <Plus size={15} color="#FFFFFF" />
                <Text style={styles.quickBtnText}>Crear Evento</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.quickBtn, { backgroundColor: '#2563EB' }]}
                onPress={() => navigation?.navigate('MapaSocial')}
              >
                <Compass size={15} color="#FFFFFF" />
                <Text style={styles.quickBtnText}>Ver en Mapa</Text>
              </TouchableOpacity>
            </View>

            {/* 4 KPI Cards */}
            <View style={styles.kpiGrid}>
              <AdminStatCard label="Eventos Creados" value={myEvents.length} color="#DC2626" />
              <AdminStatCard
                label="Beneficiarios Postulados"
                value={beneficiaryApps.length}
                color="#D97706"
              />
              <AdminStatCard
                label="Voluntarios Postulados"
                value={volunteersList.length}
                color="#2563EB"
              />
              <AdminStatCard
                label="Fondos Recibidos"
                value={`$${totalFondosCOP.toLocaleString('es-CO')}`}
                color="#16A34A"
              />
            </View>

            {/* Beneficiarios Postulados (Direct Approve / Reject on Principal) */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Beneficiarios Postulados</Text>
              <TouchableOpacity
                onPress={() => {
                  setLinkedSubTab('beneficiarios');
                  setActiveTab('personas');
                }}
              >
                <Text style={styles.sectionLink}>Gestionar todos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar beneficiario por nombre o evento..."
                placeholderTextColor="#94A3B8"
                value={benSearch}
                onChangeText={setBenSearch}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {[
                { key: 'todos', label: 'Todos' },
                { key: 'pendiente', label: 'Pendientes' },
                { key: 'aprobado', label: 'Aprobados' },
                { key: 'confirmado', label: 'Confirmados' },
                { key: 'rechazado', label: 'Rechazados' },
              ].map((st) => (
                <TouchableOpacity
                  key={st.key}
                  onPress={() => setBenStatusFilter(st.key)}
                  style={[
                    styles.filterChip,
                    benStatusFilter === st.key && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      benStatusFilter === st.key && styles.filterChipTextActive,
                    ]}
                  >
                    {st.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {filteredBeneficiariesPrincipal.length === 0 ? (
              <View style={styles.emptyBox}>
                <Users size={28} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Sin postulaciones de beneficiarios</Text>
                <Text style={styles.emptySub}>
                  Cuando los beneficiarios se postulen a tus jornadas aparecerán aquí para aprobación.
                </Text>
              </View>
            ) : (
              filteredBeneficiariesPrincipal.map((app) => {
                const badge = getAppStatusConfig(app.estadoPostulacion);
                const isPending = app.estadoPostulacion === 'pendiente';
                return (
                  <View key={app.id} style={styles.applicantCard}>
                    <View style={styles.applicantTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.applicantName}>{app.usuarioNombre}</Text>
                        <Text style={styles.applicantEvent}>{app.eventoNombre}</Text>
                        <Text style={styles.applicantMeta}>
                          {app.usuarioCorreo} ·{' '}
                          {app.fechaPostulacion
                            ? new Date(app.fechaPostulacion).toLocaleDateString('es-CO')
                            : 'Reciente'}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                        <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                          {badge.label}
                        </Text>
                      </View>
                    </View>

                    {app.observaciones ? (
                      <Text style={styles.obsInline} numberOfLines={2}>
                        {app.observaciones}
                      </Text>
                    ) : null}

                    <View style={styles.applicantActionsRow}>
                      <TouchableOpacity
                        style={styles.smallDetailBtn}
                        onPress={() => setDetailBeneficiary(app)}
                      >
                        <Eye size={13} color="#475569" />
                        <Text style={styles.smallDetailBtnText}>Ver</Text>
                      </TouchableOpacity>

                      {isPending && (
                        <>
                          <TouchableOpacity
                            style={styles.approveBtn}
                            disabled={busyAppId === app.id}
                            onPress={() => handleUpdateBeneficiaryStatus(app, 'aprobado')}
                          >
                            <CheckCircle2 size={14} color="#FFFFFF" />
                            <Text style={styles.approveBtnText}>Aprobar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.rejectBtn}
                            disabled={busyAppId === app.id}
                            onPress={() => handleUpdateBeneficiaryStatus(app, 'rechazado')}
                          >
                            <XCircle size={14} color="#DC2626" />
                            <Text style={styles.rejectBtnText}>Rechazar</Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                );
              })
            )}

            {/* Voluntarios Inscritos Preview */}
            <View style={[styles.sectionHeaderRow, { marginTop: 6 }]}>
              <Text style={styles.sectionHeading}>Voluntarios Inscritos Recientes</Text>
              <TouchableOpacity
                onPress={() => {
                  setLinkedSubTab('voluntarios');
                  setActiveTab('personas');
                }}
              >
                <Text style={styles.sectionLink}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            {volunteersList.length === 0 ? (
              <View style={styles.emptyBox}>
                <UserCheck size={26} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Aún no hay voluntarios inscritos</Text>
              </View>
            ) : (
              volunteersList.slice(0, 3).map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={styles.previewRowCard}
                  activeOpacity={0.8}
                  onPress={() => setDetailVolunteer(v)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.applicantName}>{v.nombre}</Text>
                    <Text style={styles.applicantEvent}>{v.eventoNombre}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#1D4ED8' }]}>Voluntario</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}

            {/* Donaciones Recibidas Preview */}
            <View style={[styles.sectionHeaderRow, { marginTop: 6 }]}>
              <Text style={styles.sectionHeading}>Donaciones Recibidas Recientes</Text>
              <TouchableOpacity onPress={() => setActiveTab('donaciones')}>
                <Text style={styles.sectionLink}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            {orgDonations.length === 0 ? (
              <View style={styles.emptyBox}>
                <Heart size={26} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Sin donaciones recibidas todavía</Text>
              </View>
            ) : (
              orgDonations.slice(0, 2).map((don) => (
                <AdminDonationCard
                  key={don.id}
                  donation={don}
                  onConsult={(d) => setConsultDonation(d)}
                  onDownloadReceipt={(d) => downloadDonationReceipt(d)}
                />
              ))
            )}
          </View>
        )}

        {/* ======================================================= */}
        {/* TAB 2: GESTIONAR EVENTOS                                */}
        {/* ======================================================= */}
        {activeTab === 'eventos' && (
          <View style={styles.sectionStack}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>
                Mis Eventos ({filteredEvents.length})
              </Text>
              <TouchableOpacity
                style={styles.smallPrimaryBtn}
                onPress={() => setIsCreateEventOpen(true)}
              >
                <Plus size={13} color="#FFFFFF" />
                <Text style={styles.smallPrimaryBtnText}>Crear Evento</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar evento por nombre, dirección o barrio..."
                placeholderTextColor="#94A3B8"
                value={eventSearch}
                onChangeText={setEventSearch}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {(['todos', 'activo', 'finalizado', 'cancelado'] as const).map((st) => (
                <TouchableOpacity
                  key={st}
                  onPress={() => setEventStatusFilter(st)}
                  style={[
                    styles.filterChip,
                    eventStatusFilter === st && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      eventStatusFilter === st && styles.filterChipTextActive,
                    ]}
                  >
                    {st === 'todos' ? 'Todos los estados' : st.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {categories.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {['Todas', ...categories.map((c) => c.nombre)].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setEventCategoryFilter(cat)}
                    style={[
                      styles.filterChip,
                      eventCategoryFilter === cat && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        eventCategoryFilter === cat && styles.filterChipTextActive,
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
                <Text style={styles.emptyTitle}>No hay eventos registrados</Text>
                <Text style={styles.emptySub}>
                  Crea una nueva convocatoria comunitaria para movilizar voluntarios y beneficiarios.
                </Text>
              </View>
            ) : (
              filteredEvents.map((evt) => (
                <AdminEventCard
                  key={evt.id}
                  event={evt}
                  onConsult={(e) => setConsultEvent(e)}
                  onEdit={(e) => setEditingEvent(e)}
                  onDelete={(id) => handleDeleteEvent(id)}
                />
              ))
            )}
          </View>
        )}

        {/* ======================================================= */}
        {/* TAB 3: DONACIONES RECIBIDAS                             */}
        {/* ======================================================= */}
        {activeTab === 'donaciones' && (
          <View style={styles.sectionStack}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>
                Donaciones Recibidas ({filteredDonations.length})
              </Text>
              <TouchableOpacity
                style={[styles.smallPrimaryBtn, { backgroundColor: '#16A34A' }]}
                onPress={() =>
                  navigation?.navigate('CreateDonation', { defaultOrgId: cleanOrgId })
                }
              >
                <Plus size={13} color="#FFFFFF" />
                <Text style={styles.smallPrimaryBtnText}>Hacer Donación</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por donante, categoría o descripción..."
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

            {donationCategories.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {donationCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setDonationCatFilter(cat)}
                    style={[
                      styles.filterChip,
                      donationCatFilter === cat && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        donationCatFilter === cat && styles.filterChipTextActive,
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
                <Text style={styles.emptyTitle}>No hay donaciones recibidas</Text>
                <Text style={styles.emptySub}>
                  Aquí aparecerán los aportes monetarios y en especie destinados a tu organización.
                </Text>
              </View>
            ) : (
              filteredDonations.map((don) => (
                <AdminDonationCard
                  key={don.id}
                  donation={don}
                  onConsult={(d) => setConsultDonation(d)}
                  onDownloadReceipt={(d) => downloadDonationReceipt(d)}
                />
              ))
            )}
          </View>
        )}

        {/* ======================================================= */}
        {/* TAB 4: PERSONAS VINCULADAS                              */}
        {/* ======================================================= */}
        {activeTab === 'personas' && (
          <View style={styles.sectionStack}>
            {/* Sub-tab Switcher */}
            <View style={styles.subTabBar}>
              <TouchableOpacity
                style={[
                  styles.subTabBtn,
                  linkedSubTab === 'voluntarios' && styles.subTabBtnActive,
                ]}
                onPress={() => setLinkedSubTab('voluntarios')}
              >
                <Text
                  style={[
                    styles.subTabText,
                    linkedSubTab === 'voluntarios' && styles.subTabTextActive,
                  ]}
                >
                  Voluntarios Inscritos ({volunteersList.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.subTabBtn,
                  linkedSubTab === 'beneficiarios' && styles.subTabBtnActive,
                ]}
                onPress={() => setLinkedSubTab('beneficiarios')}
              >
                <Text
                  style={[
                    styles.subTabText,
                    linkedSubTab === 'beneficiarios' && styles.subTabTextActive,
                  ]}
                >
                  Beneficiarios ({beneficiaryApps.length})
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.searchBar}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar persona por nombre, correo o evento..."
                placeholderTextColor="#94A3B8"
                value={personSearch}
                onChangeText={setPersonSearch}
              />
            </View>

            {myEvents.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipRow}
              >
                {['Todos', ...myEvents.map((e) => e.nombre)].map((evtName) => (
                  <TouchableOpacity
                    key={evtName}
                    onPress={() => setPersonEventFilter(evtName)}
                    style={[
                      styles.filterChip,
                      personEventFilter === evtName && styles.filterChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        personEventFilter === evtName && styles.filterChipTextActive,
                      ]}
                      numberOfLines={1}
                    >
                      {evtName}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {linkedSubTab === 'voluntarios' ? (
              filteredVolunteers.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Users size={30} color="#94A3B8" />
                  <Text style={styles.emptyTitle}>Sin voluntarios vinculados</Text>
                </View>
              ) : (
                filteredVolunteers.map((vol) => (
                  <View key={vol.id} style={styles.applicantCard}>
                    <View style={styles.applicantTopRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.applicantName}>{vol.nombre}</Text>
                        <Text style={styles.applicantEvent}>{vol.eventoNombre}</Text>
                        <Text style={styles.applicantMeta}>
                          {vol.correo} · {vol.telefono}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: '#EFF6FF' }]}>
                        <Text style={[styles.statusBadgeText, { color: '#1D4ED8' }]}>
                          Voluntario
                        </Text>
                      </View>
                    </View>

                    <View style={styles.applicantActionsRow}>
                      <TouchableOpacity
                        style={styles.smallDetailBtn}
                        onPress={() => setDetailVolunteer(vol)}
                      >
                        <Eye size={13} color="#475569" />
                        <Text style={styles.smallDetailBtnText}>Detalle</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.rejectBtn}
                        disabled={busyAppId === vol.id}
                        onPress={() => handleUnlinkVolunteer(vol)}
                      >
                        <Trash2 size={13} color="#DC2626" />
                        <Text style={styles.rejectBtnText}>Desvincular</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )
            ) : (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.chipRow}
                >
                  {[
                    { key: 'todos', label: 'Todos' },
                    { key: 'pendiente', label: 'Pendientes' },
                    { key: 'aprobado', label: 'Aprobados' },
                    { key: 'confirmado', label: 'Confirmados' },
                    { key: 'rechazado', label: 'Rechazados' },
                  ].map((st) => (
                    <TouchableOpacity
                      key={st.key}
                      onPress={() => setBenStatusFilter(st.key)}
                      style={[
                        styles.filterChip,
                        benStatusFilter === st.key && styles.filterChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.filterChipText,
                          benStatusFilter === st.key && styles.filterChipTextActive,
                        ]}
                      >
                        {st.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {filteredBeneficiariesLinked.length === 0 ? (
                  <View style={styles.emptyBox}>
                    <Users size={30} color="#94A3B8" />
                    <Text style={styles.emptyTitle}>Sin beneficiarios vinculados</Text>
                  </View>
                ) : (
                  filteredBeneficiariesLinked.map((app) => {
                    const badge = getAppStatusConfig(app.estadoPostulacion);
                    const isPending = app.estadoPostulacion === 'pendiente';
                    return (
                      <View key={app.id} style={styles.applicantCard}>
                        <View style={styles.applicantTopRow}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.applicantName}>{app.usuarioNombre}</Text>
                            <Text style={styles.applicantEvent}>{app.eventoNombre}</Text>
                            <Text style={styles.applicantMeta}>
                              {app.usuarioCorreo} · {app.usuarioTelefono || 'N/A'}
                            </Text>
                          </View>
                          <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                            <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                              {badge.label}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.applicantActionsRow}>
                          <TouchableOpacity
                            style={styles.smallDetailBtn}
                            onPress={() => setDetailBeneficiary(app)}
                          >
                            <Eye size={13} color="#475569" />
                            <Text style={styles.smallDetailBtnText}>Detalle</Text>
                          </TouchableOpacity>

                          {isPending && (
                            <>
                              <TouchableOpacity
                                style={styles.approveBtn}
                                disabled={busyAppId === app.id}
                                onPress={() => handleUpdateBeneficiaryStatus(app, 'aprobado')}
                              >
                                <CheckCircle2 size={13} color="#FFFFFF" />
                                <Text style={styles.approveBtnText}>Aprobar</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.rejectBtn}
                                disabled={busyAppId === app.id}
                                onPress={() => handleUpdateBeneficiaryStatus(app, 'rechazado')}
                              >
                                <XCircle size={13} color="#DC2626" />
                                <Text style={styles.rejectBtnText}>Rechazar</Text>
                              </TouchableOpacity>
                            </>
                          )}

                          <TouchableOpacity
                            style={styles.rejectBtn}
                            disabled={busyAppId === app.id}
                            onPress={() => handleDeleteBeneficiaryPostulacion(app)}
                          >
                            <Trash2 size={13} color="#DC2626" />
                            <Text style={styles.rejectBtnText}>Eliminar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })
                )}
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modals: Events & Donations */}
      <CreateEventModal
        visible={isCreateEventOpen}
        categories={categories}
        fixedOrgId={orgId}
        onClose={() => setIsCreateEventOpen(false)}
        onSubmit={handleCreateEvent}
      />

      <EditEventModal
        visible={!!editingEvent}
        event={editingEvent}
        categories={categories}
        onClose={() => setEditingEvent(null)}
        onSubmit={handleUpdateEvent}
      />

      <EventDetailModal
        visible={!!consultEvent}
        event={consultEvent}
        onClose={() => setConsultEvent(null)}
        onEdit={(e) => setEditingEvent(e)}
      />

      <DonationDetailModal
        visible={!!consultDonation}
        donation={consultDonation}
        onClose={() => setConsultDonation(null)}
      />

      {/* Modal: Verification Request */}
      <Modal
        visible={isVerifModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVerifModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={20} color="#DC2626" />
                <Text style={styles.modalTitle}>Solicitar Verificación</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsVerifModalOpen(false)}
                style={styles.closeBtn}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Completa los datos institucionales para obtener el sello de verificación oficial.
            </Text>

            <Text style={styles.inputLabel}>NIT Institucional *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="900.123.456-7"
              placeholderTextColor="#94A3B8"
              value={nitInput}
              onChangeText={setNitInput}
            />

            <Text style={styles.inputLabel}>Mensaje / Presentación</Text>
            <TextInput
              style={[styles.modalInput, { height: 74 }]}
              placeholder="Describe brevemente la labor comunitaria de tu organización..."
              placeholderTextColor="#94A3B8"
              value={mensajeInput}
              onChangeText={setMensajeInput}
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.inputLabel}>Enlace a Documentos (RUT / Cámara)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://drive.google.com/..."
              placeholderTextColor="#94A3B8"
              value={documentosInput}
              onChangeText={setDocumentosInput}
            />

            <View style={styles.modalActions}>
              <AppButton
                title="Cancelar"
                variant="outline"
                onPress={() => setIsVerifModalOpen(false)}
                style={{ flex: 1 }}
              />
              <AppButton
                title="Enviar a Revisión"
                variant="primary"
                loading={isSubmittingVerif}
                onPress={handleSendVerification}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal: Beneficiary Detail */}
      <Modal
        visible={!!detailBeneficiary}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailBeneficiary(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle de Postulación</Text>
              <TouchableOpacity
                onPress={() => setDetailBeneficiary(null)}
                style={styles.closeBtn}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {detailBeneficiary && (
              <View style={{ gap: 10 }}>
                <Text style={styles.detailHeading}>{detailBeneficiary.usuarioNombre}</Text>
                <View style={styles.detailRow}>
                  <Calendar size={14} color="#64748B" />
                  <Text style={styles.detailText}>{detailBeneficiary.eventoNombre}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Mail size={14} color="#64748B" />
                  <Text style={styles.detailText}>{detailBeneficiary.usuarioCorreo}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Phone size={14} color="#64748B" />
                  <Text style={styles.detailText}>
                    {detailBeneficiary.usuarioTelefono || 'Sin teléfono'}
                  </Text>
                </View>
                {detailBeneficiary.observaciones ? (
                  <View style={styles.obsBox}>
                    <Text style={styles.obsLabel}>Observaciones:</Text>
                    <Text style={styles.obsText}>{detailBeneficiary.observaciones}</Text>
                  </View>
                ) : null}

                <View style={[styles.modalActions, { marginTop: 10 }]}>
                  {detailBeneficiary.estadoPostulacion === 'pendiente' && (
                    <>
                      <AppButton
                        title="Aprobar"
                        variant="primary"
                        loading={busyAppId === detailBeneficiary.id}
                        onPress={() =>
                          handleUpdateBeneficiaryStatus(detailBeneficiary, 'aprobado')
                        }
                        style={{ flex: 1 }}
                      />
                      <AppButton
                        title="Rechazar"
                        variant="outline"
                        loading={busyAppId === detailBeneficiary.id}
                        onPress={() =>
                          handleUpdateBeneficiaryStatus(detailBeneficiary, 'rechazado')
                        }
                        style={{ flex: 1 }}
                      />
                    </>
                  )}
                  <AppButton
                    title="Cerrar"
                    variant="outline"
                    onPress={() => setDetailBeneficiary(null)}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal: Volunteer Detail */}
      <Modal
        visible={!!detailVolunteer}
        transparent
        animationType="slide"
        onRequestClose={() => setDetailVolunteer(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Detalle de Voluntario</Text>
              <TouchableOpacity
                onPress={() => setDetailVolunteer(null)}
                style={styles.closeBtn}
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {detailVolunteer && (
              <View style={{ gap: 10 }}>
                <Text style={styles.detailHeading}>{detailVolunteer.nombre}</Text>
                <View style={styles.detailRow}>
                  <Calendar size={14} color="#64748B" />
                  <Text style={styles.detailText}>{detailVolunteer.eventoNombre}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Mail size={14} color="#64748B" />
                  <Text style={styles.detailText}>{detailVolunteer.correo}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Phone size={14} color="#64748B" />
                  <Text style={styles.detailText}>{detailVolunteer.telefono}</Text>
                </View>

                <View style={[styles.modalActions, { marginTop: 10 }]}>
                  <AppButton
                    title="Desvincular"
                    variant="outline"
                    loading={busyAppId === detailVolunteer.id}
                    onPress={() => handleUnlinkVolunteer(detailVolunteer)}
                    style={{ flex: 1 }}
                  />
                  <AppButton
                    title="Cerrar"
                    variant="primary"
                    onPress={() => setDetailVolunteer(null)}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            )}
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
    fontSize: 20,
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
    paddingHorizontal: 13,
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
  verifSuccessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    padding: 12,
  },
  verifSuccessTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E40AF',
  },
  verifSuccessSub: {
    fontSize: 11,
    color: '#1D4ED8',
    marginTop: 1,
  },
  verifPendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
  },
  verifPendingTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  verifPendingSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  verifActionBtn: {
    backgroundColor: '#D97706',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  verifActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  quickActionRow: {
    flexDirection: 'row',
    gap: 10,
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
    fontSize: 13,
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
    maxWidth: 180,
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
  applicantCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  applicantTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  applicantName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  applicantEvent: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 2,
  },
  applicantMeta: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  obsInline: {
    fontSize: 12,
    color: '#475569',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 8,
  },
  applicantActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  smallDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smallDetailBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#16A34A',
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  previewRowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  subTabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  subTabBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  subTabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  subTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  subTabTextActive: {
    color: '#DC2626',
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 17,
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
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  detailHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  obsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
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
});

export default OrgDashboardView;
