import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import {
  UserRole,
  DonationType,
  Organization,
  MonetaryDonationData,
  ObjectDonationData,
  DonationRecord,
  DonationStatus,
} from './types/donation';
import { MOCK_ORGANIZATIONS, INITIAL_DONATION_RECORDS } from './data/mockData';
import { Header } from './components/Header';
import { BottomTabBar, TabType } from './components/BottomTabBar';
import { MonetaryDonationForm } from './components/MonetaryDonationForm';
import { ObjectDonationForm } from './components/ObjectDonationForm';
import { DonationHistoryView } from './components/DonationHistoryView';
import { DonationSuccessModal } from './components/DonationSuccessModal';
import { ApiConfigModal } from './components/ApiConfigModal';
import { MobileFrame } from './components/MobileFrame';
import { apiService } from './services/api';
import { DollarSign, Package } from 'lucide-react';

export default function App() {
  // App Core State
  const [userRole, setUserRole] = useState<UserRole>('Voluntario');
  const [activeTab, setActiveTab] = useState<TabType>('donar');
  const [donationType, setDonationType] = useState<DonationType>('monetario');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);

  // Data State
  const [organizations, setOrganizations] = useState<Organization[]>(MOCK_ORGANIZATIONS);
  const [donations, setDonations] = useState<DonationRecord[]>(INITIAL_DONATION_RECORDS);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Modals state
  const [preselectedOrgIdForDonation] = useState<string | undefined>(undefined);
  const [activeSuccessRecord, setActiveSuccessRecord] = useState<DonationRecord | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  // Cargar datos desde el backend / MySQL si está disponible
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const orgRes = await apiService.fetchOrganizations();
        if (orgRes?.organizations?.length > 0) {
          const mappedOrgs: Organization[] = orgRes.organizations.map((o: any) => ({
            id: String(o.id_organizacion),
            name: o.nombre,
            category: o.categoria || 'Alimentos',
            description: o.descripcion || 'Organización social en Kennedy',
            logo:
              o.logo ||
              'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200',
            coverImage:
              o.foto_portada ||
              'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=600',
            verified: o.verificada === 1,
            location: o.direccion || 'Kennedy, Bogotá',
            phone: o.telefono || '3000000000',
            email: o.correo,
            impactSummary: o.descripcion || 'Apoyo a familias vulnerables',
            neededItems: ['Alimentos', 'Cobijas', 'Útiles'],
          }));
          setOrganizations(mappedOrgs);
        }

        const donRes = await apiService.fetchDonations();
        if (donRes?.donations?.length > 0) {
          const mappedDonations: DonationRecord[] = donRes.donations.map((d: any) => ({
            id: `don-${d.id_donacion}`,
            trackingNumber: `GG-2026-${String(d.id_donacion).padStart(4, '0')}`,
            type: d.tipo === 'Monetaria' ? 'monetario' : 'objeto',
            organizationId: String(d.organizacion_id),
            organizationName: d.organizacion_nombre || 'Organización Beneficiaria',
            organizationLogo:
              d.organizacion_logo ||
              'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200',
            date: new Date(d.fecha).toLocaleDateString('es-CO', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }),
            status: d.estado === 1 ? 'Completado' : 'Pendiente',
            userRole: 'Voluntario',
            amount: d.monetario_valor ? parseFloat(d.monetario_valor) : undefined,
            paymentMethod: d.monetario_metodo || 'pse',
            itemTitle: d.objeto_descripcion || undefined,
            category: d.objeto_categoria || undefined,
            quantity: d.objeto_cantidad || undefined,
          }));
          setDonations(mappedDonations);
        }
      } catch (err) {
        console.warn('Backend MySQL no alcanzado en carga inicial, utilizando estado local predeterminado.');
      }
    };

    loadBackendData();
  }, []);

  // 1. Envío de Donación Monetaria
  const handleMonetarySubmit = async (data: MonetaryDonationData) => {
    setIsSubmitting(true);
    const targetOrg = organizations.find((o) => o.id === data.organizationId);

    try {
      const result = await apiService.createMonetaryDonation({
        usuario_id: 2,
        organizacion_id: data.organizationId,
        categoria: 'Económico',
        metodo: data.paymentMethod,
        cuenta: data.cardNumber || 'PSE / Billetera Digital',
        valor: data.amount,
        observaciones: `Donación de ${data.donorName} (${data.donorEmail})`,
      });

      const trackingNumber = result.trackingNumber || `GG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newRecord: DonationRecord = {
        id: `don-${result.id_donacion || Date.now()}`,
        trackingNumber,
        type: 'monetario',
        organizationId: data.organizationId,
        organizationName: targetOrg?.name || 'Organización Benéfica',
        organizationLogo:
          targetOrg?.logo ||
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200',
        date: new Date().toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        status: 'Completado',
        userRole,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        frequency: data.frequency,
      };

      setDonations([newRecord, ...donations]);
      setActiveSuccessRecord(newRecord);
    } catch (err: any) {
      console.warn('Fallback local para la donación debido a:', err.message);
      const trackingNumber = `GG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRecord: DonationRecord = {
        id: `don-${Date.now()}`,
        trackingNumber,
        type: 'monetario',
        organizationId: data.organizationId,
        organizationName: targetOrg?.name || 'Organización Benéfica',
        organizationLogo:
          targetOrg?.logo ||
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200',
        date: new Date().toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        status: 'Completado',
        userRole,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        frequency: data.frequency,
      };

      setDonations([newRecord, ...donations]);
      setActiveSuccessRecord(newRecord);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Envío de Donación de Objetos
  const handleObjectSubmit = async (data: ObjectDonationData) => {
    setIsSubmitting(true);
    const targetOrg = organizations.find((o) => o.id === data.organizationId);

    try {
      const result = await apiService.createObjectDonation({
        usuario_id: 2,
        organizacion_id: data.organizationId,
        categoria: data.category,
        descripcion: `${data.title} - ${data.description}`,
        cantidad: data.quantity,
        observaciones: `Recogida: ${data.deliveryMethod === 'recogida_domicilio' ? data.pickupAddress : 'Punto de entrega'}`,
      });

      const trackingNumber = result.trackingNumber || `GG-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const newRecord: DonationRecord = {
        id: `don-${result.id_donacion || Date.now()}`,
        trackingNumber,
        type: 'objeto',
        organizationId: data.organizationId,
        organizationName: targetOrg?.name || 'Organización Benéfica',
        organizationLogo:
          targetOrg?.logo ||
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200',
        date: new Date().toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        status: 'Pendiente',
        userRole,
        itemTitle: data.title,
        category: data.category,
        condition: data.condition,
        quantity: data.quantity,
        images: data.images,
        deliveryMethod: data.deliveryMethod,
        pickupDate: data.pickupDate,
        pickupTimeSlot: data.pickupTimeSlot,
        pickupAddress: data.pickupAddress,
      };

      setDonations([newRecord, ...donations]);
      setActiveSuccessRecord(newRecord);
    } catch (err: any) {
      console.warn('Fallback local para donación de objeto debido a:', err.message);
      const trackingNumber = `GG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const newRecord: DonationRecord = {
        id: `don-${Date.now()}`,
        trackingNumber,
        type: 'objeto',
        organizationId: data.organizationId,
        organizationName: targetOrg?.name || 'Organización Benéfica',
        organizationLogo:
          targetOrg?.logo ||
          'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=200',
        date: new Date().toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        }),
        status: 'Pendiente',
        userRole,
        itemTitle: data.title,
        category: data.category,
        condition: data.condition,
        quantity: data.quantity,
        images: data.images,
        deliveryMethod: data.deliveryMethod,
        pickupDate: data.pickupDate,
        pickupTimeSlot: data.pickupTimeSlot,
        pickupAddress: data.pickupAddress,
      };

      setDonations([newRecord, ...donations]);
      setActiveSuccessRecord(newRecord);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: DonationStatus) => {
    setDonations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'donar':
        return 'Crear Donación';
      case 'historial':
        return userRole === 'Administrador' ? 'Gestión de Donaciones' : 'Mis Donaciones';
      default:
        return 'Give&Go - Kennedy';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <MobileFrame isMobileFrame={isMobileFrame}>
        {/* Header */}
        <Header
          currentRole={userRole}
          onRoleChange={setUserRole}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
          activeTabTitle={getTabTitle()}
          onOpenApiConfig={() => setIsApiModalOpen(true)}
        />

        {/* Main Screen Content */}
        <View className="flex-1 px-4 pt-4 max-w-md mx-auto w-full">
          {/* TAB: CREAR DONACIÓN (SOLO DONAR) */}
          {activeTab === 'donar' && (
            <View className="flex-1 space-y-4">
              {/* Type Selector Pill */}
              <View className="bg-white p-2 rounded-2xl border border-gray-100 shadow-xs flex-row items-center justify-between gap-2 mb-3">
                <TouchableOpacity
                  onPress={() => setDonationType('monetario')}
                  className={`flex-1 py-3 px-3 rounded-xl font-extrabold text-xs flex-row items-center justify-center gap-2 ${
                    donationType === 'monetario'
                      ? 'bg-red-600 shadow-md'
                      : 'bg-gray-50'
                  }`}
                >
                  <DollarSign size={16} color={donationType === 'monetario' ? '#ffffff' : '#374151'} />
                  <Text className={`text-xs font-extrabold ${donationType === 'monetario' ? 'text-white' : 'text-gray-700'}`}>
                    Monetaria
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setDonationType('objeto')}
                  className={`flex-1 py-3 px-3 rounded-xl font-extrabold text-xs flex-row items-center justify-center gap-2 ${
                    donationType === 'objeto'
                      ? 'bg-red-600 shadow-md'
                      : 'bg-gray-50'
                  }`}
                >
                  <Package size={16} color={donationType === 'objeto' ? '#ffffff' : '#374151'} />
                  <Text className={`text-xs font-extrabold ${donationType === 'objeto' ? 'text-white' : 'text-gray-700'}`}>
                    Objeto Físico
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Render Forms */}
              {donationType === 'monetario' ? (
                <MonetaryDonationForm
                  organizations={organizations}
                  selectedOrganizationId={preselectedOrgIdForDonation}
                  onSubmit={handleMonetarySubmit}
                  onCancel={() => setActiveTab('donar')}
                />
              ) : (
                <ObjectDonationForm
                  organizations={organizations}
                  selectedOrganizationId={preselectedOrgIdForDonation}
                  onSubmit={handleObjectSubmit}
                  onCancel={() => setActiveTab('donar')}
                />
              )}
            </View>
          )}

          {/* TAB: HISTORIAL / GESTIÓN DE DONACIONES */}
          {activeTab === 'historial' && (
            <DonationHistoryView
              donations={donations}
              userRole={userRole}
              onSelectDonation={(rec) => setActiveSuccessRecord(rec)}
              onUpdateStatus={handleUpdateStatus}
              onNewDonationClick={() => setActiveTab('donar')}
            />
          )}
        </View>

        {/* API / Database Connection Config Modal */}
        <ApiConfigModal
          isOpen={isApiModalOpen}
          onClose={() => setIsApiModalOpen(false)}
        />

        {/* Success / Digital Voucher Modal */}
        <DonationSuccessModal
          donation={activeSuccessRecord}
          onClose={() => setActiveSuccessRecord(null)}
          onViewHistory={() => {
            setActiveSuccessRecord(null);
            setActiveTab('historial');
          }}
          onNewDonation={() => {
            setActiveSuccessRecord(null);
            setActiveTab('donar');
          }}
        />

        {/* Bottom Navigation Tab Bar */}
        <BottomTabBar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          pendingCount={
            userRole === 'Administrador'
              ? donations.filter((d) => d.status === 'Pendiente').length
              : 0
          }
        />
      </MobileFrame>
    </SafeAreaView>
  );
}
