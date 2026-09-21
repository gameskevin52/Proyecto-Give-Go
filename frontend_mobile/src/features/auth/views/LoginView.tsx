import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { AuthHeader } from '../components/AuthHeader';
import { loginStyles } from '../styles/login.styles';
import { useLoginController } from '../controllers/useLoginController';

interface LoginViewProps {
  navigation: any;
}

export const LoginView: React.FC<LoginViewProps> = ({ navigation }) => {
  const {
    correo,
    setCorreo,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleLogin,
    navigateToRegisterVolunteer,
    navigateToRegisterBeneficiary,
    navigateToRegisterOrganization,
    navigateToForgotPassword,
  } = useLoginController(navigation);

  return (
    <SafeAreaView style={loginStyles.container}>
      <ScrollView contentContainerStyle={loginStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <AuthHeader />

        <View style={loginStyles.card}>
          <Text style={loginStyles.title}>Iniciar Sesión</Text>
          <Text style={loginStyles.subtitle}>Ingresa tus credenciales para continuar</Text>

          {errorMessage ? (
            <View style={loginStyles.errorBanner}>
              <Text style={loginStyles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <AppInput
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppInput
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity activeOpacity={0.7} onPress={navigateToForgotPassword}>
            <Text style={loginStyles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Cuentas de Acceso Rápido / Pruebas */}
          <View style={{ marginVertical: 8 }}>
            <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600', marginBottom: 6 }}>
              Acceso Rápido de Prueba:
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setCorreo('admin@giveandgo.com');
                  setPassword('Admin123*');
                }}
                style={{
                  flex: 1,
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  backgroundColor: '#FEF2F2',
                  borderWidth: 1,
                  borderColor: '#FECACA',
                  borderRadius: 6,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#DC2626' }}>👑 Admin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setCorreo('carlos@volunteer.com');
                  setPassword('User123*');
                }}
                style={{
                  flex: 1,
                  paddingVertical: 6,
                  paddingHorizontal: 8,
                  backgroundColor: '#EFF6FF',
                  borderWidth: 1,
                  borderColor: '#BFDBFE',
                  borderRadius: 6,
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#2563EB' }}>🤝 Voluntario</Text>
              </TouchableOpacity>
            </View>
          </View>

          <AppButton
            title="Ingresar a la Plataforma"
            onPress={handleLogin}
            isLoading={isLoading}
            style={loginStyles.submitButton}
          />

          <View style={loginStyles.dividerContainer}>
            <View style={loginStyles.dividerLine} />
            <Text style={loginStyles.dividerText}>¿No tienes una cuenta?</Text>
            <View style={loginStyles.dividerLine} />
          </View>

          <View style={{ gap: 8, marginTop: 4 }}>
            <View style={loginStyles.registerRow}>
              <AppButton
                title="Ser Voluntario"
                variant="outline"
                onPress={navigateToRegisterVolunteer}
                style={loginStyles.registerButton}
              />
              <AppButton
                title="Soy Beneficiario"
                variant="secondary"
                onPress={navigateToRegisterBeneficiary}
                style={loginStyles.registerButton}
              />
            </View>
            <AppButton
              title="Registrar Organización / Fundación"
              variant="outline"
              onPress={navigateToRegisterOrganization}
              style={{ width: '100%', borderColor: '#CBD5E1' }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginView;
