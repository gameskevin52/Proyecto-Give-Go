import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import {
  Organization,
  ObjectDonationData,
  ObjectCategory,
  ObjectCondition,
  DeliveryMethod,
} from '../types/donation';
import { DROP_OFF_POINTS, SAMPLE_OBJECT_PRESETS } from '../data/mockData';
import {
  Box,
  Building2,
  PackageCheck,
  MapPin,
  Camera,
  User,
  Truck,
  ChevronDown,
  Sparkles,
  Heart,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';

interface ObjectDonationFormProps {
  organizations: Organization[];
  selectedOrganizationId?: string;
  onSubmit: (data: ObjectDonationData) => void;
  onCancel?: () => void;
}

const CATEGORIES: ObjectCategory[] = [
  'Muebles',
  'Ropa y Calzado',
  'Electrodomésticos',
  'Juguetes',
  'Alimentos no perecederos',
  'Libros y Útiles',
  'Artículos del Hogar',
  'Otros',
];

const CONDITIONS: ObjectCondition[] = [
  'Nuevo',
  'Como nuevo',
  'Buen estado',
  'Usado con detalles',
];

export const ObjectDonationForm: React.FC<ObjectDonationFormProps> = ({
  organizations,
  selectedOrganizationId,
  onSubmit,
  onCancel,
}) => {
  const [orgId, setOrgId] = useState<string>(
    selectedOrganizationId || (organizations[0]?.id || '')
  );
  const [showOrgPicker, setShowOrgPicker] = useState(false);
  const [showCatPicker, setShowCatPicker] = useState(false);

  // Item details
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ObjectCategory>('Muebles');
  const [condition, setCondition] = useState<ObjectCondition>('Buen estado');
  const [quantity, setQuantity] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=400',
  ]);

  // Delivery options
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('recogida_domicilio');
  const [pickupAddress, setPickupAddress] = useState('Calle 41 Sur #78K-32, Barrio Timiza, Kennedy');
  const [pickupCity, setPickupCity] = useState('Bogotá D.C.');
  const [pickupZip, setPickupZip] = useState('110821');
  const [pickupDate, setPickupDate] = useState('2026-08-10');
  const [pickupTimeSlot, setPickupTimeSlot] = useState('10:00 AM - 02:00 PM');
  const [dropoffLocationId, setDropoffLocationId] = useState(DROP_OFF_POINTS[0].id);

  // Contact Info
  const [donorName, setDonorName] = useState('María Alejandra Quiñones');
  const [donorPhone, setDonorPhone] = useState('3109876543');
  const [donorEmail, setDonorEmail] = useState('alejandra.quinones@ejemplo.com');
  const [notes, setNotes] = useState('');

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const activeOrg = organizations.find((o) => o.id === orgId) || organizations[0];

  const handleSelectPreset = (preset: typeof SAMPLE_OBJECT_PRESETS[0]) => {
    setTitle(preset.title);
    setCategory(preset.category);
    setCondition(preset.condition);
    setDescription(preset.description);
    if (preset.image && !images.includes(preset.image)) {
      setImages([preset.image, ...images]);
    }
  };

  const handleAddCustomImage = () => {
    const samplePhotos = [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=400',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=400',
    ];
    const nextPhoto = samplePhotos[images.length % samplePhotos.length];
    setImages([...images, nextPhoto]);
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim() || title.length < 3) {
      newErrors.title = 'Ingresa un título descriptivo para el objeto.';
    }

    if (!description.trim() || description.length < 10) {
      newErrors.description = 'Ingresa una breve descripción del objeto.';
    }

    if (quantity < 1) {
      newErrors.quantity = 'La cantidad debe ser al menos 1.';
    }

    if (images.length === 0) {
      newErrors.images = 'Adjunta al menos 1 fotografía del objeto.';
    }

    if (deliveryMethod === 'recogida_domicilio') {
      if (!pickupAddress.trim()) newErrors.pickupAddress = 'Ingresa la dirección completa.';
    }

    if (!donorName.trim()) newErrors.donorName = 'Ingresa tu nombre.';
    if (!donorPhone.trim() || donorPhone.length < 10) newErrors.donorPhone = 'Ingresa un celular de 10 dígitos.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSubmit({
      organizationId: orgId,
      title,
      category,
      condition,
      quantity,
      description,
      images,
      deliveryMethod,
      pickupAddress: deliveryMethod === 'recogida_domicilio' ? pickupAddress : undefined,
      pickupCity: deliveryMethod === 'recogida_domicilio' ? pickupCity : undefined,
      pickupZip: deliveryMethod === 'recogida_domicilio' ? pickupZip : undefined,
      pickupDate: deliveryMethod === 'recogida_domicilio' ? pickupDate : undefined,
      pickupTimeSlot: deliveryMethod === 'recogida_domicilio' ? pickupTimeSlot : undefined,
      dropoffLocationId: deliveryMethod === 'punto_entrega' ? dropoffLocationId : undefined,
      donorName,
      donorPhone,
      donorEmail,
      notes,
    });
  };

  return (
    <ScrollView className="space-y-6 pb-20">
      {/* Header Banner */}
      <View className="bg-red-600 text-white p-4 rounded-2xl flex-row items-center gap-3 mb-4 shadow-md">
        <View className="w-10 h-10 rounded-2xl bg-white/20 items-center justify-center">
          <Box className="w-5 h-5 text-white" />
        </View>
        <View className="flex-1">
          <Text className="text-base font-extrabold text-white">Donación de Objetos</Text>
          <Text className="text-xs text-red-100">Muebles, ropa, electrodomésticos y más</Text>
        </View>
      </View>

      {/* Presets */}
      <View className="bg-red-50 p-3 rounded-2xl mb-4">
        <Text className="text-[11px] font-bold text-red-800 uppercase mb-2">
          Plantillas Rápidas
        </Text>
        <View className="flex-row flex-wrap gap-1.5">
          {SAMPLE_OBJECT_PRESETS.map((preset, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSelectPreset(preset)}
              className="bg-white border border-red-200 px-2.5 py-1 rounded-xl"
            >
              <Text className="text-[11px] font-semibold text-gray-800">
                + {preset.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Organization */}
      <View className="space-y-2 mb-4">
        <Text className="text-xs font-bold text-gray-700 uppercase mb-1">
          Organización Destino *
        </Text>
        <TouchableOpacity
          onPress={() => setShowOrgPicker(!showOrgPicker)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 flex-row items-center justify-between"
        >
          <Text className="text-sm font-semibold text-gray-900 flex-1">
            {activeOrg ? activeOrg.name : 'Seleccionar'}
          </Text>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </TouchableOpacity>

        {showOrgPicker && (
          <View className="bg-white border border-gray-200 rounded-xl mt-1 p-1">
            {organizations.map((org) => (
              <TouchableOpacity
                key={org.id}
                onPress={() => {
                  setOrgId(org.id);
                  setShowOrgPicker(false);
                }}
                className={`p-2.5 rounded-lg ${org.id === orgId ? 'bg-red-50' : ''}`}
              >
                <Text className={`text-xs font-bold ${org.id === orgId ? 'text-red-600' : 'text-gray-800'}`}>
                  {org.name} ({org.category})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Item Details */}
      <View className="space-y-3 mb-4">
        <Text className="text-xs font-bold text-gray-700 uppercase mb-1">
          Información del Objeto *
        </Text>

        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-1">Título del Objeto *</Text>
          <TextInput
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
            }}
            placeholder="Ej: Mueble de sala de 3 piezas"
            className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900"
          />
          {errors.title && <Text className="text-[11px] font-bold text-red-600 mt-1">{errors.title}</Text>}
        </View>

        {/* Category */}
        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-1">Categoría *</Text>
          <TouchableOpacity
            onPress={() => setShowCatPicker(!showCatPicker)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex-row items-center justify-between"
          >
            <Text className="text-xs font-bold text-gray-900">{category}</Text>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </TouchableOpacity>

          {showCatPicker && (
            <View className="bg-white border border-gray-200 rounded-xl mt-1 p-1">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => {
                    setCategory(cat);
                    setShowCatPicker(false);
                  }}
                  className={`p-2 rounded-lg ${cat === category ? 'bg-red-50' : ''}`}
                >
                  <Text className={`text-xs font-bold ${cat === category ? 'text-red-600' : 'text-gray-800'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quantity */}
        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-1">Cantidad *</Text>
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-xl bg-gray-200 items-center justify-center"
            >
              <Text className="font-bold text-base text-gray-800">-</Text>
            </TouchableOpacity>
            <Text className="font-bold text-sm text-gray-900 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl">
              {quantity} {quantity === 1 ? 'unidad' : 'unidades'}
            </Text>
            <TouchableOpacity
              onPress={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-xl bg-gray-200 items-center justify-center"
            >
              <Text className="font-bold text-base text-gray-800">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Condition */}
        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-1">Estado Físico *</Text>
          <View className="flex-row flex-wrap gap-2">
            {CONDITIONS.map((cond) => (
              <TouchableOpacity
                key={cond}
                onPress={() => setCondition(cond)}
                className={`py-2 px-3 rounded-xl border ${
                  condition === cond ? 'bg-red-600 border-red-600' : 'bg-white border-gray-200'
                }`}
              >
                <Text className={`text-xs font-bold ${condition === cond ? 'text-white' : 'text-gray-700'}`}>
                  {cond}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Description */}
        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-1">Descripción *</Text>
          <TextInput
            multiline={true}
            numberOfLines={3}
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            placeholder="Menciona dimensiones, detalles y estado..."
            className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-medium text-gray-900"
          />
        </View>

        {/* Images */}
        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-2">Fotos del Objeto *</Text>
          <View className="flex-row flex-wrap gap-2">
            {images.map((img, idx) => (
              <View key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-200">
                <Image source={{ uri: img }} className="w-full h-full" />
                <TouchableOpacity
                  onPress={() => handleRemoveImage(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/60 rounded-full"
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity
              onPress={handleAddCustomImage}
              className="w-20 h-20 rounded-2xl border-2 border-dashed border-red-300 bg-red-50 items-center justify-center p-2"
            >
              <Plus className="w-5 h-5 text-red-600" />
              <Text className="text-[10px] font-bold text-red-600 mt-1">Agregar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Delivery Method */}
      <View className="space-y-3 mb-4 pt-2 border-t border-gray-100">
        <Text className="text-xs font-bold text-gray-700 uppercase mb-1">
          Método de Entrega / Recogida *
        </Text>

        <View className="flex-row bg-gray-100 p-1 rounded-2xl gap-1">
          <TouchableOpacity
            onPress={() => setDeliveryMethod('recogida_domicilio')}
            className={`flex-1 py-3 items-center rounded-xl ${
              deliveryMethod === 'recogida_domicilio' ? 'bg-white' : ''
            }`}
          >
            <Text className={`text-xs font-bold ${deliveryMethod === 'recogida_domicilio' ? 'text-red-600' : 'text-gray-600'}`}>
              Recogida Domicilio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDeliveryMethod('punto_entrega')}
            className={`flex-1 py-3 items-center rounded-xl ${
              deliveryMethod === 'punto_entrega' ? 'bg-white' : ''
            }`}
          >
            <Text className={`text-xs font-bold ${deliveryMethod === 'punto_entrega' ? 'text-red-600' : 'text-gray-600'}`}>
              Punto de Entrega
            </Text>
          </TouchableOpacity>
        </View>

        {deliveryMethod === 'recogida_domicilio' && (
          <View className="bg-slate-50 p-4 rounded-2xl border border-gray-200 space-y-3 mt-2">
            <View className="mb-2">
              <Text className="text-[11px] font-bold text-gray-600 mb-1">Dirección de Recogida *</Text>
              <TextInput
                value={pickupAddress}
                onChangeText={(text) => setPickupAddress(text)}
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
              />
            </View>

            <View className="mb-2">
              <Text className="text-[11px] font-bold text-gray-600 mb-1">Fecha Conveniente *</Text>
              <TextInput
                value={pickupDate}
                onChangeText={(text) => setPickupDate(text)}
                placeholder="2026-08-10"
                className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
              />
            </View>
          </View>
        )}
      </View>

      {/* Donor Info */}
      <View className="space-y-3 mb-4 pt-2 border-t border-gray-100">
        <Text className="text-xs font-bold text-gray-700 uppercase mb-1">
          Contacto del Donante
        </Text>

        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-1">Nombre Completo *</Text>
          <TextInput
            value={donorName}
            onChangeText={(text) => setDonorName(text)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
          />
        </View>

        <View className="mb-2">
          <Text className="text-[11px] font-bold text-gray-600 mb-1">Teléfono Celular *</Text>
          <TextInput
            value={donorPhone}
            onChangeText={(text) => setDonorPhone(text)}
            keyboardType="phone-pad"
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900"
          />
        </View>

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
      </View>

      {/* Submit */}
      <View className="pt-4 flex-row gap-2 mb-8">
        {onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            className="py-3.5 px-4 rounded-2xl bg-gray-100 items-center justify-center"
          >
            <Text className="text-xs font-bold text-gray-700">Cancelar</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={handleSubmit}
          className="flex-1 py-4 px-6 rounded-2xl bg-red-600 items-center justify-center flex-row gap-2"
        >
          <Heart className="w-5 h-5 text-white fill-white" />
          <Text className="text-sm font-black text-white">Registrar Donación Objeto</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
