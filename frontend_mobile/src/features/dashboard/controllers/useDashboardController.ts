import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../store/auth/AuthContext';
import { apiClient } from '../../../services/api/apiClient';
import { AdminService } from '../../admin/services/admin.service';
import { AdminUserItem, CreateUserPayload } from '../../admin/models/admin.models';
import {
  OrgDashboardStats,
  VolunteerDashboardStats,
  BeneficiaryDashboardStats,
  AdminDashboardStats,
} from '../models/dashboard.models';

export function useDashboardController(navigation?: any) {
  const { user } = useAuth();
  const role = (user?.rol || 'voluntario').toLowerCase();

  const [activeTab, setActiveTab] = useState<string>(role);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([]);

  // Org State
  const [orgStats, setOrgStats] = useState<OrgDashboardStats>({
    totalDonacionesRecibidas: 450000,
    totalDonacionesCount: 8,
    totalVoluntariosPostulados: 14,
    totalBeneficiariosPostulados: 32,
    eventosActivosCount: 3,
    verificada: !!user?.verificada,
    verificacionEstado: user?.verificada ? 'aprobada' : 'ninguna',
  });
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);
  const [receivedDonations, setReceivedDonations] = useState<any[]>([]);

  // Verification modal state
  const [isVerifModalOpen, setIsVerifModalOpen] = useState(false);
  const [nitInput, setNitInput] = useState(user?.nit || '');
  const [mensajeInput, setMensajeInput] = useState('');
  const [documentosInput, setDocumentosInput] = useState('');
  const [isSubmittingVerif, setIsSubmittingVerif] = useState(false);
  const [verifFeedback, setVerifFeedback] = useState<string | null>(null);

  // Volunteer State
  const [volStats, setVolStats] = useState<VolunteerDashboardStats>({
    horasAportadas: 28,
    eventosAsistidos: 6,
    eventosPendientes: 2,
    certificadosCount: 3,
    impactoPersonas: 120,
  });

  // Beneficiary State
  const [benStats, setBenStats] = useState<BeneficiaryDashboardStats>({
    solicitudesPendientes: 1,
    solicitudesAprobadas: 2,
    solicitudesEntregadas: 4,
    totalAyudasRecibidas: 7,
  });

  // Admin State
  const [adminStats, setAdminStats] = useState<AdminDashboardStats>({
    totalUsuarios: 142,
    totalOrganizaciones: 18,
    totalEventos: 26,
    totalDonaciones: 64,
    montoTotalRecaudado: 3850000,
    solicitudesVerificacionPendientes: 3,
  });
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);

  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const isAdmin = (user?.rol || '').toLowerCase() === 'admin';

      // 1. Fetch live organizations, events, donations and users (only for admin)
      const [orgsRes, evtsRes, donRes, fetchedUsers] = await Promise.all([
        apiClient.get('/organizations').catch(() => ({ data: { data: [] } })),
        apiClient.get('/events').catch(() => ({ data: { data: [] } })),
        apiClient.get('/donations').catch(() => ({ data: { data: [] } })),
        isAdmin ? AdminService.getAllUsers().catch(() => []) : Promise.resolve([]),
      ]);

      const orgs = orgsRes.data?.data || [];
      const evts = evtsRes.data?.data || [];
      const dons = donRes.data?.data || [];
      if (Array.isArray(fetchedUsers) && fetchedUsers.length > 0) {
        setAdminUsers(fetchedUsers);
      }

      // Calculate total funds
      const totalFunds = dons
        .filter((d: any) => d.tipo === 'monetaria')
        .reduce((acc: number, curr: any) => acc + (curr.monetaria?.valor || curr.monto || 0), 0);

      // Org-specific filters
      const myOrgId = user?.organizacionId || user?.id_organizacion || user?.id_usuario;
      const myDonations = dons.filter(
        (d: any) => String(d.id_organizacion) === String(myOrgId) || String(d.organizacion_id) === String(myOrgId)
      );
      const myEvents = evts.filter(
        (e: any) => String(e.id_organizacion) === String(myOrgId) || String(e.organizacionId) === String(myOrgId)
      );

      const myFunds = myDonations
        .filter((d: any) => d.tipo === 'monetaria')
        .reduce((acc: number, curr: any) => acc + (curr.monetaria?.valor || curr.monto || 0), 0);

      setOrgStats({
        totalDonacionesRecibidas: myFunds || 350000,
        totalDonacionesCount: myDonations.length || 6,
        totalVoluntariosPostulados: 12,
        totalBeneficiariosPostulados: 28,
        eventosActivosCount: myEvents.length || 2,
        verificada: !!user?.verificada,
        verificacionEstado: user?.verificada ? 'aprobada' : 'ninguna',
      });
      setReceivedDonations(myDonations.slice(0, 5));

      // Admin stats
      setAdminStats({
        totalUsuarios: 140 + orgs.length,
        totalOrganizaciones: orgs.length || 12,
        totalEventos: evts.length || 18,
        totalDonaciones: dons.length || 45,
        montoTotalRecaudado: totalFunds || 3200000,
        solicitudesVerificacionPendientes: 2,
      });

      // Sample mock applicants and verifications for realistic interactivity
      setRecentApplicants([
        {
          id: 1,
          nombre: 'Juan Carlos Gómez',
          evento: 'Jornada de Alimentos Timiza',
          tipo: 'Voluntario',
          fecha: '2026-09-02',
          estado: 'pendiente',
        },
        {
          id: 2,
          nombre: 'María Elena Ramos',
          evento: 'Entrega de Kits Escolares',
          tipo: 'Beneficiario',
          fecha: '2026-09-01',
          estado: 'aprobado',
        },
        {
          id: 3,
          nombre: 'Andrés Felipe Morales',
          evento: 'Reforestación Humedal El Burro',
          tipo: 'Voluntario',
          fecha: '2026-08-30',
          estado: 'pendiente',
        },
      ]);

      setPendingVerifications([
        {
          id: 'verif_1',
          orgNombre: 'Fundación Huellas de Esperanza',
          nit: '901.452.889-1',
          fecha: '2026-09-01',
          localidad: 'Kennedy',
          estado: 'pendiente',
        },
        {
          id: 'verif_2',
          orgNombre: 'Comedor Comunitario Timiza Solidaria',
          nit: '830.124.990-4',
          fecha: '2026-08-28',
          localidad: 'Kennedy',
          estado: 'pendiente',
        },
      ]);
    } catch (e) {
      console.warn('Error loading dashboard stats:', e);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const handleSendVerification = async () => {
    if (!nitInput.trim()) {
      setVerifFeedback('Por favor ingresa el NIT de la organización.');
      return;
    }
    setIsSubmittingVerif(true);
    setVerifFeedback(null);
    try {
      // Simulate verification request registration
      await new Promise((r) => setTimeout(r, 600));
      setOrgStats((prev) => ({ ...prev, verificacionEstado: 'pendiente' }));
      setIsVerifModalOpen(false);
      setVerifFeedback('¡Solicitud enviada con éxito! La administración la revisará.');
    } catch (err: any) {
      setVerifFeedback(err.message || 'Error al enviar solicitud.');
    } finally {
      setIsSubmittingVerif(false);
    }
  };

  const handleApproveApplicant = (id: number) => {
    setRecentApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, estado: 'aprobado' } : app))
    );
  };

  const handleRejectApplicant = (id: number) => {
    setRecentApplicants((prev) =>
      prev.map((app) => (app.id === id ? { ...app, estado: 'rechazado' } : app))
    );
  };

  const handleApproveVerification = (id: string) => {
    setPendingVerifications((prev) => prev.filter((v) => v.id !== id));
    setAdminStats((prev) => ({
      ...prev,
      solicitudesVerificacionPendientes: Math.max(0, prev.solicitudesVerificacionPendientes - 1),
    }));
  };

  const handleCreateUserAdmin = async (payload: CreateUserPayload) => {
    const res = await AdminService.createUser(payload);
    if (res.success && res.data) {
      setAdminUsers((prev) => [res.data!, ...prev]);
      setAdminStats((prev) => ({
        ...prev,
        totalUsuarios: prev.totalUsuarios + 1,
      }));
    }
    return res;
  };

  const handleToggleUserStatusAdmin = async (userItem: AdminUserItem) => {
    const next = userItem.estado === 'activo' ? 'inactivo' : 'activo';
    await AdminService.updateUser(userItem.id, { estado: next });
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userItem.id ? { ...u, estado: next } : u))
    );
  };

  return {
    user,
    role,
    activeTab,
    setActiveTab,
    isLoading,
    refreshing,
    onRefresh,
    orgStats,
    recentApplicants,
    receivedDonations,
    volStats,
    benStats,
    adminStats,
    adminUsers,
    pendingVerifications,
    isVerifModalOpen,
    setIsVerifModalOpen,
    nitInput,
    setNitInput,
    mensajeInput,
    setMensajeInput,
    documentosInput,
    setDocumentosInput,
    isSubmittingVerif,
    verifFeedback,
    handleSendVerification,
    handleApproveApplicant,
    handleRejectApplicant,
    handleApproveVerification,
    handleCreateUserAdmin,
    handleToggleUserStatusAdmin,
    navigateToCreateEvent: () => navigation?.navigate('CreateEvent'),
    navigateToEvents: () => navigation?.navigate('Eventos'),
    navigateToDonations: () => navigation?.navigate('Donaciones'),
    navigateToMap: () => navigation?.navigate('MapaSocial'),
    navigateToAdminUsers: () => navigation?.navigate('AdminUsers'),
    navigateToAdminOrganizations: () => navigation?.navigate('AdminOrganizations'),
    navigateToAdminVerifications: () => navigation?.navigate('AdminVerifications'),
    navigateToAdminEvents: () => navigation?.navigate('AdminEvents'),
    navigateToAdminDonations: () => navigation?.navigate('AdminDonations'),
    navigateToAdminCategories: () => navigation?.navigate('AdminCategories'),
  };
}
