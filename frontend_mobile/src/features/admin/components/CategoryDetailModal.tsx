import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { X, Tag, FileText, CheckCircle2 } from 'lucide-react-native';
import { AdminCategoryItem } from '../models/admin.models';
import { AppButton } from '../../../shared/components/buttons/AppButton';

interface CategoryDetailModalProps {
  visible: boolean;
  category: AdminCategoryItem | null;
  onClose: () => void;
  onEdit?: (category: AdminCategoryItem) => void;
}

export const CategoryDetailModal: React.FC<CategoryDetailModalProps> = ({
  visible,
  category,
  onClose,
  onEdit,
}) => {
  if (!category) return null;

  const isActivo = category.estado === 'activo' || category.estado === '1' || category.estado === 1;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={styles.headerIcon}>
                <Tag size={20} color="#DC2626" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Detalle de Categoría</Text>
                <Text style={styles.headerSubtitle}>
                  ID #{category.id || category.id_categoria}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.banner}>
              <Text style={styles.categoryName}>{category.nombre}</Text>
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
                  {isActivo ? 'Operativa / Activa' : 'Inactiva'}
                </Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>DESCRIPCIÓN Y ALCANCE</Text>
              <Text style={styles.descriptionText}>
                {category.descripcion || 'Sin descripción detallada registrada.'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>APLICACIÓN EN LA PLATAFORMA</Text>
              <View style={styles.infoRow}>
                <CheckCircle2 size={16} color="#16A34A" />
                <Text style={styles.infoText}>
                  Permite filtrar eventos de voluntariado y convocatorias comunitarias.
                </Text>
              </View>
              <View style={styles.infoRow}>
                <CheckCircle2 size={16} color="#16A34A" />
                <Text style={styles.infoText}>
                  Segmenta las donaciones y asigna las causas solidarias en Kennedy.
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            {onEdit && (
              <AppButton
                title="Editar Categoría"
                variant="outline"
                onPress={() => {
                  onClose();
                  onEdit(category);
                }}
                style={{ flex: 1 }}
              />
            )}
            <AppButton
              title="Cerrar"
              variant="primary"
              onPress={onClose}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  banner: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    padding: 14,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
});
