import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, ArrowLeft, CheckCircle2, ShieldAlert, KeyRound, RotateCw } from 'lucide-react-native';
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
    codigo,
    setCodigo,
    verifiedEmail,
    nuevaPassword,
    setNuevaPassword,
    confirmarPassword,
    setConfirmarPassword,
    isLoading,
    isResending,
    successMessage,
    errorMessage,
    handleVerifyEmail,
    handleResendCode,
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
              ? 'Ingresa tu correo registrado para recibir el código de verificación.'
              : `Ingresa el código de 6 dígitos enviado a:\n${verifiedEmail}`}
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

              <View
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#E2E8F0',
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Text style={{ fontSize: 12, color: '#475569', lineHeight: 17 }}>
                  Te enviaremos un código de seguridad de 6 dígitos desde{' '}
                  <Text style={{ fontWeight: '700', color: colors.primary || '#059669' }}>
                    soportegiveandgo@gmail.com
                  </Text>{' '}
                  para verificar tu identidad.
                </Text>
              </View>

              <AppButton
                title="Enviar Código al Correo"
                onPress={handleVerifyEmail}
                isLoading={isLoading}
                style={forgotPasswordStyles.submitButton}
              />
            </View>
          ) : (
            <View>
              <View
                style={{
                  backgroundColor: '#ECFDF5',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#A7F3D0',
                  padding: 12,
                  marginBottom: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 11, color: '#065F46', fontWeight: '600' }}>
                    Código enviado a:
                  </Text>
                  <Text style={{ fontSize: 13, color: '#047857', fontWeight: '700' }} numberOfLines={1}>
                    {verifiedEmail}
                  </Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleResendCode}
                  disabled={isResending}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 8 }}
                >
                  {isResending ? (
                    <ActivityIndicator size="small" color="#059669" />
                  ) : (
                    <>
                      <RotateCw size={12} color="#059669" />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#059669' }}>
                        Reenviar
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <AppInput
                label="Código de Verificación (6 dígitos) *"
                placeholder="Ej: 482910"
                value={codigo}
                onChangeText={setCodigo}
                keyboardType="numeric"
                maxLength={6}
              />

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
