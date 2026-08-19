import React from 'react';
import { User as UserIcon, Mail, Phone, Lock, HeartHandshake, ShieldCheck, AlertCircle, CheckCircle2, FileText } from 'lucide-react';
import useViewModel from './ViewModel';
import { RoundedButton } from '../../components/RoundedButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import styles from './Styles';
import { User } from '../../../domain/entities/User';

interface RegisterScreenProps {
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: (user: User) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
  onRegisterSuccess
}) => {
  const {
    name,
    lastname,
    phone,
    email,
    password,
    confirmPassword,
    rol,
    tipo_documento,
    num_documento,
    errorMessage,
    successMessage,
    loading,
    onChange,
    register
  } = useViewModel(onRegisterSuccess);

  return (
    <div className={styles.container}>
      {/* Background Visual */}
      <div className={styles.imageBackground} />

      {/* Logo Container */}
      <div className={styles.logoContainer}>
        <div className={styles.logoBadge}>
          <HeartHandshake className="w-7 h-7 text-red-600" />
        </div>
        <h1 className={styles.logoText}>Give&Go Mobile</h1>
        <p className={styles.logoSubtitle}>Crear Nueva Cuenta</p>
      </div>

      {/* Form Container */}
      <div className={styles.form}>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h2 className={styles.formText}>REGÍSTRATE</h2>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
              Clean Architecture
            </span>
          </div>
          <p className={styles.formSubtitle}>Ingresa tus datos personales para unirte</p>

          {/* Notificaciones */}
          {errorMessage ? (
            <div className="mb-2 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          ) : null}

          {/* Selector de Rol Give&Go */}
          <div className="my-2">
            <label className="text-[11px] font-bold text-slate-700 mb-1 block">Rol de Usuario *</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Voluntario', 'Beneficiario', 'Organizacion'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => onChange('rol', r)}
                  className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer ${
                    rol === r
                      ? 'bg-red-600 text-white border-red-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Selector Tipo Documento y Número */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-700 mb-1 block">Tipo Doc.</label>
              <select
                value={tipo_documento || 'CC'}
                onChange={(e) => onChange('tipo_documento', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs py-1.5 px-2 text-slate-700 outline-none focus:border-red-600"
              >
                <option value="CC">CC</option>
                <option value="TI">TI</option>
                <option value="CE">CE</option>
                <option value="NIT">NIT</option>
                <option value="PAS">PAS</option>
              </select>
            </div>
            <div className="col-span-2">
              <CustomTextInput
                icon={FileText}
                placeholder="Número Documento"
                keyboardType="numeric"
                property="num_documento"
                onChangeText={onChange}
                value={num_documento || ''}
                required
              />
            </div>
          </div>

          {/* Form Inputs con Clean Architecture Components */}
          <div className="grid grid-cols-2 gap-2">
            <CustomTextInput
              icon={UserIcon}
              placeholder="Nombres"
              keyboardType="default"
              property="name"
              onChangeText={onChange}
              value={name}
              required
            />

            <CustomTextInput
              icon={UserIcon}
              placeholder="Apellidos"
              keyboardType="default"
              property="lastname"
              onChangeText={onChange}
              value={lastname}
              required
            />
          </div>

          <CustomTextInput
            icon={Mail}
            placeholder="Correo Electrónico"
            keyboardType="email-address"
            property="email"
            onChangeText={onChange}
            value={email}
            required
          />

          <CustomTextInput
            icon={Phone}
            placeholder="Teléfono Celular"
            keyboardType="phone-pad"
            property="phone"
            onChangeText={onChange}
            value={phone}
            required
          />

          <div className="grid grid-cols-2 gap-2">
            <CustomTextInput
              icon={Lock}
              placeholder="Contraseña"
              keyboardType="default"
              property="password"
              onChangeText={onChange}
              value={password || ''}
              secureTextEntry={true}
              required
            />

            <CustomTextInput
              icon={ShieldCheck}
              placeholder="Confirmar"
              keyboardType="default"
              property="confirmPassword"
              onChangeText={onChange}
              value={confirmPassword || ''}
              secureTextEntry={true}
              required
            />
          </div>
        </div>

        <div>
          <div className="mt-3">
            <RoundedButton
              text="CONFIRMAR Y REGISTRAR"
              onPress={() => register()}
              loading={loading}
            />
          </div>

          <div className={styles.formRegister}>
            <span>¿Ya tienes cuenta?</span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className={styles.formRegisterText}
            >
              Inicia Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
