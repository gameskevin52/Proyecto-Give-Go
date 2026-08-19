import React, { useState } from 'react';
import { User, Mail, Phone, LogOut, CheckCircle2, ShieldAlert, Key, MapPin, Building, Sparkles } from 'lucide-react';
import useViewModel from './ViewModel';
import { RoundedButton } from '../../../components/RoundedButton';
import { User as UserEntity } from '../../../../domain/entities/User';

interface ProfileInfoScreenProps {
  onLogoutSuccess?: () => void;
  currentUser?: UserEntity | null;
}

export const ProfileInfoScreen: React.FC<ProfileInfoScreenProps> = ({
  onLogoutSuccess,
  currentUser: initialUser
}) => {
  const { user: hookUser, loggingOut, removeSession } = useViewModel(onLogoutSuccess);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  const user = hookUser || initialUser;

  return (
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col justify-between p-5 animate-fade-in font-sans overflow-y-auto">
      <div className="space-y-4">
        {/* Header Perfil */}
        <div className="text-center pt-2 space-y-1">
          <div className="w-16 h-16 bg-red-600 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-red-600/20 font-extrabold text-xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
          </div>
          <h1 className="text-xl font-extrabold text-slate-900">
            {user?.name} {user?.lastname}
          </h1>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Rol: {user?.role || user?.rol || 'Voluntario'}</span>
          </div>
        </div>

        {/* Card de Información en Base de Datos */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Datos de Sesión Activa (SENA Clean Architecture)</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Correo:
              </span>
              <span className="font-semibold text-slate-800">{user?.email}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                Teléfono:
              </span>
              <span className="font-semibold text-slate-800">{user?.phone || 'No registrado'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                Documento:
              </span>
              <span className="font-semibold text-slate-800">
                {user?.tipo_documento || 'CC'} {user?.num_documento || 'ID'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Ciudad:
              </span>
              <span className="font-semibold text-slate-800">{user?.ciudad || 'Bogotá'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                Estado en BD:
              </span>
              <span className="text-emerald-600 font-bold">Activo • Conectado</span>
            </div>
          </div>

          {user?.session_token && (
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1">
                <Key className="w-3 h-3 text-slate-400" />
                Token de Sesión (JWT / Session):
              </span>
              <p className="font-mono bg-slate-50 p-1.5 rounded-lg text-[9px] text-slate-600 truncate border border-slate-200">
                {user.session_token}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Apartado de Cierre de Sesión */}
      <div className="pt-4 space-y-2">
        {!showConfirmLogout ? (
          <RoundedButton
            text="CERRAR SESIÓN"
            color="#DC2626"
            onPress={() => setShowConfirmLogout(true)}
          />
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-3 animate-fade-in">
            <p className="text-xs font-bold text-red-800 text-center">
              ¿Estás seguro de que deseas cerrar tu sesión?
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmLogout(false)}
                className="py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={loggingOut}
                onClick={removeSession}
                className="py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{loggingOut ? 'Cerrando...' : 'Sí, Salir'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileInfoScreen;
