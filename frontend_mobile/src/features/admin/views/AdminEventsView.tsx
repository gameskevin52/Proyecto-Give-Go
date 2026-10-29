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
  Calendar,
  Search,
  Plus,
  ArrowLeft,
  Tag,
  CheckCircle2,
} from 'lucide-react-native';
import { AdminService } from '../services/admin.service';
import { AdminEventItem, AdminOrgItem, AdminCategoryItem } from '../models/admin.models';
import { AdminEventCard } from '../components/AdminEventCard';
import { CreateEventModal } from '../components/CreateEventModal';
import { EditEventModal } from '../components/EditEventModal';
import { EventDetailModal } from '../components/EventDetailModal';
import { AppLoader } from '../../../shared/components/loaders/AppLoader';

interface AdminEventsViewProps {
  navigation?: any;
}

export const AdminEventsView: React.FC<AdminEventsViewProps> = ({ navigation }) => {
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [organizations, setOrganizations] = useState<AdminOrgItem[]>([]);
  const [categories, setCategories] = useState<AdminCategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'activo' | 'finalizado' | 'cancelado'>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState<AdminEventItem | null>(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState<AdminEventItem | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [evts, orgs, cats] = await Promise.all([
        AdminService.getAllEvents(),
        AdminService.getAllOrganizations(),
        AdminService.getAllCategories(),
      ]);
      setEvents(evts);
      setOrganizations(orgs);
      setCategories(cats);
    } catch (err) {
      console.warn('Error fetching events data:', err);
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

  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        evt.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (evt.descripcion && evt.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (evt.categoria && evt.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (evt.direccion && evt.direccion.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (evt.barrio && evt.barrio.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesStatus = true;
      if (statusFilter !== 'todos') {
        matchesStatus = evt.estado === statusFilter;
      }

      let matchesCat = true;
      if (selectedCategory !== 'Todas') {
        matchesCat = evt.categoria === selectedCategory;
      }

      return matchesSearch && matchesStatus && matchesCat;
    });
  }, [events, searchTerm, statusFilter, selectedCategory]);

  const handleCreateEvent = async (payload: any) => {
    const res = await AdminService.createEvent(payload);
    if (res.success) {
      loadData();
    }
    return res;
  };

  const handleUpdateEvent = async (id: string | number, payload: Partial<AdminEventItem>) => {
    const res = await AdminService.updateEvent(id, payload);
    if (res.success) {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...payload } : e))
      );
    }
    return res;
  };

  const confirmDeleteEvent = (eventId: string | number) => {
    Alert.alert(
      'Eliminar Evento',
      '¿Estás seguro de que deseas eliminar este evento? Las inscripciones asociadas serán canceladas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await AdminService.deleteEvent(eventId);
            if (res.success) {
              setEvents((prev) => prev.filter((e) => e.id !== eventId));
              Alert.alert('Éxito', 'Evento eliminado correctamente.');
            } else {
              Alert.alert('Error', res.message || 'No se pudo eliminar el evento.');
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <AppLoader message="Cargando agenda de eventos comunitarios..." />;
  }

  const counts = {
    todos: events.length,
    activos: events.filter((e) => e.estado === 'activo').length,
    finalizados: events.filter((e) => e.estado === 'finalizado').length,
    cancelados: events.filter((e) => e.estado === 'cancelado').length,
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
            <Text style={styles.title}>Gestión de Eventos</Text>
            <Text style={styles.subtitle}>
              {events.length} jornadas · {counts.activos} activos en Kennedy
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsCreateOpen(true)}
          style={styles.createBtn}
        >
          <Plus size={16} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Nuevo Evento</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Search size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título, categoría, barrio, dirección..."
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
              Todos ({counts.todos})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('activo')}
            style={[
              styles.filterChip,
              statusFilter === 'activo' && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'activo' && styles.filterChipTextActive,
              ]}
            >
              Activos ({counts.activos})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('finalizado')}
            style={[
              styles.filterChip,
              statusFilter === 'finalizado' && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'finalizado' && styles.filterChipTextActive,
              ]}
            >
              Finalizados ({counts.finalizados})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setStatusFilter('cancelado')}
            style={[
              styles.filterChip,
              statusFilter === 'cancelado' && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                statusFilter === 'cancelado' && styles.filterChipTextActive,
              ]}
            >
              Cancelados ({counts.cancelados})
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Event List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Calendar size={36} color="#94A3B8" style={{ marginBottom: 10 }} />
            <Text style={styles.emptyTitle}>No hay eventos encontrados</Text>
            <Text style={styles.emptyDesc}>
              Ajusta los filtros o publica una nueva jornada solidaria para la comunidad.
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsCreateOpen(true)}
              style={styles.emptyBtn}
            >
              <Text style={styles.emptyBtnText}>+ Crear Evento Comunitario</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredEvents.map((evt) => (
            <AdminEventCard
              key={evt.id}
              event={evt}
              onEdit={(e) => setSelectedEventToEdit(e)}
              onConsult={(e) => setSelectedEventDetail(e)}
              onDelete={confirmDeleteEvent}
            />
          ))
        )}
      </ScrollView>

      {/* Create Modal */}
      <CreateEventModal
        visible={isCreateOpen}
        organizations={organizations}
        categories={categories}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateEvent}
      />

      {/* Edit Modal */}
      <EditEventModal
        visible={!!selectedEventToEdit}
        event={selectedEventToEdit}
        categories={categories}
        onClose={() => setSelectedEventToEdit(null)}
        onSubmit={handleUpdateEvent}
      />

      {/* Consult / Detail Modal */}
      <EventDetailModal
        visible={!!selectedEventDetail}
        event={selectedEventDetail}
        onClose={() => setSelectedEventDetail(null)}
        onEdit={(e) => {
          setSelectedEventDetail(null);
          setSelectedEventToEdit(e);
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

export default AdminEventsView;
