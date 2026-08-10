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
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('DASHBOARD');

  // Formulario Registro Organización
  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [categoria, setCategoria] = useState('Alimentación y Comedores');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = () => {
    if (!nombre.trim() || !nit.trim() || !direccion.trim() || !correo.trim() || !password.trim()) {
      Alert.alert('Campos incompletos', 'Por favor diligencia todos los campos obligatorios (*)');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        '¡Registro Exitoso!',
        `La organización "${nombre}" ha sido registrada satisfactoriamente en Give&Go.`,
        [{ text: 'Ir al Dashboard', onPress: () => setCurrentScreen('DASHBOARD') }]
      );
    }, 1500);
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
              <Text style={styles.heroBadge}>Bogotá Solidaria</Text>
              <Text style={styles.heroTitle}>Panel de Organizaciones y Voluntariado</Text>
              <Text style={styles.heroSubtitle}>
                Conectamos fundaciones, comedores comunitarios y donantes para maximizar el impacto social.
              </Text>
            </View>

            {/* Tarjetas de Métricas */}
            <Text style={styles.sectionTitle}>Impacto en la Comunidad</Text>
            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { borderLeftColor: COLORS.primary }]}>
                <Text style={styles.metricNumber}>1,248</Text>
                <Text style={styles.metricLabel}>Kits Entregados</Text>
              </View>
              <View style={[styles.metricCard, { borderLeftColor: '#2563EB' }]}>
                <Text style={styles.metricNumber}>45</Text>
                <Text style={styles.metricLabel}>Organizaciones</Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={[styles.metricCard, { borderLeftColor: '#059669' }]}>
                <Text style={styles.metricNumber}>312</Text>
                <Text style={styles.metricLabel}>Voluntarios Activos</Text>
              </View>
              <View style={[styles.metricCard, { borderLeftColor: '#D97706' }]}>
                <Text style={styles.metricNumber}>18</Text>
                <Text style={styles.metricLabel}>Localidades</Text>
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

            <View style={styles.cardItem}>
              <Text style={styles.cardBadge}>Kennedy • Mañana 9:00 AM</Text>
              <Text style={styles.cardItemTitle}>Jornada de Alimentación y Mercados</Text>
              <Text style={styles.cardItemDesc}>
                Distribución de 300 paquetes nutricionales para familias del sector Patio Bonito.
              </Text>
            </View>

            <View style={styles.cardItem}>
              <Text style={styles.cardBadge}>Bosa • Sábado 8:00 AM</Text>
              <Text style={styles.cardItemTitle}>Campaña de Salud y Ropa Infantil</Text>
              <Text style={styles.cardItemDesc}>
                Atención a primera infancia y donación de prendas en excelente estado.
              </Text>
            </View>
          </View>
        )}

        {currentScreen === 'MAPA' && (
          <View style={styles.screenPadding}>
            <Text style={styles.screenTitle}>🗺️ Mapa de Cobertura</Text>
            <Text style={styles.screenSubtitle}>Puntos de recolección y sedes en Bogotá D.C.</Text>
            <View style={styles.mapMockCard}>
              <Text style={styles.mapMockIcon}>📍</Text>
              <Text style={styles.mapMockText}>18 Puntos de Acopio Activos</Text>
              <Text style={styles.cardItemDesc}>Kennedy, Bosa, Suba, Engativá, Usme, San Cristóbal y Ciudad Bolívar.</Text>
            </View>
          </View>
        )}

        {currentScreen === 'DONAR' && (
          <View style={styles.screenPadding}>
            <Text style={styles.screenTitle}>❤️ Donar a Give&Go</Text>
            <Text style={styles.screenSubtitle}>Tu aporte transforma vidas en comedores y comunidades vulnerables.</Text>
            <View style={styles.cardItem}>
              <Text style={styles.cardItemTitle}>Donación en Especie</Text>
              <Text style={styles.cardItemDesc}>Alimentos no perecederos, ropa en buen estado, útiles escolares.</Text>
            </View>
            <View style={styles.cardItem}>
              <Text style={styles.cardItemTitle}>Aporte Económico</Text>
              <Text style={styles.cardItemDesc}>Canales PSE, Nequi, Daviplata y Bancolombia verificados.</Text>
            </View>
          </View>
        )}

        {currentScreen === 'REGISTRO' && (
          <View style={styles.screenPadding}>
            <Text style={styles.screenTitle}>🏢 Registro de Organización</Text>
            <Text style={styles.screenSubtitle}>Inscribe tu fundación con verificación de correo</Text>

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

            {/* Input Correo */}
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
            <Text style={styles.inputLabel}>Categoría de Acción</Text>
            <TextInput
              style={styles.input}
              value={categoria}
              onChangeText={setCategoria}
              placeholder="Ej. Alimentación, Infancia, Adulto Mayor"
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
                <Text style={styles.submitButtonText}>Confirmar Registro</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setCurrentScreen('DASHBOARD')}
            >
              <Text style={styles.cancelButtonText}>Volver al Dashboard</Text>
            </TouchableOpacity>
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
  mapMockCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapMockIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  mapMockText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 6,
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
