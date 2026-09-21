import { useState, useEffect } from 'react';
import { eventFeatureService } from '../services/event.service';
import { useAuth } from '../../../store/auth/AuthContext';
import { apiClient } from '../../../services/api/apiClient';

export const useCreateEventController = (navigation: any) => {
  const { user } = useAuth();
  
  // General Info
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idCategoria, setIdCategoria] = useState<number>(1);
  const [categorias, setCategorias] = useState<Array<{ id: number; nombre: string }>>([
    { id: 1, nombre: 'Alimentos y Nutrición' },
    { id: 2, nombre: 'Educación y Capacitación' },
    { id: 3, nombre: 'Salud y Bienestar' },
    { id: 4, nombre: 'Medio Ambiente' },
    { id: 5, nombre: 'Cultura y Recreación' },
    { id: 6, nombre: 'Apoyo Social y Comunitario' },
  ]);

  // Date and Time
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('13:00');

  // Vacancies and Capacity
  const [cupoMaximo, setCupoMaximo] = useState('30');
  const [vacantesVoluntarios, setVacantesVoluntarios] = useState('10');
  const [vacantesBeneficiarios, setVacantesBeneficiarios] = useState('20');
  const [ayudaOfrecida, setAyudaOfrecida] = useState('');

  // Physical Location & Geography
  const [nombreLugar, setNombreLugar] = useState('');
  const [puntoReferencia, setPuntoReferencia] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('Kennedy Central');
  const [localidad, setLocalidad] = useState('Kennedy');
  const [ciudad, setCiudad] = useState('Bogotá');
  const [departamento, setDepartamento] = useState('Bogotá D.C.');
  const [pais, setPais] = useState('Colombia');
  const [latitud, setLatitud] = useState<number | null>(4.6215);
  const [longitud, setLongitud] = useState<number | null>(-74.1280);

  // Status & Media
  const [imagenUrl, setImagenUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Load dynamic categories if available
    apiClient.get('/categories')
      .then(res => {
        if (res.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setCategorias(res.data.data.map((c: any) => ({
            id: c.id_categoria || c.id || 1,
            nombre: c.nombre || c.nombre_categoria || 'General'
          })));
        }
      })
      .catch(() => {
        // Fallback to default categories
      });
  }, []);

  const handleCreate = async () => {
    if (!titulo.trim()) {
      setErrorMessage('Por favor ingresa el título o nombre del evento.');
      return;
    }
    if (!descripcion.trim()) {
      setErrorMessage('Por favor describe el objetivo del evento.');
      return;
    }
    if (!fechaInicio.trim()) {
      setErrorMessage('Por favor define la fecha del evento.');
      return;
    }
    if (!direccion.trim()) {
      setErrorMessage('Por favor especifica la dirección de encuentro.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const parsedCupo = parseInt(cupoMaximo, 10) || 30;
      const parsedVol = parseInt(vacantesVoluntarios, 10) || 10;
      const parsedBen = parseInt(vacantesBeneficiarios, 10) || 20;

      await eventFeatureService.create({
        titulo: titulo.trim(),
        nombre: titulo.trim(),
        descripcion: descripcion.trim(),
        id_categoria: idCategoria,
        categoria: idCategoria as any,
        fecha_inicio: fechaInicio.trim(),
        fecha: fechaInicio.trim(),
        hora_inicio: horaInicio.trim() || '08:00',
        hora_fin: horaFin.trim() || '13:00',
        cupo_maximo: parsedCupo,
        cupo: parsedCupo,
        vacantesVoluntarios: parsedVol,
        vacantesBeneficiarios: parsedBen,
        vacantes_voluntarios: parsedVol,
        vacantes_beneficiarios: parsedBen,
        ayudaOfrecida: ayudaOfrecida.trim() || undefined,
        ayuda_ofrecida: ayudaOfrecida.trim() || undefined,
        nombre_lugar: nombreLugar.trim() || undefined,
        punto_referencia: puntoReferencia.trim() || undefined,
        direccion: direccion.trim(),
        barrio: barrio.trim() || undefined,
        localidad: localidad.trim() || 'Kennedy',
        ciudad: ciudad.trim() || 'Bogotá',
        departamento: departamento.trim() || 'Bogotá D.C.',
        pais: pais.trim() || 'Colombia',
        latitud: latitud || 4.6215,
        longitud: longitud || -74.1280,
        imagen_url: imagenUrl.trim() || undefined,
        imagen: imagenUrl.trim() || undefined,
        estado: 'activo',
      });

      navigation.goBack();
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 
        (err.response?.data?.errors && err.response.data.errors[0]?.mensaje) ||
        err.message || 
        'Error al crear el evento.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
    departamento,
    setDepartamento,
    pais,
    setPais,
    latitud,
    setLatitud,
    longitud,
    setLongitud,
    imagenUrl,
    setImagenUrl,
    isLoading,
    errorMessage,
    handleCreate,
    goBack: () => navigation.goBack(),
  };
};

export default useCreateEventController;
