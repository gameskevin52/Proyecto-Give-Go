import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { registerStyles } from '../styles/register.styles';
import { useRegisterController } from '../controllers/useRegisterController';
import { Building2, Heart, HeartHandshake } from 'lucide-react-native';

interface RegisterOrganizationViewProps {
  navigation: any;
}

export const RegisterOrganizationView: React.FC<RegisterOrganizationViewProps> = ({ navigation }) => {
  const {
    role,
    setRole,
    orgNombre,
    setOrgNombre,
    nit,
    setNit,
    representanteLegal,
    setRepresentanteLegal,
    categoria,
    setCategoria,
    descripcion,
    setDescripcion,
    direccion,
    setDireccion,
    barrio,
    setBarrio,
    localidad,
    setLocalidad,
    ciudad,
    setCiudad,
    correo,
    setCorreo,
    telefono,
    setTelefono,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    errorMessage,
    handleRegister,
    navigateToLogin,
  } = useRegisterController(navigation, 'Organizacion');

  return (
    <SafeAreaView style={registerStyles.container}>
      <ScrollView contentContainerStyle={registerStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={registerStyles.card}>
          <Text style={registerStyles.title}>Registro Institucional</Text>
          <Text style={registerStyles.subtitle}>
            Inscribe tu fundación, ONG o colectivo para convocar voluntarios y recibir donaciones
          </Text>

          {/* Role Switcher Tabs */}
          <View style={registerStyles.roleSelector}>
            <TouchableOpacity
              style={registerStyles.roleTab}
              onPress={() => navigation.navigate('RegisterVolunteer')}
            >
              <Text style={registerStyles.roleTabText}>Voluntario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={registerStyles.roleTab}
              onPress={() => navigation.navigate('RegisterBeneficiary')}
            >
              <Text style={registerStyles.roleTabText}>Beneficiario</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[registerStyles.roleTab, registerStyles.roleTabActive]}
            >
              <Text style={registerStyles.roleTabTextActive}>Organización</Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <View style={registerStyles.errorBanner}>
              <Text style={registerStyles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Datos de la Organización */}
          <Text style={registerStyles.sectionTitle}>1. Datos de la Entidad</Text>

          <AppInput
            label="Nombre de la Organización *"
            placeholder="Ej: Fundación Manos Solidarias Kennedy"
            value={orgNombre}
            onChangeText={setOrgNombre}
          />

          <View style={registerStyles.row}>
            <View style={registerStyles.halfInput}>
              <AppInput
                label="NIT Institucional"
                placeholder="900.123.456-7"
                value={nit}
                onChangeText={setNit}
              />
            </View>
            <View style={registerStyles.halfInput}>
              <AppInput
                label="Categoría Social"
                placeholder="Alimentos / Salud / Educación"
                value={categoria}
                onChangeText={setCategoria}
              />
            </View>
          </View>

          <AppInput
            label="Representante Legal"
            placeholder="Nombre del director(a) o representante"
            value={representanteLegal}
            onChangeText={setRepresentanteLegal}
          />

          <AppInput
            label="Descripción y Misión Social"
            placeholder="Describe el objeto social de tu organización..."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={3}
          />

          {/* Ubicación de la Sede */}
          <Text style={registerStyles.sectionTitle}>2. Sede en Kennedy</Text>

          <AppInput
            label="Barrio de la Sede *"
            placeholder="Ej: Kennedy Central, Castilla, Timiza, Carvajal"
            value={barrio}
            onChangeText={setBarrio}
          />

          <AppInput
            label="Dirección Física de la Sede *"
            placeholder="Calle 42 Sur # 78K - 10"
            value={direccion}
            onChangeText={setDireccion}
          />

          {/* Contacto y Credenciales */}
          <Text style={registerStyles.sectionTitle}>3. Contacto y Acceso</Text>

          <AppInput
            label="Correo Electrónico Oficial *"
            placeholder="contacto@organizacion.org"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <AppInput
            label="Teléfono / Celular de Contacto *"
            placeholder="+57 310 987 6543"
            value={telefono}
            onChangeText={setTelefono}
            keyboardType="phone-pad"
          />

          <AppInput
            label="Contraseña de Acceso *"
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
            title="Registrar Organización"
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

export default RegisterOrganizationView;
