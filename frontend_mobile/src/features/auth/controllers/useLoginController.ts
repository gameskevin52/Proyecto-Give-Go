import { useState } from 'react';
import { useAuth } from '../../../store/auth/AuthContext';

export const useLoginController = (navigation: any) => {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!correo.trim() || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await login(correo.trim(), password);
      if (!result.success) {
        setErrorMessage(result.message || 'Error al iniciar sesión.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error inesperado al conectar.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegisterVolunteer = () => {
    navigation.navigate('RegisterVolunteer');
  };

  const navigateToRegisterBeneficiary = () => {
    navigation.navigate('RegisterBeneficiary');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return {
    correo,
    setCorreo,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleLogin,
    navigateToRegisterVolunteer,
    navigateToRegisterBeneficiary,
    navigateToForgotPassword,
  };
};

export default useLoginController;
