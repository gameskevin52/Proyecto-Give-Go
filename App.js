import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal
} from 'react-native';

const API_BASE_URL = 'http://192.168.1.13:3000/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('inicio'); // 'inicio' | 'registro' | 'login' | 'perfil'
  const [currentUser, setCurrentUser] = useState(null);
  const [sessionToken, setSessionToken] = useState(null);

  // Formulario Registro
  const [regForm, setRegForm] = useState({
    rol: 'Voluntario',
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    tipo_documento: 'CC',
    num_documento: '',
    telefono: '',
    correo: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    ciudad: 'Bogotá'
  });
  const [regLoading, setRegLoading] = useState(false);

  // Formulario Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Modal Cerrar Sesión
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Manejo de Registro
  const handleRegister = async () => {
    if (!regForm.nombre1 || !regForm.apellido1 || !regForm.num_documento || !regForm.telefono || !regForm.correo || !regForm.password) {
      Alert.alert('Campos Incompletos', 'Por favor llena todos los campos obligatorios (*)');
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      Alert.alert('Error de Contraseña', 'Las contraseñas no coinciden.');
      return;
    }

    setRegLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm)
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        Alert.alert('¡Registro Exitoso!', `Usuario creado con éxito (ID #${data.usuario.id_usuario}).`);
        setCurrentScreen('login');
        setLoginEmail(data.usuario.correo);
      } else {
        Alert.alert('Error en Registro', data.mensaje || 'No se pudo completar el registro');
      }
    } catch (err) {
      Alert.alert('Error de Conexión', 'No se pudo conectar al servidor.');
    } finally {
      setRegLoading(false);
    }
  };

  // Manejo de Login
  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword) {
      Alert.alert('Atención', 'Ingresa tu correo y contraseña.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setCurrentUser(data.usuario);
        setSessionToken(data.token);
        setCurrentScreen('perfil');
        Alert.alert('Bienvenido', `Hola ${data.usuario.nombre1}, has iniciado sesión.`);
      } else {
        Alert.alert('Error de Autenticación', data.mensaje || 'Credenciales inválidas');
      }
    } catch (err) {
      Alert.alert('Error de Red', 'No se pudo conectar con el servidor.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Manejo de Cerrar Sesión
  const handleConfirmLogout = () => {
    setCurrentUser(null);
    setSessionToken(null);
    setLoginPassword('');
    setShowLogoutConfirm(false);
    setCurrentScreen('inicio');
    Alert.alert('Sesión Finalizada', 'Has cerrado sesión correctamente.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#DC2626" />
      
      {/* Header Superior */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Give&Go Mobile</Text>
        {currentUser && (
          <TouchableOpacity
            style={styles.headerLogoutBtn}
            onPress={() => setShowLogoutConfirm(true)}
          >
            <Text style={styles.headerLogoutText}>Salir</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Pantalla de Inicio */}
      {currentScreen === 'inicio' && (
        <View style={styles.containerCenter}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoBadgeText}>G&G</Text>
          </View>
          <Text style={styles.title}>Give&Go</Text>
          <Text style={styles.subtitle}>Aplicación Móvil en Expo Go</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setCurrentScreen('registro')}
            >
              <Text style={styles.primaryBtnText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setCurrentScreen('login')}
            >
              <Text style={styles.secondaryBtnText}>Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Pantalla de Registro */}
      {currentScreen === 'registro' && (
        <ScrollView style={styles.formContainer} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.sectionTitle}>Crear Cuenta</Text>
          <Text style={styles.sectionSubtitle}>Ingresa tus datos personales</Text>

          <Text style={styles.label}>Rol de Usuario *</Text>
          <View style={styles.rolePicker}>
            {['Voluntario', 'Beneficiario', 'Organizacion'].map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.roleBtn, regForm.rol === r && styles.roleBtnActive]}
                onPress={() => setRegForm({ ...regForm, rol: r })}
              >
                <Text style={[styles.roleBtnText, regForm.rol === r && styles.roleBtnTextActive]}>
                  {r}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Primer Nombre *</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan"
            value={regForm.nombre1}
            onChangeText={(t) => setRegForm({ ...regForm, nombre1: t })}
          />

          <Text style={styles.label}>Primer Apellido *</Text>
          <TextInput
            style={styles.input}
            placeholder="Pérez"
            value={regForm.apellido1}
            onChangeText={(t) => setRegForm({ ...regForm, apellido1: t })}
          />

          <Text style={styles.label}>N° Documento *</Text>
          <TextInput
            style={styles.input}
            placeholder="1019283745"
            value={regForm.num_documento}
            onChangeText={(t) => setRegForm({ ...regForm, num_documento: t })}
          />

          <Text style={styles.label}>Teléfono *</Text>
          <TextInput
            style={styles.input}
            placeholder="300 123 4567"
            keyboardType="phone-pad"
            value={regForm.telefono}
            onChangeText={(t) => setRegForm({ ...regForm, telefono: t })}
          />

          <Text style={styles.label}>Correo Electrónico *</Text>
          <TextInput
            style={styles.input}
            placeholder="correo@ejemplo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={regForm.correo}
            onChangeText={(t) => setRegForm({ ...regForm, correo: t })}
          />

          <Text style={styles.label}>Contraseña *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={regForm.password}
            onChangeText={(t) => setRegForm({ ...regForm, password: t })}
          />

          <Text style={styles.label}>Confirmar Contraseña *</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={regForm.confirmPassword}
            onChangeText={(t) => setRegForm({ ...regForm, confirmPassword: t })}
          />

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleRegister}
            disabled={regLoading}
          >
            <Text style={styles.primaryBtnText}>
              {regLoading ? 'Registrando...' : 'Registrarse en BD'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => setCurrentScreen('login')}
          >
            <Text style={styles.linkText}>¿Ya tienes cuenta? Iniciar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Pantalla de Iniciar Sesión */}
      {currentScreen === 'login' && (
        <View style={styles.containerPadding}>
          <Text style={styles.sectionTitle}>Iniciar Sesión</Text>
          <Text style={styles.sectionSubtitle}>Accede con tu correo y contraseña</Text>

          <Text style={styles.label}>Correo</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@giveandgo.org"
            autoCapitalize="none"
            keyboardType="email-address"
            value={loginEmail}
            onChangeText={setLoginEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            secureTextEntry
            value={loginPassword}
            onChangeText={setLoginPassword}
          />

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={handleLogin}
            disabled={loginLoading}
          >
            <Text style={styles.primaryBtnText}>
              {loginLoading ? 'Iniciando sesión...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkBtn}
            onPress={() => setCurrentScreen('registro')}
          >
            <Text style={styles.linkText}>¿No tienes cuenta? Crear una ahora</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Pantalla de Perfil */}
      {currentScreen === 'perfil' && currentUser && (
        <ScrollView style={styles.containerPadding}>
          <Text style={styles.sectionTitle}>Mi Perfil</Text>
          <View style={styles.profileCard}>
            <Text style={styles.profileName}>{currentUser.nombre1} {currentUser.apellido1}</Text>
            <Text style={styles.profileRole}>Rol: {currentUser.rol}</Text>
            <Text style={styles.profileEmail}>Correo: {currentUser.correo}</Text>
            <Text style={styles.profileInfo}>Documento: {currentUser.tipo_documento} {currentUser.num_documento}</Text>
            <Text style={styles.profileInfo}>Tel: {currentUser.telefono || 'N/A'}</Text>
            <Text style={styles.profileInfo}>Ciudad: {currentUser.ciudad}</Text>
          </View>

          <TouchableOpacity
            style={styles.logoutSectionBtn}
            onPress={() => setShowLogoutConfirm(true)}
          >
            <Text style={styles.logoutSectionBtnText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal de Cerrar Sesión */}
      <Modal
        visible={showLogoutConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>¿Cerrar Sesión?</Text>
            <Text style={styles.modalDesc}>Se cerrará tu sesión activa.</Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setShowLogoutConfirm(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.modalConfirmText}>Sí, Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Barra Inferior */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('inicio')}>
          <Text style={[styles.navBtnText, currentScreen === 'inicio' && styles.navBtnTextActive]}>
            Inicio
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navBtn} onPress={() => setCurrentScreen('registro')}>
          <Text style={[styles.navBtnText, currentScreen === 'registro' && styles.navBtnTextActive]}>
            Registro
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => (currentUser ? setCurrentScreen('perfil') : setCurrentScreen('login'))}
        >
          <Text style={[styles.navBtnText, (currentScreen === 'login' || currentScreen === 'perfil') && styles.navBtnTextActive]}>
            {currentUser ? 'Perfil' : 'Ingresar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#DC2626', paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  headerLogoutBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  headerLogoutText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  containerCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  containerPadding: { flex: 1, padding: 20 },
  formContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 16 },
  logoBadge: { width: 70, height: 70, borderRadius: 20, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoBadgeText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 22 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0F172A' },
  subtitle: { fontSize: 13, color: '#64748B', marginBottom: 30 },
  buttonGroup: { width: '100%', gap: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  sectionSubtitle: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#F8FAFC', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontSize: 13, marginBottom: 12, color: '#0F172A' },
  rolePicker: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  roleBtn: { flex: 1, paddingVertical: 8, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, alignItems: 'center', backgroundColor: '#F8FAFC' },
  roleBtnActive: { borderColor: '#DC2626', backgroundColor: '#FEF2F2' },
  roleBtnText: { fontSize: 11, color: '#64748B' },
  roleBtnTextActive: { color: '#DC2626', fontWeight: 'bold' },
  primaryBtn: { backgroundColor: '#DC2626', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  primaryBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  secondaryBtn: { backgroundColor: '#F1F5F9', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  secondaryBtnText: { color: '#0F172A', fontWeight: 'bold', fontSize: 14 },
  linkBtn: { alignItems: 'center', paddingVertical: 12 },
  linkText: { color: '#DC2626', fontSize: 12, fontWeight: '600' },
  profileCard: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, padding: 16, marginVertical: 16, gap: 6 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  profileRole: { fontSize: 13, color: '#DC2626', fontWeight: 'bold' },
  profileEmail: { fontSize: 13, color: '#475569' },
  profileInfo: { fontSize: 12, color: '#64748B' },
  logoutSectionBtn: { backgroundColor: '#EF4444', paddingVertical: 12, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  logoutSectionBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, width: '100%', maxWidth: 320, alignItems: 'center' },
  modalTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 6 },
  modalDesc: { fontSize: 12, color: '#64748B', textAlign: 'center', marginBottom: 16 },
  modalBtnRow: { flexDirection: 'row', gap: 10, width: '100%' },
  modalCancelBtn: { flex: 1, paddingVertical: 10, backgroundColor: '#F1F5F9', borderRadius: 10, alignItems: 'center' },
  modalCancelText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  modalConfirmBtn: { flex: 1, paddingVertical: 10, backgroundColor: '#DC2626', borderRadius: 10, alignItems: 'center' },
  modalConfirmText: { fontSize: 12, color: '#FFFFFF', fontWeight: 'bold' },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FFFFFF', paddingVertical: 8 },
  navBtn: { flex: 1, alignItems: 'center', paddingVertical: 6 },
  navBtnText: { fontSize: 11, color: '#64748B' },
  navBtnTextActive: { color: '#DC2626', fontWeight: 'bold' }
});