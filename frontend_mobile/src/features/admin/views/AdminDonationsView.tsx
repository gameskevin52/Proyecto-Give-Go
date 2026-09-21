import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Heart,
  Search,
  Plus,
  ArrowLeft,
  DollarSign,
  Package,
  ShieldCheck,
} from 'lucide-react-native';
import { AdminService } from '../services/admin.service';
import {
  AdminDonationItem,
  AdminOrgItem,
  AdminUserItem,
  AdminCategoryItem,
} from '../models/admin.models';
import { AdminDonationCard } from '../components/AdminDonationCard';
import { CreateDonationModal } from '../components/CreateDonationModal';
import { DonationDetailModal } from '../components/DonationDetailModal';
import { downloadDonationReceipt } from '../utils/donationReceipt';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';

interface AdminDonationsViewProps {
  navigation?: any;
}

export const AdminDonationsView: React.FC<AdminDonationsViewProps> = ({
  navigation,
}) => {
  const [donations, setDonations] = useState<AdminDonationItem[]>([]);
  const [organizations, setOrganizations] = useState<AdminOrgItem[]>([]);
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'todas' | 'monetaria' | 'objeto'>('todas');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedDonationDetail, setSelectedDonationDetail] = useState<AdminDonationItem | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [dons, orgs, usrs, cats] = await Promise.all([
        AdminService.getAllDonations(),
        AdminService.getAllOrganizations(),
        AdminService.getAllUsers(),
        AdminService.getAllCategories(),
      ]);
      setDonations(dons);
      setOrganizations(orgs);
      setUsers(usrs);
      setCategories(cats);
    } catch (err) {
      console.warn('Error fetching donations data:', err);
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

  const filteredDonations = useMemo(() => {
    return donations.filter((don) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        (don.usuarioNombre && don.usuarioNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (don.organizacionNombre && don.organizacionNombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (don.categoria && don.categoria.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesType = true;
      if (typeFilter !== 'todas') {
        matchesType = don.tipo === typeFilter;
      }

      return matchesSearch && matchesType;
    });
  }, [donations, searchTerm, typeFilter]);

  const totalMonetary = useMemo(() => {
    return donations
      .filter((d) => d.tipo === 'monetaria')
      .reduce((sum, d) => sum + (Number(d.monetaria?.valor) || 0), 0);
  }, [donations]);

  const handleCreateDonation = async (payload: any) => {
    let res: { success: boolean; message?: string };
    if (payload.tipo === 'monetaria') {
      res = await AdminService.createMonetaryDonation({
        donation: {
          categoria: payload.categoria,
          usuarioId: payload.usuarioId,
          organizacionId: payload.organizacionId,
        },
        monetary: {
          valor: payload.monetaria.valor,
          metodoPago: payload.monetaria.metodo,
          cuenta: payload.monetaria.cuenta,
        },
      });
    } else {
      res = await AdminService.createObjectDonation({
        donation: {
          categoria: payload.categoria,
          usuarioId: payload.usuarioId,
          organizacionId: payload.organizacionId,
        },
        objectDetail: {
          categoria: payload.objeto.categoria,
          cantidad: payload.objeto.cantidad,
          descripcion: payload.objeto.descripcion,
        },
      });
    }

    if (res.success) {
      loadData();
    }
    return res;
  };

  if (isLoading) {
    return <AppLoader message="Cargando libro contable de donaciones..." />;
  }

  const counts = {
    todas: donations.length,
    monetarias: donations.filter((d) => d.tipo === 'monetaria').length,
    objetos: donations.filter((d) => d.tipo !== 'monetaria').length,
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
            <Text style={styles.title}>Historial de Donaciones</Text>
            <Text style={styles.subtitle}>
              {donations.length} aportaciones · ${totalMonetary.toLocaleString('es-CO')} COP recaudados
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsCreateOpen(true)}
          style={styles.createBtn}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Registrar</Text>
        </TouchableOpacity>
      </View>

      {/* Notice Banner */}
      <View style={styles.noticeBanner}>
        <ShieldCheck size={14} color="#16A34A" />
        <Text style={styles.noticeText}>
          Trazabilidad segura: las donaciones son inmutables para garantizar transparencia contable.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por donante, ONG, causa..."
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

      {/* Filter Tabs */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterList}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTypeFilter('todas')}
            style={[
              styles.filterChip,
              typeFilter === 'todas' && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                typeFilter === 'todas' && styles.filterChipTextActive,
              ]}
            >
              Todas ({counts.todas})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTypeFilter('monetaria')}
            style={[
              styles.filterChip,
              typeFilter === 'monetaria' && styles.filterChipActive,
            ]}
          >
            <DollarSign size={13} color={typeFilter === 'monetaria' ? '#16A34A' : '#64748B'} />
            <Text
              style={[
                styles.filterChipText,
                typeFilter === 'monetaria' && styles.filterChipTextActive,
              ]}
            >
              Monetarias ({counts.monetarias})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setTypeFilter('objeto')}
            style={[
              styles.filterChip,
              typeFilter === 'objeto' && styles.filterChipActive,
            ]}
          >
            <Package size={13} color={typeFilter === 'objeto' ? '#2563EB' : '#64748B'} />
            <Text
              style={[
                styles.filterChipText,
                typeFilter === 'objeto' && styles.filterChipTextActive,
              ]}
            >
              En Especie ({counts.objetos})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Donations List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredDonations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Heart size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>No hay donaciones encontradas</Text>
            <Text style={styles.emptyDesc}>
              Ajusta los términos de búsqueda o registra una nueva aportación comunitaria.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsCreateOpen(true)}
              style={styles.emptyBtn}
            >
              <Text style={styles.emptyBtnText}>+ Registrar Donación</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredDonations.map((don) => (
            <AdminDonationCard
              key={don.id}
              donation={don}
              onConsult={(d) => setSelectedDonationDetail(d)}
              onDownloadReceipt={(d) => downloadDonationReceipt(d)}
            />
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <CreateDonationModal
        visible={isCreateOpen}
        organizations={organizations}
        users={users}
        categories={categories}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateDonation}
      />

      {/* Consult Detail Modal with Download Receipt Button */}
      <DonationDetailModal
        visible={!!selectedDonationDetail}
        donation={selectedDonationDetail}
        onClose={() => setSelectedDonationDetail(null)}
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
  noticeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  noticeText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '600',
    flex: 1,
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

export default AdminDonationsView;
