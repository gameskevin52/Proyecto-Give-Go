import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { UserService } from '../services/db';
import { Button, Input, Card, Alert } from '../components/UI';
import { KeyRound, Mail, CheckCircle2, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';

interface ForgotFormData {
  correo: string;
  codigo?: string;
  nuevaPassword?: string;
  confirmarPassword?: string;
}

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [verifiedEmail, setVerifiedEmail] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<ForgotFormData>({
    defaultValues: {
      correo: '',
      codigo: '',
      nuevaPassword: '',
      confirmarPassword: '',
    }
  });

  const watchedPassword = watch('nuevaPassword');

  // Si el usuario llega desde el enlace del correo electrónico con parámetros
  useEffect(() => {
    const emailParam = searchParams.get('email');
    const codeParam = searchParams.get('code') || searchParams.get('token');

    if (emailParam) {
      setValue('correo', emailParam);
      setVerifiedEmail(emailParam);
      if (codeParam) {
        setValue('codigo', codeParam);
        setStep(2);
        setSuccessMsg('Verificación automática iniciada desde el enlace de tu correo. Ingresa tu nueva contraseña.');
      }
    }
  }, [searchParams, setValue]);

  // Paso 1: Solicitar código al correo electrónico
  const handleStep1Submit = async (data: ForgotFormData) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await UserService.forgotPassword(data.correo.trim());
      setVerifiedEmail(data.correo.trim());
      setStep(2);
      setSuccessMsg('Hemos enviado un código de 6 dígitos a tu correo electrónico. Por favor, revisa tu bandeja de entrada o spam.');
    } catch (err: any) {
      setErrorMsg(err.message || 'El correo electrónico no está registrado en el sistema.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reenviar código
  const handleResendCode = async () => {
    if (!verifiedEmail) return;
    setIsResending(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await UserService.forgotPassword(verifiedEmail);
      setSuccessMsg('Se ha enviado un nuevo código de 6 dígitos a tu correo electrónico.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al reenviar el código. Intenta nuevamente.');
    } finally {
      setIsResending(false);
    }
  };

  // Paso 2: Restablecer contraseña con código y nueva clave
  const handleStep2Submit = async (data: ForgotFormData) => {
    if (!data.codigo || data.codigo.trim().length < 6) {
      setErrorMsg('Ingresa el código de verificación completo de 6 dígitos.');
      return;
    }
    if (data.nuevaPassword !== data.confirmarPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await UserService.forgotPassword(
        verifiedEmail,
        data.nuevaPassword,
        data.codigo.trim()
      );
      setSuccessMsg('Contraseña actualizada con éxito. Redirigiendo al inicio de sesión...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'El código de verificación es inválido o ha expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <Card
        title="Recuperar Contraseña"
        subtitle={
          step === 1
            ? "Ingresa tu correo registrado para recibir el código de verificación"
            : "Ingresa el código recibido en tu correo y tu nueva contraseña"
        }
      >
        <div className="mb-4 flex items-center justify-between">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio de sesión
          </Link>

          {step === 2 && (
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Cambiar correo
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="mb-4">
            <Alert type="danger" message={errorMsg} />
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 rounded-xl font-medium flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSubmit(handleStep1Submit)} className="space-y-4">
            <Input
              label="Correo Electrónico Registrado *"
              type="email"
              placeholder="ejemplo@giveandgo.com"
              error={errors.correo?.message}
              {...register('correo', {
                required: 'El correo electrónico es requerido',
                pattern: { value: /^\S+@\S+$/i, message: 'Dirección de correo inválida' }
              })}
            />

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
              <span className="font-semibold text-neutral-800 block mb-1">Envío seguro por correo</span>
              Recibirás un código de 6 dígitos desde <strong className="text-emerald-700">soportegiveandgo@gmail.com</strong> para validar tu identidad de forma segura.
            </div>

            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
            >
              <Mail className="w-4 h-4 mr-2" />
              Enviar Código al Correo
            </Button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(handleStep2Submit)} className="space-y-4">
            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 text-xs text-emerald-900 font-medium flex items-center justify-between">
              <div>
                Código enviado a: <span className="font-bold">{verifiedEmail}</span>
              </div>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                Reenviar
              </button>
            </div>

            <Input
              label="Código de Verificación (6 dígitos) *"
              type="text"
              placeholder="Ej: 482910"
              maxLength={6}
              className="font-mono tracking-widest text-center text-lg font-bold"
              error={errors.codigo?.message}
              {...register('codigo', {
                required: 'El código de 6 dígitos es requerido',
                minLength: { value: 6, message: 'El código debe tener 6 dígitos' },
                maxLength: { value: 6, message: 'El código debe tener 6 dígitos' }
              })}
            />

            <Input
              label="Nueva Contraseña *"
              type="password"
              placeholder="Mínimo 6 caracteres"
              error={errors.nuevaPassword?.message}
              {...register('nuevaPassword', {
                required: 'La nueva contraseña es requerida',
                minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              })}
            />

            <Input
              label="Confirmar Nueva Contraseña *"
              type="password"
              placeholder="Repite tu nueva contraseña"
              error={errors.confirmarPassword?.message}
              {...register('confirmarPassword', {
                required: 'Debes confirmar la contraseña',
                validate: value => value === watchedPassword || 'Las contraseñas no coinciden'
              })}
            />

            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
            >
              <KeyRound className="w-4 h-4 mr-2" />
              Restablecer Contraseña
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
export default ForgotPassword;
