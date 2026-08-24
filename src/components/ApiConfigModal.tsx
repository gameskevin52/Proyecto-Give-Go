import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from 'react-native';
import { apiService, getApiBaseUrl, setApiBaseUrl } from '../services/api';
import {
  Database,
  Server,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Smartphone,
} from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  const [currentUrl, setCurrentUrl] = useState(getApiBaseUrl());
  const [inputUrl, setInputUrl] = useState(getApiBaseUrl());
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const data = await apiService.checkHealth();
      setStatus(data);
    } catch (err: any) {
      setStatus({
        status: 'error',
        error: err.message || 'No se pudo contactar con el backend',
        database: { connected: false },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = async (newUrlToSet: string) => {
    const formatted = setApiBaseUrl(newUrlToSet);
    setCurrentUrl(formatted);
    setInputUrl(formatted);
    setMessage(`URL actualizada a: ${formatted}`);
    await checkConnection();
  };

  return (
    <Modal visible={isOpen} transparent={true} animationType="fade">
      <View className="flex-1 bg-black/60 items-center justify-center p-4">
        <View className="bg-white rounded-3xl max-w-md w-full p-6 border border-gray-100 space-y-5">
          {/* Header */}
          <View className="flex-row justify-between items-center pb-3 border-b border-gray-100 mb-3">
            <View className="flex-row items-center gap-2.5">
              <View className="w-9 h-9 rounded-xl bg-red-100 text-red-600 items-center justify-center">
                <Database className="w-5 h-5 text-red-600" />
              </View>
              <View>
                <Text className="font-black text-gray-900 text-base">Conexión Backend & MySQL</Text>
                <Text className="text-xs text-gray-500">XAMPP, Expo Go y Android Studio</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X className="w-5 h-5 text-gray-400" />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-4">
            {/* Status Server & DB */}
            <View className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3 mb-3">
              <View className="flex-row items-center justify-between text-xs mb-2">
                <View className="flex-row items-center gap-1.5">
                  <Server className="w-4 h-4 text-blue-600" />
                  <Text className="font-bold text-gray-600 text-xs">Servidor Node / Express:</Text>
                </View>
                {status?.status === 'ok' ? (
                  <View className="flex-row items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <Text className="text-emerald-700 font-black text-xs">En línea</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    <Text className="text-red-600 font-black text-xs">Sin conexión</Text>
                  </View>
                )}
              </View>

              <View className="flex-row items-center justify-between text-xs mb-2">
                <View className="flex-row items-center gap-1.5">
                  <Database className="w-4 h-4 text-emerald-600" />
                  <Text className="font-bold text-gray-600 text-xs">Base de Datos MySQL:</Text>
                </View>
                {status?.database?.connected ? (
                  <View className="flex-row items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <Text className="text-emerald-700 font-black text-xs">giveandgo_v2 Lista</Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <Text className="text-amber-600 font-black text-xs">Pendiente XAMPP</Text>
                  </View>
                )}
              </View>

              {status?.database?.connected && (
                <View className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl">
                  <Text className="text-[11px] text-emerald-900 font-medium">
                    ✅ Conectado a MySQL local ({status.database.host}:{status.database.port}) en giveandgo_v2.
                  </Text>
                </View>
              )}

              {!status?.database?.connected && (
                <View className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl space-y-1">
                  <Text className="text-[11px] font-bold text-amber-900">⚠️ Conexión MySQL no detectada:</Text>
                  <Text className="text-[11px] text-amber-900">Inicia el módulo MySQL en XAMPP e importa giveandgo_v2.</Text>
                </View>
              )}
            </View>

            {/* URL Input */}
            <View className="space-y-2 mb-3">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Smartphone className="w-4 h-4 text-red-600" />
                <Text className="text-xs font-bold text-gray-700 uppercase">
                  Dirección URL / IP de la API
                </Text>
              </View>

              <View className="flex-row gap-2 mb-2">
                <TextInput
                  value={inputUrl}
                  onChangeText={setInputUrl}
                  placeholder="http://192.168.1.100:3000"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-gray-900"
                />
                <TouchableOpacity
                  onPress={() => handleSaveUrl(inputUrl)}
                  className="py-2.5 px-4 bg-red-600 rounded-xl"
                >
                  <Text className="text-white font-bold text-xs">Guardar</Text>
                </TouchableOpacity>
              </View>

              <View className="space-y-1 pt-1">
                <Text className="text-[11px] text-gray-500 font-bold mb-1">Accesos rápidos:</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleSaveUrl('http://10.0.2.2:3000')}
                    className="flex-1 p-2 bg-gray-100 rounded-xl"
                  >
                    <Text className="text-[11px] font-bold text-gray-700">🤖 Emulador Android</Text>
                    <Text className="text-[10px] text-gray-500 font-mono">http://10.0.2.2:3000</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSaveUrl('http://localhost:3000')}
                    className="flex-1 p-2 bg-gray-100 rounded-xl"
                  >
                    <Text className="text-[11px] font-bold text-gray-700">💻 Web Localhost</Text>
                    <Text className="text-[10px] text-gray-500 font-mono">http://localhost:3000</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {message && (
              <View className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 mb-3">
                <Text className="text-xs font-bold text-emerald-700">{message}</Text>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="pt-3 flex-row justify-between items-center border-t border-gray-100 mt-2">
            <TouchableOpacity
              onPress={checkConnection}
              disabled={loading}
              className="flex-row items-center gap-1 py-2 px-3 rounded-xl bg-gray-100"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-700" />
              <Text className="text-xs font-bold text-gray-600">Probar Conexión</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="py-2.5 px-5 bg-gray-900 rounded-xl"
            >
              <Text className="text-white font-bold text-xs">Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
