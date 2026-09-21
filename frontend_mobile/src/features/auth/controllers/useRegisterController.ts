import { useState } from 'react';
import { useAuth } from '../../../store/auth/AuthContext';

export type RegisterRole = 'Voluntario' | 'Beneficiario' | 'Organizacion';

export const useRegisterController = (navigation: any, initialRole: RegisterRole = 'Voluntario') => {
  const { register, registerOrganization } = useAuth();
  const [role, setRole] = useState<RegisterRole>(initialRole);

  // Common Persona fields (Voluntario / Beneficiario)
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CC');
  const [numDocumento, setNumDocumento] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  
  // Organization fields
  const [orgNombre, setOrgNombre] = useState('');
  const [nit, setNit] = useState('');
  const [representanteLegal, setRepresentanteLegal] = useState('');
  const [categoria, setCategoria] = useState('General');
  const [descripcion, setDescripcion] = useState('');

  // Location fields (Used by all roles)
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [localidad, setLocalidad] = useState('Kennedy');
  const [ciudad, setCiudad] = useState('Bogotá');
  const [departamento, setDepartamento] = useState('Bogotá D.C.');
  const [pais, setPais] = useState('Colombia');
  const [latitud, setLatitud] = useState<number | undefined>(4.6215);
  const [longitud, setLongitud] = useState<number | undefined>(-74.1280);

  // Credentials & Contact
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    if (!correo.trim()) {
      setErrorMessage('El correo electrónico es obligatorio.');
      return;
    }

    setIsLoading(true);

    try {
      if (role === 'Organizacion') {
        if (!orgNombre.trim()) {
          setErrorMessage('El nombre de la organización es obligatorio.');
          setIsLoading(false);
          return;
        }
        if (!direccion.trim()) {
          setErrorMessage('La dirección de la sede es obligatoria.');
          setIsLoading(false);
          return;
        }

        const orgPayload = {
          nombre: orgNombre.trim(),
          direccion: direccion.trim(),
          correo: correo.trim().toLowerCase(),
          password,
          telefono: telefono.trim() || '+57 300 000 0000',
          descripcion: descripcion.trim() || undefined,
          nit: nit.trim() || undefined,
          representante_legal: representanteLegal.trim() || undefined,
          barrio: barrio.trim() || 'Kennedy Central',
          categoria: categoria.trim() || 'Comunitaria',
          latitud: latitud || 4.6215,
          longitud: longitud || -74.1280,
        };

        const result = await registerOrganization(orgPayload);
        if (!result.success) {
          setErrorMessage(result.message || 'Error al completar el registro institucional.');
        }
      } else {
        // Voluntario o Beneficiario (Personas - sin documentos ni tablas geográficas redundantes)
        if (!nombre1.trim()) {
          setErrorMessage('El primer nombre es obligatorio.');
          setIsLoading(false);
          return;
        }
        if (!apellido1.trim()) {
          setErrorMessage('El primer apellido es obligatorio.');
          setIsLoading(false);
          return;
        }

        const userPayload = {
          rol: role.toLowerCase(),
          nombre1: nombre1.trim(),
          nombre2: nombre2.trim() || undefined,
          apellido1: apellido1.trim(),
          apellido2: apellido2.trim() || undefined,
          fecha_nacimiento: fechaNacimiento.trim() || undefined,
          correo: correo.trim().toLowerCase(),
          telefono: telefono.trim() || '+57 300 000 0000',
          direccion: direccion.trim() || undefined,
          barrio: barrio.trim() || 'Kennedy Central',
        };

        const result = await register(userPayload, password);
        if (!result.success) {
          setErrorMessage(result.message || 'Error al completar el registro.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error inesperado durante el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    role,
    setRole,
    nombre1,
    setNombre1,
    nombre2,
    setNombre2,
    apellido1,
    setApellido1,
    apellido2,
    setApellido2,
    tipoDocumento,
    setTipoDocumento,
    numDocumento,
    setNumDocumento,
    fechaNacimiento,
    setFechaNacimiento,
    orgNombre,
    setOrgNombre,
    nit,
    setNit,
    representanteLegal,
    setRepresentanteLegal,
    categoria,
    setCategoria,
    descripcion,
    setDescripcion,
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
    correo,
    setCorreo,
    telefono,
    setTelefono,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    isLoading,
    errorMessage,
    handleRegister,
    navigateToLogin,
  };
};

export default useRegisterController;
