import { useEffect, useState } from 'react';
import { LoginAuthUseCase } from '../../../domain/useCases/auth/LoginAuth';
import { SaveUserUseCase } from '../../../domain/useCases/userLocal/SaveUserLocal';
import { useUserLocal } from '../../hooks/useUserLocal';
import { User } from '../../../domain/entities/User';

const HomeViewModel = (onLoginSuccess?: (user: User) => void) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const { user, getUserSession } = useUserLocal();

  useEffect(() => {
    getUserSession();
  }, []);

  const onChange = (property: string, value: any) => {
    setValues({
      ...values,
      [property]: value,
    });
    if (errorMessage) setErrorMessage('');
  };

  const isValidForm = () => {
    setErrorMessage('');
    if (values.email.trim() === '') {
      setErrorMessage('El correo electrónico es requerido');
      return false;
    }
    if (values.password === '') {
      setErrorMessage('La contraseña es requerida');
      return false;
    }
    return true;
  };

  const login = async () => {
    if (!isValidForm()) return;

    setLoading(true);
    setErrorMessage('');
    try {
      const response = await LoginAuthUseCase(values.email, values.password);
      if (!response.success && !response.ok) {
        setErrorMessage(response.message || response.mensaje || 'Credenciales incorrectas.');
      } else {
        const loggedUser: User = response.data || response.usuario;
        if (loggedUser) {
          await SaveUserUseCase(loggedUser);
          await getUserSession();
          setSuccessMessage('¡Bienvenido a Give&Go!');
          if (onLoginSuccess) {
            onLoginSuccess(loggedUser);
          }
        }
      }
    } catch (err) {
      setErrorMessage('Error de red o servidor no disponible.');
    } finally {
      setLoading(false);
    }
  };

  return {
    ...values,
    user,
    loading,
    errorMessage,
    successMessage,
    onChange,
    login,
    setErrorMessage,
  };
};

export default HomeViewModel;
