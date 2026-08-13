import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { Organizacion } from '../types';
import { authenticateOrganizacion, INITIAL_ORGANIZACIONES } from '../services/storage';

interface LoginScreenProps {
  onLoginSuccess: (org: Organizacion) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [nit, setNit] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [pinSeguridad, setPinSeguridad] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!nit.trim() || !correo.trim() || !password.trim() || !pinSeguridad.trim()) {
      Alert.alert(
        'Credenciales Incompletas',
        'Por favor completa todos los campos de autenticación institucional: NIT, Correo, Contraseña y PIN de Seguridad (4 dígitos).'
      );
      return;
    }

    if (pinSeguridad.trim().length < 4) {
      Alert.alert(
        'PIN Inválido',
        'El PIN de seguridad institucional debe tener al menos 4 dígitos numéricos.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const result = await authenticateOrganizacion(nit, correo, password, pinSeguridad);
      setIsLoading(false);

      if (result.success && result.org) {
        Alert.alert(
          '¡Bienvenido de Nuevo!',
          `Has iniciado sesión exitosamente como "${result.org.nombre}".`
        );
        onLoginSuccess(result.org);
      } else {
        Alert.alert('Acceso Denegado', result.error || 'Credenciales inválidas.');
      }
    } catch {
      setIsLoading(false);
      Alert.alert('Error', 'Ocurrió un error al procesar el inicio de sesión.');
    }
  };

  // Ayudante para autocompletar credenciales de prueba en Expo Go
  const handleFillDemo = (demoOrg: Organizacion) => {
    setNit(demoOrg.nit);
    setCorreo(demoOrg.correo);
    setPassword(demoOrg.password || 'password123');
    setPinSeguridad(demoOrg.pinSeguridad || '2026');
  };

  return (
    <View style={styles.container}>
      {/* Header Institucional */}
      <View style={styles.heroBadgeCard}>
        <Text style={styles.heroBadgeText}>🔒 ACCESO SEGURO INSTITUCIONAL</Text>
        <Text style={styles.screenTitle}>Iniciar Sesión de Organización</Text>
        <Text style={styles.screenSubtitle}>
          Ingresa con las credenciales oficiales y el token de verificación de tu fundación
        </Text>
      </View>

      {/* Formulario de Login */}
      <View style={styles.formCard}>
        {/* Campo NIT */}
        <Text style={styles.inputLabel}>NIT Institucional *</Text>
        <Text style={styles.inputHelper}>Identificador fiscal único registrado ante DIAN</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 901.458.789-2"
          placeholderTextColor="#94A3B8"
          value={nit}
          onChangeText={setNit}
          autoCapitalize="none"
        />

        {/* Campo Correo */}
        <Text style={styles.inputLabel}>Correo Electrónico Institucional *</Text>
        <Text style={styles.inputHelper}>Correo corporativo o del representante legal</Text>
        <TextInput
          style={styles.input}
          placeholder="contacto@organizacion.org"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        {/* Campo Contraseña */}
        <View style={styles.labelRow}>
          <Text style={styles.inputLabel}>Contraseña Institucional *</Text>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.togglePasswordText}>
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Clave maestra de la fundación"
          placeholderTextColor="#94A3B8"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        {/* Campo PIN de Seguridad 4 Dígitos */}
        <Text style={styles.inputLabel}>PIN de Seguridad Móvil (4 Dígitos) *</Text>
        <Text style={styles.inputHelper}>
          Token único de doble factor asignado a directivos autorizados
        </Text>
        <TextInput
          style={[styles.input, styles.pinInput]}
          placeholder="••••"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          maxLength={6}
          secureTextEntry
          value={pinSeguridad}
          onChangeText={setPinSeguridad}
        />

        {/* Botón Ingresar */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Ingresar al Panel de Organización →</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Tarjeta de Seguridad y Transparencia */}
      <View style={styles.securityInfoCard}>
        <Text style={styles.securityInfoTitle}>🛡️ ¿Por qué estos requisitos de acceso?</Text>
        <Text style={styles.securityInfoText}>
          Para garantizar la <Text style={{ fontWeight: 'bold' }}>transparencia y trazabilidad</Text> de las donaciones y actividades comunitarias, Give&Go solicita el <Text style={{ fontWeight: 'bold' }}>NIT oficial</Text> y un <Text style={{ fontWeight: 'bold' }}>PIN de seguridad institucional</Text>, evitando suplantaciones de organizaciones sin ánimo de lucro.
        </Text>
      </View>

      {/* Botones de Acceso Rápido / Demo */}
      <View style={styles.demoSection}>
        <Text style={styles.demoSectionTitle}>⚡ Acceso Rápido para Pruebas (Expo Go)</Text>
        <View style={styles.demoButtonsRow}>
          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => handleFillDemo(INITIAL_ORGANIZACIONES[0])}
          >
            <Text style={styles.demoButtonText}>Demo: Manos Unidas</Text>
            <Text style={styles.demoButtonSub}>NIT: 901.458.789-2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoButton}
            onPress={() => handleFillDemo(INITIAL_ORGANIZACIONES[1])}
          >
            <Text style={styles.demoButtonText}>Demo: Semillas Esperanza</Text>
            <Text style={styles.demoButtonSub}>NIT: 900.874.123-5</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heroBadgeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  heroBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1,
    marginBottom: 6,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 2,
    marginTop: 8,
  },
  inputHelper: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  togglePasswordText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 6,
  },
  pinInput: {
    letterSpacing: 6,
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  securityInfoCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  securityInfoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  securityInfoText: {
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 17,
  },
  demoSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  demoSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  demoButton: {
    flex: 1,
    backgroundColor: COLORS.primarySurface,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  demoButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  demoButtonSub: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
