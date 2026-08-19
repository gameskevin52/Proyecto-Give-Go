import { useState } from 'react';
import { RegisterAuthUseCase } from '../../../domain/useCases/auth/RegisterAuth';
import { User } from '../../../domain/entities/User';

const RegisterViewModel = (onRegisterSuccess?: (user: User) => void) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState<User>({
    name: '',
    lastname: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'Voluntario',
    tipo_documento: 'CC',
    num_documento: '',
    ciudad: 'Bogotá',
  });

  const onChange = (property: string, value: any) => {
    setValues({
      ...values,
      [property]: value,
    });
    if (errorMessage) setErrorMessage('');
  };

  const resetForm = () => {
    setValues({
      name: '',
      lastname: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      rol: 'Voluntario',
      tipo_documento: 'CC',
      num_documento: '',
      ciudad: 'Bogotá',
    });
  };

  const isValidForm = (): boolean => {
    setErrorMessage('');
    if (!values.name.trim()) {
      setErrorMessage('El nombre es requerido (*)');
      return false;
    }
    if (!values.lastname.trim()) {
      setErrorMessage('El apellido es requerido (*)');
      return false;
    }
    if (!values.email.trim()) {
      setErrorMessage('El correo electrónico es requerido (*)');
      return false;
    }
    if (!values.phone.trim()) {
      setErrorMessage('El teléfono es requerido (*)');
      return false;
    }
    if (!values.password) {
      setErrorMessage('La contraseña es requerida (*)');
      return false;
    }
    if (!values.confirmPassword) {
      setErrorMessage('La confirmación de contraseña es requerida (*)');
      return false;
    }
    if (values.password !== values.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const register = async () => {
    if (!isValidForm()) return;

    setLoading(true);
    setErrorMessage('');
    try {
      const response = await RegisterAuthUseCase(values);
      console.log('Result Register: ', response);
      if (!response.success && !response.ok) {
        setErrorMessage(response.message || response.mensaje || 'Error al registrar el usuario.');
      } else {
        setSuccessMessage('¡Usuario registrado exitosamente en la base de datos!');
        const createdUser = response.data || response.usuario || values;
        if (onRegisterSuccess) {
          onRegisterSuccess(createdUser);
        }
        resetForm();
      }
    } catch (error) {
      setErrorMessage('Error al conectar con la base de datos.');
    } finally {
      setLoading(false);
    }
  };

  return {
    ...values,
    values,
    loading,
    errorMessage,
    successMessage,
    onChange,
    register,
    resetForm,
  };
};

export default RegisterViewModel;
