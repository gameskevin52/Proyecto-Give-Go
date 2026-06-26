import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Card, Alert } from '../components/UI';
import { KeyRound, Mail, LogIn } from 'lucide-react';

interface LoginFormData {
  correo: string;
  password?: string;
}

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormData>({});

  const handleLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMsg(null);

    const result = await login(data.correo, data.password || '');
    if (result.success) {
      // Redirigir según el rol del usuario autenticado
      // Necesitamos cargar la sesión actual para ver a dónde va
      const stored = sessionStorage.getItem('gg_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.rol === 'admin') navigate('/admin/dashboard');
        else if (parsed.rol === 'voluntario') navigate('/volunteer/dashboard');
        else if (parsed.rol === 'beneficiario') navigate('/beneficiary/dashboard');
        else if (parsed.rol === 'organizacion') navigate('/org/dashboard');
        else navigate('/');
      } else {
        navigate('/');
      }
    } else {
      setErrorMsg(result.error || 'Correo o contraseña incorrectos.');
      setIsLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setValue('correo', 'admin@giveandgo.com');
    setValue('password', 'Admin123*');
  };

  return (
    <div className="max-w-md mx-auto my-12">
      <Card
        title="Iniciar Sesión"
        subtitle="Accede a tu panel administrativo o área privada de Give&Go"
      >
        <form onSubmit={handleSubmit(handleLoginSubmit)} className="space-y-4">
          {errorMsg && (
            <Alert type="danger" message={errorMsg} />
          )}

          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@giveandgo.com"
            error={errors.correo?.message}
            {...register('correo', { 
              required: 'El correo electrónico es requerido',
              pattern: { value: /^\S+@\S+$/i, message: 'Dirección de correo inválida' }
            })}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password', { 
              required: 'La contraseña es requerida',
              minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
            })}
          />

          <Button 
            variant="primary" 
            type="submit" 
            isLoading={isLoading} 
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Acceder al Sistema
          </Button>

          {/* Botón rápido para pruebas del administrador */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 text-center">Acceso rápido para demostración</span>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={fillAdminCredentials}
              className="w-full bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700"
            >
              Cargar Cuenta Admin
            </Button>
          </div>

          <div className="text-center text-xs text-neutral-500 pt-2">
            ¿Aún no tienes cuenta?{' '}
            <Link to="/register" className="text-red-600 font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
