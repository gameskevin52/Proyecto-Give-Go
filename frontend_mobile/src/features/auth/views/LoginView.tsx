import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Users,
  Heart,
  Building2,
  AlertCircle,
  ArrowRight,
} from 'lucide-react-native';
import { AuthHeader } from '../components/AuthHeader';
import { loginStyles } from '../styles/login.styles';
import { useLoginController } from '../controllers/useLoginController';
import { colors } from '../../../config/theme';

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

  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  return (
    <SafeAreaView style={loginStyles.container}>
      <ScrollView
        contentContainerStyle={loginStyles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AuthHeader />

        <View style={loginStyles.card}>
          <View style={loginStyles.cardHeader}>
            <View style={loginStyles.iconBadge}>
              <LogIn size={20} color={colors.primary} strokeWidth={2.5} />
            </View>
            <Text style={loginStyles.title}>Iniciar Sesión</Text>
            <Text style={loginStyles.subtitle}>
              Accede a tu cuenta y continúa apoyando a las comunidades
            </Text>
          </View>

          {errorMessage ? (
            <View style={loginStyles.errorBanner}>
              <AlertCircle size={16} color="#B91C1C" />
              <Text style={loginStyles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Email Input */}
          <View style={loginStyles.inputWrapper}>
            <Text style={loginStyles.inputLabel}>Correo Electrónico</Text>
            <View style={[loginStyles.inputBox, emailFocused && loginStyles.inputBoxFocused]}>
              <Mail size={18} color={emailFocused ? colors.primary : '#94A3B8'} strokeWidth={2} />
              <TextInput
                style={loginStyles.textInput}
                placeholder="ejemplo@giveandgo.com"
                placeholderTextColor="#94A3B8"
                value={correo}
                onChangeText={setCorreo}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={loginStyles.inputWrapper}>
            <Text style={loginStyles.inputLabel}>Contraseña</Text>
            <View style={[loginStyles.inputBox, passwordFocused && loginStyles.inputBoxFocused]}>
              <Lock size={18} color={passwordFocused ? colors.primary : '#94A3B8'} strokeWidth={2} />
              <TextInput
                style={loginStyles.textInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#64748B" />
                ) : (
                  <Eye size={18} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={loginStyles.forgotRow}
            activeOpacity={0.7}
            onPress={navigateToForgotPassword}
          >
            <Text style={loginStyles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          {/* Submit Button */}
          <TouchableOpacity
            style={[loginStyles.submitButton, isLoading && { opacity: 0.8 }]}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <LogIn size={18} color="#FFFFFF" strokeWidth={2.5} />
                <Text style={loginStyles.submitButtonText}>Ingresar a la Plataforma</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Registration Section */}
          <View style={loginStyles.dividerContainer}>
            <View style={loginStyles.dividerLine} />
            <Text style={loginStyles.dividerText}>¿No tienes una cuenta?</Text>
            <View style={loginStyles.dividerLine} />
          </View>

          <View style={loginStyles.registerSection}>
            <TouchableOpacity
              style={loginStyles.registerCardBtn}
              activeOpacity={0.7}
              onPress={navigateToRegisterVolunteer}
            >
              <View style={[loginStyles.registerCardIcon, { backgroundColor: '#EFF6FF' }]}>
                <Users size={16} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={loginStyles.registerCardTitle}>Soy Voluntario</Text>
                <Text style={loginStyles.registerCardSubtitle}>
                  Participa en jornadas y acumula horas oficiales
                </Text>
              </View>
              <ArrowRight size={14} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={loginStyles.registerCardBtn}
              activeOpacity={0.7}
              onPress={navigateToRegisterBeneficiary}
            >
              <View style={[loginStyles.registerCardIcon, { backgroundColor: '#F0FDF4' }]}>
                <Heart size={16} color="#16A34A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={loginStyles.registerCardTitle}>Soy Beneficiario</Text>
                <Text style={loginStyles.registerCardSubtitle}>
                  Solicita alimentos, kits o asistencia comunitaria
                </Text>
              </View>
              <ArrowRight size={14} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={loginStyles.registerCardBtn}
              activeOpacity={0.7}
              onPress={navigateToRegisterOrganization}
            >
              <View style={[loginStyles.registerCardIcon, { backgroundColor: '#FAF5FF' }]}>
                <Building2 size={16} color="#7C3AED" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={loginStyles.registerCardTitle}>Registrar Organización</Text>
                <Text style={loginStyles.registerCardSubtitle}>
                  Publica convocatorias y recibe donaciones oficiales
                </Text>
              </View>
              <ArrowRight size={14} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginView;
