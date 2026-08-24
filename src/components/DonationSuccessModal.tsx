import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { DonationRecord } from '../types/donation';
import {
  CheckCircle,
  QrCode,
  Download,
  ArrowRight,
  X,
} from 'lucide-react';

interface DonationSuccessModalProps {
  donation: DonationRecord | null;
  onClose: () => void;
  onViewHistory: () => void;
  onNewDonation: () => void;
}

export const DonationSuccessModal: React.FC<DonationSuccessModalProps> = ({
  donation,
  onClose,
  onViewHistory,
  onNewDonation,
}) => {
  if (!donation) return null;

  return (
    <Modal visible={!!donation} transparent={true} animationType="fade">
      <View className="flex-1 bg-black/70 items-center justify-center p-4">
        <View className="bg-white w-full max-w-md rounded-3xl overflow-hidden border border-gray-100 flex-col max-h-[92vh]">
          {/* Header Banner */}
          <View className="bg-red-600 p-6 text-center items-center relative">
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20"
            >
              <X className="w-4 h-4 text-white" />
            </TouchableOpacity>

            <View className="w-16 h-16 rounded-full bg-white items-center justify-center mb-3">
              <CheckCircle className="w-10 h-10 text-red-600 fill-red-600" />
            </View>

            <Text className="text-xl font-black text-white text-center">¡Donación Registrada!</Text>
            <Text className="text-xs text-red-100 mt-1 text-center">
              Muchas gracias por tu compromiso y solidaridad con Give&Go.
            </Text>
          </View>

          {/* Voucher Content */}
          <ScrollView className="p-5 space-y-4">
            {/* Tracking Number Badge */}
            <View className="bg-slate-50 border border-dashed border-gray-300 p-3.5 rounded-2xl items-center mb-3">
              <Text className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-center">
                Folio Único de Seguimiento
              </Text>
              <Text className="text-lg font-black text-red-600 font-mono tracking-wider text-center my-1">
                {donation.trackingNumber}
              </Text>
              <View className="bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <Text className="text-[11px] font-semibold text-emerald-700">
                  Estado: {donation.status}
                </Text>
              </View>
            </View>

            {/* Details Card */}
            <View className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2.5 text-xs mb-3">
              <View className="flex-row justify-between items-center pb-2 border-b border-gray-200">
                <Text className="text-gray-500 font-medium text-xs">Organización:</Text>
                <Text className="font-bold text-gray-900 text-xs">{donation.organizationName}</Text>
              </View>

              <View className="flex-row justify-between items-center pb-2 border-b border-gray-200">
                <Text className="text-gray-500 font-medium text-xs">Tipo de Donación:</Text>
                <Text className="font-extrabold text-red-600 text-xs uppercase">
                  {donation.type === 'monetario' ? 'Monetaria (Efectivo)' : 'Objeto Físico'}
                </Text>
              </View>

              {donation.type === 'monetario' ? (
                <View className="flex-row justify-between items-center pb-2 border-b border-gray-200">
                  <Text className="text-gray-500 font-medium text-xs">Monto Aportado:</Text>
                  <Text className="font-black text-gray-900 text-sm">
                    ${(donation.amount || 0).toLocaleString()} COP
                  </Text>
                </View>
              ) : (
                <>
                  <View className="flex-row justify-between items-center pb-2 border-b border-gray-200">
                    <Text className="text-gray-500 font-medium text-xs">Objeto:</Text>
                    <Text className="font-bold text-gray-900 text-xs">{donation.itemTitle}</Text>
                  </View>
                  <View className="flex-row justify-between items-center pb-2 border-b border-gray-200">
                    <Text className="text-gray-500 font-medium text-xs">Categoría / Estado:</Text>
                    <Text className="font-semibold text-gray-800 text-xs">
                      {donation.category} ({donation.condition})
                    </Text>
                  </View>
                </>
              )}

              <View className="flex-row justify-between items-center pt-1">
                <Text className="text-gray-500 font-medium text-xs">Fecha de Registro:</Text>
                <Text className="font-medium text-gray-700 text-xs">{donation.date}</Text>
              </View>
            </View>

            {/* Simulated QR Voucher */}
            <View className="bg-white border border-gray-200 p-3 rounded-2xl flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-12 h-12 bg-gray-900 text-white rounded-xl items-center justify-center p-1.5">
                  <QrCode className="w-8 h-8 text-white" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-gray-900">Comprobante Digital</Text>
                  <Text className="text-[10px] text-gray-500">Escanea en centro de acopio</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => Alert.alert('Comprobante Guardado', `Comprobante ${donation.trackingNumber} guardado en el dispositivo.`)}
                className="p-2"
              >
                <Download className="w-5 h-5 text-red-600" />
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View className="p-4 bg-gray-50 border-t border-gray-100 flex-col gap-2">
            <TouchableOpacity
              onPress={onViewHistory}
              className="w-full py-3.5 px-4 bg-red-600 text-white rounded-2xl flex-row items-center justify-center gap-2 mb-1"
            >
              <Text className="text-white font-extrabold text-xs">Ver Estado en Mis Donaciones</Text>
              <ArrowRight className="w-4 h-4 text-white" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onNewDonation}
              className="w-full py-2.5 px-4 bg-white border border-gray-200 rounded-2xl items-center justify-center"
            >
              <Text className="text-gray-700 font-bold text-xs">Realizar Otra Donación</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
