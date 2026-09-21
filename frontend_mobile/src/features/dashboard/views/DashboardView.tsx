import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Building2,
  Users,
  Calendar,
  Heart,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  MapPin,
  FileText,
  DollarSign,
  Briefcase,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  UserPlus,
  Tag,
} from 'lucide-react-native';
import { colors } from '../../../config/theme';
import { useDashboardController } from '../controllers/useDashboardController';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AdminUserCard } from '../../admin/components/AdminUserCard';
import { CreateUserModal } from '../../admin/components/CreateUserModal';

interface DashboardViewProps {
  navigation: any;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ navigation }) => {
  const {
    user,
    role,
    activeTab,
    setActiveTab,
    isLoading,
    refreshing,
    onRefresh,
    orgStats,
    recentApplicants,
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
    navigateToCreateEvent,
    navigateToEvents,
    navigateToDonations,
    navigateToMap,
    navigateToAdminUsers,
    navigateToAdminOrganizations,
    navigateToAdminVerifications,
    navigateToAdminEvents,
    navigateToAdminDonations,
    navigateToAdminCategories,
  } = useDashboardController(navigation);

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = React.useState(false);

  if (isLoading) {
    return <AppLoader message="Cargando panel de control..." />;
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Panel de Control</Text>
          <Text style={styles.subtitle}>
            Gestión social, métricas de impacto y convocatorias
          </Text>
        </View>
      </View>

      {/* Role Navigation Switcher Tabs */}
      <View style={styles.roleTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roleTabsScroll}>
          {[
            { key: 'organizacion', label: 'Organización', icon: Building2 },
            { key: 'voluntario', label: 'Voluntario', icon: Users },
            { key: 'beneficiario', label: 'Beneficiario', icon: Heart },
            { key: 'admin', label: 'Administrador', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.roleTab, isActive && styles.roleTabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}
              >
                <Icon size={14} color={isActive ? '#FFFFFF' : '#64748B'} style={{ marginRight: 5 }} />
                <Text style={[styles.roleTabText, isActive && styles.roleTabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {verifFeedback ? (
          <View style={styles.feedbackBanner}>
            <Text style={styles.feedbackText}>{verifFeedback}</Text>
          </View>
        ) : null}

        {/* ==================================================== */}
        {/* TAB 1: PANEL ORGANIZATIVO                           */}
        {/* ==================================================== */}
        {activeTab === 'organizacion' && (
          <View style={styles.tabContent}>
            {/* Status & Verification Card */}
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.orgNameTitle}>
                    {user?.nombre1 || 'Organización Aliada'}
                  </Text>
                  <Text style={styles.orgSubTitle}>Sede Local Kennedy • Entidad Registrada</Text>
                </View>
                {orgStats.verificada ? (
                  <View style={styles.verifiedBadge}>
                    <ShieldCheck size={14} color="#1D4ED8" />
                    <Text style={styles.verifiedBadgeText}>Verificada</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.unverifiedBadge}
                    onPress={() => setIsVerifModalOpen(true)}
                  >
                    <AlertCircle size={12} color="#B45309" />
                    <Text style={styles.unverifiedBadgeText}>
                      {orgStats.verificacionEstado === 'pendiente'
                        ? 'En Revisión'
                        : 'Solicitar Sello'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* KPI Metrics Grid */}
              <View style={styles.kpiGrid}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>
                    ${orgStats.totalDonacionesRecibidas.toLocaleString('es-CO')}
                  </Text>
                  <Text style={styles.kpiLabel}>Donaciones Recibidas</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{orgStats.eventosActivosCount}</Text>
                  <Text style={styles.kpiLabel}>Jornadas Activas</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{orgStats.totalVoluntariosPostulados}</Text>
                  <Text style={styles.kpiLabel}>Voluntarios Convocados</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{orgStats.totalBeneficiariosPostulados}</Text>
                  <Text style={styles.kpiLabel}>Beneficiarios Apoyados</Text>
                </View>
              </View>

              {/* Quick Actions */}
              <View style={styles.actionGrid}>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                  onPress={navigateToCreateEvent}
                >
                  <Plus size={16} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Crear Convocatoria</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, { backgroundColor: '#2563EB' }]}
                  onPress={navigateToMap}
                >
                  <MapPin size={16} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Ver en Mapa</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Postulaciones Recientes */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Postulaciones a tus Convocatorias</Text>
              <Text style={styles.sectionBadge}>{recentApplicants.length} recientes</Text>
            </View>

            {recentApplicants.map((app) => (
              <View key={app.id} style={styles.applicantCard}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <Text style={styles.applicantName}>{app.nombre}</Text>
                    <View
                      style={[
                        styles.tagPill,
                        {
                          backgroundColor:
                            app.tipo === 'Voluntario' ? '#EFF6FF' : '#FEF3C7',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagPillText,
                          {
                            color:
                              app.tipo === 'Voluntario' ? '#1D4ED8' : '#92400E',
                          },
                        ]}
                      >
                        {app.tipo}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.applicantEvent}>{app.evento}</Text>
                  <Text style={styles.applicantDate}>Postulado el: {app.fecha}</Text>
                </View>

                {app.estado === 'pendiente' ? (
                  <View style={styles.appActionCol}>
                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() => handleApproveApplicant(app.id)}
                    >
                      <CheckCircle2 size={16} color="#FFFFFF" />
                      <Text style={styles.btnSmallText}>Aprobar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => handleRejectApplicant(app.id)}
                    >
                      <XCircle size={14} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          app.estado === 'aprobado' ? '#DCFCE7' : '#FEE2E2',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        {
                          color:
                            app.estado === 'aprobado' ? '#166534' : '#991B1B',
                        },
                      ]}
                    >
                      {app.estado.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* ==================================================== */}
        {/* TAB 2: PANEL DE VOLUNTARIO                           */}
        {/* ==================================================== */}
        {activeTab === 'voluntario' && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.orgNameTitle}>Tu Huella de Solidaridad</Text>
              <Text style={styles.orgSubTitle}>
                Registro oficial de horas comunitarias y causas apoyadas
              </Text>

              <View style={styles.kpiGrid}>
                <View style={styles.kpiCard}>
                  <Text style={[styles.kpiValue, { color: '#2563EB' }]}>
                    {volStats.horasAportadas}h
                  </Text>
                  <Text style={styles.kpiLabel}>Horas Voluntarias</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{volStats.eventosAsistidos}</Text>
                  <Text style={styles.kpiLabel}>Jornadas Completadas</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{volStats.certificadosCount}</Text>
                  <Text style={styles.kpiLabel}>Certificados</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{volStats.impactoPersonas}</Text>
                  <Text style={styles.kpiLabel}>Vidas Impactadas</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryBannerBtn, { marginTop: 12 }]}
                onPress={navigateToEvents}
              >
                <Calendar size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryBannerBtnText}>
                  Explorar Nuevas Convocatorias
                </Text>
              </TouchableOpacity>
            </View>

            {/* Certificados */}
            <Text style={styles.sectionHeading}>Certificados de Participación</Text>
            {[
              {
                title: 'Certificado de Servicio Comunitario 2026',
                org: 'Fundación Manos Solidarias',
                horas: '12 horas',
                fecha: '2026-08-15',
              },
              {
                title: 'Constancia Voluntariado Ambiental Humedal',
                org: 'Colectivo Verde Kennedy',
                horas: '16 horas',
                fecha: '2026-07-22',
              },
            ].map((cert, i) => (
              <View key={i} style={styles.certCard}>
                <Award size={24} color="#D97706" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.certTitle}>{cert.title}</Text>
                  <Text style={styles.certSub}>
                    {cert.org} • {cert.horas}
                  </Text>
                  <Text style={styles.certDate}>Expedido: {cert.fecha}</Text>
                </View>
                <View style={styles.validBadge}>
                  <Text style={styles.validBadgeText}>OFICIAL</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ==================================================== */}
        {/* TAB 3: PANEL DE BENEFICIARIO                        */}
        {/* ==================================================== */}
        {activeTab === 'beneficiario' && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.orgNameTitle}>Red de Apoyo y Ayudas</Text>
              <Text style={styles.orgSubTitle}>
                Estado de tus solicitudes de mercados, útiles y vestuario
              </Text>

              <View style={styles.kpiGrid}>
                <View style={styles.kpiCard}>
                  <Text style={[styles.kpiValue, { color: '#16A34A' }]}>
                    {benStats.totalAyudasRecibidas}
                  </Text>
                  <Text style={styles.kpiLabel}>Ayudas Recibidas</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{benStats.solicitudesAprobadas}</Text>
                  <Text style={styles.kpiLabel}>Aprobadas</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{benStats.solicitudesPendientes}</Text>
                  <Text style={styles.kpiLabel}>En Trámite</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{benStats.solicitudesEntregadas}</Text>
                  <Text style={styles.kpiLabel}>Entregadas</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryBannerBtn, { backgroundColor: '#16A34A', marginTop: 12 }]}
                onPress={navigateToMap}
              >
                <MapPin size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryBannerBtnText}>
                  Ver Puntos de Entrega en el Mapa
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeading}>Historial de Ayudas</Text>
            {[
              {
                causa: 'Paquete Nutricional Familiar',
                entidad: 'Comedor Comunitario Timiza',
                fecha: '2026-08-20',
                estado: 'Entregado',
              },
              {
                causa: 'Kit de Útiles Escolares Primaria',
                entidad: 'Alcaldía Local de Kennedy & Give&Go',
                fecha: '2026-08-05',
                estado: 'Entregado',
              },
            ].map((sol, i) => (
              <View key={i} style={styles.applicantCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.applicantName}>{sol.causa}</Text>
                  <Text style={styles.applicantEvent}>{sol.entidad}</Text>
                  <Text style={styles.applicantDate}>Fecha: {sol.fecha}</Text>
                </View>
                <View style={[styles.statusPill, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.statusPillText, { color: '#15803D' }]}>
                    {sol.estado}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ==================================================== */}
        {/* TAB 4: PANEL ADMINISTRADOR                          */}
        {/* ==================================================== */}
        {activeTab === 'admin' && (
          <View style={styles.tabContent}>
            <View style={styles.card}>
              <Text style={styles.orgNameTitle}>Auditoría y Plataforma</Text>
              <Text style={styles.orgSubTitle}>
                Supervisión general de Kennedy y Bogotá Give&Go
              </Text>

              <View style={styles.kpiGrid}>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>
                    {adminUsers.length > 0 ? adminUsers.length : adminStats.totalUsuarios}
                  </Text>
                  <Text style={styles.kpiLabel}>Usuarios Totales</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{adminStats.totalOrganizaciones}</Text>
                  <Text style={styles.kpiLabel}>Organizaciones</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>{adminStats.totalEventos}</Text>
                  <Text style={styles.kpiLabel}>Eventos Totales</Text>
                </View>
                <View style={styles.kpiCard}>
                  <Text style={styles.kpiValue}>
                    {pendingVerifications.length}
                  </Text>
                  <Text style={styles.kpiLabel}>Verif. Pendientes</Text>
                </View>
              </View>
            </View>

            {/* Centro de Módulos del Administrador */}
            <View style={{ marginTop: 14, marginBottom: 16 }}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>Módulos de Gestión Oficial</Text>
                <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600' }}>
                  6 Secciones CRUD
                </Text>
              </View>

              <View style={{ gap: 10, marginTop: 4 }}>
                {/* 1. Módulo Usuarios */}
                <View style={styles.adminModuleCard}>
                  <View style={styles.adminModuleHeader}>
                    <View style={[styles.adminModuleIcon, { backgroundColor: '#FEE2E2' }]}>
                      <Users size={18} color="#DC2626" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adminModuleTitle}>Usuarios del Sistema</Text>
                      <Text style={styles.adminModuleSubtitle}>
                        Directorio oficial · Crear, consultar, editar rol/estado y eliminar
                      </Text>
                    </View>
                  </View>
                  <View style={styles.adminModuleActions}>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#DC2626' }]}
                      onPress={() => setIsCreateUserModalOpen(true)}
                    >
                      <UserPlus size={13} color="#FFFFFF" />
                      <Text style={styles.adminModuleBtnTextLight}>+ Registro Manual</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#F1F5F9' }]}
                      onPress={navigateToAdminUsers}
                    >
                      <Text style={styles.adminModuleBtnTextDark}>Mostrar todos ({adminUsers.length > 0 ? adminUsers.length : adminStats.totalUsuarios})</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 2. Módulo Organizaciones */}
                <View style={styles.adminModuleCard}>
                  <View style={styles.adminModuleHeader}>
                    <View style={[styles.adminModuleIcon, { backgroundColor: '#DBEAFE' }]}>
                      <Building2 size={18} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adminModuleTitle}>Organizaciones y Fundaciones</Text>
                      <Text style={styles.adminModuleSubtitle}>
                        Entidades sociales · Crear ONG, consultar ficha, actualizar y eliminar
                      </Text>
                    </View>
                  </View>
                  <View style={styles.adminModuleActions}>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#2563EB' }]}
                      onPress={navigateToAdminOrganizations}
                    >
                      <Plus size={13} color="#FFFFFF" />
                      <Text style={styles.adminModuleBtnTextLight}>+ Crear ONG</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#F1F5F9' }]}
                      onPress={navigateToAdminOrganizations}
                    >
                      <Text style={styles.adminModuleBtnTextDark}>Mostrar todas ({adminStats.totalOrganizaciones})</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 3. Módulo Solicitudes de Verificación */}
                <View style={styles.adminModuleCard}>
                  <View style={styles.adminModuleHeader}>
                    <View style={[styles.adminModuleIcon, { backgroundColor: '#DCFCE7' }]}>
                      <ShieldCheck size={18} color="#16A34A" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adminModuleTitle}>Solicitudes de Verificación</Text>
                      <Text style={styles.adminModuleSubtitle}>
                        Auditoría institucional · Crear solicitud, consultar NIT, auditar y eliminar
                      </Text>
                    </View>
                  </View>
                  <View style={styles.adminModuleActions}>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#16A34A' }]}
                      onPress={navigateToAdminVerifications}
                    >
                      <Plus size={13} color="#FFFFFF" />
                      <Text style={styles.adminModuleBtnTextLight}>+ Nueva Solicitud</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#F1F5F9' }]}
                      onPress={navigateToAdminVerifications}
                    >
                      <Text style={styles.adminModuleBtnTextDark}>Mostrar todas ({pendingVerifications.length} pend.)</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 4. Módulo Eventos */}
                <View style={styles.adminModuleCard}>
                  <View style={styles.adminModuleHeader}>
                    <View style={[styles.adminModuleIcon, { backgroundColor: '#EDE9FE' }]}>
                      <Calendar size={18} color="#7C3AED" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adminModuleTitle}>Eventos y Convocatorias</Text>
                      <Text style={styles.adminModuleSubtitle}>
                        Jornadas solidarias · Crear evento, consultar detalle, actualizar y eliminar
                      </Text>
                    </View>
                  </View>
                  <View style={styles.adminModuleActions}>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#7C3AED' }]}
                      onPress={navigateToAdminEvents}
                    >
                      <Plus size={13} color="#FFFFFF" />
                      <Text style={styles.adminModuleBtnTextLight}>+ Crear Evento</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#F1F5F9' }]}
                      onPress={navigateToAdminEvents}
                    >
                      <Text style={styles.adminModuleBtnTextDark}>Mostrar todos ({adminStats.totalEventos})</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 5. Módulo Donaciones */}
                <View style={styles.adminModuleCard}>
                  <View style={styles.adminModuleHeader}>
                    <View style={[styles.adminModuleIcon, { backgroundColor: '#FFEDD5' }]}>
                      <Heart size={18} color="#EA580C" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adminModuleTitle}>Donaciones Contables</Text>
                      <Text style={styles.adminModuleSubtitle}>
                        Monetarias y en especie · Crear, consultar y descargar comprobante (Inmutables)
                      </Text>
                    </View>
                  </View>
                  <View style={styles.adminModuleActions}>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#EA580C' }]}
                      onPress={navigateToAdminDonations}
                    >
                      <Plus size={13} color="#FFFFFF" />
                      <Text style={styles.adminModuleBtnTextLight}>+ Registrar Donación</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#F1F5F9' }]}
                      onPress={navigateToAdminDonations}
                    >
                      <Text style={styles.adminModuleBtnTextDark}>Mostrar todas y Descargar</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 6. Módulo Categorías */}
                <View style={styles.adminModuleCard}>
                  <View style={styles.adminModuleHeader}>
                    <View style={[styles.adminModuleIcon, { backgroundColor: '#CCFBF1' }]}>
                      <Tag size={18} color="#0D9488" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adminModuleTitle}>Categorías y Causas</Text>
                      <Text style={styles.adminModuleSubtitle}>
                        Clasificación temática · Crear categoría, consultar alcance, actualizar y eliminar
                      </Text>
                    </View>
                  </View>
                  <View style={styles.adminModuleActions}>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#0D9488' }]}
                      onPress={navigateToAdminCategories}
                    >
                      <Plus size={13} color="#FFFFFF" />
                      <Text style={styles.adminModuleBtnTextLight}>+ Crear Categoría</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.adminModuleBtn, { backgroundColor: '#F1F5F9' }]}
                      onPress={navigateToAdminCategories}
                    >
                      <Text style={styles.adminModuleBtnTextDark}>Mostrar todas</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Gestión de Usuarios desde el rol Administrador */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>
                Directorio de Usuarios ({adminUsers.length > 0 ? adminUsers.length : adminStats.totalUsuarios})
              </Text>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                onPress={navigateToAdminUsers}
              >
                <Text style={{ fontSize: 13, color: '#DC2626', fontWeight: '700' }}>
                  Mostrar todos
                </Text>
                <ArrowRight size={14} color="#DC2626" />
              </TouchableOpacity>
            </View>

            {/* Quick Actions */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#DC2626',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  paddingVertical: 11,
                  borderRadius: 10,
                }}
                onPress={() => setIsCreateUserModalOpen(true)}
              >
                <UserPlus size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
                  + Registro Manual
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#0F172A',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  paddingVertical: 11,
                  borderRadius: 10,
                }}
                onPress={navigateToAdminUsers}
              >
                <Users size={16} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
                  Ver Todos los Usuarios
                </Text>
              </TouchableOpacity>
            </View>

            {/* Users preview list */}
            {adminUsers.length === 0 ? (
              <View style={styles.emptyBox}>
                <Users size={32} color="#94A3B8" />
                <Text style={styles.emptyBoxText}>
                  No hay usuarios cargados o directorio vacío
                </Text>
              </View>
            ) : (
              adminUsers.slice(0, 4).map((u) => (
                <AdminUserCard
                  key={String(u.id || u.id_usuario)}
                  user={u}
                  onToggleStatus={handleToggleUserStatusAdmin}
                  onPress={navigateToAdminUsers}
                />
              ))
            )}

            {adminUsers.length > 4 && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#FFFFFF',
                  paddingVertical: 12,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#CBD5E1',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
                onPress={navigateToAdminUsers}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#DC2626' }}>
                  Mostrar todos los {adminUsers.length} usuarios desde Administrador →
                </Text>
              </TouchableOpacity>
            )}

            {/* Solicitudes de Verificación */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeading}>Verificaciones Institucionales</Text>
              <Text style={styles.sectionBadge}>{pendingVerifications.length} pendientes</Text>
            </View>

            {pendingVerifications.length === 0 ? (
              <View style={styles.emptyBox}>
                <CheckCircle2 size={32} color="#10B981" />
                <Text style={styles.emptyBoxText}>
                  Todas las organizaciones están al día con su auditoría
                </Text>
              </View>
            ) : (
              pendingVerifications.map((v) => (
                <View key={v.id} style={styles.verifAuditCard}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.applicantName}>{v.orgNombre}</Text>
                    <Text style={styles.applicantEvent}>NIT: {v.nit}</Text>
                    <Text style={styles.applicantDate}>
                      Localidad: {v.localidad} • Fecha: {v.fecha}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.approveVerifBtn}
                    onPress={() => handleApproveVerification(v.id)}
                  >
                    <ShieldCheck size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                    <Text style={styles.approveVerifBtnText}>Aprobar NIT</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>

      {/* ==================================================== */}
      {/* MODAL: REGISTRO MANUAL DE USUARIO                   */}
      {/* ==================================================== */}
      <CreateUserModal
        visible={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSubmit={handleCreateUserAdmin}
      />

      {/* ==================================================== */}
      {/* MODAL: SOLICITAR VERIFICACIÓN INSTITUCIONAL         */}
      {/* ==================================================== */}
      <Modal
        visible={isVerifModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVerifModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={20} color={colors.primary} />
                <Text style={styles.modalTitle}>Solicitar Verificación</Text>
              </View>
              <TouchableOpacity onPress={() => setIsVerifModalOpen(false)}>
                <XCircle size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Obtén la insignia de confianza para recibir donaciones monetarias y convocar voluntarios oficiales.
            </Text>

            <Text style={styles.inputLabel}>NIT Institucional *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="900.123.456-7"
              value={nitInput}
              onChangeText={setNitInput}
            />

            <Text style={styles.inputLabel}>Mensaje / Carta de Presentación</Text>
            <TextInput
              style={[styles.modalInput, { height: 64 }]}
              placeholder="Explica brevemente tu labor social..."
              value={mensajeInput}
              onChangeText={setMensajeInput}
              multiline
            />

            <Text style={styles.inputLabel}>Enlace a Documentos (RUT / Cámara)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="https://drive.google.com/..."
              value={documentosInput}
              onChangeText={setDocumentosInput}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsVerifModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleSendVerification}
                disabled={isSubmittingVerif}
              >
                <Text style={styles.modalSubmitText}>
                  {isSubmittingVerif ? 'Enviando...' : 'Enviar a Auditoría'}
                </Text>
              </TouchableOpacity>
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  roleTabsContainer: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  roleTabsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  roleTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  roleTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  roleTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  roleTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
  },
  tabContent: {
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  orgNameTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  orgSubTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  unverifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  unverifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  primaryBannerBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryBannerBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  applicantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  applicantName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  applicantEvent: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  applicantDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  tagPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  appActionCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnSmallText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  rejectBtn: {
    padding: 6,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
  },
  certCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  certTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  certSub: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
  },
  certDate: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  validBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  validBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  verifAuditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  approveVerifBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  approveVerifBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  emptyBoxText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  feedbackBanner: {
    backgroundColor: '#DCFCE7',
    borderColor: '#16A34A',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  feedbackText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 14,
    lineHeight: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSubmitBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  adminModuleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  adminModuleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  adminModuleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminModuleTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  adminModuleSubtitle: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 1,
  },
  adminModuleActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  adminModuleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  adminModuleBtnTextLight: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  adminModuleBtnTextDark: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default DashboardView;
