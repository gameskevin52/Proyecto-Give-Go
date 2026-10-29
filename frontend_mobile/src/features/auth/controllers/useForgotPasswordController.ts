import { useState } from 'react';
import { authFeatureService } from '../services/auth.service';

export const useForgotPasswordController = (navigation: any) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [verifiedEmail, setVerifiedEmail] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
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
        setSuccessMessage('Hemos enviado un código de 6 dígitos a tu correo electrónico.');
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

  const handleResendCode = async () => {
    if (!verifiedEmail) return;
    setErrorMessage('');
    setSuccessMessage('');
    setIsResending(true);

    try {
      const res = await authFeatureService.forgotPassword({ correo: verifiedEmail });
      if (res.success) {
        setSuccessMessage('Se ha enviado un nuevo código a tu correo electrónico.');
      } else {
        setErrorMessage(res.message || 'No se pudo reenviar el código.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'Error al reenviar el código.'
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleSetNewPassword = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!codigo || codigo.trim().length < 6) {
      setErrorMessage('Por favor ingresa el código de verificación de 6 dígitos.');
      return;
    }

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
        codigo: codigo.trim(),
        nuevaPassword,
      });

      if (res.success) {
        setSuccessMessage(
          'Contraseña actualizada con éxito. Ya puedes iniciar sesión con tu nueva contraseña.'
        );
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        setErrorMessage(res.message || 'El código de verificación es incorrecto o ha expirado.');
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || err.message || 'El código de verificación es inválido o ha expirado.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setCodigo('');
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
    codigo,
    setCodigo,
    verifiedEmail,
    nuevaPassword,
    setNuevaPassword,
    confirmarPassword,
    setConfirmarPassword,
    isLoading,
    isResending,
    successMessage,
    errorMessage,
    handleVerifyEmail,
    handleResendCode,
    handleSetNewPassword,
    handleBackToStep1,
    navigateToLogin,
  };
};

export default useForgotPasswordController;
