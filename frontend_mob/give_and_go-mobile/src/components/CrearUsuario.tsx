import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  ArrowLeft,
  User,
  HeartHandshake,
  UserCheck,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { UsuarioForm, FormErrors, PasswordValidation, UserRole, DocumentType, UsuarioDB } from '../types';

interface CrearUsuarioProps {
  onVolverInicio: () => void;
  onIrAIniciarSesion: () => void;
  onUsuarioRegistrado?: (usuario: UsuarioDB) => void;
}

const EXISTING_EMAILS = [
  'admin@giveandgo.org',
  'contacto@fundacion.org',
  'voluntario@ejemplo.com'
];

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
    } else if (EXISTING_EMAILS.includes(formData.correo.toLowerCase().trim())) {
      newErrors.correo = 'Este correo electrónico ya está registrado';
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

  const mockEncryptPassword = (pass: string): string => {
    return `$2b$10$eG${btoa(pass).substring(0, 12)}...`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Registro rápido completado en menos de 3 segundos (1.1s)
    setTimeout(() => {
      const nuevoUsuario: UsuarioDB = {
        id_usuario: Math.floor(Math.random() * 9000) + 1000,
        rol: formData.rol,
        nombre1: formData.nombre1,
        nombre2: formData.nombre2 || null,
        apellido1: formData.apellido1,
        apellido2: formData.apellido2 || null,
        tipo_documento: formData.tipo_documento,
        num_documento: formData.num_documento,
        fecha_nacimiento: formData.fecha_nacimiento || null,
        telefono: formData.telefono,
        correo: formData.correo.toLowerCase().trim(),
        password_cifrada: mockEncryptPassword(formData.password),
        direccion: formData.direccion || null,
        barrio: formData.barrio || null,
        localidad: formData.localidad || null,
        ciudad: formData.ciudad || 'Bogotá',
        departamento: formData.departamento || 'Bogotá D.C.',
        pais: formData.pais || 'Colombia',
        codigo_postal: formData.codigo_postal || null,
        foto: null,
        biografia: formData.biografia || null,
        sitio_web: formData.sitio_web || null,
        mision: formData.mision || null,
        vision: formData.vision || null,
        estado: 1,
        fecha_registro: new Date().toISOString()
      };

      setIsSubmitting(false);
      setRegisteredUser(nuevoUsuario);
      setShowSuccessModal(true);

      if (onUsuarioRegistrado) {
        onUsuarioRegistrado(nuevoUsuario);
      }
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12 animate-fade-in">
      {/* Top Header */}
      <div className="bg-red-600 text-white px-5 py-4 sticky top-0 z-30 shadow-sm flex items-center justify-between">
        <button
          onClick={onVolverInicio}
          className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
        <span className="font-bold text-sm">Crear Usuario - Give&Go</span>
        <div className="w-12"></div>
      </div>

      <div className="max-w-md mx-auto p-5 space-y-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-1 text-center">
          <h1 className="text-xl font-extrabold text-slate-900">Formulario de Registro</h1>
          <p className="text-xs text-slate-500">Ingresa tus datos básicos para crear tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* ROL / TIPO DE PERFIL */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Selecciona tu Rol
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Voluntario', 'Beneficiario', 'Organizacion'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => handleChange('rol', r)}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1 transition-all ${
                    formData.rol === r 
                      ? 'border-red-600 bg-red-50 text-red-700 font-bold ring-1 ring-red-600'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {r === 'Voluntario' && <HeartHandshake className="w-4 h-4 text-red-600" />}
                  {r === 'Beneficiario' && <UserCheck className="w-4 h-4 text-red-600" />}
                  {r === 'Organizacion' && <Building2 className="w-4 h-4 text-red-600" />}
                  <span className="text-xs">{r}</span>
                </button>
              ))}
            </div>
          </div>

          {/* DATOS PERSONALES */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Datos Personales
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primer Nombre <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. Juan"
                  value={formData.nombre1}
                  onChange={(e) => handleChange('nombre1', e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    errors.nombre1 ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-red-600'
                  }`}
                />
                {errors.nombre1 && <p className="text-[11px] text-red-500 mt-1">{errors.nombre1}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Segundo Nombre
                </label>
                <input
                  type="text"
                  placeholder="Ej. Carlos"
                  value={formData.nombre2}
                  onChange={(e) => handleChange('nombre2', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-red-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Primer Apellido <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. Pérez"
                  value={formData.apellido1}
                  onChange={(e) => handleChange('apellido1', e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    errors.apellido1 ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-red-600'
                  }`}
                />
                {errors.apellido1 && <p className="text-[11px] text-red-500 mt-1">{errors.apellido1}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Segundo Apellido
                </label>
                <input
                  type="text"
                  placeholder="Ej. Rodríguez"
                  value={formData.apellido2}
                  onChange={(e) => handleChange('apellido2', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-red-600 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tipo Doc.</label>
                <select
                  value={formData.tipo_documento}
                  onChange={(e) => handleChange('tipo_documento', e.target.value as DocumentType)}
                  className="w-full px-2 py-2 text-xs rounded-xl border border-slate-200 focus:border-red-600 outline-none bg-white"
                >
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  N° Documento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="101923849"
                  value={formData.num_documento}
                  onChange={(e) => handleChange('num_documento', e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    errors.num_documento ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-red-600'
                  }`}
                />
                {errors.num_documento && <p className="text-[11px] text-red-500 mt-1">{errors.num_documento}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="300 123 4567"
                value={formData.telefono}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                  errors.telefono ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-red-600'
                }`}
              />
              {errors.telefono && <p className="text-[11px] text-red-500 mt-1">{errors.telefono}</p>}
            </div>
          </div>

          {/* CREDENCIALES (CORREO Y CONTRASEÑA) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Correo y Contraseña
            </label>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={formData.correo}
                onChange={(e) => handleChange('correo', e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                  errors.correo ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-red-600'
                }`}
              />
              {errors.correo && <p className="text-[11px] text-red-500 mt-1">{errors.correo}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className={`w-full pl-3 pr-8 py-2 text-xs rounded-xl border outline-none ${
                    errors.password ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-red-600'
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

              {/* Indicadores de requisitos de contraseña */}
              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] space-y-1">
                <span className="font-semibold text-slate-600">Requisitos:</span>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <span className={passwordValidation.hasMinLength ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    • Mínimo 8 caracteres
                  </span>
                  <span className={passwordValidation.hasUppercase ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    • 1 Letra mayúscula
                  </span>
                  <span className={passwordValidation.hasNumber ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    • 1 Número (0-9)
                  </span>
                  <span className={passwordValidation.hasSymbol ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    • 1 Símbolo (!@#$)
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Confirmar Contraseña <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-red-600'
                }`}
              />
              {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* UBICACIÓN */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              4. Ubicación
            </label>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Dirección</label>
              <input
                type="text"
                placeholder="Calle 100 # 15-20"
                value={formData.direccion}
                onChange={(e) => handleChange('direccion', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-red-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Barrio</label>
                <input
                  type="text"
                  placeholder="Ej. Chapinero"
                  value={formData.barrio}
                  onChange={(e) => handleChange('barrio', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-red-600 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  value={formData.ciudad}
                  onChange={(e) => handleChange('ciudad', e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-red-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* BOTÓN PRINCIPAL REGISTRARSE */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-600/20 transition-all flex items-center justify-center gap-2 active:scale-98 disabled:opacity-75 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando registro...</span>
                </>
              ) : (
                <span>Registrarse</span>
              )}
            </button>

            <button
              type="button"
              onClick={onIrAIniciarSesion}
              className="w-full py-3 px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all text-center"
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
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">¡Registro Completado!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tu cuenta de <strong className="text-slate-800">{registeredUser.rol}</strong> se ha registrado con éxito.
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-left space-y-1">
                <p><span className="text-slate-400">Nombre:</span> <strong>{registeredUser.nombre1} {registeredUser.apellido1}</strong></p>
                <p><span className="text-slate-400">Correo:</span> <strong>{registeredUser.correo}</strong></p>
              </div>

              <button
                onClick={onIrAIniciarSesion}
                className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors"
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
