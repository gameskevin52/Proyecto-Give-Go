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

interface RegistroScreenProps {
  onRegisterSuccess: (nuevaOrg: Organizacion) => void;
  onCancel?: () => void;
  hasExistingOrgs: boolean;
}

export const RegistroScreen: React.FC<RegistroScreenProps> = ({
  onRegisterSuccess,
  onCancel,
  hasExistingOrgs,
}) => {
  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [barrio, setBarrio] = useState('Kennedy Central');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [categoria, setCategoria] = useState('Alimentos y Bienestar Social');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = () => {
    if (!nombre.trim() || !nit.trim() || !direccion.trim() || !correo.trim() || !password.trim()) {
      Alert.alert('Campos Incompletos', 'Por favor diligencia todos los campos obligatorios (*)');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const nuevaOrg: Organizacion = {
        idOrganizacion: Date.now(),
        nombre: nombre.trim(),
        nit: nit.trim(),
        direccion: direccion.trim(),
        telefono: telefono.trim() || '+57 300 000 0000',
        correo: correo.trim().toLowerCase(),
        password: password,
        categoria: categoria.trim(),
        barrio: barrio.trim() || 'Kennedy',
        localidad: 'Kennedy',
        ciudad: 'Bogotá',
        departamento: 'Bogotá D.C.',
        pais: 'Colombia',
        fechaRegistro: Date.now(),
        estadoVerificacion: 'pendiente',
        verificada: 0,
      };

      setIsSubmitting(false);

      // Limpiar formulario
      setNombre('');
      setNit('');
      setDireccion('');
      setTelefono('');
      setCorreo('');
      setPassword('');

      Alert.alert(
        '¡Registro Exitoso!',
        `La organización "${nuevaOrg.nombre}" se ha guardado correctamente en la base de datos.`,
        [{ text: 'Ver en Dashboard', onPress: () => onRegisterSuccess(nuevaOrg) }]
      );

      onRegisterSuccess(nuevaOrg);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>🏢 Registro de Organización</Text>
      <Text style={styles.screenSubtitle}>Inscribe tu fundación y guárdala en la base de datos</Text>

      {/* Input Nombre */}
      <Text style={styles.inputLabel}>Nombre de la Organización *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Fundación Manos Unidas Kennedy"
        placeholderTextColor="#94A3B8"
        value={nombre}
        onChangeText={setNombre}
      />

      {/* Input NIT */}
      <Text style={styles.inputLabel}>NIT / Identificación Tributaria *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. 901.458.789-2"
        placeholderTextColor="#94A3B8"
        value={nit}
        onChangeText={setNit}
      />

      {/* Input Dirección */}
      <Text style={styles.inputLabel}>Dirección Institucional *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Calle 38C Sur # 78-45"
        placeholderTextColor="#94A3B8"
        value={direccion}
        onChangeText={setDireccion}
      />

      {/* Input Teléfono */}
      <Text style={styles.inputLabel}>Teléfono de Contacto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. +57 312 456 7890"
        placeholderTextColor="#94A3B8"
        keyboardType="phone-pad"
        value={telefono}
        onChangeText={setTelefono}
      />

      {/* Input Barrio */}
      <Text style={styles.inputLabel}>Barrio / Sector en Bogotá</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej. Castilla, Kennedy"
        placeholderTextColor="#94A3B8"
        value={barrio}
        onChangeText={setBarrio}
      />

      {/* Input Correo */}
      <Text style={styles.inputLabel}>Correo Electrónico Institucional *</Text>
      <TextInput
        style={styles.input}
        placeholder="contacto@organizacion.org"
        placeholderTextColor="#94A3B8"
        keyboardType="email-address"
        autoCapitalize="none"
        value={correo}
        onChangeText={setCorreo}
      />

      {/* Input Contraseña */}
      <Text style={styles.inputLabel}>Contraseña de Acceso *</Text>
      <TextInput
        style={styles.input}
        placeholder="Mínimo 6 caracteres"
        placeholderTextColor="#94A3B8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Input Categoría */}
      <Text style={styles.inputLabel}>Categoría de Acción Social</Text>
      <TextInput
        style={styles.input}
        value={categoria}
        onChangeText={setCategoria}
        placeholder="Ej. Alimentos y Bienestar Social"
        placeholderTextColor="#94A3B8"
      />

      {/* Botón Confirmar */}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleRegister}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.submitButtonText}>Confirmar y Guardar Registro</Text>
        )}
      </TouchableOpacity>

      {hasExistingOrgs && onCancel && (
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Ir al Dashboard</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  screenSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.black,
    marginBottom: 8,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
});
