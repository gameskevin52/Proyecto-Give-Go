import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Users,
  Building2,
  Calendar,
  Heart,
  Tag,
  ShieldCheck,
  Search,
  Plus,
  LayoutDashboard,
  Filter,
  CheckCircle2,
  Clock,
  Inbox,
  X,
  FileText,
  DollarSign,
  TrendingUp,
} from 'lucide-react-native';
import { AdminService } from '../services/admin.service';
import {
  AdminStats,
  AdminUserItem,
  AdminOrgItem,
  AdminVerificationItem,
  AdminEventItem,
  AdminDonationItem,
  AdminCategoryItem,
  CreateUserPayload,
} from '../models/admin.models';
import { AdminStatCard } from '../components/AdminStatCard';
import { AdminUserCard } from '../components/AdminUserCard';
import { AdminOrgCard } from '../components/AdminOrgCard';
import { AdminVerificationCard } from '../components/AdminVerificationCard';
import { AdminEventCard } from '../components/AdminEventCard';
import { AdminDonationCard } from '../components/AdminDonationCard';
import { AdminCategoryCard } from '../components/AdminCategoryCard';

// Modals
import { CreateUserModal } from '../components/CreateUserModal';
import { EditUserModal } from '../components/EditUserModal';
import { UserDetailModal } from '../components/UserDetailModal';

import { CreateOrgModal } from '../components/CreateOrgModal';
import { EditOrgModal } from '../components/EditOrgModal';
import { OrgDetailModal } from '../components/OrgDetailModal';

import { CreateVerificationModal } from '../components/CreateVerificationModal';
import { RespondVerificationModal } from '../components/RespondVerificationModal';
import { VerificationDetailModal } from '../components/VerificationDetailModal';

import { CreateEventModal } from '../components/CreateEventModal';
import { EditEventModal } from '../components/EditEventModal';
import { EventDetailModal } from '../components/EventDetailModal';

import { CreateDonationModal } from '../components/CreateDonationModal';
import { DonationDetailModal } from '../components/DonationDetailModal';

import { CreateCategoryModal } from '../components/CreateCategoryModal';
import { EditCategoryModal } from '../components/EditCategoryModal';
import { CategoryDetailModal } from '../components/CategoryDetailModal';

import { downloadDonationReceipt } from '../utils/donationReceipt';
import { styles } from '../styles/admin.styles';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';
import { colors } from '../../../config/theme';

type AdminTab =
  | 'resumen'
  | 'usuarios'
  | 'organizaciones'
  | 'verificaciones'
  | 'eventos'
  | 'donaciones'
  | 'categorias';

