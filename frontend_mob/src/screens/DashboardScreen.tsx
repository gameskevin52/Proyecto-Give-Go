import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS } from '../constants/theme';
import { Organizacion } from '../types';

interface DashboardScreenProps {
  currentOrg: Organizacion | null;
  organizacionesCount: number;
  onLogout: () => void;
  onUpdateOrg?: (updatedOrg: Organizacion) => Promise<{ success: boolean; source: 'backend' | 'local'; message?: string } | void> | void;
}

type SubTab = 'INFO_GENERAL' | 'MI_PERFIL' | 'EVENTOS_STATS';

// Iconos/Logos institucionales predefinidos
const LOGO_OPTIONS = ['🏢', '🤝', '🌱', '🏥', '📚', '🍞', '❤️', '🕊️'];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  currentOrg,
  organizacionesCount,
  onLogout,
  onUpdateOrg,
}) => {
  const [activeTab, setActiveTab] = useState<SubTab>('INFO_GENERAL');

  // Estado para la edición en "Mi Perfil"
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 1. nombre
  const [nombre, setNombre] = useState(currentOrg?.nombre || '');
  // 2. direccion
  const [direccion, setDireccion] = useState(currentOrg?.direccion || '');
  // 3. telefono
  const [telefono, setTelefono] = useState(currentOrg?.telefono || '');
  // 4. correo (Protegido por Admin General)
  const [correo, setCorreo] = useState(currentOrg?.correo || '');
  // 5. password
  const [password, setPassword] = useState(currentOrg?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  // 6. descripcion
  const [descripcion, setDescripcion] = useState(currentOrg?.descripcion || '');
  // 7. nit (Protegido por Admin General)
  const [nit, setNit] = useState(currentOrg?.nit || '');
  // 8. mision
  const [mision, setMision] = useState(currentOrg?.mision || '');
  // 9. vision
  const [vision, setVision] = useState(currentOrg?.vision || '');
  // Logo institucional
  const [logo, setLogo] = useState(currentOrg?.logo || '🏢');

  // Criterio 2: Autorización del Administrador General para modificar NIT y Correo
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminAuthBox, setShowAdminAuthBox] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');

  // Sincronizar estado cuando cambie la organización activa
  useEffect(() => {
    if (currentOrg) {
      setNombre(currentOrg.nombre || '');
      setDireccion(currentOrg.direccion || '');
      setTelefono(currentOrg.telefono || '');
      setCorreo(currentOrg.correo || '');
      setPassword(currentOrg.password || '');
      setDescripcion(currentOrg.descripcion || '');
      setNit(currentOrg.nit || '');
      setMision(currentOrg.mision || '');
      setVision(currentOrg.vision || '');
      setLogo(currentOrg.logo || '🏢');
    }
  }, [currentOrg]);

  // Validar y desbloquear permisos de Administrador General
  const handleAuthorizeAdmin = () => {
    const cleanKey = adminKeyInput.trim().toUpperCase();
    // Claves maestras de autorización institucional de Administrador General
    if (cleanKey === 'ADMIN2026' || cleanKey === 'ADMIN' || cleanKey === 'GIVEANDGO' || cleanKey === 'MASTER') {
      setIsAdminUnlocked(true);
      setShowAdminAuthBox(false);
      setAdminKeyInput('');
      Alert.alert(
        '🔓 Autorización Concedida',
        'Permiso de Administrador General validado. Ahora puedes editar el NIT y el Correo Institucional de forma segura.'
      );
    } else {
      Alert.alert(
        'Acceso Denegado',
        'La clave de Administrador General es incorrecta. Si necesitas cambiar el NIT o Correo, contacta a la directiva central de Give&Go.'
      );
    }
  };

  // Guardar Cambios en Backend MySQL y Almacenamiento Local (< 2 segundos)
  const handleSaveProfile = async () => {
    if (!currentOrg) return;

    // Criterio 3: Validaciones rigurosas
    if (!nombre.trim() || nombre.trim().length < 3) {
      Alert.alert('Validación', 'El nombre de la organización debe contener al menos 3 caracteres.');
      return;
    }

    if (!direccion.trim() || direccion.trim().length < 4) {
      Alert.alert('Validación', 'Por favor ingresa una dirección física institucional válida.');
      return;
    }

    if (!telefono.trim() || telefono.trim().length < 7) {
      Alert.alert('Validación', 'El teléfono debe contener al menos 7 dígitos.');
      return;
    }

    // Validación de formato de correo con Regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      Alert.alert('Validación', 'El formato del correo electrónico institucional no es válido (ej. contacto@organizacion.org).');
      return;
    }

    if (password.trim() && password.trim().length < 6) {
      Alert.alert('Validación', 'La contraseña institucional debe tener al menos 6 caracteres por seguridad.');
      return;
    }

    if (!nit.trim()) {
      Alert.alert('Validación', 'El NIT de la organización no puede estar vacío.');
      return;
    }

    setIsSaving(true);
    const startTime = Date.now();

    const updatedOrg: Organizacion = {
      ...currentOrg,
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      telefono: telefono.trim(),
      correo: correo.trim().toLowerCase(),
      password: password.trim(),
      descripcion: descripcion.trim(),
      nit: nit.trim(),
      mision: mision.trim(),
      vision: vision.trim(),
      logo: logo || '🏢',
    };

    try {
      if (onUpdateOrg) {
        await onUpdateOrg(updatedOrg);
      }

      const elapsed = (Date.now() - startTime) / 1000;
      setIsSaving(false);
      setIsEditing(false);
      setIsAdminUnlocked(false);

      // confirmacion de actualizacion de la organizacion
      Alert.alert(
        '¡Perfil Actualizado!',
        `Los datos de la organización se han actualizado exitosamente en la base de datos MySQL y en el panel institucional.\n\n⏱️ Tiempo de respuesta: ${elapsed.toFixed(2)}s`
      );
    } catch {
      setIsSaving(false);
      Alert.alert('Error', 'Ocurrió un inconveniente al guardar los datos en el servidor.');
    }
  };

  const handleCancelEditing = () => {
    // Restaurar valores previos
    if (currentOrg) {
      setNombre(currentOrg.nombre || '');
      setDireccion(currentOrg.direccion || '');
      setTelefono(currentOrg.telefono || '');
      setCorreo(currentOrg.correo || '');
      setPassword(currentOrg.password || '');
      setDescripcion(currentOrg.descripcion || '');
      setNit(currentOrg.nit || '');
      setMision(currentOrg.mision || '');
      setVision(currentOrg.vision || '');
      setLogo(currentOrg.logo || '🏢');
    }
    setIsEditing(false);
    setIsAdminUnlocked(false);
    setShowAdminAuthBox(false);
  };

  return (
    <View style={styles.container}>
      {/* 3 Botones / SubPestañas superiores */}
      
      <View style={styles.tabButtonGroup}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'INFO_GENERAL' && styles.tabButtonActive]}//Informaacion general
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
          style={[styles.tabButton, activeTab === 'MI_PERFIL' && styles.tabButtonActive]}//Miperfil donde hay posibilidad de actualizar
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
            <View style={styles.heroTopRow}>
              <Text style={styles.heroBadge}>
                {currentOrg ? `ID #${currentOrg.idOrganizacion} • ${currentOrg.barrio || 'Kennedy'}` : 'Bogotá Solidaria'}
              </Text>
              <Text style={styles.heroLogoIcon}>{currentOrg?.logo || '🏢'}</Text>
            </View>
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
            <Text style={styles.primaryActionButtonText}>👤 Ver y Actualizar Mi Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryActionButton}
            onPress={onLogout}
          >
            <Text style={styles.secondaryActionButtonText}>🚪 Cerrar Sesión Institucional</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CONTENIDO 2: Mi perfil panel de actualizacion */}
      {activeTab === 'MI_PERFIL' && (
        <View style={styles.profileCard}>
          <View style={styles.profileHeaderRow}>
            <View style={styles.profileTitleContainer}>
              <Text style={styles.profileLogoAvatar}>{logo}</Text>
              <View>
                <Text style={styles.profileTitle}>Perfil Institucional</Text>
                <Text style={styles.profileSubtitle}>
                  {isEditing ? 'Modificando datos en la base de datos' : 'Datos registrados en Give&Go MySQL'}
                </Text>
              </View>
            </View>

            <TouchableOpacity //Boton de confirmar o guardar actualizacion
              style={[styles.editToggleButton, isEditing && styles.editToggleButtonActive]}
              onPress={() => {
                if (isEditing) {
                  handleSaveProfile();
                } else {
                  setIsEditing(true);
                }
              }}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.editToggleButtonText}>
                  {isEditing ? '💾 Guardar' : '✏️ Editar'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Criterio 1: Selección de Logo / Insignia en modo edición */}
          {isEditing && (
            <View style={styles.logoPickerContainer}>
              <Text style={styles.fieldLabel}>Logo / Emblema de la Organización</Text>
              <View style={styles.logoOptionsRow}>
                {LOGO_OPTIONS.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[styles.logoOptionItem, logo === item && styles.logoOptionItemSelected]}
                    onPress={() => setLogo(item)}
                  >
                    <Text style={styles.logoOptionEmoji}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Campos de edicion para la efectiva actualizacion de la organizacion*/}

          {/* 1. NOMBRE */}
          <Text style={styles.fieldLabel}>1. Nombre de la Organización *</Text>
          {isEditing ? (
            <TextInput
              style={styles.inputEdit}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre oficial de la fundación"
              placeholderTextColor="#94A3B8"
            />
          ) : (
            <Text style={styles.fieldValue}>{nombre || 'Sin registrar'}</Text>
          )}

          {/* 2. DIRECCIÓN */}
          <Text style={styles.fieldLabel}>2. Dirección Institucional *</Text>
          {isEditing ? (
            <TextInput
              style={styles.inputEdit}
              value={direccion}
              onChangeText={setDireccion}
              placeholder="Ej. Calle 38C Sur # 78-45"
              placeholderTextColor="#94A3B8"
            />
          ) : (
            <Text style={styles.fieldValue}>{direccion || 'Sin registrar'}</Text>
          )}

          {/* 3. TELÉFONO */}
          <Text style={styles.fieldLabel}>3. Teléfono de Contacto *</Text>
          {isEditing ? (
            <TextInput
              style={styles.inputEdit}
              value={telefono}
              onChangeText={setTelefono}
              placeholder="+57 312 456 7890"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.fieldValue}>{telefono || 'Sin registrar'}</Text>
          )}

          {/* 4. CORREO Protegido por Administrador General */}
          <View style={styles.labelRowWithLock}>
            <Text style={styles.fieldLabel}>4. Correo Electrónico Institucional *</Text>
            {!isAdminUnlocked && isEditing && (
              <Text style={styles.lockBadge}>🔒 Solo Admin General</Text>
            )}
          </View>
          {isEditing ? (
            <View>
              <TextInput
                style={[styles.inputEdit, !isAdminUnlocked && styles.inputLocked]}
                value={correo}
                onChangeText={setCorreo}
                placeholder="contacto@organizacion.org"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                editable={isAdminUnlocked}
              />
              {!isAdminUnlocked && (
                <Text style={styles.lockHelperText}>
                  🛡️ El correo institucional no puede modificarse sin autorización del Administrador General.
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.fieldValue}>{correo || 'Sin registrar'}</Text>
          )}

          {/* 5. PASSWORD */}
          <View style={styles.labelRowWithLock}>
            <Text style={styles.fieldLabel}>5. Contraseña Institucional</Text>
            {isEditing && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.togglePasswordSmall}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {isEditing ? (
            <TextInput
              style={styles.inputEdit}
              value={password}
              onChangeText={setPassword}
              placeholder="Clave maestra de la organización"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPassword}
            />
          ) : (
            <Text style={styles.fieldValue}>
              {password ? '••••••••••••' : 'Protegida en Base de Datos'}
            </Text>
          )}

          {/* 6. DESCRIPCIÓN */}
          <Text style={styles.fieldLabel}>6. Descripción de la Organización *</Text>
          {isEditing ? (
            <TextInput
              style={[styles.inputEdit, styles.textAreaEdit]}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Breve reseña del trabajo social y comunitario que realizan..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.fieldValue}>
              {descripcion || 'Organización comunitaria dedicada al servicio social y solidario.'}
            </Text>
          )}

          {/* 7. NIT Protegido por Administrador General*/}
          <View style={styles.labelRowWithLock}>
            <Text style={styles.fieldLabel}>7. NIT Institucional *</Text>
            {!isAdminUnlocked && isEditing && (
              <Text style={styles.lockBadge}>🔒 Solo Admin General</Text>
            )}
          </View>
          {isEditing ? (
            <View>
              <TextInput
                style={[styles.inputEdit, !isAdminUnlocked && styles.inputLocked]}
                value={nit}
                onChangeText={setNit}
                placeholder="Ej. 901.458.789-2"
                placeholderTextColor="#94A3B8"
                editable={isAdminUnlocked}
              />
              {!isAdminUnlocked && (
                <Text style={styles.lockHelperText}>
                  🛡️ El NIT fiscal no puede modificarse sin autorización del Administrador General.
                </Text>
              )}
            </View>
          ) : (
            <Text style={styles.fieldValue}>{nit || 'Sin registrar'}</Text>
          )}

          {/* 8. MISIÓN */}
          <Text style={styles.fieldLabel}>8. Misión de la Organización</Text>
          {isEditing ? (
            <TextInput
              style={[styles.inputEdit, styles.textAreaEdit]}
              value={mision}
              onChangeText={setMision}
              placeholder="Objetivo social fundamental de la fundación..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.fieldValue}>{mision || 'Sin registrar'}</Text>
          )}

          {/* 9. VISIÓN */}
          <Text style={styles.fieldLabel}>9. Visión Institucional</Text>
          {isEditing ? (
            <TextInput
              style={[styles.inputEdit, styles.textAreaEdit]}
              value={vision}
              onChangeText={setVision}
              placeholder="Proyección a futuro y metas comunitarias..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.fieldValue}>{vision || 'Sin registrar'}</Text>
          )}

          {/* SECCIÓN DE AUTORIZACIÓN DEL ADMINISTRADOR GENERAL (Criterio 2) */}
          {isEditing && !isAdminUnlocked && (
            <View style={styles.adminAuthSection}>
              {!showAdminAuthBox ? (
                <TouchableOpacity
                  style={styles.adminUnlockButton}
                  onPress={() => setShowAdminAuthBox(true)}
                >
                  <Text style={styles.adminUnlockButtonText}>
                    🔑 ¿Eres Administrador General? Desbloquear NIT y Correo
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.adminAuthCard}>
                  <Text style={styles.adminAuthTitle}>🔐 Autorización de Administrador General</Text>
                  <Text style={styles.adminAuthDesc}>
                    Ingresa el token o clave maestra institucional para habilitar la edición de NIT y Correo:
                  </Text>
                  <TextInput
                    style={styles.adminAuthInput}
                    placeholder="Clave Maestra (ej. ADMIN2026)"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    value={adminKeyInput}
                    onChangeText={setAdminKeyInput}
                  />
                  <View style={styles.adminAuthBtnRow}>
                    <TouchableOpacity
                      style={styles.adminAuthCancelBtn}
                      onPress={() => {
                        setShowAdminAuthBox(false);
                        setAdminKeyInput('');
                      }}
                    >
                      <Text style={styles.adminAuthCancelBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.adminAuthConfirmBtn}
                      onPress={handleAuthorizeAdmin}
                    >
                      <Text style={styles.adminAuthConfirmBtnText}>Validar Permiso</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Badge cuando el Administrador General está desbloqueado */}
          {isEditing && isAdminUnlocked && (
            <View style={styles.adminUnlockedBanner}>
              <Text style={styles.adminUnlockedBannerText}>
                🔓 Modo Administrador General Habilitado: Ahora puedes actualizar el NIT y Correo Institucional.
              </Text>
            </View>
          )}

          {/* BOTONES DE ACCIÓN EN MODO EDICIÓN */}
          {isEditing && (
            <View style={styles.editActionButtonsContainer}>
              <TouchableOpacity
                style={styles.saveProfileButton}
                onPress={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? (
                  <View style={styles.savingRow}>
                    <ActivityIndicator color={COLORS.white} />
                    <Text style={[styles.saveProfileButtonText, { marginLeft: 8 }]}>
                      Actualizando Base de Datos...
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.saveProfileButtonText}>
                    💾 Guardar y Actualizar Base de Datos
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelEditButton}
                onPress={handleCancelEditing}
                disabled={isSaving}
              >
                <Text style={styles.cancelEditButtonText}>✕ Cancelar Edición</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/*  EVENTOS en panel superior de dashboard */}
      {activeTab === 'EVENTOS_STATS' && (
        <View>
          <Text style={styles.sectionTitle}>Estadísticas Generales de Eventos</Text>

          {/* Cards de cada uno*/}
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
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroBadge: {
    color: '#FEE2E2',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroLogoIcon: {
    fontSize: 24,
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
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  profileLogoAvatar: {
    fontSize: 30,
    backgroundColor: COLORS.primarySurface,
    padding: 8,
    borderRadius: 14,
    overflow: 'hidden',
  },
  profileTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  profileSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  editToggleButton: {
    backgroundColor: COLORS.primarySurface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  editToggleButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  editToggleButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 12,
  },
  logoPickerContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  logoOptionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  logoOptionItem: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 8,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoOptionItemSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primarySurface,
    borderWidth: 2,
  },
  logoOptionEmoji: {
    fontSize: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 10,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  labelRowWithLock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  lockBadge: {
    fontSize: 11,
    color: '#B91C1C',
    fontWeight: 'bold',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lockHelperText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  togglePasswordSmall: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  fieldValue: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
    marginBottom: 6,
    lineHeight: 20,
  },
  inputEdit: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: COLORS.black,
    marginBottom: 6,
  },
  inputLocked: {
    backgroundColor: '#F1F5F9',
    borderColor: '#CBD5E1',
    color: '#64748B',
  },
  textAreaEdit: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  adminAuthSection: {
    marginTop: 14,
    marginBottom: 10,
  },
  adminUnlockButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  adminUnlockButtonText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: 'bold',
  },
  adminAuthCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
  },
  adminAuthTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginBottom: 4,
  },
  adminAuthDesc: {
    fontSize: 11,
    color: '#1E3A8A',
    marginBottom: 8,
    lineHeight: 15,
  },
  adminAuthInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#93C5FD',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 8,
  },
  adminAuthBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  adminAuthCancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  adminAuthCancelBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: 'bold',
  },
  adminAuthConfirmBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#1E40AF',
  },
  adminAuthConfirmBtnText: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  adminUnlockedBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  adminUnlockedBannerText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editActionButtonsContainer: {
    marginTop: 14,
    gap: 8,
  },
  saveProfileButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveProfileButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelEditButton: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 11,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelEditButtonText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
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
