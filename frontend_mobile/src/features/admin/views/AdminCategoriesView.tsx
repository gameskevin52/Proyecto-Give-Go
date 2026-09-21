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
import { Tag, Search, Plus, ArrowLeft } from 'lucide-react-native';
import { AdminService } from '../services/admin.service';
import { AdminCategoryItem } from '../models/admin.models';
import { AdminCategoryCard } from '../components/AdminCategoryCard';
import { CreateCategoryModal } from '../components/CreateCategoryModal';
import { EditCategoryModal } from '../components/EditCategoryModal';
import { CategoryDetailModal } from '../components/CategoryDetailModal';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';

interface AdminCategoriesViewProps {
  navigation?: any;
}

export const AdminCategoriesView: React.FC<AdminCategoriesViewProps> = ({
  navigation,
}) => {
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todas' | 'activa' | 'inactiva'>('todas');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedCatToEdit, setSelectedCatToEdit] = useState<AdminCategoryItem | null>(null);
  const [selectedCatDetail, setSelectedCatDetail] = useState<AdminCategoryItem | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const list = await AdminService.getAllCategories();
      setCategories(list);
    } catch (err) {
      console.warn('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.descripcion && cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        String(cat.id || cat.id_categoria).includes(searchTerm);

      const isActivo = cat.estado === 'activo' || cat.estado === '1' || cat.estado === 1;
      let matchesStatus = true;
      if (statusFilter === 'activa') matchesStatus = isActivo;
      if (statusFilter === 'inactiva') matchesStatus = !isActivo;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchTerm, statusFilter]);

  const handleCreateCategory = async (payload: { nombre: string; descripcion: string; estado?: string }) => {
    const res = await AdminService.createCategory(payload);
    if (res.success) {
      loadCategories();
    }
    return res;
  };

  const handleUpdateCategory = async (id: string, payload: Partial<AdminCategoryItem>) => {
    const res = await AdminService.updateCategory(id, payload);
    if (res.success) {
      setCategories((prev) =>
        prev.map((c) =>
          String(c.id || c.id_categoria) === id ? { ...c, ...payload } : c
        )
      );
    }
    return res;
  };

  const confirmDeleteCategory = (categoryId: string | number) => {
    Alert.alert(
      'Eliminar Categoría',
      '¿Estás seguro de que deseas eliminar esta categoría? Si está vinculada a eventos, estos perderán la etiqueta temática.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await AdminService.deleteCategory(String(categoryId));
            if (res.success) {
              setCategories((prev) =>
                prev.filter((c) => String(c.id || c.id_categoria) !== String(categoryId))
              );
              Alert.alert('Éxito', 'Categoría eliminada correctamente.');
            } else {
              Alert.alert('Error', res.message || 'No se pudo eliminar la categoría.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <AppLoader message="Cargando catálogo de categorías..." />;
  }

  const counts = {
    todas: categories.length,
    activas: categories.filter((c) => c.estado === 'activo' || c.estado === '1' || c.estado === 1).length,
    inactivas: categories.filter((c) => !(c.estado === 'activo' || c.estado === '1' || c.estado === 1)).length,
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
            <Text style={styles.title}>Gestión de Categorías</Text>
            <Text style={styles.subtitle}>
              {categories.length} etiquetas · {counts.activas} operativas
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsCreateOpen(true)}
          style={styles.createBtn}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre, ID o descripción..."
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
            onPress={() => setStatusFilter('todas')}
            style={[
              styles.filterChip,
              statusFilter === 'todas' && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'todas' && styles.filterChipTextActive,
              ]}
            >
              Todas ({counts.todas})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('activa')}
            style={[
              styles.filterChip,
              statusFilter === 'activa' && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'activa' && styles.filterChipTextActive,
              ]}
            >
              Activas ({counts.activas})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('inactiva')}
            style={[
              styles.filterChip,
              statusFilter === 'inactiva' && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'inactiva' && styles.filterChipTextActive,
              ]}
            >
              Inactivas ({counts.inactivas})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Categories List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredCategories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Tag size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>No hay categorías encontradas</Text>
            <Text style={styles.emptyDesc}>
              Ajusta los términos de búsqueda o registra una nueva causa temática.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsCreateOpen(true)}
              style={styles.emptyBtn}
            >
              <Text style={styles.emptyBtnText}>+ Crear Categoría</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredCategories.map((cat) => (
            <AdminCategoryCard
              key={cat.id || cat.id_categoria}
              category={cat}
              onEdit={(c) => setSelectedCatToEdit(c)}
              onConsult={(c) => setSelectedCatDetail(c)}
              onDelete={confirmDeleteCategory}
            />
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <CreateCategoryModal
        visible={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateCategory}
      />

      {/* Edit Modal */}
      <EditCategoryModal
        visible={!!selectedCatToEdit}
        category={selectedCatToEdit}
        onClose={() => setSelectedCatToEdit(null)}
        onSubmit={handleUpdateCategory}
      />

      {/* Consult Detail Modal */}
      <CategoryDetailModal
        visible={!!selectedCatDetail}
        category={selectedCatDetail}
        onClose={() => setSelectedCatDetail(null)}
        onEdit={(c) => {
          setSelectedCatDetail(null);
          setSelectedCatToEdit(c);
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

export default AdminCategoriesView;
