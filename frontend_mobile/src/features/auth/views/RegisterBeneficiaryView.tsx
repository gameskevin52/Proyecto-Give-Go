import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { registerStyles } from '../styles/register.styles';
import { useRegisterController } from '../controllers/useRegisterController';

interface RegisterBeneficiaryViewProps {
  navigation: any;
}

export const RegisterBeneficiaryView: React.FC<RegisterBeneficiaryViewProps> = ({ navigation }) => {
  const {
    nombre1,
    setNombre1,
    nombre2,
    setNombre2,
    apellido1,
    setApellido1,
    apellido2,
    setApellido2,
    tipoDocumento,
    setTipoDocumento,
    numDocumento,
    setNumDocumento,
    correo,
    setCorreo,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    telefono,
    setTelefono,
    direccion,
    setDireccion,
    barrio,
    setBarrio,
    localidad,
    setLocalidad,
    ciudad,
    setCiudad,
    isLoading,
    errorMessage,
    handleRegister,
    navigateToLogin,
  } = useRegisterController(navigation, 'Beneficiario');

  return (
    <SafeAreaView style={registerStyles.container}>
      <ScrollView contentContainerStyle={registerStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={registerStyles.card}>
          <Text style={registerStyles.title}>Registro de Beneficiario</Text>
          <Text style={registerStyles.subtitle}>Accede a jornadas de apoyo social, donaciones de alimentos y vestuario</Text>

          {/* Role Switcher Tabs */}
          <View style={registerStyles.roleSelector}>
            <TouchableOpacity
              style={registerStyles.roleTab}
              onPress={() => navigation.navigate('RegisterVolunteer')}
            >
              <Text style={registerStyles.roleTabText}>Voluntario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[registerStyles.roleTab, registerStyles.roleTabActive]}
            >
              <Text style={registerStyles.roleTabTextActive}>Beneficiario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={registerStyles.roleTab}
              onPress={() => navigation.navigate('RegisterOrganization')}
            >
              <Text style={registerStyles.roleTabText}>Organización</Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <View style={registerStyles.errorBanner}>
              <Text style={registerStyles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          <Text style={registerStyles.sectionTitle}>1. Identificación Personal</Text>

          <View style={registerStyles.row}>
            <View style={registerStyles.halfInput}>
              <AppInput
                label="Primer Nombre *"
                placeholder="María"
                value={nombre1}
                onChangeText={setNombre1}
              />
            </View>
            <View style={registerStyles.halfInput}>
              <AppInput
                label="Segundo Nombre"
                placeholder="Elena"
                value={nombre2}
                onChangeText={setNombre2}
              />
            </View>
          </View>

          <View style={registerStyles.row}>
            <View style={registerStyles.halfInput}>
              <AppInput
                label="Primer Apellido *"
                placeholder="Rodríguez"
                value={apellido1}
                onChangeText={setApellido1}
              />
            </View>
            <View style={registerStyles.halfInput}>
              <AppInput
                label="Segundo Apellido"
                placeholder="Ramos"
                value={apellido2}
                onChangeText={setApellido2}
              />
            </View>
          </View>

          <Text style={registerStyles.sectionTitle}>2. Residencia en Kennedy</Text>

          <AppInput
            label="Barrio en Kennedy *"
            placeholder="Ej: Patio Bonito, Tintal, Kennedy Central, Castilla"
            value={barrio}
            onChangeText={setBarrio}
          />

          <AppInput
            label="Dirección de Residencia"
            placeholder="Carrera 80 # 43 - 20 Sur"
            value={direccion}
            onChangeText={setDireccion}
          />

          <Text style={registerStyles.sectionTitle}>3. Contacto y Contraseña</Text>

          <AppInput
            label="Correo Electrónico *"
            placeholder="maria.rodriguez@correo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppInput
            label="Teléfono Celular *"
            placeholder="320 987 6543"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <AppInput
            label="Contraseña *"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <AppInput
            label="Confirmar Contraseña *"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <AppButton
            title="Crear Cuenta de Beneficiario"
            variant="secondary"
            onPress={handleRegister}
            isLoading={isLoading}
            style={registerStyles.submitButton}
          />

          <View style={registerStyles.loginRow}>
            <Text style={registerStyles.loginPrompt}>¿Ya tienes una cuenta?</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={navigateToLogin}>
              <Text style={registerStyles.loginLink}>Inicia Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterBeneficiaryView;
