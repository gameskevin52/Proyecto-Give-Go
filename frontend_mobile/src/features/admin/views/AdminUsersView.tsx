import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Users,
  Search,
  UserPlus,
  ArrowLeft,
  Filter,
  CheckCircle2,
  XCircle,
  Shield,
  Heart,
  Building2,
  UserCheck,
} from 'lucide-react-native';
import { useAdminController } from '../controllers/useAdminController';
import { AdminUserCard } from '../components/AdminUserCard';
import { CreateUserModal } from '../components/CreateUserModal';
import { EditUserModal } from '../components/EditUserModal';
import { UserDetailModal } from '../components/UserDetailModal';
import { styles } from '../styles/admin.styles';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';
import { THEME } from '../../../config/theme';
import { AdminUserItem } from '../models/admin.models';

interface AdminUsersViewProps {
  navigation?: any;
}

export const AdminUsersView: React.FC<AdminUsersViewProps> = ({ navigation }) => {
  const {
    users,
    filteredUsers,
    isLoading,
    refreshing,
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    onRefresh,
    handleCreateUser,
    handleUpdateUser,
    handleToggleStatus,
    handleDeleteUser,
  } = useAdminController();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<AdminUserItem | null>(null);
  const [selectedUserToEdit, setSelectedUserToEdit] = useState<AdminUserItem | null>(null);

  const confirmToggleStatus = (user: AdminUserItem) => {
    const action = user.estado === 'activo' ? 'desactivar' : 'activar';
    Alert.alert(
      'Confirmar Cambio de Estado',
      `¿Deseas ${action} la cuenta de ${user.nombre1} ${user.apellido1}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            const res = await handleToggleStatus(user);
            if (!res.success) {
              Alert.alert('Error', res.message || 'No se pudo cambiar el estado.');
            }
          },
        },
      ]
    );
  };

  const confirmDeleteUser = (userId: string | number) => {
    Alert.alert(
      'Eliminar Usuario',
      '¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await handleDeleteUser(userId);
            if (!res.success) {
              Alert.alert('Error', res.message || 'No se pudo eliminar el usuario.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <AppLoader message="Cargando directorio de usuarios..." />;
  }

  const roleCounts = {
    Todos: users.length,
    Voluntario: users.filter((u) => u.rol.toLowerCase().includes('volunt')).length,
    Beneficiario: users.filter((u) => u.rol.toLowerCase().includes('benef')).length,
    Organizacion: users.filter((u) => u.rol.toLowerCase().includes('org')).length,
    Admin: users.filter((u) => u.rol.toLowerCase().includes('admin')).length,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          {navigation && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              style={{ padding: 4 }}
            >
              <ArrowLeft size={20} color="#0F172A" />
            </TouchableOpacity>
          )}
          <View>
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#0F172A' }}>
              Gestión de Usuarios
            </Text>
            <Text style={{ fontSize: 11, color: '#64748B' }}>
              Rol Administrador · {users.length} usuarios totales
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setModalVisible(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: '#DC2626',
            paddingHorizontal: 12,
            paddingVertical: 7,
            borderRadius: 8,
          }}
        >
          <UserPlus size={15} color="#FFFFFF" />
          <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
            Registrar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search and Filters bar */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#F8FAFC' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#CBD5E1',
            paddingHorizontal: 12,
            height: 40,
            gap: 8,
          }}
        >
          <Search size={16} color="#64748B" />
          <TextInput
            placeholder="Buscar por nombre, correo o teléfono..."
            placeholderTextColor="#94A3B8"
            value={searchTerm}
            onChangeText={setSearchTerm}
            style={{ flex: 1, fontSize: 13, color: '#0F172A', paddingVertical: 0 }}
            autoCapitalize="none"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity activeOpacity={0.7} onPress={() => setSearchTerm('')}>
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '600' }}>Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Role Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 10 }}
        >
          {(['Todos', 'Voluntario', 'Beneficiario', 'Organizacion', 'Admin'] as const).map(
            (role) => {
              const isSelected = selectedRole === role;
              const count = roleCounts[role] || 0;
              return (
                <TouchableOpacity
                  key={role}
                  activeOpacity={0.75}
                  onPress={() => setSelectedRole(role)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                    borderWidth: 1,
                    borderColor: isSelected ? '#0F172A' : '#E2E8F0',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? '#FFFFFF' : '#475569',
                    }}
                  >
                    {role === 'Organizacion' ? 'Organizaciones' : role === 'Todos' ? 'Todos' : `${role}s`}
                  </Text>
                  <View
                    style={{
                      backgroundColor: isSelected ? '#334155' : '#F1F5F9',
                      paddingHorizontal: 6,
                      paddingVertical: 1,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: isSelected ? '#FFFFFF' : '#64748B',
                      }}
                    >
                      {count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            }
          )}
        </ScrollView>
      </View>

      {/* Main List */}
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 10, paddingBottom: 40 }]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#475569' }}>
            Resultados: {filteredUsers.length} de {users.length} usuarios
          </Text>
          {searchTerm || selectedRole !== 'Todos' ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setSearchTerm('');
                setSelectedRole('Todos');
              }}
            >
              <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '600' }}>
                Restablecer filtros
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {filteredUsers.length === 0 ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 40,
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              paddingHorizontal: 20,
            }}
          >
            <Users size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 4 }}>
              No se encontraron usuarios
            </Text>
            <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 14 }}>
              Intenta cambiar el término de búsqueda o el rol seleccionado.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setModalVisible(true)}
              style={{
                backgroundColor: '#DC2626',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 13 }}>
                + Registrar Usuario Ahora
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredUsers.map((u) => (
            <AdminUserCard
              key={String(u.id || u.id_usuario)}
              user={u}
              onToggleStatus={confirmToggleStatus}
              onDelete={confirmDeleteUser}
              onEdit={(user) => setSelectedUserToEdit(user)}
              onConsult={(user) => setSelectedUserDetail(user)}
              onPress={(user) => setSelectedUserDetail(user)}
            />
          ))
        )}
      </ScrollView>

      {/* Manual Registration Modal */}
      <CreateUserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreateUser}
      />

      {/* User Detail / Consult Modal */}
      <UserDetailModal
        visible={!!selectedUserDetail}
        user={selectedUserDetail}
        onClose={() => setSelectedUserDetail(null)}
        onEdit={(user) => {
          setSelectedUserDetail(null);
          setSelectedUserToEdit(user);
        }}
      />

      {/* Edit User Modal */}
      <EditUserModal
        visible={!!selectedUserToEdit}
        user={selectedUserToEdit}
        onClose={() => setSelectedUserToEdit(null)}
        onSubmit={handleUpdateUser}
      />
    </SafeAreaView>
  );
};

export default AdminUsersView;

