import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

// Colores del sistema Give&Go
const COLORS = {
  primary: '#DC2626',
  primaryDark: '#B91C1C',
  primarySurface: '#FEF2F2',
  background: '#F8FAFC',
  card: '#FFFFFF',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  success: '#10B981',
  white: '#FFFFFF',
  black: '#000000',
};

type ScreenType = 'DASHBOARD' | 'EVENTOS' | 'MAPA' | 'DONAR' | 'REGISTRO';

export default function App() {
  // Al exportar el proyecto el registrar aparece de primeras
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('REGISTRO');

  // Base de datos local en memoria para organizaciones
  const [organizaciones, setOrganizaciones] = useState<any[]>([]);
  const [currentOrg, setCurrentOrg] = useState<any>(null);

  // Formulario Registro Organización
  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [categoria, setCategoria] = useState('Alimentos y Bienestar Social');
  const [barrio, setBarrio] = useState('Kennedy Central');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = () => {
    if (!nombre.trim() || !nit.trim() || !direccion.trim() || !correo.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor diligencia todos los campos obligatorios (*)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const nuevaOrg = {
        idOrganizacion: organizaciones.length + 1,
        nombre: nombre.trim(),
        nit: nit.trim(),
        direccion: direccion.trim(),
        telefono: telefono.trim() || '+57 300 000 0000',
        correo: correo.trim().toLowerCase(),
        password: password,
        categoria: categoria.trim(),
        barrio: barrio.trim(),
        localidad: 'Kennedy',
        ciudad: 'Bogotá',
        departamento: 'Bogotá D.C.',
        pais: 'Colombia',
        fechaRegistro: Date.now(),
        estadoVerificacion: 'pendiente',
        verificada: 0,
      };

      const updatedOrgs = [...organizaciones, nuevaOrg];
      setOrganizaciones(updatedOrgs);
      setCurrentOrg(nuevaOrg);

      // Limpiar campos del formulario
      setNombre('');
      setNit('');
      setDireccion('');
      setTelefono('');
      setCorreo('');
      setPassword('');

      setIsSubmitting(false);

      // Redirigir al Dashboard inmediatamente tras el registro exitoso
      Alert.alert(
        '¡Registro Exitoso!',
        `La organización "${nuevaOrg.nombre}" se ha guardado correctamente en la base de datos.`,
        [{ text: 'Ver en Dashboard', onPress: () => setCurrentScreen('DASHBOARD') }]
      );
      setCurrentScreen('DASHBOARD');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ExpoStatusBar style="dark" />

      {/* Top Header Sticky */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.heartIcon}>❤️</Text>
          <Text style={styles.brandTitle}>Give&Go</Text>
        </View>
        <TouchableOpacity
          style={styles.registerButtonHeader}
          onPress={() => setCurrentScreen('REGISTRO')}
        >
          <Text style={styles.registerButtonHeaderText}>+ Registrar Org</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido Principal */}
      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {currentScreen === 'DASHBOARD' && (
          <View style={styles.screenPadding}>
            {/* Banner Bienvenida */}
            <View style={styles.heroCard}>
              <Text style={styles.heroBadge}>
                {currentOrg ? `ID #${currentOrg.idOrganizacion} • ${currentOrg.barrio}` : 'Bogotá Solidaria'}
              </Text>
              <Text style={styles.heroTitle}>
                {currentOrg ? currentOrg.nombre : 'Panel de Organizaciones Give&Go'}
              </Text>
              <Text style={styles.heroSubtitle}>
                {currentOrg
                  ? `Organización registrada en ${currentOrg.ciudad}. Correo: ${currentOrg.correo}`
                  : 'Registra tu primera organización para comenzar a gestionar donaciones, eventos y voluntariado.'}
              </Text>
            </View>

            {/* Tarjetas de Métricas */}
            <Text style={styles.sectionTitle}>Resumen de la Organización</Text>
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { borderLeftColor: COLORS.primary }]}>
                <Text style={styles.metricNumber}>{organizaciones.length}</Text>
                <Text style={styles.metricLabel}>Organizaciones</Text>
              </View>
              <View style={[styles.metricCard, { borderLeftColor: '#2563EB' }]}>
                <Text style={styles.metricNumber}>0</Text>
                <Text style={styles.metricLabel}>Eventos Activos</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { borderLeftColor: '#059669' }]}>
                <Text style={styles.metricNumber}>$0</Text>
                <Text style={styles.metricLabel}>Total Donaciones</Text>
              </View>
              <View style={[styles.metricCard, { borderLeftColor: '#D97706' }]}>
                <Text style={styles.metricNumber}>0</Text>
                <Text style={styles.metricLabel}>Voluntarios</Text>
              </View>
            </View>

            {/* Botón Acción Rápida */}
            <TouchableOpacity
              style={styles.primaryActionButton}
              onPress={() => setCurrentScreen('REGISTRO')}
            >
              <Text style={styles.primaryActionButtonText}>📝 Inscribir Nueva Fundación / Organización</Text>
            </TouchableOpacity>
          </View>
        )}

        {currentScreen === 'EVENTOS' && (
          <View style={styles.screenPadding}>
            <Text style={styles.screenTitle}>📅 Próximos Eventos</Text>
            <Text style={styles.screenSubtitle}>Jornadas comunitarias y entregas en Bogotá</Text>

            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🗓️</Text>
              <Text style={styles.emptyTitle}>Sin eventos registrados</Text>
              <Text style={styles.emptyDesc}>
                Aún no hay eventos comunitarios programados en la agenda. Los eventos creados aparecerán aquí.
              </Text>
            </View>
          </View>
        )}

        {currentScreen === 'MAPA' && (
          <View style={styles.screenPadding}>
            <Text style={styles.screenTitle}>🗺️ Mapa de Cobertura</Text>
            <Text style={styles.screenSubtitle}>Puntos de recolección y sedes en Bogotá D.C.</Text>

            {organizaciones.length === 0 ? (
              <View style={styles.emptyCard}>
                <Text style={styles.emptyIcon}>📍</Text>
                <Text style={styles.emptyTitle}>Sin puntos en el mapa</Text>
                <Text style={styles.emptyDesc}>
                  Aún no hay puntos ni sedes registradas en el mapa. Se agregarán automáticamente al registrar organizaciones.
                </Text>
              </View>
            ) : (
              organizaciones.map((org) => (
                <View key={org.idOrganizacion} style={styles.cardItem}>
                  <Text style={styles.cardBadge}>{org.barrio} • Bogotá</Text>
                  <Text style={styles.cardItemTitle}>{org.nombre}</Text>
                  <Text style={styles.cardItemDesc}>
                    {org.direccion} • Tel: {org.telefono}
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        {currentScreen === 'DONAR' && (
          <View style={styles.screenPadding}>
            <Text style={styles.screenTitle}>❤️ Donar a Give&Go</Text>
            <Text style={styles.screenSubtitle}>Tu aporte transforma vidas en comedores y comunidades vulnerables.</Text>

            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🎁</Text>
              <Text style={styles.emptyTitle}>Sin donaciones registradas</Text>
              <Text style={styles.emptyDesc}>
                Aún no hay aportes registrados en el historial de donaciones.
              </Text>
            </View>
          </View>
        )}

        {currentScreen === 'REGISTRO' && (
          <View style={styles.screenPadding}>
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

            {organizaciones.length > 0 && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setCurrentScreen('DASHBOARD')}
              >
                <Text style={styles.cancelButtonText}>Ir al Dashboard</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Barra de Navegación Inferior (4 pestañas: Dashboard, Eventos, Mapa, Donar) */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setCurrentScreen('DASHBOARD')}
        >
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navLabel, currentScreen === 'DASHBOARD' && styles.navLabelActive]}>
            DASHBOARD
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setCurrentScreen('EVENTOS')}
        >
          <Text style={styles.navIcon}>📅</Text>
          <Text style={[styles.navLabel, currentScreen === 'EVENTOS' && styles.navLabelActive]}>
            EVENTOS
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setCurrentScreen('MAPA')}
        >
          <Text style={styles.navIcon}>📍</Text>
          <Text style={[styles.navLabel, currentScreen === 'MAPA' && styles.navLabelActive]}>
            MAPA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navTab}
          onPress={() => setCurrentScreen('DONAR')}
        >
          <Text style={styles.navIcon}>❤️</Text>
          <Text style={[styles.navLabel, currentScreen === 'DONAR' && styles.navLabelActive]}>
            DONAR
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    height: 60,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 22,
    marginRight: 6,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  registerButtonHeader: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  registerButtonHeaderText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 12,
  },
  contentContainer: {
    flex: 1,
  },
  screenPadding: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  heroBadge: {
    color: '#FEE2E2',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  heroTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: '#FEF2F2',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  primaryActionButton: {
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryActionButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
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
  cardItem: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardBadge: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  cardItemDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  emptyCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 12,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
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
  bottomNav: {
    height: 64,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    flex: 1,
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  navLabelActive: {
    color: COLORS.primary,
  },
});
