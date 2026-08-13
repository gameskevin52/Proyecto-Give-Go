import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { Organizacion } from '../types';

interface RegistroScreenProps {
  onRegisterSuccess: (nuevaOrg: Organizacion) => void;
  onCancel?: () => void;
  hasExistingOrgs: boolean;
}

const CATEGORIAS = [
  'Alimentos y Bienestar Social',
  'Salud y Prevención',
  'Educación y Talleres',
  'Medio Ambiente y Siembra',
  'Atención Comunitaria General',
];

export const RegistroScreen: React.FC<RegistroScreenProps> = ({
  onRegisterSuccess,
  onCancel,
  hasExistingOrgs,
}) => {
  // Sección 1: Información Principal
  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  // Sección 2: Ubicación y Contacto
  const [localidad] = useState('Kennedy');
  const [telefono, setTelefono] = useState('');
  const [representanteLegal, setRepresentanteLegal] = useState('');

  // Sección 3: Categoría y Propósito Institucional
  const [categoria, setCategoria] = useState('Alimentos y Bienestar Social');
  const [mision, setMision] = useState('');
  const [vision, setVision] = useState('');
  const [sitioWeb, setSitioWeb] = useState('');
  const [redesSociales, setRedesSociales] = useState('');

  // UI State
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = () => {
    if (
      !nombre.trim() ||
      !nit.trim() ||
      !direccion.trim() ||
      !correo.trim() ||
      !password.trim() ||
      !telefono.trim() ||
      !representanteLegal.trim() ||
      !categoria.trim() ||
      !mision.trim() ||
      !vision.trim()
    ) {
      Alert.alert(
        'Campos Obligatorios Incompletos',
        'Por favor diligencia todos los campos obligatorios (*): Nombre, NIT, Dirección, Correo, Contraseña, Teléfono, Representante Legal, Categoría, Misión y Visión.'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const nuevaOrg: Organizacion = {
        idOrganizacion: Date.now(),
        nombre: nombre.trim(),
        nit: nit.trim(),
        direccion: direccion.trim(),
        correo: correo.trim().toLowerCase(),
        password: password,
        localidad: localidad.trim() || 'Kennedy',
        telefono: telefono.trim(),
        representanteLegal: representanteLegal.trim(),
        categoria: categoria,
        mision: mision.trim(),
        vision: vision.trim(),
        sitioWeb: sitioWeb.trim(),
        redesSociales: redesSociales.trim(),
        barrio: 'Kennedy Central',
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
      setCorreo('');
      setPassword('');
      setTelefono('');
      setRepresentanteLegal('');
      setMision('');
      setVision('');
      setSitioWeb('');
      setRedesSociales('');

      Alert.alert(
        '¡Registro Exitoso!',
        `La organización "${nuevaOrg.nombre}" se ha registrado correctamente.`,
        [{ text: 'Ver en Dashboard', onPress: () => onRegisterSuccess(nuevaOrg) }]
      );

      onRegisterSuccess(nuevaOrg);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>🏢 Registro de Organización</Text>
      <Text style={styles.screenSubtitle}>Inscribe tu fundación y guárdala en la base de datos</Text>

      {/* SECCIÓN 1 */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>1. Información Principal (Obligatorio)</Text>

        <Text style={styles.inputLabel}>Nombre de la Organización *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Fundación Manos Unidas Kennedy"
          placeholderTextColor="#94A3B8"
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.inputLabel}>NIT *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. 901.458.789-2"
          placeholderTextColor="#94A3B8"
          value={nit}
          onChangeText={setNit}
        />

        <Text style={styles.inputLabel}>Dirección *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Calle 38C Sur # 78-45"
          placeholderTextColor="#94A3B8"
          value={direccion}
          onChangeText={setDireccion}
        />

        <Text style={styles.inputLabel}>Correo Electrónico *</Text>
        <TextInput
          style={styles.input}
          placeholder="contacto@organizacion.org"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          autoCapitalize="none"
          value={correo}
          onChangeText={setCorreo}
        />

        <Text style={styles.inputLabel}>Contraseña *</Text>
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* SECCIÓN 2 */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>2. Ubicación y Contacto (Bogotá)</Text>

        <Text style={styles.inputLabel}>Localidad *</Text>
        <View style={styles.readOnlyInput}>
          <Text style={styles.readOnlyText}>📍 {localidad} (Fijo)</Text>
        </View>

        <Text style={styles.inputLabel}>Teléfono *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. +57 312 456 7890"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          value={telefono}
          onChangeText={setTelefono}
        />

        <Text style={styles.inputLabel}>Representante Legal *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. Carolina Gómez Morales"
          placeholderTextColor="#94A3B8"
          value={representanteLegal}
          onChangeText={setRepresentanteLegal}
        />
      </View>

      {/* SECCIÓN 3 */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTitle}>3. Categoría y Propósito Institucional</Text>

        <Text style={styles.inputLabel}>Categoría de Acción *</Text>
        <TouchableOpacity
          style={styles.dropdownSelector}
          onPress={() => setShowCategoryPicker(true)}
        >
          <Text style={styles.dropdownText}>{categoria}</Text>
          <Text style={styles.dropdownArrow}>▼</Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>Misión de la Organización *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describa la misión social de su fundación..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
          value={mision}
          onChangeText={setMision}
        />

        <Text style={styles.inputLabel}>Visión Institucional *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describa la visión a futuro..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={3}
          value={vision}
          onChangeText={setVision}
        />

        <Text style={styles.inputLabel}>Sitio Web (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://manosunidaskennedy.org"
          placeholderTextColor="#94A3B8"
          autoCapitalize="none"
          value={sitioWeb}
          onChangeText={setSitioWeb}
        />

        <Text style={styles.inputLabel}>Redes Sociales (Opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej. @fundacionkennedy en Instagram / Facebook"
          placeholderTextColor="#94A3B8"
          value={redesSociales}
          onChangeText={setRedesSociales}
        />

        {/* Botón Confirmar Registro */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleRegister}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.submitButtonText}>Confirmar Registro</Text>
          )}
        </TouchableOpacity>

        {hasExistingOrgs && onCancel && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>Volver al Dashboard</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal Desplegable de Categorías */}
      <Modal
        visible={showCategoryPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCategoryPicker(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Seleccione Categoría de Acción</Text>
            <FlatList
              data={CATEGORIAS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    categoria === item && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setCategoria(item);
                    setShowCategoryPicker(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      categoria === item && styles.modalOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 4,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  readOnlyInput: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 4,
  },
  readOnlyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  dropdownSelector: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dropdownText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: 12,
    color: COLORS.textMuted,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
  },
  modalOptionSelected: {
    backgroundColor: COLORS.primarySurface,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  modalOptionText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  modalOptionTextSelected: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
