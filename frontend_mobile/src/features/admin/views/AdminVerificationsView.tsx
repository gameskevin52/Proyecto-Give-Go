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
  ShieldCheck,
  Search,
  Plus,
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react-native';
import { AdminService } from '../services/admin.service';
import { AdminVerificationItem, AdminOrgItem } from '../models/admin.models';
import { AdminVerificationCard } from '../components/AdminVerificationCard';
import { CreateVerificationModal } from '../components/CreateVerificationModal';
import { RespondVerificationModal } from '../components/RespondVerificationModal';
import { VerificationDetailModal } from '../components/VerificationDetailModal';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';

interface AdminVerificationsViewProps {
  navigation?: any;
}

export const AdminVerificationsView: React.FC<AdminVerificationsViewProps> = ({ navigation }) => {
  const [verifications, setVerifications] = useState<AdminVerificationItem[]>([]);
  const [organizations, setOrganizations] = useState<AdminOrgItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendientes' | 'aprobadas' | 'rechazadas'>('todos');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItemToRespond, setSelectedItemToRespond] = useState<AdminVerificationItem | null>(null);
  const [selectedItemDetail, setSelectedItemDetail] = useState<AdminVerificationItem | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [verifs, orgs] = await Promise.all([
        AdminService.getAllVerifications(),
        AdminService.getAllOrganizations(),
      ]);
      setVerifications(verifs);
      setOrganizations(orgs);
    } catch (err) {
      console.warn('Error fetching verifications:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const filteredVerifications = useMemo(() => {
    return verifications.filter((item) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        (item.nombreOrganizacion && item.nombreOrganizacion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.nit && item.nit.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.mensaje && item.mensaje.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.documentos && item.documentos.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesStatus = true;
      if (statusFilter === 'pendientes') {
        matchesStatus = item.estado === 'pendiente';
      } else if (statusFilter === 'aprobadas') {
        matchesStatus = item.estado === 'aprobada';
      } else if (statusFilter === 'rechazadas') {
        matchesStatus = item.estado === 'rechazada';
      }

      return matchesSearch && matchesStatus;
    });
  }, [verifications, searchTerm, statusFilter]);

  const handleCreateVerification = async (payload: {
    organizacionId: string;
    nit?: string;
    mensaje?: string;
    documentos?: string;
  }) => {
    const res = await AdminService.createVerification(payload);
    if (res.success) {
      loadData();
    }
    return res;
  };

  const handleRespondVerification = async (
    id: string,
    estado: 'aprobada' | 'rechazada',
    respuestaAdmin: string
  ) => {
    const res = await AdminService.respondVerification(id, { estado, respuestaAdmin });
    if (res.success) {
      setVerifications((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, estado, respuestaAdmin } : v
        )
      );
    }
    return res;
  };

  const confirmDeleteVerification = (id: string) => {
    Alert.alert(
      'Eliminar Solicitud',
      '¿Estás seguro de que deseas eliminar este registro de verificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await AdminService.deleteVerification(id);
            if (res.success) {
              setVerifications((prev) => prev.filter((v) => v.id !== id));
              Alert.alert('Éxito', 'Solicitud eliminada con éxito.');
            } else {
              Alert.alert('Error', res.message || 'No se pudo eliminar la solicitud.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <AppLoader message="Cargando solicitudes de verificación..." />;
  }

  const counts = {
    todos: verifications.length,
    pendientes: verifications.filter((v) => v.estado === 'pendiente').length,
    aprobadas: verifications.filter((v) => v.estado === 'aprobada').length,
    rechazadas: verifications.filter((v) => v.estado === 'rechazada').length,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header */}
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
            <Text style={styles.title}>Solicitudes de Verificación</Text>
            <Text style={styles.subtitle}>
              {verifications.length} expedientes radicados · {counts.pendientes} pendientes
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsCreateOpen(true)}
          style={styles.createBtn}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Radicar</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por organización, NIT, documentos..."
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

      {/* Status Chips */}
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
            onPress={() => setStatusFilter('aprobadas')}
            style={[
              styles.filterChip,
              statusFilter === 'aprobadas' && styles.filterChipActive,
            ]}
          >
            <CheckCircle2 size={12} color={statusFilter === 'aprobadas' ? '#DC2626' : '#16A34A'} />
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'aprobadas' && styles.filterChipTextActive,
              ]}
            >
              Aprobadas ({counts.aprobadas})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('rechazadas')}
            style={[
              styles.filterChip,
              statusFilter === 'rechazadas' && styles.filterChipActive,
            ]}
          >
            <XCircle size={12} color={statusFilter === 'rechazadas' ? '#DC2626' : '#DC2626'} />
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'rechazadas' && styles.filterChipTextActive,
              ]}
            >
              Rechazadas ({counts.rechazadas})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredVerifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ShieldCheck size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>No hay solicitudes registradas</Text>
            <Text style={styles.emptyDesc}>
              No se encontraron solicitudes con los criterios de filtro actuales.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsCreateOpen(true)}
              style={styles.emptyBtn}
            >
              <Text style={styles.emptyBtnText}>+ Radicar Nueva Solicitud</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredVerifications.map((item) => (
            <AdminVerificationCard
              key={item.id}
              item={item}
              onRespond={(item) => setSelectedItemToRespond(item)}
              onConsult={(item) => setSelectedItemDetail(item)}
              onDelete={confirmDeleteVerification}
            />
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <CreateVerificationModal
        visible={isCreateOpen}
        organizations={organizations}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateVerification}
      />

      {/* Respond Modal */}
      <RespondVerificationModal
        visible={!!selectedItemToRespond}
        item={selectedItemToRespond}
        onClose={() => setSelectedItemToRespond(null)}
        onSubmit={handleRespondVerification}
      />

      {/* Detail / Consult Modal */}
      <VerificationDetailModal
        visible={!!selectedItemDetail}
        item={selectedItemDetail}
        onClose={() => setSelectedItemDetail(null)}
        onRespond={(item) => {
          setSelectedItemDetail(null);
          setSelectedItemToRespond(item);
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
    backgroundColor: '#DC2626',
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
    backgroundColor: '#DC2626',
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

export default AdminVerificationsView;
