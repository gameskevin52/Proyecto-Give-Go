import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import { Organization, MonetaryDonationData, PaymentMethodType } from '../types/donation';
import { PRESET_AMOUNTS } from '../data/mockData';
import {
  CreditCard,
  DollarSign,
  Calendar,
  Lock,
  User,
  AlertCircle,
  Building2,
  Heart,
  ChevronDown,
  FileText,
  Check,
} from 'lucide-react';

interface MonetaryDonationFormProps {
  organizations: Organization[];
  selectedOrganizationId?: string;
  onSubmit: (data: MonetaryDonationData) => void;
  onCancel?: () => void;
}

export const MonetaryDonationForm: React.FC<MonetaryDonationFormProps> = ({
  organizations,
  selectedOrganizationId,
  onSubmit,
  onCancel,
}) => {
  const [orgId, setOrgId] = useState<string>(
    selectedOrganizationId || (organizations[0]?.id || '')
  );
  const [showOrgPicker, setShowOrgPicker] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<'unica' | 'mensual'>('unica');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('pse');

  // Contact fields
  const [donorName, setDonorName] = useState('María Alejandra Quiñones');
  const [donorEmail, setDonorEmail] = useState('alejandra.quinones@ejemplo.com');
  const [donorPhone, setDonorPhone] = useState('3109876543');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Tax receipt fields
  const [needsTaxReceipt, setNeedsTaxReceipt] = useState(false);
  const [taxRfc, setTaxRfc] = useState('');

  // Card details
  const [cardNumber, setCardNumber] = useState('4532 8901 2345 6789');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('882');
  const [cardHolder, setCardHolder] = useState('MARIA A QUINONES');

  // Form errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const activeOrg = organizations.find((o) => o.id === orgId) || organizations[0];

  const handleCardNumberChange = (text: string) => {
    let value = text.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(.{4})/g, '$1 ').trim();
    setCardNumber(formatted);
    if (errors.cardNumber) setErrors((prev) => ({ ...prev, cardNumber: '' }));
  };

  const handleExpiryChange = (text: string) => {
    let value = text.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setCardExpiry(value);
    if (errors.cardExpiry) setErrors((prev) => ({ ...prev, cardExpiry: '' }));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    const finalAmount = isCustom ? parseFloat(customAmount) : amount;
    if (!finalAmount || isNaN(finalAmount) || finalAmount < 5000) {
      newErrors.amount = 'El monto mínimo de donación es de $5.000 COP.';
    }

    if (!donorName.trim() && !isAnonymous) {
      newErrors.donorName = 'Ingresa tu nombre completo.';
    }

    if (!donorEmail.trim() || !donorEmail.includes('@')) {
      newErrors.donorEmail = 'Ingresa un correo electrónico válido.';
    }

    if (!donorPhone.trim() || donorPhone.replace(/\D/g, '').length < 10) {
      newErrors.donorPhone = 'Ingresa un número telefónico de 10 dígitos (ej. 3109876543).';
    }

    if (needsTaxReceipt && (!taxRfc.trim() || taxRfc.trim().length < 6)) {
      newErrors.taxRfc = 'Ingresa un NIT o Cédula válido (mínimo 6 dígitos).';
    }

    if (paymentMethod === 'tarjeta') {
      const cleanCard = cardNumber.replace(/\s/g, '');
      if (cleanCard.length < 15) {
        newErrors.cardNumber = 'Número de tarjeta inválido (15-16 dígitos).';
      }
      if (!cardExpiry || !cardExpiry.includes('/') || cardExpiry.length < 5) {
        newErrors.cardExpiry = 'Fecha expiración inválida (MM/AA).';
      }
      if (!cardCvc || cardCvc.length < 3) {
        newErrors.cardCvc = 'Código CVC inválido (3-4 dígitos).';
      }
      if (!cardHolder.trim()) {
        newErrors.cardHolder = 'Ingresa el nombre del titular.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const finalAmount = isCustom ? parseFloat(customAmount) : amount;

    onSubmit({
      organizationId: orgId,
      amount: finalAmount,
      frequency,
      paymentMethod,
      donorName: isAnonymous ? 'Donador Anónimo' : donorName,
      donorEmail,
      donorPhone,
      isAnonymous,
      needsTaxReceipt,
      taxRfc: needsTaxReceipt ? taxRfc.toUpperCase() : undefined,
      cardNumber: paymentMethod === 'tarjeta' ? cardNumber : undefined,
      cardExpiry: paymentMethod === 'tarjeta' ? cardExpiry : undefined,
      cardCvc: paymentMethod === 'tarjeta' ? cardCvc : undefined,
      cardHolder: paymentMethod === 'tarjeta' ? cardHolder : undefined,
    });
  };

  return (
    <ScrollView className="space-y-6 pb-20">
      {/* Step Header */}
      <View className="bg-red-50 border border-red-100 p-4 rounded-2xl flex-row items-center gap-3 mb-4">
        <View className="w-10 h-10 rounded-2xl bg-red-600 items-center justify-center shadow-md">
          <DollarSign className="w-5 h-5 text-white" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-extrabold text-gray-900 leading-tight">
            Donación Monetaria
          </Text>
          <Text className="text-xs text-gray-600">
            Aportación financiera segura para causas sociales
          </Text>
        </View>
      </View>

      {/* 1. Selección de Organización */}
      <View className="space-y-2 mb-4">
        <Text className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
          Organismo Beneficiario *
        </Text>
        
        <TouchableOpacity
          onPress={() => setShowOrgPicker(!showOrgPicker)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 flex-row items-center justify-between"
        >
          <Text className="text-sm font-semibold text-gray-900 flex-1">
            {activeOrg ? `${activeOrg.name} (${activeOrg.category})` : 'Seleccionar Organización'}
          </Text>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </TouchableOpacity>

        {showOrgPicker && (
          <View className="bg-white border border-gray-200 rounded-xl mt-1 p-1 z-50">
            {organizations.map((org) => (
              <TouchableOpacity
                key={org.id}
                onPress={() => {
                  setOrgId(org.id);
                  setShowOrgPicker(false);
                }}
                className={`p-2.5 rounded-lg flex-row items-center justify-between ${
                  org.id === orgId ? 'bg-red-50' : ''
                }`}
              >
                <Text className={`text-xs font-bold ${org.id === orgId ? 'text-red-600' : 'text-gray-800'}`}>
                  {org.name} ({org.category})
                </Text>
                {org.id === orgId && <Check className="w-4 h-4 text-red-600" />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeOrg && (
          <View className="bg-white p-3 rounded-xl border border-gray-100 flex-row items-center gap-3 mt-2">
            <Image
              source={{ uri: activeOrg.logo }}
              className="w-10 h-10 rounded-lg border border-gray-100"
            />
            <View className="flex-1">
              <Text className="font-bold text-gray-900 text-xs">{activeOrg.name}</Text>
              <Text className="text-gray-500 text-xs">{activeOrg.impactSummary}</Text>
            </View>
          </View>
        )}
      </View>

      {/* 2. Tipo y Frecuencia de Donación */}
      <View className="space-y-3 mb-4">
        <Text className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
          Frecuencia de la Donación
        </Text>
        <View className="flex-row bg-gray-100 p-1 rounded-2xl border border-gray-200/80 gap-1">
          <TouchableOpacity
            onPress={() => setFrequency('unica')}
            className={`flex-1 py-2.5 px-3 rounded-xl items-center ${
              frequency === 'unica' ? 'bg-white shadow-xs' : ''
            }`}
          >
            <Text className={`text-xs font-extrabold ${frequency === 'unica' ? 'text-red-600' : 'text-gray-600'}`}>
              Donación Única
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFrequency('mensual')}
            className={`flex-1 py-2.5 px-3 rounded-xl items-center ${
              frequency === 'mensual' ? 'bg-white shadow-xs' : ''
            }`}
          >
            <Text className={`text-xs font-extrabold ${frequency === 'mensual' ? 'text-red-600' : 'text-gray-600'}`}>
              Suscripción Mensual 🌟
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Selección de Monto */}
      <View className="space-y-3 mb-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Selecciona el Monto (COP $) *
          </Text>
          <Text className="text-[11px] font-semibold text-red-600">
            {frequency === 'mensual' ? 'Se cobrará cada mes' : 'Pago único'}
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <TouchableOpacity
              key={preset}
              onPress={() => {
                setAmount(preset);
                setIsCustom(false);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              className={`py-3 px-3 rounded-xl border flex-1 min-w-[90px] items-center ${
                !isCustom && amount === preset
                  ? 'bg-red-600 border-red-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-xs font-extrabold ${!isCustom && amount === preset ? 'text-white' : 'text-gray-800'}`}>
                ${preset.toLocaleString()} COP
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setIsCustom(!isCustom)}
          className="pt-2"
        >
          <Text className="text-xs font-bold text-red-600">
            {isCustom ? '← Seleccionar montos sugeridos' : '+ Ingresar un monto personalizado'}
          </Text>
        </TouchableOpacity>

        {isCustom && (
          <View className="mt-2 relative">
            <TextInput
              keyboardType="numeric"
              value={customAmount}
              onChangeText={(text) => {
                setCustomAmount(text);
                if (errors.amount) setErrors((prev) => ({ ...prev, amount: '' }));
              }}
              placeholder="Ingresa otro monto (mínimo $5.000 COP)"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900"
            />
          </View>
        )}

        {errors.amount && (
          <Text className="text-xs font-bold text-red-600 mt-1">
            {errors.amount}
          </Text>
        )}
      </View>

      {/* 4. Método de Pago */}
      <View className="space-y-3 mb-4">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Método de Pago (Colombia) *
          </Text>
          <Text className="text-[10px] text-emerald-700 font-bold">
            🔒 Cifrado 256-bit
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          {(['pse', 'nequi', 'daviplata', 'tarjeta', 'efecty'] as PaymentMethodType[]).map((method) => (
            <TouchableOpacity
              key={method}
              onPress={() => setPaymentMethod(method)}
              className={`p-3 rounded-xl border flex-1 min-w-[130px] ${
                paymentMethod === method
                  ? 'bg-red-50 border-red-500'
                  : 'bg-white border-gray-200'
              }`}
            >
              <Text className={`text-xs font-extrabold uppercase ${paymentMethod === method ? 'text-red-700' : 'text-gray-800'}`}>
                {method}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Credit Card Details */}
        {paymentMethod === 'tarjeta' && (
          <View className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3 mt-2">
            <View className="mb-2">
              <Text className="text-[11px] font-bold text-gray-600 mb-1">
                Número de Tarjeta *
              </Text>
              <TextInput
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                keyboardType="numeric"
                placeholder="0000 0000 0000 0000"
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900"
              />
              {errors.cardNumber && (
                <Text className="text-[11px] font-bold text-red-600 mt-1">{errors.cardNumber}</Text>
              )}
            </View>

            <View className="flex-row gap-2 mb-2">
              <View className="flex-1">
                <Text className="text-[11px] font-bold text-gray-600 mb-1">Expiración (MM/AA) *</Text>
                <TextInput
                  value={cardExpiry}
                  onChangeText={handleExpiryChange}
                  placeholder="MM/AA"
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-bold text-gray-600 mb-1">CVC / CVV *</Text>
                <TextInput
                  value={cardCvc}
                  onChangeText={(text) => setCardCvc(text.replace(/\D/g, ''))}
                  secureTextEntry={true}
                  keyboardType="numeric"
                  maxLength={4}
                  placeholder="123"
                  className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900"
                />
              </View>
            </View>

            <View>
              <Text className="text-[11px] font-bold text-gray-600 mb-1">Nombre del Titular *</Text>
              <TextInput
                value={cardHolder}
                onChangeText={(text) => setCardHolder(text.toUpperCase())}
                placeholder="Como aparece en la tarjeta"
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
              />
            </View>
          </View>
        )}
      </View>

      {/* 5. Datos del Donante */}
      <View className="space-y-3 pt-2 border-t border-gray-100 mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Información del Donante
          </Text>

          <TouchableOpacity
            onPress={() => setIsAnonymous(!isAnonymous)}
            className="flex-row items-center gap-1.5"
          >
            <View className={`w-4 h-4 rounded border items-center justify-center ${isAnonymous ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
              {isAnonymous && <Check className="w-3 h-3 text-white" />}
            </View>
            <Text className="text-xs text-gray-600 font-semibold">Anónimo</Text>
          </TouchableOpacity>
        </View>

        {!isAnonymous && (
          <View className="mb-2">
            <Text className="text-[11px] font-bold text-gray-600 mb-1">Nombre Completo *</Text>
            <TextInput
              value={donorName}
              onChangeText={(text) => setDonorName(text)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
            />
          </View>
        )}

        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-1">Correo Electrónico *</Text>
          <TextInput
            value={donorEmail}
            onChangeText={(text) => setDonorEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
          />
        </View>

        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-1">Teléfono de Contacto *</Text>
          <TextInput
            value={donorPhone}
            onChangeText={(text) => setDonorPhone(text)}
            keyboardType="phone-pad"
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
          />
        </View>

        <TouchableOpacity
          onPress={() => setNeedsTaxReceipt(!needsTaxReceipt)}
          className="flex-row items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200/80 mt-2"
        >
          <View className={`w-4 h-4 rounded border items-center justify-center ${needsTaxReceipt ? 'bg-red-600 border-red-600' : 'border-gray-300'}`}>
            {needsTaxReceipt && <Check className="w-3 h-3 text-white" />}
          </View>
          <Text className="text-xs font-extrabold text-gray-800 flex-1">
            Solicitar Comprobante Fiscal Deducible de Impuestos
          </Text>
        </TouchableOpacity>

        {needsTaxReceipt && (
          <View className="mt-2">
            <Text className="text-[11px] font-bold text-gray-600 mb-1">NIT o Cédula *</Text>
            <TextInput
              value={taxRfc}
              onChangeText={(text) => setTaxRfc(text.toUpperCase())}
              placeholder="900.123.456-1"
              className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-gray-900"
            />
          </View>
        )}
      </View>

      {/* Summary Box & Submit */}
      <View className="bg-gray-900 text-white p-5 rounded-3xl shadow-xl space-y-4 mb-8">
        <View className="flex-row justify-between items-center border-b border-gray-700/80 pb-3">
          <View>
            <Text className="text-xs text-gray-400 font-medium">Total a Donar</Text>
            <Text className="text-2xl font-black text-white">
              ${(isCustom ? parseFloat(customAmount) || 0 : amount).toLocaleString()} COP
            </Text>
          </View>
          <View className="px-3 py-1 bg-red-600/30 rounded-full border border-red-500/30">
            <Text className="text-red-300 text-xs font-bold">
              {frequency === 'mensual' ? 'Mensual' : 'Pago Único'}
            </Text>
          </View>
        </View>

        <View className="pt-3 flex-row gap-2">
          {onCancel && (
            <TouchableOpacity
              onPress={onCancel}
              className="py-3.5 px-4 rounded-2xl bg-gray-700 items-center justify-center"
            >
              <Text className="text-xs font-bold text-white">Cancelar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleSubmit}
            className="flex-1 py-4 px-6 rounded-2xl bg-red-600 items-center justify-center flex-row gap-2"
          >
            <Heart className="w-5 h-5 text-white fill-white" />
            <Text className="text-sm font-black text-white">Confirmar Donación</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
