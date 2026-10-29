import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AdminCategoryItem } from '../models/admin.models';
import { Tag, Edit3, Trash2, Eye } from 'lucide-react-native';

interface AdminCategoryCardProps {
  category: AdminCategoryItem;
  onEdit?: (category: AdminCategoryItem) => void;
  onDelete?: (categoryId: string | number) => void;
  onConsult?: (category: AdminCategoryItem) => void;
}

export const AdminCategoryCard: React.FC<AdminCategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
  onConsult,
}) => {
  const isActivo = category.estado === 'activo' || category.estado === '1' || category.estado === 1;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onConsult && onConsult(category)}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <Tag size={18} color="#DC2626" />
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.title} numberOfLines={1}>
              {category.nombre}
            </Text>
            <Text style={styles.idText}>ID: #{category.id || category.id_categoria}</Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isActivo ? '#DCFCE7' : '#F1F5F9' },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              { color: isActivo ? '#16A34A' : '#64748B' },
            ]}
          >
            {isActivo ? 'Activa' : 'Inactiva'}
          </Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {category.descripcion || 'Sin descripción asignada para esta categoría.'}
      </Text>

      <View style={styles.actionsRow}>
        {onConsult && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onConsult(category)}
            style={[styles.actionBtn, { backgroundColor: '#F8FAFC' }]}
          >
            <Eye size={13} color="#475569" />
            <Text style={[styles.actionBtnText, { color: '#475569' }]}>
              Consultar
            </Text>
          </TouchableOpacity>
        )}

        {onEdit && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onEdit(category)}
            style={[styles.actionBtn, { backgroundColor: '#EFF6FF' }]}
          >
            <Edit3 size={13} color="#2563EB" />
            <Text style={[styles.actionBtnText, { color: '#2563EB' }]}>
              Editar
            </Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onDelete(category.id || category.id_categoria || '')}
            style={[styles.actionBtn, { backgroundColor: '#FFF1F2' }]}
          >
            <Trash2 size={13} color="#E11D48" />
            <Text style={[styles.actionBtnText, { color: '#E11D48' }]}>
              Eliminar
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBox: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  idText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 1,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
