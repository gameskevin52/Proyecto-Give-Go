import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { DonationRecord, DonationStatus, UserRole } from '../types/donation';
import {
  History,
  DollarSign,
  PackageCheck,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  XCircle,
  ChevronDown,
} from 'lucide-react';

interface DonationHistoryViewProps {
  donations: DonationRecord[];
  userRole: UserRole;
  onSelectDonation: (record: DonationRecord) => void;
  onUpdateStatus?: (id: string, newStatus: DonationStatus) => void;
  onNewDonationClick: () => void;
}

export const DonationHistoryView: React.FC<DonationHistoryViewProps> = ({
  donations,
  userRole,
  onSelectDonation,
  onUpdateStatus,
  onNewDonationClick,
}) => {
  const [filterType, setFilterType] = useState<'todos' | 'monetario' | 'objeto'>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [showStatusPicker, setShowStatusPicker] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDonations = donations.filter((item) => {
    const matchesType = filterType === 'todos' || item.type === filterType;
    const matchesStatus = filterStatus === 'todos' || item.status === filterStatus;
    const matchesSearch =
      item.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.itemTitle && item.itemTitle.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesType && matchesStatus && matchesSearch;
  });

  const renderStatusBadge = (status: DonationStatus) => {
    switch (status) {
      case 'Completado':
      case 'Aprobado':
        return (
          <View className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-200 flex-row items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <Text className="text-[10px] font-extrabold text-emerald-800">{status}</Text>
          </View>
        );
      case 'Programado':
      case 'En tránsito':
        return (
          <View className="px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 flex-row items-center gap-1">
            <Truck className="w-3 h-3 text-blue-600" />
            <Text className="text-[10px] font-extrabold text-blue-800">{status}</Text>
          </View>
        );
      case 'Pendiente':
        return (
          <View className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-200 flex-row items-center gap-1">
            <Clock className="w-3 h-3 text-amber-600" />
            <Text className="text-[10px] font-extrabold text-amber-800">{status}</Text>
          </View>
        );
      case 'Rechazado':
        return (
          <View className="px-2.5 py-0.5 rounded-full bg-red-100 border border-red-200 flex-row items-center gap-1">
            <XCircle className="w-3 h-3 text-red-600" />
            <Text className="text-[10px] font-extrabold text-red-800">{status}</Text>
          </View>
        );
      default:
        return (
          <View className="px-2.5 py-0.5 rounded-full bg-gray-100">
            <Text className="text-[10px] font-extrabold text-gray-700">{status}</Text>
          </View>
        );
    }
  };

  const totalMonetary = donations
    .filter((d) => d.type === 'monetario')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const pendingCount = donations.filter((d) => d.status === 'Pendiente').length;

  return (
    <ScrollView className="space-y-5 pb-20">
      {/* Role Banner Header */}
      <View className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex-row items-center justify-between mb-4">
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-extrabold text-gray-900">
              {userRole === 'Administrador' ? 'Panel de Gestión de Donaciones' : 'Historial de Mis Donaciones'}
            </Text>
            {userRole === 'Administrador' && (
              <View className="bg-red-600 px-2 py-0.5 rounded-full">
                <Text className="text-white text-[10px] font-extrabold uppercase">Admin</Text>
              </View>
            )}
          </View>
          <Text className="text-xs text-gray-500 font-medium mt-0.5">
            {userRole === 'Administrador'
              ? 'Administra, aprueba y programa recogidas de donaciones'
              : 'Seguimiento en tiempo real de tus aportaciones'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onNewDonationClick}
          className="px-3 py-2 bg-red-600 rounded-xl"
        >
          <Text className="text-white font-bold text-xs">+ Donar</Text>
        </TouchableOpacity>
      </View>

      {/* Admin Quick Metrics */}
      {userRole === 'Administrador' && (
        <View className="flex-row gap-2.5 mb-4">
          <View className="flex-1 bg-red-50 p-3.5 rounded-2xl border border-red-200">
            <Text className="text-[10px] font-bold text-red-700 uppercase">Recaudación Total</Text>
            <Text className="text-base font-black text-red-900 mt-0.5">
              ${totalMonetary.toLocaleString()} COP
            </Text>
          </View>

          <View className="flex-1 bg-amber-50 p-3.5 rounded-2xl border border-amber-200">
            <Text className="text-[10px] font-bold text-amber-700 uppercase">Por Aprobar</Text>
            <Text className="text-base font-black text-amber-900 mt-0.5">
              {pendingCount} solicitudes
            </Text>
          </View>
        </View>
      )}

      {/* Search & Filters */}
      <View className="space-y-2 mb-4">
        <View className="relative flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2">
          <Search className="w-4 h-4 text-gray-400" />
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Buscar por folio, organización u objeto..."
            className="flex-1 ml-2 text-xs font-medium text-gray-900"
          />
        </View>

        <View className="flex-row items-center justify-between gap-2 text-xs mt-2">
          {/* Type filters */}
          <View className="flex-row bg-gray-100 p-1 rounded-xl gap-1">
            <TouchableOpacity
              onPress={() => setFilterType('todos')}
              className={`px-2.5 py-1 rounded-lg ${filterType === 'todos' ? 'bg-white' : ''}`}
            >
              <Text className={`text-xs font-bold ${filterType === 'todos' ? 'text-red-600' : 'text-gray-600'}`}>
                Todas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterType('monetario')}
              className={`px-2.5 py-1 rounded-lg ${filterType === 'monetario' ? 'bg-white' : ''}`}
            >
              <Text className={`text-xs font-bold ${filterType === 'monetario' ? 'text-red-600' : 'text-gray-600'}`}>
                Monetarias
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFilterType('objeto')}
              className={`px-2.5 py-1 rounded-lg ${filterType === 'objeto' ? 'bg-white' : ''}`}
            >
              <Text className={`text-xs font-bold ${filterType === 'objeto' ? 'text-red-600' : 'text-gray-600'}`}>
                Objetos
              </Text>
            </TouchableOpacity>
          </View>

          {/* Status selector */}
          <TouchableOpacity
            onPress={() => setShowStatusPicker(!showStatusPicker)}
            className="bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 flex-row items-center gap-1"
          >
            <Text className="text-xs font-semibold text-gray-700 capitalize">
              {filterStatus}
            </Text>
            <ChevronDown className="w-3.5 h-3.5 text-gray-700" />
          </TouchableOpacity>
        </View>

        {showStatusPicker && (
          <View className="bg-white border border-gray-200 rounded-xl p-2 z-50">
            {['todos', 'Pendiente', 'Programado', 'En tránsito', 'Completado'].map((st) => (
              <TouchableOpacity
                key={st}
                onPress={() => {
                  setFilterStatus(st);
                  setShowStatusPicker(false);
                }}
                className="p-2 border-b border-gray-100"
              >
                <Text className={`text-xs font-bold ${filterStatus === st ? 'text-red-600' : 'text-gray-800'}`}>
                  {st === 'todos' ? 'Todos los estados' : st}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Donation Cards List */}
      <View className="space-y-3 mb-8">
        {filteredDonations.length === 0 ? (
          <View className="bg-white p-8 rounded-3xl border border-gray-100 items-center space-y-3">
            <View className="w-12 h-12 bg-red-50 rounded-2xl items-center justify-center mb-2">
              <History className="w-6 h-6 text-red-600" />
            </View>
            <Text className="text-sm font-extrabold text-gray-800">No se encontraron donaciones</Text>
            <Text className="text-xs text-gray-500 text-center">
              Intenta cambiar los términos de búsqueda o realiza una nueva donación.
            </Text>
            <TouchableOpacity
              onPress={onNewDonationClick}
              className="mt-3 px-4 py-2 bg-red-600 rounded-xl"
            >
              <Text className="text-white text-xs font-bold">Crear Donación Ahora</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredDonations.map((record) => (
            <View
              key={record.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 mb-3 space-y-3"
            >
              {/* Top Row */}
              <View className="flex-row items-start justify-between gap-2 mb-2">
                <View className="flex-row items-center gap-3">
                  <Image
                    source={{ uri: record.organizationLogo }}
                    className="w-10 h-10 rounded-xl border border-gray-100"
                  />
                  <View>
                    <Text className="font-extrabold text-gray-900 text-sm">
                      {record.organizationName}
                    </Text>
                    <Text className="text-[11px] text-gray-500 font-mono">
                      Folio: {record.trackingNumber}
                    </Text>
                  </View>
                </View>

                {renderStatusBadge(record.status)}
              </View>

              {/* Main Content Details */}
              <View className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-1.5 my-2">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-xs text-gray-500 font-medium">Tipo:</Text>
                  <View className="flex-row items-center gap-1">
                    {record.type === 'monetario' ? (
                      <>
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        <Text className="text-xs font-extrabold text-gray-800">
                          Monetario (${(record.amount || 0).toLocaleString()} COP)
                        </Text>
                      </>
                    ) : (
                      <>
                        <PackageCheck className="w-3.5 h-3.5 text-red-600" />
                        <Text className="text-xs font-extrabold text-gray-800">
                          Objeto: {record.itemTitle}
                        </Text>
                      </>
                    )}
                  </View>
                </View>

                {record.type === 'objeto' && (
                  <View className="flex-row justify-between text-xs text-gray-600 mb-1">
                    <Text className="text-xs text-gray-500">Categoría / Piezas:</Text>
                    <Text className="text-xs font-bold text-gray-800">
                      {record.category} ({record.quantity || 1} pza)
                    </Text>
                  </View>
                )}

                <View className="flex-row justify-between text-[11px] pt-1 border-t border-gray-200/60">
                  <Text className="text-[11px] text-gray-400">Fecha: {record.date}</Text>
                  {record.frequency === 'mensual' && (
                    <Text className="text-[11px] text-red-600 font-bold">Donación Mensual</Text>
                  )}
                </View>
              </View>

              {/* Admin Actions */}
              {userRole === 'Administrador' && onUpdateStatus && (
                <View className="pt-2 border-t border-gray-100 flex-row items-center justify-between gap-2">
                  <Text className="text-[10px] font-bold text-gray-400 uppercase">Acción Admin:</Text>
                  <View className="flex-row items-center gap-1.5">
                    {record.status === 'Pendiente' && (
                      <TouchableOpacity
                        onPress={() => onUpdateStatus(record.id, 'Programado')}
                        className="px-2.5 py-1 bg-blue-600 rounded-lg"
                      >
                        <Text className="text-white text-[11px] font-bold">Programar</Text>
                      </TouchableOpacity>
                    )}
                    {record.status !== 'Completado' && (
                      <TouchableOpacity
                        onPress={() => onUpdateStatus(record.id, 'Completado')}
                        className="px-2.5 py-1 bg-emerald-600 rounded-lg"
                      >
                        <Text className="text-white text-[11px] font-bold">Completar</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => onSelectDonation(record)}
                      className="px-2.5 py-1 bg-gray-100 rounded-lg"
                    >
                      <Text className="text-gray-700 text-[11px] font-bold">Ver Folio</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Volunteer Button */}
              {userRole === 'Voluntario' && (
                <TouchableOpacity
                  onPress={() => onSelectDonation(record)}
                  className="w-full py-2 bg-slate-50 rounded-xl border border-gray-200 items-center justify-center flex-row gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-red-600" />
                  <Text className="text-xs font-bold text-gray-700">Ver Comprobante Digital</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};
