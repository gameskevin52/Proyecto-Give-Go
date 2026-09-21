import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { registerStyles } from '../styles/register.styles';
import { useRegisterController } from '../controllers/useRegisterController';

interface RegisterVolunteerViewProps {
  navigation: any;
}

export const RegisterVolunteerView: React.FC<RegisterVolunteerViewProps> = ({ navigation }) => {
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
  } = useRegisterController(navigation, 'Voluntario');

  return (
    <SafeAreaView style={registerStyles.container}>
      <ScrollView contentContainerStyle={registerStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={registerStyles.card}>
          <Text style={registerStyles.title}>Registro de Voluntario</Text>
          <Text style={registerStyles.subtitle}>Únete a Give&Go y transforma vidas aportando tu tiempo y talento</Text>

          {/* Role Switcher Tabs */}
          <View style={registerStyles.roleSelector}>
            <TouchableOpacity
              style={[registerStyles.roleTab, registerStyles.roleTabActive]}
            >
              <Text style={registerStyles.roleTabTextActive}>Voluntario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={registerStyles.roleTab}
              onPress={() => navigation.navigate('RegisterBeneficiary')}
            >
              <Text style={registerStyles.roleTabText}>Beneficiario</Text>
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
                placeholder="Juan"
                value={nombre1}
                onChangeText={setNombre1}
              />
            </View>
            <View style={registerStyles.halfInput}>
              <AppInput
                label="Segundo Nombre"
                placeholder="Carlos"
                value={nombre2}
                onChangeText={setNombre2}
              />
            </View>
          </View>

          <View style={registerStyles.row}>
            <View style={registerStyles.halfInput}>
              <AppInput
                label="Primer Apellido *"
                placeholder="Pérez"
                value={apellido1}
                onChangeText={setApellido1}
              />
            </View>
            <View style={registerStyles.halfInput}>
              <AppInput
                label="Segundo Apellido"
                placeholder="Gómez"
                value={apellido2}
                onChangeText={setApellido2}
              />
            </View>
          </View>

          <Text style={registerStyles.sectionTitle}>2. Residencia en Kennedy</Text>

          <AppInput
            label="Barrio en Kennedy *"
            placeholder="Ej: Kennedy Central, Castilla, Timiza, Patio Bonito"
            value={barrio}
            onChangeText={setBarrio}
          />

          <AppInput
            label="Dirección de Residencia"
            placeholder="Calle 42 Sur # 78K - 10"
            value={direccion}
            onChangeText={setDireccion}
          />

          <Text style={registerStyles.sectionTitle}>3. Contacto y Seguridad</Text>

          <AppInput
            label="Correo Electrónico *"
            placeholder="juan.perez@correo.com"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppInput
            label="Teléfono Celular *"
            placeholder="310 123 4567"
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
            title="Completar Registro"
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

export default RegisterVolunteerView;