export const AdminDashboardView: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('resumen');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data States
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalDonations: 0,
    pendingVerifications: 0,
  });
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [orgs, setOrgs] = useState<AdminOrgItem[]>([]);
  const [verifications, setVerifications] = useState<AdminVerificationItem[]>([]);
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [donations, setDonations] = useState<AdminDonationItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('todos');
  const [orgFilter, setOrgFilter] = useState<'todas' | 'verificadas' | 'no_verificadas'>('todas');
  const [verifFilter, setVerifFilter] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada'>('todas');
  const [eventFilter, setEventFilter] = useState<'todos' | 'activo' | 'finalizado' | 'cancelado'>('todos');
  const [donationFilter, setDonationFilter] = useState<'todas' | 'monetaria' | 'objeto'>('todas');
  const [categoryFilter, setCategoryFilter] = useState<'todas' | 'activa' | 'inactiva'>('todas');

  // Modal States
  // Users
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<AdminUserItem | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserItem | null>(null);

  // Orgs
  const [isCreateOrgModalOpen, setIsCreateOrgModalOpen] = useState(false);
  const [selectedOrgToEdit, setSelectedOrgToEdit] = useState<AdminOrgItem | null>(null);
  const [selectedOrgDetail, setSelectedOrgDetail] = useState<AdminOrgItem | null>(null);

  // Verifications
  const [isCreateVerifModalOpen, setIsCreateVerifModalOpen] = useState(false);
  const [selectedVerifToRespond, setSelectedVerifToRespond] = useState<AdminVerificationItem | null>(null);
  const [selectedVerifDetail, setSelectedVerifDetail] = useState<AdminVerificationItem | null>(null);

  // Events
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState<AdminEventItem | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState<AdminEventItem | null>(null);

  // Donations
  const [isCreateDonationModalOpen, setIsCreateDonationModalOpen] = useState(false);
  const [selectedDonationDetail, setSelectedDonationDetail] = useState<AdminDonationItem | null>(null);

  // Categories
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [selectedCategoryToEdit, setSelectedCategoryToEdit] = useState<AdminCategoryItem | null>(null);
  const [selectedCategoryDetail, setSelectedCategoryDetail] = useState<AdminCategoryItem | null>(null);

  const loadAllData = useCallback(async () => {
    try {
      const [
        statsData,
        usersData,
        orgsData,
        verifData,
        eventsData,
        donationsData,
        catsData,
      ] = await Promise.all([
        AdminService.getDashboardStats().catch(() => ({
          totalUsers: 0,
          totalEvents: 0,
          totalDonations: 0,
          pendingVerifications: 0,
        })),
        AdminService.getAllUsers().catch(() => []),
        AdminService.getAllOrganizations().catch(() => []),
        AdminService.getAllVerifications().catch(() => []),
        AdminService.getAllEvents().catch(() => []),
        AdminService.getAllDonations().catch(() => []),
        AdminService.getAllCategories().catch(() => []),
      ]);

      setStats({
        totalUsers: usersData.length || statsData.totalUsers,
        totalEvents: eventsData.length || statsData.totalEvents,
        totalDonations: donationsData.length || statsData.totalDonations,
        pendingVerifications: verifData.filter((v) => v.estado === 'pendiente').length,
      });

      setUsers(usersData);
      setOrgs(orgsData);
      setVerifications(verifData);
      setEvents(eventsData);
      setDonations(donationsData);
      setCategories(catsData);
    } catch (err) {
      console.warn('Error loading admin dashboard data:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadAllData();
  }, [loadAllData]);

  // Switch tab and reset search
  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setSearchTerm('');
  };

  // ==========================================
  // FILTERED DATA
  // ==========================================
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        `${u.nombre1} ${u.nombre2 || ''} ${u.apellido1} ${u.apellido2 || ''}`
          .toLowerCase()
          .includes(term) ||
        u.correo.toLowerCase().includes(term) ||
        (u.telefono && u.telefono.includes(term));

      const matchesRole =
        roleFilter === 'todos' ||
        u.rol.toLowerCase().includes(roleFilter.toLowerCase());

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const filteredOrgs = useMemo(() => {
    return orgs.filter((o) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        o.nombre.toLowerCase().includes(term) ||
        o.correo.toLowerCase().includes(term) ||
        (o.nit && o.nit.toLowerCase().includes(term)) ||
        (o.direccion && o.direccion.toLowerCase().includes(term));

      let matchesVerif = true;
      if (orgFilter === 'verificadas') matchesVerif = Boolean(o.verificada);
      if (orgFilter === 'no_verificadas') matchesVerif = !Boolean(o.verificada);

      return matchesSearch && matchesVerif;
    });
  }, [orgs, searchTerm, orgFilter]);

  const filteredVerifications = useMemo(() => {
    return verifications.filter((v) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        v.nombreOrganizacion.toLowerCase().includes(term) ||
        v.nit.toLowerCase().includes(term) ||
        (v.correoOrganizacion && v.correoOrganizacion.toLowerCase().includes(term));

      const matchesStatus =
        verifFilter === 'todas' || v.estado === verifFilter;

      return matchesSearch && matchesStatus;
    });
  }, [verifications, searchTerm, verifFilter]);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        e.nombre.toLowerCase().includes(term) ||
        (e.descripcion && e.descripcion.toLowerCase().includes(term)) ||
        (e.direccion && e.direccion.toLowerCase().includes(term)) ||
        (e.categoria && e.categoria.toLowerCase().includes(term));

      const matchesStatus =
        eventFilter === 'todos' || e.estado === eventFilter;

      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, eventFilter]);

  const filteredDonations = useMemo(() => {
    return donations.filter((d) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        (d.usuarioNombre && d.usuarioNombre.toLowerCase().includes(term)) ||
        (d.organizacionNombre && d.organizacionNombre.toLowerCase().includes(term)) ||
        (d.categoria && d.categoria.toLowerCase().includes(term));

      const matchesType =
        donationFilter === 'todas' || d.tipo === donationFilter;

      return matchesSearch && matchesType;
    });
  }, [donations, searchTerm, donationFilter]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        term === '' ||
        c.nombre.toLowerCase().includes(term) ||
        (c.descripcion && c.descripcion.toLowerCase().includes(term));

      const rawEst = String(c.estado || '').toLowerCase();
      const isActivo = rawEst === 'activo' || rawEst === '1';

      let matchesStatus = true;
      if (categoryFilter === 'activa') matchesStatus = isActivo;
      if (categoryFilter === 'inactiva') matchesStatus = !isActivo;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, categoryFilter]);

  // Total funds calculated
  const totalFunds = useMemo(() => {
    return donations
      .filter((d) => d.tipo === 'monetaria')
      .reduce((sum, d) => sum + (d.monetaria?.valor || 0), 0);
  }, [donations]);

  // ==========================================
  // HANDLERS (CRUD)
  // ==========================================

  // 1. Users Handlers
  const handleCreateUser = async (payload: CreateUserPayload) => {
    const res = await AdminService.createUser(payload);
    if (res.success && res.data) {
      setUsers((prev) => [res.data!, ...prev]);
      setStats((prev) => ({ ...prev, totalUsers: prev.totalUsers + 1 }));
    }
    return res;
  };

  const handleUpdateUser = async (id: string | number, payload: Partial<AdminUserItem>) => {
    const res = await AdminService.updateUser(id, payload);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (String(u.id) === String(id) ? { ...u, ...payload } : u))
      );
    }
    return res;
  };

  const handleToggleUserStatus = async (user: AdminUserItem) => {
    const next = user.estado === 'activo' ? 'inactivo' : 'activo';
    await AdminService.updateUser(user.id, { estado: next });
    setUsers((prev) =>
      prev.map((u) => (String(u.id) === String(user.id) ? { ...u, estado: next } : u))
    );
  };

  const handleDeleteUser = async (userId: string | number) => {
    Alert.alert('Eliminar Usuario', '¿Confirmas la eliminación permanente del usuario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await AdminService.deleteUser(userId);
          setUsers((prev) => prev.filter((u) => String(u.id) !== String(userId)));
          setStats((prev) => ({ ...prev, totalUsers: Math.max(0, prev.totalUsers - 1) }));
        },
      },
    ]);
  };

  // 2. Org Handlers
  const handleCreateOrg = async (payload: any) => {
    const res = await AdminService.createOrganization(payload);
    if (res.success && res.data) {
      setOrgs((prev) => [res.data!, ...prev]);
    }
    return res;
  };

  const handleUpdateOrg = async (id: string, payload: Partial<AdminOrgItem>) => {
    const res = await AdminService.updateOrganization(id, payload);
    if (res.success) {
      setOrgs((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...payload } : o))
      );
    }
    return res;
  };

  const handleDeleteOrg = async (orgId: string) => {
    Alert.alert('Eliminar Organización', '¿Deseas eliminar esta organización del directorio oficial?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await AdminService.deleteOrganization(orgId);
          setOrgs((prev) => prev.filter((o) => o.id !== orgId));
        },
      },
    ]);
  };

  // 3. Verifications Handlers
  const handleCreateVerification = async (payload: any) => {
    const res = await AdminService.createVerification(payload);
    if (res.success) {
      loadAllData();
    }
    return res;
  };

  const handleRespondVerification = async (
    id: string,
    estado: 'aprobada' | 'rechazada',
    respuestaAdmin: string
  ) => {
    const res = await AdminService.respondVerification(id, { estado, respuestaAdmin });
    if (res.success) {
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? { ...v, estado, respuestaAdmin } : v))
      );
      setStats((prev) => ({
        ...prev,
        pendingVerifications: Math.max(0, prev.pendingVerifications - 1),
      }));
    }
    return res;
  };

  const handleDeleteVerification = async (id: string) => {
    Alert.alert('Eliminar Solicitud', '¿Eliminar esta solicitud de verificación?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await AdminService.deleteVerification(id);
          setVerifications((prev) => prev.filter((v) => v.id !== id));
        },
      },
    ]);
  };

  // 4. Events Handlers
  const handleCreateEvent = async (payload: any) => {
    const res = await AdminService.createEvent(payload);
    if (res.success) {
      loadAllData();
    }
    return res;
  };

  const handleUpdateEvent = async (id: string | number, payload: Partial<AdminEventItem>) => {
    const res = await AdminService.updateEvent(String(id), payload);
    if (res.success) {
      setEvents((prev) =>
        prev.map((e) => (String(e.id) === String(id) ? { ...e, ...payload } : e))
      );
    }
    return res;
  };

  const handleDeleteEvent = async (eventId: string | number) => {
    Alert.alert('Eliminar Convocatoria', '¿Eliminar este evento comunitario?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await AdminService.deleteEvent(String(eventId));
          setEvents((prev) => prev.filter((e) => String(e.id) !== String(eventId)));
          setStats((prev) => ({ ...prev, totalEvents: Math.max(0, prev.totalEvents - 1) }));
        },
      },
    ]);
  };

  // 5. Donations Handlers
  const handleCreateDonation = async (payload: any) => {
    const res = await AdminService.createDonation(payload);
    if (res.success) {
      loadAllData();
    }
    return res;
  };

  // 6. Categories Handlers
  const handleCreateCategory = async (payload: any) => {
    const res = await AdminService.createCategory(payload);
    if (res.success) {
      loadAllData();
    }
    return res;
  };

  const handleUpdateCategory = async (id: string, payload: Partial<AdminCategoryItem>) => {
    const res = await AdminService.updateCategory(id, payload);
    if (res.success) {
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...payload } : c))
      );
    }
    return res;
  };

  const handleDeleteCategory = async (categoryId: string) => {
    Alert.alert('Eliminar Categoría', '¿Eliminar esta causa social?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          await AdminService.deleteCategory(categoryId);
          setCategories((prev) => prev.filter((c) => c.id !== categoryId));
        },
      },
    ]);
  };

  if (isLoading) {
    return <AppLoader message="Cargando centro de administración oficial..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={styles.title}>Panel de Administración</Text>
            <Text style={styles.subtitle}>
              Supervisión de usuarios, organizaciones, eventos y libros contables
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs Selector Bar (matching Web Admin exactly) */}
      <View style={{ backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', paddingVertical: 6 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        >
          {[
            { key: 'resumen', label: 'Resumen', icon: LayoutDashboard },
            { key: 'usuarios', label: `Usuarios (${users.length})`, icon: Users },
            { key: 'organizaciones', label: `Organizaciones (${orgs.length})`, icon: Building2 },
            { key: 'verificaciones', label: `Verificaciones (${stats.pendingVerifications})`, icon: ShieldCheck },
            { key: 'eventos', label: `Eventos (${events.length})`, icon: Calendar },
            { key: 'donaciones', label: `Donaciones (${donations.length})`, icon: Heart },
            { key: 'categorias', label: `Categorías (${categories.length})`, icon: Tag },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                onPress={() => handleTabChange(tab.key as AdminTab)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  backgroundColor: isActive ? colors.primary : '#F1F5F9',
                  borderWidth: 1,
                  borderColor: isActive ? colors.primary : '#E2E8F0',
                }}
              >
                <Icon
                  size={13}
                  color={isActive ? '#FFFFFF' : '#64748B'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '700',
                    color: isActive ? '#FFFFFF' : '#475569',
                  }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 }]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* ========================================================= */}
        {/* TAB 1: RESUMEN                                            */}
        {/* ========================================================= */}
        {activeTab === 'resumen' && (
          <View style={{ gap: 16 }}>
            {/* KPI Cards Grid */}
            <View style={styles.statsGrid}>
              <AdminStatCard
                label="Usuarios Totales"
                value={users.length}
                color="#DC2626"
                onPress={() => handleTabChange('usuarios')}
              />
              <AdminStatCard
                label="Organizaciones"
                value={orgs.length}
                color="#2563EB"
                onPress={() => handleTabChange('organizaciones')}
              />
              <AdminStatCard
                label="Eventos Activos"
                value={events.length}
                color="#7C3AED"
                onPress={() => handleTabChange('eventos')}
              />
              <AdminStatCard
                label="Verif. Pendientes"
                value={stats.pendingVerifications}
                color="#D97706"
                onPress={() => handleTabChange('verificaciones')}
              />
            </View>

            {/* Total Funds Highlight Card */}
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#64748B', textTransform: 'uppercase' }}>
                  Fondos Recaudados en Donaciones
                </Text>
                <Text style={{ fontSize: 24, fontWeight: '900', color: '#0F172A', marginTop: 2 }}>
                  ${totalFunds.toLocaleString('es-CO')} COP
                </Text>
                <Text style={{ fontSize: 11, color: '#16A34A', fontWeight: '600', marginTop: 2 }}>
                  Libro contable auditado de donaciones monetarias y en especie
                </Text>
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: '#FEF2F2',
                  borderWidth: 1,
                  borderColor: '#FECACA',
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 10,
                }}
                onPress={() => handleTabChange('donaciones')}
              >
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
                  Ver Libro
                </Text>
              </TouchableOpacity>
            </View>

            {/* Quick Actions to the 6 Management Sections */}
            <Text style={styles.sectionTitle}>Módulos Oficiales de Gestión</Text>
            <View style={{ gap: 8 }}>
              {[
                { tab: 'usuarios', title: 'Usuarios del Sistema', count: `${users.length} registrados`, color: '#DC2626', icon: Users },
                { tab: 'organizaciones', title: 'Organizaciones y Fundaciones', count: `${orgs.length} entidades`, color: '#2563EB', icon: Building2 },
                { tab: 'verificaciones', title: 'Solicitudes de Verificación', count: `${stats.pendingVerifications} pendientes`, color: '#D97706', icon: ShieldCheck },
                { tab: 'eventos', title: 'Convocatorias Comunitarias', count: `${events.length} jornadas`, color: '#7C3AED', icon: Calendar },
                { tab: 'donaciones', title: 'Donaciones y Aportes', count: `${donations.length} transacciones`, color: '#16A34A', icon: Heart },
                { tab: 'categorias', title: 'Categorías y Causas', count: `${categories.length} causas`, color: '#0D9488', icon: Tag },
              ].map((mod) => {
                const Icon = mod.icon;
                return (
                  <TouchableOpacity
                    key={mod.tab}
                    activeOpacity={0.7}
                    onPress={() => handleTabChange(mod.tab as AdminTab)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF',
                      borderRadius: 14,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: '#E2E8F0',
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: '#F8FAFC',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Icon size={18} color={mod.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A' }}>
                        {mod.title}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#64748B' }}>{mod.count}</Text>
                    </View>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: mod.color }}>
                      Gestionar →
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Recent Verifications Preview */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <Text style={styles.sectionTitle}>Verificaciones Pendientes de Auditoría</Text>
              <TouchableOpacity onPress={() => handleTabChange('verificaciones')}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.primary }}>
                  Ver todas
                </Text>
              </TouchableOpacity>
            </View>

            {verifications.filter((v) => v.estado === 'pendiente').length === 0 ? (
              <View style={{ backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, alignItems: 'center' }}>
                <CheckCircle2 size={32} color="#16A34A" />
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F172A', marginTop: 8 }}>
                  No hay solicitudes pendientes
                </Text>
              </View>
            ) : (
              verifications
                .filter((v) => v.estado === 'pendiente')
                .slice(0, 3)
                .map((v) => (
                  <AdminVerificationCard
                    key={v.id}
                    item={v}
                    onRespond={(item) => setSelectedVerifToRespond(item)}
                    onConsult={(item) => setSelectedVerifDetail(item)}
                    onDelete={(id) => handleDeleteVerification(id)}
                  />
                ))
            )}
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 2: USUARIOS                                           */}
        {/* ========================================================= */}
        {activeTab === 'usuarios' && (
          <View style={{ gap: 12 }}>
            {/* Top Action Bar */}
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  paddingHorizontal: 10,
                  height: 40,
                }}
              >
                <Search size={16} color="#94A3B8" />
                <TextInput
                  style={{ flex: 1, fontSize: 13, color: '#0F172A', marginLeft: 8 }}
                  placeholder="Buscar usuario..."
                  placeholderTextColor="#94A3B8"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
                {searchTerm ? (
                  <TouchableOpacity onPress={() => setSearchTerm('')}>
                    <X size={14} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 12,
                  height: 40,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
                onPress={() => setIsCreateUserModalOpen(true)}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
                  Nuevo
                </Text>
              </TouchableOpacity>
            </View>

            {/* Role Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {['todos', 'voluntario', 'beneficiario', 'organizacion', 'admin'].map((r) => (
                <TouchableOpacity
                  key={r}
                  activeOpacity={0.7}
                  onPress={() => setRoleFilter(r)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 16,
                    backgroundColor: roleFilter === r ? '#0F172A' : '#F1F5F9',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: roleFilter === r ? '#FFFFFF' : '#64748B',
                      textTransform: 'capitalize',
                    }}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>
              Mostrando {filteredUsers.length} usuarios
            </Text>

            {filteredUsers.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Inbox size={40} color="#94A3B8" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 10 }}>
                  No se encontraron usuarios
                </Text>
              </View>
            ) : (
              filteredUsers.map((u) => (
                <AdminUserCard
                  key={String(u.id_usuario || u.id)}
                  user={u}
                  onToggleStatus={handleToggleUserStatus}
                  onEdit={(user) => setSelectedUserToEdit(user)}
                  onDelete={(id) => handleDeleteUser(id)}
                  onConsult={(user) => setSelectedUserDetail(user)}
                />
              ))
            )}
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 3: ORGANIZACIONES                                     */}
        {/* ========================================================= */}
        {activeTab === 'organizaciones' && (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  paddingHorizontal: 10,
                  height: 40,
                }}
              >
                <Search size={16} color="#94A3B8" />
                <TextInput
                  style={{ flex: 1, fontSize: 13, color: '#0F172A', marginLeft: 8 }}
                  placeholder="Buscar organización o NIT..."
                  placeholderTextColor="#94A3B8"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
                {searchTerm ? (
                  <TouchableOpacity onPress={() => setSearchTerm('')}>
                    <X size={14} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#2563EB',
                  paddingHorizontal: 12,
                  height: 40,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
                onPress={() => setIsCreateOrgModalOpen(true)}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
                  Crear ONG
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'verificadas', label: 'Verificadas' },
                { key: 'no_verificadas', label: 'Sin Verificar' },
              ].map((f) => (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.7}
                  onPress={() => setOrgFilter(f.key as any)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 16,
                    backgroundColor: orgFilter === f.key ? '#2563EB' : '#F1F5F9',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: orgFilter === f.key ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>
              Mostrando {filteredOrgs.length} organizaciones
            </Text>

            {filteredOrgs.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Building2 size={40} color="#94A3B8" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 10 }}>
                  No se encontraron organizaciones
                </Text>
              </View>
            ) : (
              filteredOrgs.map((org) => (
                <AdminOrgCard
                  key={org.id}
                  organization={org}
                  onEdit={(org) => setSelectedOrgToEdit(org)}
                  onDelete={(id) => handleDeleteOrg(id)}
                  onConsult={(org) => setSelectedOrgDetail(org)}
                />
              ))
            )}
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SOLICITUDES DE VERIFICACIÓN                        */}
        {/* ========================================================= */}
        {activeTab === 'verificaciones' && (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  paddingHorizontal: 10,
                  height: 40,
                }}
              >
                <Search size={16} color="#94A3B8" />
                <TextInput
                  style={{ flex: 1, fontSize: 13, color: '#0F172A', marginLeft: 8 }}
                  placeholder="Buscar por NIT o nombre..."
                  placeholderTextColor="#94A3B8"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
                {searchTerm ? (
                  <TouchableOpacity onPress={() => setSearchTerm('')}>
                    <X size={14} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#D97706',
                  paddingHorizontal: 12,
                  height: 40,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
                onPress={() => setIsCreateVerifModalOpen(true)}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
                  Solicitud
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'pendiente', label: 'Pendientes' },
                { key: 'aprobada', label: 'Aprobadas' },
                { key: 'rechazada', label: 'Rechazadas' },
              ].map((f) => (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.7}
                  onPress={() => setVerifFilter(f.key as any)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 16,
                    backgroundColor: verifFilter === f.key ? '#D97706' : '#F1F5F9',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: verifFilter === f.key ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>
              Mostrando {filteredVerifications.length} solicitudes
            </Text>

            {filteredVerifications.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <ShieldCheck size={40} color="#94A3B8" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 10 }}>
                  No hay solicitudes en este estado
                </Text>
              </View>
            ) : (
              filteredVerifications.map((v) => (
                <AdminVerificationCard
                  key={v.id}
                  item={v}
                  onRespond={(item) => setSelectedVerifToRespond(item)}
                  onConsult={(item) => setSelectedVerifDetail(item)}
                  onDelete={(id) => handleDeleteVerification(id)}
                />
              ))
            )}
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 5: EVENTOS                                            */}
        {/* ========================================================= */}
        {activeTab === 'eventos' && (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  paddingHorizontal: 10,
                  height: 40,
                }}
              >
                <Search size={16} color="#94A3B8" />
                <TextInput
                  style={{ flex: 1, fontSize: 13, color: '#0F172A', marginLeft: 8 }}
                  placeholder="Buscar convocatoria..."
                  placeholderTextColor="#94A3B8"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
                {searchTerm ? (
                  <TouchableOpacity onPress={() => setSearchTerm('')}>
                    <X size={14} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#7C3AED',
                  paddingHorizontal: 12,
                  height: 40,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
                onPress={() => setIsCreateEventModalOpen(true)}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
                  Crear Jornada
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {[
                { key: 'todos', label: 'Todos' },
                { key: 'activo', label: 'Activos' },
                { key: 'finalizado', label: 'Finalizados' },
                { key: 'cancelado', label: 'Cancelados' },
              ].map((f) => (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.7}
                  onPress={() => setEventFilter(f.key as any)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 16,
                    backgroundColor: eventFilter === f.key ? '#7C3AED' : '#F1F5F9',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: eventFilter === f.key ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>
              Mostrando {filteredEvents.length} convocatorias
            </Text>

            {filteredEvents.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Calendar size={40} color="#94A3B8" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 10 }}>
                  No se encontraron eventos
                </Text>
              </View>
            ) : (
              filteredEvents.map((evt) => (
                <AdminEventCard
                  key={evt.id}
                  event={evt}
                  onEdit={(event) => setSelectedEventToEdit(event)}
                  onDelete={(id) => handleDeleteEvent(id)}
                  onConsult={(event) => setSelectedEventDetail(event)}
                />
              ))
            )}
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 6: DONACIONES                                         */}
        {/* ========================================================= */}
        {activeTab === 'donaciones' && (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  paddingHorizontal: 10,
                  height: 40,
                }}
              >
                <Search size={16} color="#94A3B8" />
                <TextInput
                  style={{ flex: 1, fontSize: 13, color: '#0F172A', marginLeft: 8 }}
                  placeholder="Buscar por donante u ONG..."
                  placeholderTextColor="#94A3B8"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
                {searchTerm ? (
                  <TouchableOpacity onPress={() => setSearchTerm('')}>
                    <X size={14} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#16A34A',
                  paddingHorizontal: 12,
                  height: 40,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
                onPress={() => setIsCreateDonationModalOpen(true)}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
                  Registrar
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'monetaria', label: 'Monetarias' },
                { key: 'objeto', label: 'En Especie' },
              ].map((f) => (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.7}
                  onPress={() => setDonationFilter(f.key as any)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 16,
                    backgroundColor: donationFilter === f.key ? '#16A34A' : '#F1F5F9',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: donationFilter === f.key ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>
              Mostrando {filteredDonations.length} donaciones registradas
            </Text>

            {filteredDonations.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Heart size={40} color="#94A3B8" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 10 }}>
                  No se encontraron donaciones
                </Text>
              </View>
            ) : (
              filteredDonations.map((don) => (
                <AdminDonationCard
                  key={don.id}
                  donation={don}
                  onConsult={(item) => setSelectedDonationDetail(item)}
                  onDownloadReceipt={(item) => downloadDonationReceipt(item)}
                />
              ))
            )}
          </View>
        )}

        {/* ========================================================= */}
        {/* TAB 7: CATEGORÍAS                                         */}
        {/* ========================================================= */}
        {activeTab === 'categorias' && (
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  paddingHorizontal: 10,
                  height: 40,
                }}
              >
                <Search size={16} color="#94A3B8" />
                <TextInput
                  style={{ flex: 1, fontSize: 13, color: '#0F172A', marginLeft: 8 }}
                  placeholder="Buscar categoría social..."
                  placeholderTextColor="#94A3B8"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                />
                {searchTerm ? (
                  <TouchableOpacity onPress={() => setSearchTerm('')}>
                    <X size={14} color="#94A3B8" />
                  </TouchableOpacity>
                ) : null}
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: '#0D9488',
                  paddingHorizontal: 12,
                  height: 40,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 4,
                }}
                onPress={() => setIsCreateCategoryModalOpen(true)}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 12 }}>
                  Nueva Causa
                </Text>
              </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'activa', label: 'Activas' },
                { key: 'inactiva', label: 'Inactivas' },
              ].map((f) => (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.7}
                  onPress={() => setCategoryFilter(f.key as any)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 16,
                    backgroundColor: categoryFilter === f.key ? '#0D9488' : '#F1F5F9',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: '700',
                      color: categoryFilter === f.key ? '#FFFFFF' : '#64748B',
                    }}
                  >
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748B' }}>
              Mostrando {filteredCategories.length} categorías
            </Text>

            {filteredCategories.length === 0 ? (
              <View style={{ padding: 40, alignItems: 'center' }}>
                <Tag size={40} color="#94A3B8" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#0F172A', marginTop: 10 }}>
                  No se encontraron categorías
                </Text>
              </View>
            ) : (
              filteredCategories.map((cat) => (
                <AdminCategoryCard
                  key={cat.id}
                  category={cat}
                  onEdit={(category) => setSelectedCategoryToEdit(category)}
                  onDelete={(id) => handleDeleteCategory(String(id))}
                  onConsult={(category) => setSelectedCategoryDetail(category)}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* ========================================================= */}
      {/* MODALS SECTION                                            */}
      {/* ========================================================= */}

      {/* 1. User Modals */}
      <CreateUserModal
        visible={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSubmit={handleCreateUser}
      />
      <EditUserModal
        visible={Boolean(selectedUserToEdit)}
        user={selectedUserToEdit}
        onClose={() => setSelectedUserToEdit(null)}
        onSubmit={handleUpdateUser}
      />
      <UserDetailModal
        visible={Boolean(selectedUserDetail)}
        user={selectedUserDetail}
        onClose={() => setSelectedUserDetail(null)}
      />

      {/* 2. Org Modals */}
      <CreateOrgModal
        visible={isCreateOrgModalOpen}
        onClose={() => setIsCreateOrgModalOpen(false)}
        onSubmit={handleCreateOrg}
      />
      <EditOrgModal
        visible={Boolean(selectedOrgToEdit)}
        org={selectedOrgToEdit}
        onClose={() => setSelectedOrgToEdit(null)}
        onSubmit={handleUpdateOrg}
      />
      <OrgDetailModal
        visible={Boolean(selectedOrgDetail)}
        org={selectedOrgDetail}
        onClose={() => setSelectedOrgDetail(null)}
      />

      {/* 3. Verification Modals */}
      <CreateVerificationModal
        visible={isCreateVerifModalOpen}
        organizations={orgs}
        onClose={() => setIsCreateVerifModalOpen(false)}
        onSubmit={handleCreateVerification}
      />
      <RespondVerificationModal
        visible={Boolean(selectedVerifToRespond)}
        item={selectedVerifToRespond}
        onClose={() => setSelectedVerifToRespond(null)}
        onSubmit={handleRespondVerification}
      />
      <VerificationDetailModal
        visible={Boolean(selectedVerifDetail)}
        item={selectedVerifDetail}
        onClose={() => setSelectedVerifDetail(null)}
      />

      {/* 4. Event Modals */}
      <CreateEventModal
        visible={isCreateEventModalOpen}
        organizations={orgs}
        categories={categories}
        onClose={() => setIsCreateEventModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
      <EditEventModal
        visible={Boolean(selectedEventToEdit)}
        event={selectedEventToEdit}
        organizations={orgs}
        categories={categories}
        onClose={() => setSelectedEventToEdit(null)}
        onSubmit={handleUpdateEvent}
      />
      <EventDetailModal
        visible={Boolean(selectedEventDetail)}
        event={selectedEventDetail}
        onClose={() => setSelectedEventDetail(null)}
      />

      {/* 5. Donation Modals */}
      <CreateDonationModal
        visible={isCreateDonationModalOpen}
        organizations={orgs}
        users={users}
        categories={categories}
        onClose={() => setIsCreateDonationModalOpen(false)}
        onSubmit={handleCreateDonation}
      />
      <DonationDetailModal
        visible={Boolean(selectedDonationDetail)}
        donation={selectedDonationDetail}
        onClose={() => setSelectedDonationDetail(null)}
      />

      {/* 6. Category Modals */}
      <CreateCategoryModal
        visible={isCreateCategoryModalOpen}
        onClose={() => setIsCreateCategoryModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
      <EditCategoryModal
        visible={Boolean(selectedCategoryToEdit)}
        category={selectedCategoryToEdit}
        onClose={() => setSelectedCategoryToEdit(null)}
        onSubmit={handleUpdateCategory}
      />
      <CategoryDetailModal
        visible={Boolean(selectedCategoryDetail)}
        category={selectedCategoryDetail}
        onClose={() => setSelectedCategoryDetail(null)}
      />
    </SafeAreaView>
  );
};

export default AdminDashboardView;
