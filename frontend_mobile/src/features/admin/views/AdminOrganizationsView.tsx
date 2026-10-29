import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Building2,
  Search,
  Plus,
  ArrowLeft,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react-native';
import { AdminService } from '../services/admin.service';
import { AdminOrgItem } from '../models/admin.models';
import { AdminOrgCard } from '../components/AdminOrgCard';
import { CreateOrgModal } from '../components/CreateOrgModal';
import { EditOrgModal } from '../components/EditOrgModal';
import { OrgDetailModal } from '../components/OrgDetailModal';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';

interface AdminOrganizationsViewProps {
  navigation?: any;
}

export const AdminOrganizationsView: React.FC<AdminOrganizationsViewProps> = ({ navigation }) => {
  const [organizations, setOrganizations] = useState<AdminOrgItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'verificadas' | 'pendientes' | 'sin_verificar'>('todos');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedOrgDetail, setSelectedOrgDetail] = useState<AdminOrgItem | null>(null);
  const [selectedOrgToEdit, setSelectedOrgToEdit] = useState<AdminOrgItem | null>(null);

  const loadOrganizations = useCallback(async () => {
    try {
      const list = await AdminService.getAllOrganizations();
      setOrganizations(list);
    } catch (err) {
      console.warn('Error fetching organizations:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadOrganizations();
  }, [loadOrganizations]);

  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        org.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (org.nit && org.nit.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (org.direccion && org.direccion.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesStatus = true;
      const isVerif = Boolean(org.verificada);
      const estado = org.estadoVerificacion || (isVerif ? 'aprobada' : 'no_solicitado');

      if (statusFilter === 'verificadas') {
        matchesStatus = isVerif || estado === 'aprobada';
      } else if (statusFilter === 'pendientes') {
        matchesStatus = estado === 'pendiente';
      } else if (statusFilter === 'sin_verificar') {
        matchesStatus = !isVerif && estado !== 'aprobada';
      }

      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchTerm, statusFilter]);

  const handleCreateOrg = async (payload: {
    nombre: string;
    direccion: string;
    correo: string;
    password?: string;
    telefono?: string;
    nit?: string;
  }) => {
    const res = await AdminService.createOrganization(payload);
    if (res.success) {
      loadOrganizations();
    }
    return res;
  };

  const handleUpdateOrg = async (id: string, payload: Partial<AdminOrgItem> & { password?: string }) => {
    const res = await AdminService.updateOrganization(id, payload);
    if (res.success) {
      setOrganizations((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...payload } : o))
      );
    }
    return res;
  };

  const confirmDeleteOrg = (orgId: string) => {
    Alert.alert(
      'Eliminar Organización',
      '¿Estás seguro de que deseas eliminar esta organización? Todos sus eventos y registros asociados serán afectados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await AdminService.deleteOrganization(orgId);
            if (res.success) {
              setOrganizations((prev) => prev.filter((o) => o.id !== orgId));
              Alert.alert('Éxito', 'Organización eliminada con éxito.');
            } else {
              Alert.alert('Error', res.message || 'No se pudo eliminar la organización.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <AppLoader message="Cargando directorio de organizaciones..." />;
  }

  const counts = {
    todos: organizations.length,
    verificadas: organizations.filter((o) => Boolean(o.verificada) || o.estadoVerificacion === 'aprobada').length,
    pendientes: organizations.filter((o) => o.estadoVerificacion === 'pendiente').length,
    sin_verificar: organizations.filter((o) => !o.verificada && o.estadoVerificacion !== 'aprobada').length,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
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
            <Text style={styles.title}>Gestión de Organizaciones</Text>
            <Text style={styles.subtitle}>
              Rol Administrador · {organizations.length} ONGs registradas
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsCreateOpen(true)}
          style={styles.createBtn}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Nueva ONG</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, correo, NIT, dirección..."
            placeholderTextColor="#94A3B8"
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Text style={{ fontSize: 13, color: '#94A3B8', fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Status Filter Chips */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('todos')}
            style={[
              styles.filterChip,
              statusFilter === 'todos' && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'todos' && styles.filterChipTextActive,
              ]}
            >
              Todas ({counts.todos})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('verificadas')}
            style={[
              styles.filterChip,
              statusFilter === 'verificadas' && styles.filterChipActive,
            ]}
          >
            <CheckCircle size={12} color={statusFilter === 'verificadas' ? '#DC2626' : '#16A34A'} />
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'verificadas' && styles.filterChipTextActive,
              ]}
            >
              Verificadas ({counts.verificadas})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('pendientes')}
            style={[
              styles.filterChip,
              statusFilter === 'pendientes' && styles.filterChipActive,
            ]}
          >
            <Clock size={12} color={statusFilter === 'pendientes' ? '#DC2626' : '#D97706'} />
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'pendientes' && styles.filterChipTextActive,
              ]}
            >
              Pendientes ({counts.pendientes})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('sin_verificar')}
            style={[
              styles.filterChip,
              statusFilter === 'sin_verificar' && styles.filterChipActive,
            ]}
          >
            <XCircle size={12} color={statusFilter === 'sin_verificar' ? '#DC2626' : '#64748B'} />
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'sin_verificar' && styles.filterChipTextActive,
              ]}
            >
              Sin Verificar ({counts.sin_verificar})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Organization List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredOrganizations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Building2 size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>No se encontraron organizaciones</Text>
            <Text style={styles.emptyDesc}>
              Ajusta el filtro de estado o registra una nueva organización institucional.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsCreateOpen(true)}
              style={styles.emptyBtn}
            >
              <Text style={styles.emptyBtnText}>+ Registrar Organización</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredOrganizations.map((org) => (
            <AdminOrgCard
              key={org.id}
              organization={org}
              onEdit={(org) => setSelectedOrgToEdit(org)}
              onDelete={confirmDeleteOrg}
              onConsult={(org) => setSelectedOrgDetail(org)}
            />
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <CreateOrgModal
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateOrg}
      />

      {/* Edit Modal */}
      <EditOrgModal
        visible={!!selectedOrgToEdit}
        org={selectedOrgToEdit}
        onClose={() => setSelectedOrgToEdit(null)}
        onSubmit={handleUpdateOrg}
      />

      {/* Consult / Detail Modal */}
      <OrgDetailModal
        visible={!!selectedOrgDetail}
        org={selectedOrgDetail}
        onClose={() => setSelectedOrgDetail(null)}
        onEdit={(org) => {
          setSelectedOrgDetail(null);
          setSelectedOrgToEdit(org);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  searchSection: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  filterSection: {
    paddingVertical: 10,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  filterChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#DC2626',
    fontWeight: '800',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
  },
  emptyBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default AdminOrganizationsView;
