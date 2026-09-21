import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyRound, Mail, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { forgotPasswordStyles } from '../styles/forgotPassword.styles';
import { useForgotPasswordController } from '../controllers/useForgotPasswordController';
import { colors } from '../../../config/theme';

interface ForgotPasswordViewProps {
  navigation: any;
}

export const ForgotPasswordView: React.FC<ForgotPasswordViewProps> = ({ navigation }) => {
  const {
    step,
    correo,
    setCorreo,
    verifiedEmail,
    nuevaPassword,
    setNuevaPassword,
    confirmarPassword,
    setConfirmarPassword,
    isLoading,
    successMessage,
    errorMessage,
    handleVerifyEmail,
    handleSetNewPassword,
    handleBackToStep1,
    navigateToLogin,
  } = useForgotPasswordController(navigation);

  return (
    <SafeAreaView style={forgotPasswordStyles.container}>
      <ScrollView contentContainerStyle={forgotPasswordStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={forgotPasswordStyles.card}>
          {/* Header Back Link */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={step === 2 ? handleBackToStep1 : navigateToLogin}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 6 }}
          >
            <ArrowLeft size={16} color={colors.textSecondary || '#64748B'} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.textSecondary || '#64748B' }}>
              {step === 2 ? 'Cambiar correo' : 'Volver al inicio de sesión'}
            </Text>
          </TouchableOpacity>

          {/* Stepper indicator */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: step === 1 ? colors.primary : '#E2E8F0',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: step === 1 ? '#FFFFFF' : '#64748B', fontWeight: '700', fontSize: 13 }}>
                1
              </Text>
            </View>
            <View style={{ width: 32, height: 2, backgroundColor: step === 2 ? colors.primary : '#CBD5E1' }} />
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: step === 2 ? colors.primary : '#E2E8F0',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: step === 2 ? '#FFFFFF' : '#64748B', fontWeight: '700', fontSize: 13 }}>
                2
              </Text>
            </View>
          </View>

          <Text style={forgotPasswordStyles.title}>
            {step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}
          </Text>
          <Text style={forgotPasswordStyles.subtitle}>
            {step === 1
              ? 'Ingresa el correo electrónico asociado a tu cuenta para verificarla.'
              : `Ingresa y confirma la nueva contraseña de acceso para:\n${verifiedEmail}`}
          </Text>

          {successMessage ? (
            <View style={forgotPasswordStyles.successBanner}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 2 }}>
                <CheckCircle2 size={16} color={colors.success || '#16A34A'} />
                <Text style={forgotPasswordStyles.successText}>{successMessage}</Text>
              </View>
            </View>
          ) : null}

          {errorMessage ? (
            <View style={forgotPasswordStyles.errorBanner}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ShieldAlert size={16} color={colors.danger || '#DC2626'} />
                <Text style={forgotPasswordStyles.errorText}>{errorMessage}</Text>
              </View>
            </View>
          ) : null}

          {step === 1 ? (
            <View>
              <AppInput
                label="Correo Electrónico Registrado *"
                placeholder="ejemplo@giveandgo.com"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <AppButton
                title="Verificar Cuenta"
                onPress={handleVerifyEmail}
                isLoading={isLoading}
                style={forgotPasswordStyles.submitButton}
              />
            </View>
          ) : (
            <View>
              <AppInput
                label="Nueva Contraseña (mínimo 6 caracteres) *"
                placeholder="••••••••"
                value={nuevaPassword}
                onChangeText={setNuevaPassword}
                secureTextEntry
              />

              <AppInput
                label="Confirmar Nueva Contraseña *"
                placeholder="••••••••"
                value={confirmarPassword}
                onChangeText={setConfirmarPassword}
                secureTextEntry
              />

              <AppButton
                title="Actualizar Contraseña"
                onPress={handleSetNewPassword}
                isLoading={isLoading}
                style={forgotPasswordStyles.submitButton}
              />
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={navigateToLogin}
            style={forgotPasswordStyles.backButton}
          >
            <Text style={forgotPasswordStyles.backText}>Cancelar y volver al Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordView;

