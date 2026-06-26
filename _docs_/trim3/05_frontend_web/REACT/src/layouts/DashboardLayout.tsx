import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Badge } from '../components/UI';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Users, 
  Building2, 
  FileText, 
  Tag, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard, 
  User, 
  HandHeart,
  Activity,
  History
} from 'lucide-react';

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Rutas públicas
  const isPublicRoute = ['/', '/events', '/donations', '/map', '/login', '/register'].includes(location.pathname) || location.pathname.startsWith('/404');

  // Menús de la sidebar según el rol
  const getSidebarItems = (): SidebarItem[] => {
    if (!user) return [];

    switch (user.rol) {
      case 'admin':
        return [
          { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Usuarios', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
          { label: 'Organizaciones', path: '/admin/organizations', icon: <Building2 className="w-4 h-4" /> },
          { label: 'Eventos', path: '/admin/events', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Donaciones', path: '/admin/donations', icon: <Heart className="w-4 h-4" /> },
          { label: 'Categorías', path: '/admin/categories', icon: <Tag className="w-4 h-4" /> },
        ];
      case 'voluntario':
        return [
          { label: 'Dashboard', path: '/volunteer/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Mi Perfil', path: '/volunteer/profile', icon: <User className="w-4 h-4" /> },
          { label: 'Inscribirme en Eventos', path: '/volunteer/events', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Mis Donaciones', path: '/volunteer/donations', icon: <Heart className="w-4 h-4" /> },
        ];
      case 'beneficiario':
        return [
          { label: 'Dashboard', path: '/beneficiary/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Crear Solicitud', path: '/beneficiary/dashboard?action=create', icon: <FileText className="w-4 h-4" /> },
        ];
      case 'organizacion':
        return [
          { label: 'Dashboard', path: '/org/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { label: 'Gestionar Eventos', path: '/org/events', icon: <Calendar className="w-4 h-4" /> },
          { label: 'Donaciones Recibidas', path: '/org/campaigns', icon: <Heart className="w-4 h-4" /> },
          { label: 'Nuestros Voluntarios', path: '/org/volunteers', icon: <Users className="w-4 h-4" /> },
        ];
      default:
        return [];
    }
  };

  const sidebarItems = getSidebarItems();

  // renderizar el menú público
  if (isPublicRoute && !user) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col font-sans">
        {/* Header Público */}
        <header className="bg-white border-b border-neutral-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-9 h-9 bg-red-600 rounded flex items-center justify-center text-white font-bold text-lg">
                  G&G
                </div>
                <span className="text-xl font-bold text-neutral-900 tracking-tight">
                  Give<span className="text-red-600">&</span>Go
                </span>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-8 text-sm font-semibold">
                <Link 
                  to="/" 
                  className={`transition-colors py-2 ${location.pathname === '/' ? 'text-red-600 border-b-2 border-red-600' : 'text-neutral-600 hover:text-red-600'}`}
                >
                  Inicio
                </Link>
                <Link 
                  to="/events" 
                  className={`transition-colors py-2 ${location.pathname === '/events' ? 'text-red-600 border-b-2 border-red-600' : 'text-neutral-600 hover:text-red-600'}`}
                >
                  Eventos
                </Link>
                <Link 
                  to="/donations" 
                  className={`transition-colors py-2 ${location.pathname === '/donations' ? 'text-red-600 border-b-2 border-red-600' : 'text-neutral-600 hover:text-red-600'}`}
                >
                  Donar
                </Link>
                <Link 
                  to="/map" 
                  className={`transition-colors py-2 ${location.pathname === '/map' ? 'text-red-600 border-b-2 border-red-600' : 'text-neutral-600 hover:text-red-600'}`}
                >
                  Mapa Solidario
                </Link>
              </nav>

              {/* CTA Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Registrarse</Button>
                </Link>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="flex md:hidden">
                <button
                  onClick={() => setIsMobileOpen(!isMobileOpen)}
                  className="p-2 rounded text-neutral-600 hover:text-neutral-950 focus:outline-none"
                >
                  {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {isMobileOpen && (
            <div className="md:hidden bg-white border-t border-neutral-100 px-4 py-4 space-y-3">
              <Link to="/" onClick={() => setIsMobileOpen(false)} className="block py-2 text-sm font-semibold text-neutral-800">Inicio</Link>
              <Link to="/events" onClick={() => setIsMobileOpen(false)} className="block py-2 text-sm font-semibold text-neutral-800">Eventos</Link>
              <Link to="/donations" onClick={() => setIsMobileOpen(false)} className="block py-2 text-sm font-semibold text-neutral-800">Donar</Link>
              <Link to="/map" onClick={() => setIsMobileOpen(false)} className="block py-2 text-sm font-semibold text-neutral-800">Mapa Solidario</Link>
              <hr className="border-neutral-100" />
              <div className="flex flex-col gap-2 pt-2">
                <Link to="/login" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">Iniciar Sesión</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileOpen(false)}>
                  <Button variant="primary" className="w-full" size="sm">Registrarse</Button>
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-neutral-900 border-t border-neutral-800 text-white mt-auto py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <span className="text-lg font-bold text-white tracking-tight">
                  Give<span className="text-red-500">&</span>Go
                </span>
                <p className="text-xs text-neutral-400 mt-2 max-w-xs leading-relaxed">
                  Conectando personas que quieren ayudar con aquellos que más lo necesitan. Eventos, campañas y donaciones en un solo lugar.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">Enlaces útiles</h4>
                <ul className="space-y-2 text-xs text-neutral-400">
                  <li><Link to="/events" className="hover:text-red-500 transition-colors">Ver Eventos</Link></li>
                  <li><Link to="/donations" className="hover:text-red-500 transition-colors">Realizar Donación</Link></li>
                  <li><Link to="/map" className="hover:text-red-500 transition-colors">Mapa de Actividades</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-3">Contacto</h4>
                <p className="text-xs text-neutral-400">Email: soporte@giveandgo.com</p>
                <p className="text-xs text-neutral-400 mt-1">Teléfono: +34 900 123 456</p>
              </div>
            </div>
            <div className="border-t border-neutral-800 mt-8 pt-4 text-center text-xs text-neutral-500">
              &copy; {new Date().getFullYear()} Give&Go. Todos los derechos reservados.
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Dashboard Layout (Logged in users)
  const roleLabels: Record<string, string> = {
    admin: 'Administrador',
    voluntario: 'Voluntario',
    beneficiario: 'Beneficiario',
    organizacion: 'Organización',
  };

  const userDisplayName = user 
    ? `${user.nombre1} ${user.apellido1}`
    : 'Usuario';

  return (
    <div className="min-h-screen bg-neutral-50 flex font-sans select-none">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white text-neutral-800 border-r border-neutral-200 select-none">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-neutral-250/60 bg-white">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-sm transform hover:scale-105 transition-all">
              <div className="w-3.5 h-3.5 bg-white transform rotate-45"></div>
            </div>
            <span className="text-lg font-extrabold text-neutral-900 tracking-tight uppercase">
              Give<span className="text-red-600">&</span>Go
            </span>
          </Link>
        </div>

        {/* User Info */}
        <div className="px-6 py-5 border-b border-neutral-250/60 bg-neutral-50/50">
          <p className="text-[10px] text-neutral-400 font-bold tracking-wider uppercase mb-1.5">Tu Rol</p>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <Badge variant={user?.rol === 'admin' ? 'danger' : user?.rol === 'organizacion' ? 'info' : 'success'}>
              {roleLabels[user?.rol || ''] || 'General'}
            </Badge>
          </div>
          <p className="text-sm font-bold text-neutral-900 mt-3 truncate">{userDisplayName}</p>
          <p className="text-xs text-neutral-500 truncate mt-0.5">{user?.correo}</p>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1 bg-white">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                  isActive 
                    ? 'bg-red-50 text-red-700 font-bold shadow-xs' 
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <span className={`transition-colors ${isActive ? 'text-red-700' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout bottom */}
        <div className="p-4 border-t border-neutral-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-150"
          >
            <LogOut className="w-4 h-4 text-neutral-400" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setIsMobileOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-white text-neutral-900 border-r border-neutral-200 h-full z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-neutral-200">
              <span className="text-base font-extrabold uppercase tracking-wider text-neutral-900">Menú Panel</span>
              <button onClick={() => setIsMobileOpen(false)} className="p-1 rounded-full hover:bg-neutral-100">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            
            <div className="px-6 py-5 border-b border-neutral-200 bg-neutral-50/50">
              <Badge variant={user?.rol === 'admin' ? 'danger' : 'success'}>
                {roleLabels[user?.rol || ''] || 'General'}
              </Badge>
              <p className="text-sm font-bold text-neutral-900 mt-2 truncate">{userDisplayName}</p>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto bg-white">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      isActive 
                        ? 'bg-red-50 text-red-700' 
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <span className={isActive ? 'text-red-700' : 'text-neutral-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-neutral-200 bg-white">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all duration-150"
              >
                <LogOut className="w-4 h-4 text-neutral-400" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-neutral-200 px-6 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="p-2 -ml-2 rounded-lg text-neutral-600 hover:text-neutral-900 focus:outline-none md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-bold text-neutral-800 ml-2 md:ml-0 flex items-center space-x-2 uppercase tracking-wider">
              <span className="hidden md:inline text-neutral-400 font-semibold">Panel</span>
              <span className="hidden md:inline text-neutral-300 font-light">/</span>
              <span className="text-red-600">{roleLabels[user?.rol || ''] || 'General'}</span>
            </h1>
          </div>

          <div className="flex items-center space-x-5">
            {/* Quick Links back to main site */}
            <Link to="/" className="text-xs font-bold text-neutral-500 hover:text-red-600 transition-colors uppercase tracking-wider">
              Ir a la Web Pública
            </Link>
            <div className="h-4 w-px bg-neutral-200" />
            
            {/* Elegant avatar and details representing the Design HTML standard */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black text-sm border border-red-200">
                {user?.nombre1?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-left leading-none hidden sm:block">
                <p className="text-xs font-bold text-neutral-900">{userDisplayName}</p>
                <p className="text-[9px] text-neutral-400 uppercase font-bold tracking-widest mt-0.5">{user?.rol}</p>
              </div>
            </div>
          </div>
        </header>

        {/* View Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-neutral-50/50">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>

        {/* System level Footer similar to the Design HTML */}
        <footer className="bg-white border-t border-neutral-200 h-10 px-8 flex items-center justify-between text-[11px] text-neutral-400 shrink-0">
          <p>&copy; {new Date().getFullYear()} Give&amp;Go Platform. Todos los derechos reservados.</p>
          <div className="hidden sm:flex gap-4">
            <span className="flex items-center gap-1 font-mono uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              Almacenamiento Local Activo
            </span>
            <span>v1.0.4 - Production Ready Build</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
