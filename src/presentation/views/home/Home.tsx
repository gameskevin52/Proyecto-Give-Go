import React, { useEffect } from 'react';
import { Mail, Lock, HeartHandshake, AlertCircle, CheckCircle2 } from 'lucide-react';
import useViewModel from './ViewModel';
import { RoundedButton } from '../../components/RoundedButton';
import { CustomTextInput } from '../../components/CustomTextInput';
import styles from './Styles';
import { User } from '../../../domain/entities/User';

interface HomeScreenProps {
  onNavigateToRegister?: () => void;
  onNavigateToProfile?: () => void;
  onLoginSuccess?: (user: User) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToRegister,
  onNavigateToProfile,
  onLoginSuccess
}) => {
  const { email, password, errorMessage, successMessage, loading, user, onChange, login } = useViewModel(onLoginSuccess);

  useEffect(() => {
    if (user?.id || user?.id_usuario || user?.email) {
      if (onNavigateToProfile) {
        onNavigateToProfile();
      }
    }
  }, [user]);

  return (
    <div className={styles.container}>
      {/* Background visual */}
      <div className={styles.imageBackground} />

      {/* Logo & Header Give&Go */}
      <div className={styles.logoContainer}>
        <div className={styles.logoBadge}>
          <HeartHandshake className="w-9 h-9 text-red-600" />
        </div>
        <h1 className={styles.logoText}>Give&Go Mobile</h1>
        <p className={styles.logoSubtitle}>Plataforma de Donaciones & Solidaridad</p>
      </div>

      {/* Form Card */}
      <div className={styles.form}>
        <div>
          <h2 className={styles.formText}>INGRESAR</h2>
          <p className={styles.formSubtitle}>Accede a tu cuenta para continuar</p>

          {/* Notificaciones */}
          {errorMessage ? (
            <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          ) : null}

          {/* Inputs con Clean Architecture Components */}
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
            icon={Lock}
            placeholder="Contraseña"
            keyboardType="default"
            property="password"
            onChangeText={onChange}
            value={password}
            secureTextEntry={true}
            required
          />
        </div>

        <div>
          <div className="mt-3">
            <RoundedButton
              text="ENVIAR"
              onPress={() => login()}
              loading={loading}
            />
          </div>

          <div className={styles.formRegister}>
            <span>¿No tienes cuenta?</span>
            <button
              type="button"
              onClick={onNavigateToRegister}
              className={styles.formRegisterText}
            >
              Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
