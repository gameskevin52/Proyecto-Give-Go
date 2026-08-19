import React, { useState } from 'react';
import { 
  LogIn, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle, 
  UserCheck, 
  CheckCircle2, 
  LogOut,
  ShieldCheck,
  Building2,
  HeartHandshake,
  Mail,
  Lock,
  Sparkles
} from 'lucide-react';
import { UsuarioDB } from '../types';

interface IniciarSesionProps {
  currentUser?: UsuarioDB | null;
  onVolverInicio: () => void;
  onIrARegistro: () => void;
  onLoginExitoso?: (usuario: UsuarioDB, token: string) => void;
  onIrACerrarSesion?: () => void;
}

export const IniciarSesion: React.FC<IniciarSesionProps> = ({
  currentUser,
  onVolverInicio,
  onIrARegistro,
  onLoginExitoso,
  onIrACerrarSesion
}) => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Active User Session State
  const [sessionUser, setSessionUser] = useState<UsuarioDB | null>(currentUser || null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);

  React.useEffect(() => {
    if (currentUser) {
      setSessionUser(currentUser);
    } else {
      setSessionUser(null);
    }
  }, [currentUser]);

  const handleQuickFill = (userEmail: string) => {
    setCorreo(userEmail);
    setPassword('GiveGo2026!');
    setErrorMsg(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!correo.trim() || !password) {
      setErrorMsg('Por favor ingrese su correo y contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      // Conexión real con el backend Express/API (`POST /api/login`)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, password })
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setErrorMsg(data.mensaje || 'Credenciales incorrectas');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      setSessionUser(data.usuario);
      setSessionToken(data.token);

      if (onLoginExitoso) {
        onLoginExitoso(data.usuario, data.token);
      }
    } catch (err) {
      console.error('Error al conectar con el servidor:', err);
      setErrorMsg('No se pudo establecer conexión con la base de datos.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (onIrACerrarSesion) {
      onIrACerrarSesion();
      return;
    }
    setSessionUser(null);
    setSessionToken(null);
    setCorreo('');
    setPassword('');
    setErrorMsg(null);
  };

  // VISTA 1: SESIÓN INICIADA (PERFIL DE USUARIO AUTENTICADO)
  if (sessionUser) {
    return (
      <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col justify-between p-5 animate-fade-in font-sans">
        <div className="space-y-4">
          {/* Header Mobile */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mi Perfil</span>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Sesión Activa</span>
            </span>
          </div>

          {/* Tarjeta de Usuario */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {sessionUser.rol === 'Organizacion' ? (
                  <Building2 className="w-6 h-6" />
                ) : sessionUser.rol === 'Beneficiario' ? (
                  <UserCheck className="w-6 h-6" />
                ) : (
                  <HeartHandshake className="w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">
                  {sessionUser.nombre1} {sessionUser.apellido1}
                </h3>
                <p className="text-[11px] text-slate-500 truncate">{sessionUser.correo}</p>
                <div className="mt-1 inline-flex px-2 py-0.5 rounded-md bg-red-50 text-red-700 text-[10px] font-bold">
                  {sessionUser.rol}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block text-[9px]">ID BD:</span>
                <span className="font-semibold text-slate-700">#{sessionUser.id_usuario}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Documento:</span>
                <span className="font-semibold text-slate-700">{sessionUser.tipo_documento} {sessionUser.num_documento}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Teléfono:</span>
                <span className="font-semibold text-slate-700">{sessionUser.telefono || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Ciudad:</span>
                <span className="font-semibold text-slate-700">{sessionUser.ciudad}</span>
              </div>
            </div>
          </div>

          {/* Token de Autenticación */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 text-[10px] space-y-1">
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Token de Sesión Generado:
            </span>
            <p className="font-mono bg-slate-50 p-2 rounded-lg text-slate-600 break-all border border-slate-100 text-[9px]">
              {sessionToken}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="space-y-2 pt-4">
          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-slate-600" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    );
  }

  // VISTA 2: FORMULARIO DE INICIO DE SESIÓN
  return (
    <div className="flex-1 bg-white text-slate-800 flex flex-col justify-between p-5 animate-fade-in font-sans">
      <div className="space-y-4">
        {/* Top bar header */}
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onVolverInicio}
            className="p-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>
          <span className="text-xs font-bold text-slate-400">Give&Go Auth</span>
        </div>

        {/* Title */}
        <div className="text-center pt-2 space-y-1">
          <div className="w-12 h-12 bg-red-600 rounded-2xl text-white flex items-center justify-center mx-auto shadow-md shadow-red-600/20">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">Iniciar Sesión</h1>
          <p className="text-xs text-slate-500">Ingresa tus credenciales para acceder a tu cuenta</p>
        </div>

        {/* Alerta de Error */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} noValidate className="space-y-3.5 pt-2">
          {/* Correo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="ejemplo@giveandgo.org"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:bg-white focus:border-red-600"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-9 py-2.5 text-xs rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:bg-white focus:border-red-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botón Iniciar Sesión */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando en BD...</span>
              </>
            ) : (
              <span>Iniciar Sesión</span>
            )}
          </button>
        </form>

        {/* Accesos rápidos de prueba de la BD giveandgo_v2 */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-medium mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Cuentas cargadas en giveandgo_v2:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('carlos@volunteer.com')}
              className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] text-left border border-slate-200 truncate cursor-pointer"
            >
              <strong className="block text-slate-800">Voluntario</strong>
              carlos@volunteer.com
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('juan@beneficiary.com')}
              className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] text-left border border-slate-200 truncate cursor-pointer"
            >
              <strong className="block text-slate-800">Beneficiario</strong>
              juan@beneficiary.com
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('contacto@manosporkennedy.org')}
              className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] text-left border border-slate-200 truncate cursor-pointer"
            >
              <strong className="block text-slate-800">Organización</strong>
              contacto@manosporkennedy.org
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@giveandgo.com')}
              className="px-2 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] text-left border border-slate-200 truncate cursor-pointer"
            >
              <strong className="block text-slate-800">Admin</strong>
              admin@giveandgo.com
            </button>
          </div>
        </div>
      </div>

      {/* Footer ir a registro */}
      <div className="pt-4 text-center">
        <button
          onClick={onIrARegistro}
          className="text-xs text-slate-600 font-medium hover:text-red-600 transition-colors cursor-pointer"
        >
          ¿No tienes una cuenta aún? <strong className="text-red-600">Regístrate aquí</strong>
        </button>
      </div>
    </div>
  );
};
