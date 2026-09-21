import { useState } from 'react';
import { authFeatureService } from '../services/auth.service';

export const useForgotPasswordController = (navigation: any) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [correo, setCorreo] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleVerifyEmail = async () => {
    if (!correo.trim()) {
      setErrorMessage('Por favor ingresa tu correo registrado.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await authFeatureService.forgotPassword({ correo: correo.trim() });
      if (res.success) {
        setVerifiedEmail(correo.trim());
        setStep(2);
        setSuccessMessage('Correo electrónico verificado. Por favor, ingresa tu nueva contraseña.');
      } else {
        setErrorMessage(res.message || 'No se encontró ninguna cuenta con ese correo.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'El correo electrónico no está registrado en Give&Go.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!nuevaPassword || nuevaPassword.length < 6) {
      setErrorMessage('La nueva contraseña debe contener al menos 6 caracteres.');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setErrorMessage('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authFeatureService.forgotPassword({
        correo: verifiedEmail,
        nuevaPassword,
      });

      if (res.success) {
        setSuccessMessage(
          '¡Contraseña actualizada con éxito! Ya puedes iniciar sesión con tu nueva clave.'
        );
        setTimeout(() => {
          navigation.navigate('Login');
        }, 1800);
      } else {
        setErrorMessage(res.message || 'No se pudo actualizar la contraseña.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Error al actualizar la contraseña. Intente nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return {
    step,
    correo,
    setCorreo,
    verifiedEmail,
    nuevaPassword,
    setNuevaPassword,
    confirmarPassword,
    setConfirmarPassword,
    isLoading,
    successMessage,
    errorMessage,
    handleVerifyEmail,
    handleSetNewPassword,
    handleBackToStep1,
    navigateToLogin,
  };
};

export default useForgotPasswordController;

