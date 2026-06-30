import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { EventService, DonationService, DonacionCompleta } from '../../services/db';
import { Evento, Usuario } from '../../types';
import { Button, Input, Card, Table, Badge, Alert, EmptyState, ConfirmDialog, formatCOP, formatDate } from '../../components/UI';
import { Calendar, Heart, Award, ShieldCheck, User, Trash2, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ==========================================
 * 1. VOLUNTEER DASHBOARD
 * ==========================================
 */
export const VolunteerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Evento[]>([]);
  const [myDonations, setMyDonations] = useState<DonacionCompleta[]>([]);

  useEffect(() => {
    if (!user) return;
    async function loadData() {
      const evts = await EventService.getEventsByVolunteer(user.id);
      setMyEvents(evts);

      const dons = await DonationService.getByVolunteer(user.id);
      setMyDonations(dons);
    }
    loadData();
  }, [user]);

  const totalEcon = myDonations
    .filter(d => d.tipo === 'monetaria' && d.monetaria)
    .reduce((sum, d) => sum + (d.monetaria?.valor || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Mi Portal de Voluntariado</h1>
        <p className="text-xs text-neutral-500 mt-1">¡Gracias por tu apoyo! Aquí tienes un resumen de tus participaciones y aportaciones.</p>
      </div>

      {/* Tarjetas de Logros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Mis Inscripciones</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{myEvents.length} Eventos</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-neutral-900">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Donado Económico</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{formatCOP(totalEcon)}</h3>
            </div>
            <div className="p-3 bg-neutral-100 text-neutral-900 rounded">
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Mis Donaciones Totales</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{myDonations.length} Registros</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Próximos Eventos */}
        <Card 
          title="Mis Próximas Campañas"
          headerAction={
            <Link to="/volunteer/events">
              <Button variant="outline" size="sm">Ver Calendario</Button>
            </Link>
          }
        >
          <div className="space-y-4">
            {myEvents.length === 0 ? (
              <div className="text-center py-6 text-xs text-neutral-400 font-medium">
                <p>No estás inscrito en ningún evento de voluntariado actualmente.</p>
                <Link to="/events" className="text-red-600 hover:underline font-bold block mt-2">
                  Explorar causas disponibles &rarr;
                </Link>
              </div>
            ) : (
              myEvents.map((evt) => (
                <div key={evt.id} className="p-3 bg-neutral-50 border border-neutral-150 rounded text-xs flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-neutral-900">{evt.nombre}</h4>
                    <span className="text-[10px] text-neutral-500">Causa: {evt.categoria} | Fecha: {formatDate(evt.fecha)}</span>
                  </div>
                  <Badge variant="success">Inscrito</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Historial Donaciones */}
        <Card 
          title="Mi Historial de Donaciones"
          headerAction={
            <Link to="/donations">
              <Button variant="primary" size="sm">Donar Ahora</Button>
            </Link>
          }
        >
          <div className="space-y-4">
            {myDonations.length === 0 ? (
              <p className="text-xs text-neutral-400 italic text-center py-6">Aún no has registrado donaciones con este usuario.</p>
            ) : (
              myDonations.slice(0, 3).map((don) => (
                <div key={don.id} className="p-3 bg-neutral-50 border border-neutral-150 rounded text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-neutral-800">Donación {don.tipo}</p>
                    <p className="text-[10px] text-neutral-500">Hacia: {don.organizacionNombre} el {formatDate(don.fecha)}</p>
                  </div>
                  <span className="font-bold text-red-600">
                    {don.tipo === 'monetaria' ? `+${formatCOP(don.monetaria?.valor || 0)}` : `${don.objeto?.cantidad} u.`}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

/**
 * ==========================================
 * 2. VOLUNTEER PROFILE
 * ==========================================
 */
export const VolunteerProfile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Usuario>>({
    defaultValues: {
      nombre1: user?.nombre1 || '',
      nombre2: user?.nombre2 || '',
      apellido1: user?.apellido1 || '',
      apellido2: user?.apellido2 || '',
      telefono: user?.telefono || '',
      correo: user?.correo || '',
      password: user?.password || '',
    }
  });

  const onSubmit = async (data: Partial<Usuario>) => {
    setIsLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const result = await updateProfile(data);
    if (result.success) {
      setSuccessMsg('Tu perfil ha sido actualizado con éxito.');
    } else {
      setErrorMsg(result.error || 'Ocurrió un error al actualizar el perfil.');
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Mi Perfil</h1>
        <p className="text-xs text-neutral-500 mt-1">Mantén tus datos personales y credenciales de acceso actualizados.</p>
      </div>

      {successMsg && <Alert type="success" message={successMsg} />}
      {errorMsg && <Alert type="danger" message={errorMsg} />}

      <Card title="Datos de la Cuenta">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primer Nombre"
              error={errors.nombre1?.message}
              {...register('nombre1', { required: 'El primer nombre es requerido' })}
            />
            <Input
              label="Segundo Nombre (Opcional)"
              {...register('nombre2')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primer Apellido"
              error={errors.apellido1?.message}
              {...register('apellido1', { required: 'El primer apellido es requerido' })}
            />
            <Input
              label="Segundo Apellido (Opcional)"
              {...register('apellido2')}
            />
          </div>

          <Input
            label="Número de Teléfono"
            error={errors.telefono?.message}
            {...register('telefono', { required: 'El número de teléfono es obligatorio' })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
            <Input
              label="Correo Electrónico"
              type="email"
              error={errors.correo?.message}
              {...register('correo', { required: 'El correo electrónico es requerido' })}
            />

            <Input
              label="Establecer Nueva Contraseña"
              type="password"
              error={errors.password?.message}
              {...register('password', { required: 'La contraseña no puede quedar en blanco' })}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="primary" type="submit" isLoading={isLoading}>
              Actualizar Perfil
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

/**
 * ==========================================
 * 3. VOLUNTEER EVENTS
 * ==========================================
 */
export const VolunteerEvents: React.FC = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState<Evento[]>([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  useEffect(() => {
    loadMyEvents();
  }, [user]);

  async function loadMyEvents() {
    if (!user) return;
    const list = await EventService.getEventsByVolunteer(user.id);
    setRegisteredEvents(list);
  }

  const handleOpenCancel = (evtId: string) => {
    setSelectedEventId(evtId);
    setIsConfirmOpen(true);
  };

  const handleCancelRegistration = async () => {
    if (user && selectedEventId) {
      await EventService.unregisterParticipant(selectedEventId, user.id);
      loadMyEvents();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Mis Eventos de Voluntariado</h1>
          <p className="text-xs text-neutral-500 mt-1">Revisa el listado de campañas activas donde has confirmado asistencia.</p>
        </div>
        <Link to="/events">
          <Button variant="primary" size="sm">
            Buscar Nuevos Eventos
          </Button>
        </Link>
      </div>

      <Table<Evento>
        headers={['Campaña', 'Categoría', 'Fecha', 'Estado', 'Acciones']}
        data={registeredEvents}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3">
              <span className="font-semibold text-neutral-900">{item.nombre}</span>
              <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{item.descripcion}</p>
            </td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.categoria}</td>
            <td className="px-5 py-3 text-xs text-neutral-600">{formatDate(item.fecha)}</td>
            <td className="px-5 py-3 text-xs">
              <Badge variant="success">Suscrito</Badge>
            </td>
            <td className="px-5 py-3 text-xs">
              <button 
                onClick={() => handleOpenCancel(item.id)} 
                className="p-1.5 rounded text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-4 h-4" />
                <span>Baja</span>
              </button>
            </td>
          </tr>
        )}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCancelRegistration}
        title="Cancelar Inscripción de Voluntariado"
        message="¿Seguro de darte de baja en esta campaña? Al retirarte, el cupo quedará libre para otros voluntarios."
      />
    </div>
  );
};

/**
 * ==========================================
 * 4. VOLUNTEER DONATIONS
 * ==========================================
 */
export const VolunteerDonations: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonacionCompleta[]>([]);

  useEffect(() => {
    if (!user) return;
    async function loadDons() {
      const list = await DonationService.getByVolunteer(user.id);
      setDonations(list);
    }
    loadDons();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Historial de Mis Donaciones</h1>
          <p className="text-xs text-neutral-500 mt-1">Consulta el detalle de todas tus aportaciones benéficas.</p>
        </div>
        <Link to="/donations">
          <Button variant="primary" size="sm">
            Realizar Nueva Donación
          </Button>
        </Link>
      </div>

      <Table<DonacionCompleta>
        headers={['ID Registro', 'Organización Destinataria', 'Causa General', 'Tipo', 'Detalle Donación', 'Fecha de Registro']}
        data={donations}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3 text-[10px] font-mono text-neutral-400">{item.id}</td>
            <td className="px-5 py-3 text-xs font-semibold text-neutral-900">{item.organizacionNombre}</td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.categoria}</td>
            <td className="px-5 py-3 text-xs">
              <Badge variant={item.tipo === 'monetaria' ? 'danger' : 'info'}>
                {item.tipo}
              </Badge>
            </td>
            <td className="px-5 py-3 text-xs">
              {item.tipo === 'monetaria' ? (
                <span className="font-extrabold text-red-600">{formatCOP(item.monetaria?.valor || 0)} ({item.monetaria?.metodo})</span>
              ) : (
                <span className="text-neutral-800 font-medium">{item.objeto?.cantidad} unidades de {item.objeto?.categoria}</span>
              )}
            </td>
            <td className="px-5 py-3 text-xs text-neutral-600">{formatDate(item.fecha)}</td>
          </tr>
        )}
      />
    </div>
  );
};
