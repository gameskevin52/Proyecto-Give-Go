import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createEventStyles } from '../styles/createEvent.styles';
import { AppInput } from '../../../shared/components/inputs/AppInput';
import { AppButton } from '../../../shared/components/buttons/AppButton';
import { useCreateEventController } from '../controllers/useCreateEventController';

interface CreateEventViewProps {
  navigation: any;
}

export const CreateEventView: React.FC<CreateEventViewProps> = ({ navigation }) => {
  const {
    titulo,
    setTitulo,
    descripcion,
    setDescripcion,
    idCategoria,
    setIdCategoria,
    categorias,
    fechaInicio,
    setFechaInicio,
    horaInicio,
    setHoraInicio,
    horaFin,
    setHoraFin,
    cupoMaximo,
    setCupoMaximo,
    vacantesVoluntarios,
    setVacantesVoluntarios,
    vacantesBeneficiarios,
    setVacantesBeneficiarios,
    ayudaOfrecida,
    setAyudaOfrecida,
    nombreLugar,
    setNombreLugar,
    puntoReferencia,
    setPuntoReferencia,
    direccion,
    setDireccion,
    barrio,
    setBarrio,
    localidad,
    setLocalidad,
    ciudad,
    setCiudad,
    imagenUrl,
    setImagenUrl,
    isLoading,
    errorMessage,
    handleCreate,
    goBack,
  } = useCreateEventController(navigation);

  return (
    <SafeAreaView style={createEventStyles.container}>
      <ScrollView contentContainerStyle={createEventStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={createEventStyles.card}>
          <Text style={createEventStyles.title}>Crear Convocatoria Social</Text>
          <Text style={createEventStyles.subtitle}>
            Organiza jornadas comunitarias, entrega de ayudas y voluntariado en Kennedy y Bogotá
          </Text>

          {errorMessage ? (
            <View style={{ backgroundColor: '#FEE2E2', padding: 12, borderRadius: 8, marginBottom: 16 }}>
              <Text style={{ color: '#991B1B', fontWeight: '700', textAlign: 'center' }}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* 1. Categoría */}
          <Text style={createEventStyles.sectionTitle}>1. Categoría de la Causa</Text>
          <View style={createEventStyles.chipContainer}>
            {categorias.map((cat) => {
              const isActive = idCategoria === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[createEventStyles.chip, isActive && createEventStyles.chipActive]}
                  onPress={() => setIdCategoria(cat.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[createEventStyles.chipText, isActive && createEventStyles.chipTextActive]}>
                    {cat.nombre}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* 2. Información Principal */}
          <Text style={createEventStyles.sectionTitle}>2. Información General</Text>
          <AppInput
            label="Título / Nombre del Evento *"
            placeholder="Ej: Gran Jornada de Alimentos y Ropa"
            value={titulo}
            onChangeText={setTitulo}
          />

          <AppInput
            label="Descripción de la Causa *"
            placeholder="Describe los objetivos, cronograma y qué deben saber los participantes..."
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
          />

          <AppInput
            label="Ayuda Ofrecida (para Beneficiarios)"
            placeholder="Ej: Mercados básicos, kits escolares, atención médica..."
            value={ayudaOfrecida}
            onChangeText={setAyudaOfrecida}
          />

          {/* 3. Fechas y Horarios */}
          <Text style={createEventStyles.sectionTitle}>3. Fecha y Horarios</Text>
          <AppInput
            label="Fecha del Evento (AAAA-MM-DD) *"
            placeholder="2026-09-20"
            value={fechaInicio}
            onChangeText={setFechaInicio}
          />

          <View style={createEventStyles.row}>
            <View style={createEventStyles.halfInput}>
              <AppInput
                label="Hora Inicio"
                placeholder="08:00"
                value={horaInicio}
                onChangeText={setHoraInicio}
              />
            </View>
            <View style={createEventStyles.halfInput}>
              <AppInput
                label="Hora Finalización"
                placeholder="13:00"
                value={horaFin}
                onChangeText={setHoraFin}
              />
            </View>
          </View>

          {/* 4. Cupos y Vacantes */}
          <Text style={createEventStyles.sectionTitle}>4. Cupos y Vacantes</Text>
          <View style={createEventStyles.row}>
            <View style={createEventStyles.halfInput}>
              <AppInput
                label="Cupo Voluntarios"
                placeholder="10"
                value={vacantesVoluntarios}
                onChangeText={setVacantesVoluntarios}
                keyboardType="numeric"
              />
            </View>
            <View style={createEventStyles.halfInput}>
              <AppInput
                label="Cupo Beneficiarios"
                placeholder="20"
                value={vacantesBeneficiarios}
                onChangeText={setVacantesBeneficiarios}
                keyboardType="numeric"
              />
            </View>
          </View>

          <AppInput
            label="Cupo Total Máximo de Asistentes"
            placeholder="30"
            value={cupoMaximo}
            onChangeText={setCupoMaximo}
            keyboardType="numeric"
          />

          {/* 5. Ubicación y Puntos de Encuentro */}
          <Text style={createEventStyles.sectionTitle}>5. Ubicación y Cobertura</Text>
          <AppInput
            label="Nombre del Lugar / Instalación"
            placeholder="Ej: Salón Comunal Timiza / Parque Bellavista"
            value={nombreLugar}
            onChangeText={setNombreLugar}
          />

          <AppInput
            label="Punto de Referencia"
            placeholder="Ej: Diagonal a la estación TransMilenio Banderas"
            value={puntoReferencia}
            onChangeText={setPuntoReferencia}
          />

          <AppInput
            label="Dirección Física *"
            placeholder="Calle 40 Sur # 78 - 12"
            value={direccion}
            onChangeText={setDireccion}
          />

          <View style={createEventStyles.row}>
            <View style={createEventStyles.halfInput}>
              <AppInput
                label="Localidad"
                placeholder="Kennedy"
                value={localidad}
                onChangeText={setLocalidad}
              />
            </View>
            <View style={createEventStyles.halfInput}>
              <AppInput
                label="Barrio"
                placeholder="Castilla / Timiza"
                value={barrio}
                onChangeText={setBarrio}
              />
            </View>
          </View>

          <AppInput
            label="Ciudad"
            placeholder="Bogotá"
            value={ciudad}
            onChangeText={setCiudad}
          />

          <AppInput
            label="URL de Imagen o Banner (Opcional)"
            placeholder="https://ejemplo.com/banner.jpg"
            value={imagenUrl}
            onChangeText={setImagenUrl}
          />

          <AppButton
            title="Publicar Convocatoria"
            onPress={handleCreate}
            isLoading={isLoading}
            style={createEventStyles.submitButton}
          />

          <AppButton
            title="Cancelar"
            variant="ghost"
            onPress={goBack}
            style={createEventStyles.cancelButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateEventView;
