import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { Organizacion } from '../types';

interface DashboardScreenProps {
  currentOrg: Organizacion | null;
  organizacionesCount: number;
  onLogout: () => void;
  onUpdateOrg?: (updatedOrg: Organizacion) => void;
}

type SubTab = 'INFO_GENERAL' | 'MI_PERFIL' | 'EVENTOS_STATS';

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentOrg,
  organizacionesCount,
  onLogout,
  onUpdateOrg,
}) => {
  const [activeTab, setActiveTab] = useState<SubTab>('INFO_GENERAL');

  // Estado para la edición en "Mi Perfil"
  const [isEditing, setIsEditing] = useState(false);
  const [nombre, setNombre] = useState(currentOrg?.nombre || '');
  const [nit, setNit] = useState(currentOrg?.nit || '');
  const [direccion, setDireccion] = useState(currentOrg?.direccion || '');
  const [correo, setCorreo] = useState(currentOrg?.correo || '');
  const [localidad, setLocalidad] = useState(currentOrg?.localidad || 'Kennedy');
  const [telefono, setTelefono] = useState(currentOrg?.telefono || '');
  const [representanteLegal, setRepresentanteLegal] = useState(currentOrg?.representanteLegal || '');
  const [categoria, setCategoria] = useState(currentOrg?.categoria || 'Alimentos y Bienestar Social');
  const [mision, setMision] = useState(currentOrg?.mision || '');
  const [vision, setVision] = useState(currentOrg?.vision || '');
  const [sitioWeb, setSitioWeb] = useState(currentOrg?.sitioWeb || '');
  const [redesSociales, setRedesSociales] = useState(currentOrg?.redesSociales || '');

  useEffect(() => {
    if (currentOrg) {
      setNombre(currentOrg.nombre || '');
      setNit(currentOrg.nit || '');
      setDireccion(currentOrg.direccion || '');
      setCorreo(currentOrg.correo || '');
      setLocalidad(currentOrg.localidad || 'Kennedy');
      setTelefono(currentOrg.telefono || '');
      setRepresentanteLegal(currentOrg.representanteLegal || '');
      setCategoria(currentOrg.categoria || 'Alimentos y Bienestar Social');
      setMision(currentOrg.mision || '');
      setVision(currentOrg.vision || '');
      setSitioWeb(currentOrg.sitioWeb || '');
      setRedesSociales(currentOrg.redesSociales || '');
    }
  }, [currentOrg]);

  const handleSaveProfile = () => {
    if (!currentOrg) return;

    if (!nombre.trim() || !nit.trim() || !direccion.trim() || !correo.trim()) {
      Alert.alert('Error', 'Los campos principales no pueden estar vacíos.');
      return;
    }

    const updatedOrg: Organizacion = {
      ...currentOrg,
      nombre: nombre.trim(),
      nit: nit.trim(),
      direccion: direccion.trim(),
      correo: correo.trim(),
      localidad: localidad.trim() || 'Kennedy',
      telefono: telefono.trim(),
      representanteLegal: representanteLegal.trim(),
      categoria: categoria.trim(),
      mision: mision.trim(),
      vision: vision.trim(),
      sitioWeb: sitioWeb.trim(),
      redesSociales: redesSociales.trim(),
    };

    if (onUpdateOrg) {
      onUpdateOrg(updatedOrg);
    }

    setIsEditing(false);
    Alert.alert('Perfil Actualizado', 'La información de la organización se ha guardado exitosamente.');
  };

  return (
    <View style={styles.container}>
      {/* 3 Botones / SubPestañas superiores */}
      <View style={styles.tabButtonGroup}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'INFO_GENERAL' && styles.tabButtonActive]}
          onPress={() => setActiveTab('INFO_GENERAL')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'INFO_GENERAL' && styles.tabButtonTextActive,
            ]}
          >
            Info General
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'MI_PERFIL' && styles.tabButtonActive]}
          onPress={() => setActiveTab('MI_PERFIL')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'MI_PERFIL' && styles.tabButtonTextActive,
            ]}
          >
            Mi Perfil
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'EVENTOS_STATS' && styles.tabButtonActive]}
          onPress={() => setActiveTab('EVENTOS_STATS')}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'EVENTOS_STATS' && styles.tabButtonTextActive,
            ]}
          >
            Eventos
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTENIDO 1: INFO GENERAL */}
      {activeTab === 'INFO_GENERAL' && (
        <View>
          {/* Banner Bienvenida */}
          <View style={styles.heroCard}>
            <Text style={styles.heroBadge}>
              {currentOrg ? `ID #${currentOrg.idOrganizacion} • ${currentOrg.barrio || 'Kennedy'}` : 'Bogotá Solidaria'}
            </Text>
            <Text style={styles.heroTitle}>
              {currentOrg ? currentOrg.nombre : 'Panel de Organizaciones Give&Go'}
            </Text>
            <Text style={styles.heroSubtitle}>
              {currentOrg
                ? `Organización registrada en ${currentOrg.ciudad || 'Bogotá'}. NIT: ${currentOrg.nit} | Correo: ${currentOrg.correo}`
                : 'Inscribe una organización para comenzar a gestionar donaciones, eventos y voluntariado.'}
            </Text>
          </View>

          {/* Tarjetas de Métricas */}
          <Text style={styles.sectionTitle}>Resumen de la Organización</Text>
          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { borderLeftColor: COLORS.primary }]}>
              <Text style={styles.metricNumber}>{organizacionesCount}</Text>
              <Text style={styles.metricLabel}>Organizaciones</Text>
            </View>
            <View style={[styles.metricCard, { borderLeftColor: COLORS.info }]}>
              <Text style={styles.metricNumber}>0</Text>
              <Text style={styles.metricLabel}>Eventos Activos</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={[styles.metricCard, { borderLeftColor: COLORS.success }]}>
              <Text style={styles.metricNumber}>$0</Text>
              <Text style={styles.metricLabel}>Total Donaciones</Text>
            </View>
            <View style={[styles.metricCard, { borderLeftColor: COLORS.warning }]}>
              <Text style={styles.metricNumber}>0</Text>
              <Text style={styles.metricLabel}>Voluntarios</Text>
            </View>
          </View>

          {/* Botón Acción Rápida */}
          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => setActiveTab('MI_PERFIL')}
          >
            <Text style={styles.primaryActionButtonText}>👤 Ver y Editar Mi Perfil Institucional</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={onLogout}
          >
            <Text style={styles.secondaryActionButtonText}>🚪 Cerrar Sesión / Cambiar Organización</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CONTENIDO 2: MI PERFIL */}
      {activeTab === 'MI_PERFIL' && (
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <Text style={styles.profileTitle}>🏢 Perfil de la Organización</Text>
            <TouchableOpacity
              style={styles.editToggleButton}
              onPress={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              <Text style={styles.editToggleButtonText}>
                {isEditing ? '💾 Guardar Cambios' : '✏️ Editar Perfil'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Campos de información / edición */}
          <Text style={styles.fieldLabel}>Nombre de la Organización</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={nombre} onChangeText={setNombre} />
          ) : (
            <Text style={styles.fieldValue}>{nombre || 'Sin registrar'}</Text>
          )}

          <Text style={styles.fieldLabel}>NIT</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={nit} onChangeText={setNit} />
          ) : (
            <Text style={styles.fieldValue}>{nit || 'Sin registrar'}</Text>
          )}

          <Text style={styles.fieldLabel}>Dirección</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={direccion} onChangeText={setDireccion} />
          ) : (
            <Text style={styles.fieldValue}>{direccion || 'Sin registrar'}</Text>
          )}

          <Text style={styles.fieldLabel}>Correo Electrónico</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={correo} onChangeText={setCorreo} keyboardType="email-address" />
          ) : (
            <Text style={styles.fieldValue}>{correo || 'Sin registrar'}</Text>
          )}

          <Text style={styles.fieldLabel}>Localidad</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={localidad} onChangeText={setLocalidad} />
          ) : (
            <Text style={styles.fieldValue}>{localidad || 'Kennedy'}</Text>
          )}

          <Text style={styles.fieldLabel}>Teléfono</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" />
          ) : (
            <Text style={styles.fieldValue}>{telefono || 'Sin registrar'}</Text>
          )}

          <Text style={styles.fieldLabel}>Representante Legal</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={representanteLegal} onChangeText={setRepresentanteLegal} />
          ) : (
            <Text style={styles.fieldValue}>{representanteLegal || 'Sin registrar'}</Text>
          )}

          <Text style={styles.fieldLabel}>Categoría de Acción</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={categoria} onChangeText={setCategoria} />
          ) : (
            <Text style={styles.fieldValue}>{categoria || 'Alimentos y Bienestar Social'}</Text>
          )}

          <Text style={styles.fieldLabel}>Misión de la Organización</Text>
          {isEditing ? (
            <TextInput
              style={[styles.inputEdit, styles.textAreaEdit]}
              value={mision}
              onChangeText={setMision}
              multiline
            />
          ) : (
            <Text style={styles.fieldValue}>{mision || 'Sin registrar'}</Text>
          )}

          <Text style={styles.fieldLabel}>Visión Institucional</Text>
          {isEditing ? (
            <TextInput
              style={[styles.inputEdit, styles.textAreaEdit]}
              value={vision}
              onChangeText={setVision}
              multiline
            />
          ) : (
            <Text style={styles.fieldValue}>{vision || 'Sin registrar'}</Text>
          )}

          <Text style={styles.fieldLabel}>Sitio Web</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={sitioWeb} onChangeText={setSitioWeb} />
          ) : (
            <Text style={styles.fieldValue}>{sitioWeb || 'No especificado'}</Text>
          )}

          <Text style={styles.fieldLabel}>Redes Sociales</Text>
          {isEditing ? (
            <TextInput style={styles.inputEdit} value={redesSociales} onChangeText={setRedesSociales} />
          ) : (
            <Text style={styles.fieldValue}>{redesSociales || 'No especificadas'}</Text>
          )}

          {isEditing && (
            <TouchableOpacity style={styles.saveProfileButton} onPress={handleSaveProfile}>
              <Text style={styles.saveProfileButtonText}>Guardar Todos los Cambios</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* CONTENIDO 3: EVENTOS */}
      {activeTab === 'EVENTOS_STATS' && (
        <View>
          <Text style={styles.sectionTitle}>Estadísticas Generales de Eventos</Text>

          {/* 2 Cards Cuadriredondas */}
          <View style={styles.roundedCardsRow}>
            <View style={styles.roundedCard}>
              <Text style={styles.roundedCardIcon}>🗓️</Text>
              <Text style={styles.roundedCardNumber}>0</Text>
              <Text style={styles.roundedCardLabel}>Total de Eventos</Text>
            </View>

            <View style={styles.roundedCard}>
              <Text style={styles.roundedCardIcon}>👥</Text>
              <Text style={styles.roundedCardNumber}>0</Text>
              <Text style={styles.roundedCardLabel}>Participantes</Text>
            </View>
          </View>

          {/* Estadísticas de eventos por tipo */}
          <Text style={styles.sectionSubTitle}>Eventos por Tipo de Acción</Text>

          <View style={styles.categoryStatsList}>
            <View style={styles.categoryStatCard}>
              <View style={styles.categoryStatHeader}>
                <Text style={styles.categoryStatTitle}>🏥 Salud y Prevención</Text>
                <Text style={styles.categoryStatCount}>0 eventos</Text>
              </View>
              <Text style={styles.categoryStatDesc}>0 participantes impactados</Text>
            </View>

            <View style={styles.categoryStatCard}>
              <View style={styles.categoryStatHeader}>
                <Text style={styles.categoryStatTitle}>📚 Educación y Talleres</Text>
                <Text style={styles.categoryStatCount}>0 eventos</Text>
              </View>
              <Text style={styles.categoryStatDesc}>0 participantes impactados</Text>
            </View>

            <View style={styles.categoryStatCard}>
              <View style={styles.categoryStatHeader}>
                <Text style={styles.categoryStatTitle}>🌱 Medio Ambiente y Siembra</Text>
                <Text style={styles.categoryStatCount}>0 eventos</Text>
              </View>
              <Text style={styles.categoryStatDesc}>0 participantes impactados</Text>
            </View>

            <View style={styles.categoryStatCard}>
              <View style={styles.categoryStatHeader}>
                <Text style={styles.categoryStatTitle}>🍞 Alimentos y Mercados Solidarios</Text>
                <Text style={styles.categoryStatCount}>0 eventos</Text>
              </View>
              <Text style={styles.categoryStatDesc}>0 participantes impactados</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  tabButtonGroup: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabButtonActive: {
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
  },
  tabButtonTextActive: {
    color: COLORS.primary,
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
  sectionSubTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 18,
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
  secondaryActionButton: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryActionButtonText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  profileHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  editToggleButton: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  editToggleButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: 6,
  },
  inputEdit: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 6,
  },
  textAreaEdit: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveProfileButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  saveProfileButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  roundedCardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  roundedCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  roundedCardIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  roundedCardNumber: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
  },
  roundedCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  categoryStatsList: {
    gap: 10,
  },
  categoryStatCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  categoryStatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryStatTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  categoryStatCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  categoryStatDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
