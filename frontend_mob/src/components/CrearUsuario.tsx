import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Loader2,
  ArrowLeft,
  HeartHandshake,
  UserCheck,
  Building2,
  AlertCircle
} from 'lucide-react';
import { UsuarioForm, FormErrors, PasswordValidation, UserRole, DocumentType, UsuarioDB } from '../types';

interface CrearUsuarioProps {
  onVolverInicio: () => void;
  onIrAIniciarSesion: () => void;
  onUsuarioRegistrado?: (usuario: UsuarioDB) => void;
}

export const CrearUsuario: React.FC<CrearUsuarioProps> = ({ 
  onVolverInicio,
  onIrAIniciarSesion,
  onUsuarioRegistrado
}) => {
  // Form State
  const [formData, setFormData] = useState<UsuarioForm>({
    rol: 'Voluntario',
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    tipo_documento: 'CC',
    num_documento: '',
    fecha_nacimiento: '',
    telefono: '',
    correo: '',
    password: '',
    confirmPassword: '',
    direccion: '',
    barrio: '',
    localidad: '',
    ciudad: 'Bogotá',
    departamento: 'Bogotá D.C.',
    pais: 'Colombia',
    codigo_postal: '',
    foto: '',
    biografia: '',
    sitio_web: '',
    mision: '',
    vision: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState<UsuarioDB | null>(null);

  // Password Validation Rules
  const passwordValidation: PasswordValidation = useMemo(() => {
    const p = formData.password;
    return {
      hasMinLength: p.length >= 8,
      hasUppercase: /[A-Z]/.test(p),
      hasNumber: /[0-9]/.test(p),
      hasSymbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p)
    };
  }, [formData.password]);

  const isPasswordValid = 
    passwordValidation.hasMinLength && 
    passwordValidation.hasUppercase && 
    passwordValidation.hasNumber && 
    passwordValidation.hasSymbol;

  // Handle Input Changes
  const handleChange = (field: keyof UsuarioForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setServerError(null);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Form Validation
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre1.trim()) {
      newErrors.nombre1 = 'El primer nombre es obligatorio';
    }
    if (!formData.apellido1.trim()) {
      newErrors.apellido1 = 'El primer apellido es obligatorio';
    }
    if (!formData.num_documento.trim()) {
      newErrors.num_documento = 'El número de documento es obligatorio';
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = 'Formato de correo no válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (!isPasswordValid) {
      newErrors.password = 'La contraseña debe cumplir todos los requisitos de seguridad';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Conexión real con la API Backend (/api/registro)
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setServerError(data.mensaje || 'Ocurrió un error al registrar el usuario');
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setRegisteredUser(data.usuario);
      setShowSuccessModal(true);

      if (onUsuarioRegistrado) {
        onUsuarioRegistrado(data.usuario);
      }
    } catch (err) {
      console.error('Error al conectar con el backend:', err);
      setServerError('No se pudo conectar con el servidor. Verifique su conexión.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 bg-white text-slate-800 pb-8 animate-fade-in flex flex-col font-sans">
      {/* Top Mobile Bar Header */}
      <div className="bg-red-600 text-white px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-xs">
        <button
          onClick={onVolverInicio}
          className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
        <span className="font-bold text-xs tracking-tight">Crear Usuario</span>
        <div className="w-10"></div>
      </div>

      <div className="px-5 pt-4 pb-6 space-y-4">
        {/* Encabezado sin caja agrupada */}
        <div className="mb-2">
          <h1 className="text-lg font-bold text-slate-900">Registro de Usuario</h1>
          <p className="text-xs text-slate-500">Completa tus datos personales para unirte a Give&Go</p>
        </div>

        {/* Mensaje de Error del Servidor / Backend */}
        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Formulario Continuo Sin Cajas ni Contenedores Agrupados */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
          
          {/* Selección de Rol */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tipo de Perfil <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Voluntario', 'Beneficiario', 'Organizacion'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleChange('rol', r)}
                  className={`py-2 px-1 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    formData.rol === r 
                      ? 'border-red-600 bg-red-50 text-red-700 font-bold ring-1 ring-red-600'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r === 'Voluntario' && <HeartHandshake className="w-4 h-4 text-red-600" />}
                  {r === 'Beneficiario' && <UserCheck className="w-4 h-4 text-red-600" />}
                  {r === 'Organizacion' && <Building2 className="w-4 h-4 text-red-600" />}
                  <span className="text-[11px]">{r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Primer Nombre y Segundo Nombre */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Primer Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Juan"
                value={formData.nombre1}
                onChange={(e) => handleChange('nombre1', e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none bg-slate-50/50 focus:bg-white focus:border-red-600 ${
                  errors.nombre1 ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                }`}
              />
              {errors.nombre1 && <p className="text-[10px] text-red-500 mt-0.5">{errors.nombre1}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Segundo Nombre
              </label>
              <input
                type="text"
                placeholder="Carlos"
                value={formData.nombre2}
                onChange={(e) => handleChange('nombre2', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:bg-white focus:border-red-600"
              />
            </div>
          </div>

          {/* Apellidos */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Primer Apellido <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Pérez"
                value={formData.apellido1}
                onChange={(e) => handleChange('apellido1', e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none bg-slate-50/50 focus:bg-white focus:border-red-600 ${
                  errors.apellido1 ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                }`}
              />
              {errors.apellido1 && <p className="text-[10px] text-red-500 mt-0.5">{errors.apellido1}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Segundo Apellido
              </label>
              <input
                type="text"
                placeholder="Gómez"
                value={formData.apellido2}
                onChange={(e) => handleChange('apellido2', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:bg-white focus:border-red-600"
              />
            </div>
          </div>

          {/* Tipo y Número de Documento */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tipo Doc.</label>
              <select
                value={formData.tipo_documento}
                onChange={(e) => handleChange('tipo_documento', e.target.value as DocumentType)}
                className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-slate-50 focus:bg-white focus:border-red-600"
              >
                <option value="CC">CC</option>
                <option value="CE">CE</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="NIT">NIT</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                N° Documento <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="1019283745"
                value={formData.num_documento}
                onChange={(e) => handleChange('num_documento', e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none bg-slate-50/50 focus:bg-white focus:border-red-600 ${
                  errors.num_documento ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                }`}
              />
              {errors.num_documento && <p className="text-[10px] text-red-500 mt-0.5">{errors.num_documento}</p>}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Teléfono / Celular <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              placeholder="300 123 4567"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none bg-slate-50/50 focus:bg-white focus:border-red-600 ${
                errors.telefono ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
              }`}
            />
            {errors.telefono && <p className="text-[10px] text-red-500 mt-0.5">{errors.telefono}</p>}
          </div>

          {/* Correo Electrónico */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              value={formData.correo}
              onChange={(e) => handleChange('correo', e.target.value)}
              className={`w-full px-3 py-2 text-xs rounded-xl border outline-none bg-slate-50/50 focus:bg-white focus:border-red-600 ${
                errors.correo ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
              }`}
            />
            {errors.correo && <p className="text-[10px] text-red-500 mt-0.5">{errors.correo}</p>}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full pl-3 pr-8 py-2 text-xs rounded-xl border outline-none bg-slate-50/50 focus:bg-white focus:border-red-600 ${
                  errors.password ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Checklist simple de seguridad para la contraseña */}
            <div className="mt-1.5 p-2 bg-slate-50 rounded-lg text-[10px] space-y-0.5 border border-slate-100">
              <div className="grid grid-cols-2 gap-1 text-[9px]">
                <span className={passwordValidation.hasMinLength ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  • Min. 8 caracteres
                </span>
                <span className={passwordValidation.hasUppercase ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  • 1 Mayúscula
                </span>
                <span className={passwordValidation.hasNumber ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  • 1 Número
                </span>
                <span className={passwordValidation.hasSymbol ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                  • 1 Símbolo (!@#$)
                </span>
              </div>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 mt-0.5">{errors.password}</p>}
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Confirmar Contraseña <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`w-full pl-3 pr-8 py-2 text-xs rounded-xl border outline-none bg-slate-50/50 focus:bg-white focus:border-red-600 ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50/50' : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-0.5">{errors.confirmPassword}</p>}
          </div>

          {/* Dirección y Ciudad */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dirección</label>
              <input
                type="text"
                placeholder="Calle 100 # 15-20"
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:bg-white focus:border-red-600"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Ciudad</label>
              <input
                type="text"
                value={formData.ciudad}
                onChange={(e) => handleChange('ciudad', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none bg-slate-50/50 focus:bg-white focus:border-red-600"
              />
            </div>
          </div>

          {/* Botón de Enviar */}
          <div className="pt-3 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando en base de datos...</span>
                </>
              ) : (
                <span>Registrarse</span>
              )}
            </button>

            <button
              type="button"
              onClick={onIrAIniciarSesion}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-all text-center cursor-pointer"
            >
              ¿Ya tienes cuenta? <span className="text-red-600 font-bold">Iniciar Sesión</span>
            </button>
          </div>
        </form>
      </div>

      {/* CONFIRMATION MODAL */}
      <AnimatePresence>
        {showSuccessModal && registeredUser && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-xs w-full p-5 shadow-2xl text-center space-y-3"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">¡Registro Guardado en BD!</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Cuenta creada como <strong className="text-slate-800">{registeredUser.rol}</strong> con éxito.
                </p>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] text-left space-y-0.5">
                <p><span className="text-slate-400">ID Usuario:</span> <strong>#{registeredUser.id_usuario}</strong></p>
                <p><span className="text-slate-400">Nombre:</span> <strong>{registeredUser.nombre1} {registeredUser.apellido1}</strong></p>
                <p><span className="text-slate-400">Correo:</span> <strong>{registeredUser.correo}</strong></p>
              </div>

              <button
                onClick={onIrAIniciarSesion}
                className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors cursor-pointer"
              >
                Ir a Iniciar Sesión
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
