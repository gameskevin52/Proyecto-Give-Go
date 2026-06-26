import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Páginas Públicas
import { Home } from '../pages/Home';
import { Events } from '../pages/Events';
import { Donations } from '../pages/Donations';
import { Map } from '../pages/Map';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { NotFound } from '../pages/NotFound';

// Páginas de Administración
import { 
  AdminDashboard, 
  AdminUsers, 
  AdminOrganizations, 
  AdminEvents, 
  AdminDonations, 
  AdminCategories 
} from '../pages/admin/AdminPages';

// Páginas de Voluntarios
import { 
  VolunteerDashboard, 
  VolunteerProfile, 
  VolunteerEvents, 
  VolunteerDonations 
} from '../pages/volunteer/VolunteerPages';

// Páginas de Beneficiarios
import { BeneficiaryDashboard } from '../pages/beneficiary/BeneficiaryDashboard';

// Páginas de Organizaciones
import { 
  OrgDashboard, 
  OrgEvents, 
  OrgCampaigns, 
  OrgVolunteers 
} from '../pages/org/OrgPages';

// Componente para proteger las rutas privadas
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-sm font-semibold text-neutral-600">Verificando sesión...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    // Si tiene sesión pero no rol permitido, redirigir a su propio dashboard predeterminado
    const defaultDashboards: Record<string, string> = {
      admin: '/admin/dashboard',
      voluntario: '/volunteer/dashboard',
      beneficiario: '/beneficiary/dashboard',
      organizacion: '/org/dashboard',
    };
    return <Navigate to={defaultDashboards[user.rol] || '/'} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* RUTAS PÚBLICAS (Envueltas en DashboardLayout que actuará como Navbar/Footer público si es visitante) */}
      <Route path="/" element={<DashboardLayout><Home /></DashboardLayout>} />
      <Route path="/events" element={<DashboardLayout><Events /></DashboardLayout>} />
      <Route path="/donations" element={<DashboardLayout><Donations /></DashboardLayout>} />
      <Route path="/map" element={<DashboardLayout><Map /></DashboardLayout>} />
      
      {/* RUTAS DE ACCESO (Si ya está logueado, redirige a su panel) */}
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to={
              user.rol === 'admin' ? '/admin/dashboard' :
              user.rol === 'voluntario' ? '/volunteer/dashboard' :
              user.rol === 'beneficiario' ? '/beneficiary/dashboard' :
              '/org/dashboard'
            } replace />
          ) : (
            <DashboardLayout><Login /></DashboardLayout>
          )
        } 
      />
      <Route 
        path="/register" 
        element={
          user ? (
            <Navigate to={
              user.rol === 'admin' ? '/admin/dashboard' :
              user.rol === 'voluntario' ? '/volunteer/dashboard' :
              user.rol === 'beneficiario' ? '/beneficiary/dashboard' :
              '/org/dashboard'
            } replace />
          ) : (
            <DashboardLayout><Register /></DashboardLayout>
          )
        } 
      />

      {/* PANEL ADMINISTRADOR */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminDashboard /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminUsers /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/organizations" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminOrganizations /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/events" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminEvents /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/donations" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminDonations /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/categories" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout><AdminCategories /></DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* PANEL VOLUNTARIO */}
      <Route 
        path="/volunteer/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['voluntario']}>
            <DashboardLayout><VolunteerDashboard /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/volunteer/profile" 
        element={
          <ProtectedRoute allowedRoles={['voluntario']}>
            <DashboardLayout><VolunteerProfile /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/volunteer/events" 
        element={
          <ProtectedRoute allowedRoles={['voluntario']}>
            <DashboardLayout><VolunteerEvents /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/volunteer/donations" 
        element={
          <ProtectedRoute allowedRoles={['voluntario']}>
            <DashboardLayout><VolunteerDonations /></DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* PANEL BENEFICIARIO */}
      <Route 
        path="/beneficiary/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['beneficiario']}>
            <DashboardLayout><BeneficiaryDashboard /></DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* PANEL ORGANIZACIÓN */}
      <Route 
        path="/org/dashboard" 
        element={
          <ProtectedRoute allowedRoles={['organizacion']}>
            <DashboardLayout><OrgDashboard /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/org/events" 
        element={
          <ProtectedRoute allowedRoles={['organizacion']}>
            <DashboardLayout><OrgEvents /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/org/campaigns" 
        element={
          <ProtectedRoute allowedRoles={['organizacion']}>
            <DashboardLayout><OrgCampaigns /></DashboardLayout>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/org/volunteers" 
        element={
          <ProtectedRoute allowedRoles={['organizacion']}>
            <DashboardLayout><OrgVolunteers /></DashboardLayout>
          </ProtectedRoute>
        } 
      />

      {/* FALLBACK 404 */}
      <Route path="/404" element={<DashboardLayout><NotFound /></DashboardLayout>} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};
