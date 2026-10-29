import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AdminDonationItem } from '../models/admin.models';
import { Heart, Building2, User, Calendar, DollarSign, Package, Download, Eye } from 'lucide-react-native';

interface AdminDonationCardProps {
  donation: AdminDonationItem;
  onConsult: (donation: AdminDonationItem) => void;
  onDownloadReceipt: (donation: AdminDonationItem) => void;
}

export const AdminDonationCard: React.FC<AdminDonationCardProps> = ({
  donation,
  onConsult,
  onDownloadReceipt,
}) => {
  const isMonetary = donation.tipo === 'monetaria';

  const amountOrQty = isMonetary
    ? `$${Number(donation.monetaria?.valor || 0).toLocaleString('es-CO')} COP`
    : `${donation.objeto?.cantidad || 1} un. (${donation.objeto?.categoria || 'Insumo'})`;

  const formattedDate = donation.fecha
    ? new Date(donation.fecha).toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'Reciente';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onConsult(donation)}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconBox,
              { backgroundColor: isMonetary ? '#DCFCE7' : '#EFF6FF' },
            ]}
          >
            {isMonetary ? (
              <DollarSign size={20} color="#16A34A" />
            ) : (
              <Package size={20} color="#2563EB" />
            )}
          </View>
          <View style={styles.titleBox}>
            <Text style={styles.amountText}>{amountOrQty}</Text>
            <Text style={styles.categoryText}>{donation.categoria || 'Social'}</Text>
          </View>
        </View>

        <View
          style={[
            styles.typeBadge,
            { backgroundColor: isMonetary ? '#F0FDF4' : '#EFF6FF' },
          ]}
        >
          <Text
            style={[
              styles.typeText,
              { color: isMonetary ? '#16A34A' : '#2563EB' },
            ]}
          >
            {isMonetary ? 'Monetaria' : 'En Especie'}
          </Text>
        </View>
      </View>

      <View style={styles.metaContainer}>
        <View style={styles.metaRow}>
          <User size={13} color="#64748B" />
          <Text style={styles.metaText} numberOfLines={1}>
            Donante: <Text style={styles.metaBold}>{donation.usuarioNombre || 'Anónimo'}</Text>
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Building2 size={13} color="#64748B" />
          <Text style={styles.metaText} numberOfLines={1}>
            Destino: <Text style={styles.metaBold}>{donation.organizacionNombre || 'ONG'}</Text>
          </Text>
        </View>

        <View style={styles.metaRow}>
          <Calendar size={13} color="#64748B" />
          <Text style={styles.metaText}>{formattedDate}</Text>
        </View>
      </View>

      {/* Strictly NO update or delete buttons allowed on donations */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onConsult(donation)}
          style={[styles.actionBtn, { backgroundColor: '#F8FAFC' }]}
        >
          <Eye size={13} color="#475569" />
          <Text style={[styles.actionBtnText, { color: '#475569' }]}>
            Consultar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onDownloadReceipt(donation)}
          style={[styles.actionBtn, { backgroundColor: '#FEF2F2' }]}
        >
          <Download size={13} color="#DC2626" />
          <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>
            Comprobante
          </Text>
        </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBox: {
    flex: 1,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  categoryText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaContainer: {
    gap: 4,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  metaBold: {
    fontWeight: '700',
    color: '#1E293B',
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
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
