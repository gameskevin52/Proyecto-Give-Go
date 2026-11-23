import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Coins,
  Package,
  Check,
  Building2,
  Heart,
  ArrowLeft,
  ShieldAlert,
  CreditCard,
  CheckCircle2,
} from 'lucide-react-native';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { donationFeatureService } from '../services/donation.service';
import { apiClient } from '../../../services/api/apiClient';
import { useAuth } from '../../../store/auth/AuthContext';
import { colors } from '../../../config/theme';

interface CreateDonationViewProps {
  route?: any;
  navigation: any;
}

export const CreateDonationView: React.FC<CreateDonationViewProps> = ({ route, navigation }) => {
  const { user } = useAuth();
  const defaultOrgId = route?.params?.defaultOrgId;

  const isBeneficiary = (user?.rol || '').toLowerCase() === 'beneficiario';

  const [tipo, setTipo] = useState<'monetaria' | 'especie'>('monetaria');
  const [monto, setMonto] = useState('50000');
  const [metodo, setMetodo] = useState<'tarjeta' | 'pse' | 'nequi' | 'daviplata'>('nequi');
  const [descripcionEspecie, setDescripcionEspecie] = useState('');
  const [objetoCategoria, setObjetoCategoria] = useState('Alimentos no perecederos');
  const [cantidad, setCantidad] = useState('1');
  const [anonima, setAnonima] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(
    defaultOrgId ? parseInt(String(defaultOrgId), 10) : null
  );

  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await apiClient.get('/organizations');
        const orgs = res.data?.data || [];
        setOrganizations(orgs);
        if (!selectedOrgId && orgs.length > 0) {
          const firstId = orgs[0].id_organizacion || (orgs[0].id ? parseInt(String(orgs[0].id).replace('org_', ''), 10) : 1);
          setSelectedOrgId(firstId);
        }
      } catch (err) {
        console.warn('Error fetching organizations for donation:', err);
      } finally {
        setIsLoadingOrgs(false);
      }
    };
    fetchOrgs();
  }, []);

  // Beneficiaries are restricted from donating
  if (isBeneficiary) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#FEF2F2',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#FECACA',
              marginBottom: 16,
            }}
          >
            <ShieldAlert size={36} color="#DC2626" />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: '800',
              color: '#0F172A',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Acción No Permitida
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: '#64748B',
              textAlign: 'center',
              lineHeight: 20,
              maxWidth: 320,
              marginBottom: 24,
            }}
          >
            Hola, <Text style={{ fontWeight: '700', color: '#0F172A' }}>{user?.nombre1}</Text>. Como usuario registrado con el rol de <Text style={{ fontWeight: '700', color: '#0F172A' }}>Beneficiario</Text>, tu cuenta está destinada para solicitar y recibir asistencia humanitaria.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Heart size={16} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>
              Ir a Mis Solicitudes
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Success Confirmation Screen
  if (isSuccess) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: '#ECFDF5',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: '#A7F3D0',
              marginBottom: 16,
            }}
          >
            <CheckCircle2 size={36} color="#10B981" />
          </View>
          <Text
            style={{
              fontSize: 22,
              fontWeight: '800',
              color: '#0F172A',
              textAlign: 'center',
              marginBottom: 8,
            }}
          >
            Aporte Confirmado
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: '#64748B',
              textAlign: 'center',
              lineHeight: 20,
              maxWidth: 320,
              marginBottom: 24,
            }}
          >
            Muchas gracias por tu generosidad. Tu aporte ha sido registrado en la base de datos oficial y notificado a la entidad beneficiaria.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 12,
              width: '100%',
              alignItems: 'center',
            }}
            onPress={() => navigation.goBack()}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 14 }}>
              Volver a Donaciones
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = async () => {
    if (tipo === 'monetaria') {
      const val = parseFloat(monto);
      if (isNaN(val) || val <= 0) {
        setErrorMessage('Por favor ingresa un monto válido mayor a 0.');
        return;
      }
    } else {
      if (!descripcionEspecie.trim()) {
        setErrorMessage('Por favor describe los artículos o insumos a donar.');
        return;
      }
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      await donationFeatureService.create({
        tipo_donacion: tipo,
        monto: tipo === 'monetaria' ? parseFloat(monto) : undefined,
        descripcion_especie:
          tipo === 'especie'
            ? `${objetoCategoria}: ${descripcionEspecie.trim()} (${cantidad} unidades)`
            : undefined,
        id_organizacion: selectedOrgId || 1,
        id_categoria: 1,
        anonima,
      });
      setIsSuccess(true);
    } catch (e: any) {
      setErrorMessage(
        e.response?.data?.message || e.message || 'Error al procesar donación'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
        >
          <ArrowLeft size={18} color="#DC2626" />
          <Text style={{ fontSize: 14, color: '#DC2626', fontWeight: '700', marginLeft: 6 }}>
            Volver a Donaciones
          </Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: '#FFFFFF',
            padding: 20,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#E2E8F0',
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 4 }}>
            Formulario de Aportación Solidaria
          </Text>
          <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 18 }}>
            Tu contribución fortalece las causas sociales en Bogotá y Kennedy de forma transparente.
          </Text>

          {errorMessage ? (
            <View
              style={{
                backgroundColor: '#FEF2F2',
                borderWidth: 1,
                borderColor: '#FCA5A5',
                padding: 10,
                borderRadius: 10,
                marginBottom: 14,
              }}
            >
              <Text style={{ color: '#B91C1C', fontWeight: '600', fontSize: 12, textAlign: 'center' }}>
                {errorMessage}
              </Text>
            </View>
          ) : null}

          {/* Selector de Organización Destino */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 6, textTransform: 'uppercase' }}>
            Organización Destino
          </Text>

          {isLoadingOrgs ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 10 }} />
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, marginBottom: 16 }}
            >
              {organizations.map((org) => {
                const orgIdNum = org.id_organizacion || (org.id ? parseInt(String(org.id).replace('org_', ''), 10) : 1);
                const isSelected = selectedOrgId === orgIdNum;
                return (
                  <TouchableOpacity
                    key={`org_${orgIdNum}`}
                    activeOpacity={0.7}
                    onPress={() => setSelectedOrgId(orgIdNum)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      backgroundColor: isSelected ? '#FEF2F2' : '#F8FAFC',
                      borderWidth: 1.5,
                      borderColor: isSelected ? colors.primary : '#E2E8F0',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Building2 size={14} color={isSelected ? colors.primary : '#64748B'} />
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: isSelected ? colors.primary : '#334155',
                      }}
                    >
                      {org.nombre || org.nombre_organizacion}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Tipo Selector */}
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 6, textTransform: 'uppercase' }}>
            Modalidad del Aporte
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setTipo('monetaria')}
              style={{
                flex: 1,
                paddingVertical: 11,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: tipo === 'monetaria' ? '#DC2626' : '#F1F5F9',
                borderWidth: 1,
                borderColor: tipo === 'monetaria' ? '#DC2626' : '#E2E8F0',
              }}
            >
              <Coins
                size={16}
                color={tipo === 'monetaria' ? '#FFFFFF' : '#475569'}
                strokeWidth={2}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: tipo === 'monetaria' ? '#FFFFFF' : '#475569',
                  fontWeight: '700',
                  fontSize: 13,
                }}
              >
                Monetaria
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setTipo('especie')}
              style={{
                flex: 1,
                paddingVertical: 11,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: tipo === 'especie' ? '#DC2626' : '#F1F5F9',
                borderWidth: 1,
                borderColor: tipo === 'especie' ? '#DC2626' : '#E2E8F0',
              }}
            >
              <Package
                size={16}
                color={tipo === 'especie' ? '#FFFFFF' : '#475569'}
                strokeWidth={2}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: tipo === 'especie' ? '#FFFFFF' : '#475569',
                  fontWeight: '700',
                  fontSize: 13,
                }}
              >
                En Especie
              </Text>
            </TouchableOpacity>
          </View>

          {tipo === 'monetaria' ? (
            <View>
              <AppInput
                label="Valor en Pesos Colombianos (COP) *"
                placeholder="50000"
                value={monto}
                onChangeText={setMonto}
                keyboardType="numeric"
              />

              <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 6, textTransform: 'uppercase' }}>
                Método de Pago
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {[
                  { key: 'nequi', label: 'Nequi' },
                  { key: 'daviplata', label: 'Daviplata' },
                  { key: 'pse', label: 'PSE' },
                  { key: 'tarjeta', label: 'Tarjeta Crédito/Débito' },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.key}
                    activeOpacity={0.7}
                    onPress={() => setMetodo(item.key as any)}
                    style={{
                      paddingVertical: 7,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      backgroundColor: metodo === item.key ? '#FEF2F2' : '#F8FAFC',
                      borderWidth: 1,
                      borderColor: metodo === item.key ? colors.primary : '#E2E8F0',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '700',
                        color: metodo === item.key ? colors.primary : '#475569',
                      }}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 6, textTransform: 'uppercase' }}>
                Categoría del Objeto
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 6, marginBottom: 12 }}
              >
                {[
                  'Alimentos no perecederos',
                  'Material Escolar',
                  'Ropa y Calzado',
                  'Medicamentos e Higiene',
                  'Juguetes',
                ].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    activeOpacity={0.7}
                    onPress={() => setObjetoCategoria(cat)}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 10,
                      borderRadius: 8,
                      backgroundColor: objetoCategoria === cat ? '#FEF2F2' : '#F8FAFC',
                      borderWidth: 1,
                      borderColor: objetoCategoria === cat ? colors.primary : '#E2E8F0',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '700',
                        color: objetoCategoria === cat ? colors.primary : '#475569',
                      }}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <AppInput
                label="Cantidad de Unidades"
                placeholder="1"
                value={cantidad}
                onChangeText={setCantidad}
                keyboardType="numeric"
              />

              <AppInput
                label="Descripción Detallada de los Insumos *"
                placeholder="Ej: 4 cajas de leche en polvo, arroz y aceite sellados"
                value={descripcionEspecie}
                onChangeText={setDescripcionEspecie}
                multiline
                numberOfLines={3}
              />
            </View>
          )}

          {/* Opción Anónima */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setAnonima(!anonima)}
            style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                borderWidth: 2,
                borderColor: anonima ? colors.primary : '#CBD5E1',
                backgroundColor: anonima ? colors.primary : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 8,
              }}
            >
              {anonima && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
            </View>
            <Text style={{ fontSize: 13, color: '#334155' }}>
              Deseo que mi donación sea anónima
            </Text>
          </TouchableOpacity>

          <AppButton
            title="Confirmar y Enviar Donación"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateDonationView;
