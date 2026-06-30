import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, Input, Select, Card, Alert } from '../components/UI';
import { UserPlus, User, Building2, ShieldAlert } from 'lucide-react';

interface RegisterFormData {
  rol: 'voluntario' | 'beneficiario' | 'organizacion';
  // Campos de persona
  nombre1: string;
  nombre2?: string;
  apellido1: string;
  apellido2?: string;
  telefono: string;
  correo: string;
  password?: string;
  // Campos de organización
  orgNombre?: string;
  orgDireccion?: string;
}

export const Register: React.FC = () => {
  const { register, registerOrg } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedRole, setSelectedRole] = useState<'voluntario' | 'beneficiario' | 'organizacion'>('voluntario');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register: formRegister, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      rol: 'voluntario',
    }
  });

  const formRole = watch('rol');

  useEffect(() => {
    // Escuchar el cambio en el select de react-hook-form para actualizar estado local
    if (formRole) {
      setSelectedRole(formRole);
    }
  }, [formRole]);

  useEffect(() => {
    // Sincronizar parámetro query ?role=
    const roleParam = searchParams.get('role');
    if (roleParam === 'vol') {
      setValue('rol', 'voluntario');
      setSelectedRole('voluntario');
    } else if (roleParam === 'ben') {
      setValue('rol', 'beneficiario');
      setSelectedRole('beneficiario');
    } else if (roleParam === 'org') {
      setValue('rol', 'organizacion');
      setSelectedRole('organizacion');
    }
  }, [searchParams, setValue]);

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (data.rol === 'organizacion') {
        const result = await registerOrg(
          data.orgNombre || '',
          data.orgDireccion || '',
          data.correo,
          data.password || ''
        );

        if (result.success) {
          navigate('/org/dashboard');
        } else {
          setErrorMsg(result.error || 'Error al registrar organización');
        }
      } else {
        const result = await register({
          rol: data.rol,
          nombre1: data.nombre1,
          nombre2: data.nombre2 || '',
          apellido1: data.apellido1,
          apellido2: data.apellido2 || '',
          telefono: data.telefono,
          correo: data.correo,
          password: data.password || ''
        });

        if (result.success) {
          if (data.rol === 'voluntario') navigate('/volunteer/dashboard');
          else if (data.rol === 'beneficiario') navigate('/beneficiary/dashboard');
        } else {
          setErrorMsg(result.error || 'Error al registrar usuario');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error inesperado durante el registro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-8">
      <Card
        title="Crear una Cuenta"
        subtitle="Únete hoy mismo a la comunidad solidaria de Give&Go"
      >
        <form onSubmit={handleSubmit(handleRegisterSubmit)} className="space-y-4">
          {errorMsg && (
            <Alert type="danger" message={errorMsg} />
          )}

          {/* Selector de Rol */}
          <Select
            label="Tipo de Cuenta / Rol"
            options={[
              { value: 'voluntario', label: 'Voluntario (Quiero participar en eventos y donar)' },
              { value: 'beneficiario', label: 'Beneficiario (Quiero solicitar asistencia social)' },
              { value: 'organizacion', label: 'Organización (Gestiono eventos y causas)' },
            ]}
            {...formRegister('rol')}
          />

          <hr className="border-neutral-100 my-4" />

          {/* Formulario Dinámico para Organización */}
          {selectedRole === 'organizacion' ? (
            <div className="space-y-4">
              <div className="bg-red-50 p-3 rounded border border-red-200 text-xs text-red-800 font-semibold mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 shrink-0" />
                <span>Registra tu asociación civil, fundación u ONG oficial</span>
              </div>
              
              <Input
                label="Nombre de la Organización"
                placeholder="Ej: Fundación Manos por Kennedy"
                error={errors.orgNombre?.message}
                {...formRegister('orgNombre', { 
                  required: selectedRole === 'organizacion' ? 'El nombre de la organización es obligatorio' : false,
                  minLength: { value: 3, message: 'El nombre debe tener al menos 3 caracteres' }
                })}
              />

              <Input
                label="Dirección Física de la Sede"
                placeholder="Calle 38 Sur # 78-45, Kennedy, Bogotá D.C."
                error={errors.orgDireccion?.message}
                {...formRegister('orgDireccion', { 
                  required: selectedRole === 'organizacion' ? 'La dirección de la sede es requerida' : false 
                })}
              />
            </div>
          ) : (
            /* Formulario Dinámico para Voluntario o Beneficiario */
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Primer Nombre"
                  placeholder="Carlos"
                  error={errors.nombre1?.message}
                  {...formRegister('nombre1', { required: 'El primer nombre es obligatorio' })}
                />
                <Input
                  label="Segundo Nombre (Opcional)"
                  placeholder="Andrés"
                  {...formRegister('nombre2')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Primer Apellido"
                  placeholder="Mendoza"
                  error={errors.apellido1?.message}
                  {...formRegister('apellido1', { required: 'El primer apellido es obligatorio' })}
                />
                <Input
                  label="Segundo Apellido (Opcional)"
                  placeholder="Castro"
                  {...formRegister('apellido2')}
                />
              </div>

              <Input
                label="Número de Teléfono"
                placeholder="Ej: +57 300 123 4567"
                error={errors.telefono?.message}
                {...formRegister('telefono', { required: 'El número de teléfono es obligatorio' })}
              />
            </div>
          )}

          {/* Campos Comunes de Acceso */}
          <div className="border-t border-neutral-100 pt-4 space-y-4">
            <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">Credenciales de Acceso</span>
            
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="ejemplo@correo.com"
              error={errors.correo?.message}
              {...formRegister('correo', { 
                required: 'El correo electrónico es obligatorio',
                pattern: { value: /^\S+@\S+$/i, message: 'Formato de correo inválida' }
              })}
            />

            <Input
              label="Establecer Contraseña"
              type="password"
              placeholder="Min. 6 caracteres"
              error={errors.password?.message}
              {...formRegister('password', { 
                required: 'La contraseña es requerida',
                minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
              })}
            />
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            isLoading={isLoading} 
            className="w-full mt-2"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Crear Cuenta y Acceder
          </Button>

          <div className="text-center text-xs text-neutral-500 pt-2">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link to="/login" className="text-red-600 font-semibold hover:underline">
              Iniciar Sesión
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};
