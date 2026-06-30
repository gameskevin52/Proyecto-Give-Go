import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { EventService, DonationService, CategoryService, DonacionCompleta } from '../../services/db';
import { Evento, Usuario, Categoria } from '../../types';
import { Button, Input, Select, Card, Table, Badge, Modal, ConfirmDialog, Textarea, EmptyState, formatCOP, formatDate } from '../../components/UI';
import { Calendar, Heart, Users, Plus, Edit, Trash2, Mail, Phone, Box } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * ==========================================
 * 1. ORGANIZATION DASHBOARD
 * ==========================================
 */
export const OrgDashboard: React.FC = () => {
  const { user } = useAuth();
  const [eventsCount, setEventsCount] = useState(0);
  const [receivedDonations, setReceivedDonations] = useState<DonacionCompleta[]>([]);
  const [volunteersCount, setVolunteersCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    async function loadStats() {
      // Filtrar eventos de esta organización
      const allEvents = await EventService.getAll();
      const orgEvents = allEvents.filter(e => e.organizacionId === user.id);
      setEventsCount(orgEvents.length);

      // Filtrar donaciones recibidas
      const dons = await DonationService.getByOrganization(user.id);
      setReceivedDonations(dons);

      // Contar voluntarios inscritos en eventos de esta organización
      let volSum = 0;
      for (const evt of orgEvents) {
        const parts = await EventService.getParticipants(evt.id);
        volSum += parts.length;
      }
      setVolunteersCount(volSum);
    }
    loadStats();
  }, [user]);

  const totalFunds = receivedDonations
    .filter(d => d.tipo === 'monetaria' && d.monetaria)
    .reduce((sum, d) => sum + (d.monetaria?.valor || 0), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Panel Organizativo</h1>
        <p className="text-xs text-neutral-500 mt-1">Administra tus causas sociales, revisa a tus voluntarios y audita las donaciones recibidas.</p>
      </div>

      {/* Grid de métricas de la ONG */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
        <Card className="border-l-4 border-l-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Nuestros Eventos</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{eventsCount} Campañas</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-neutral-900">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Fondos Recibidos</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{formatCOP(totalFunds)}</h3>
            </div>
            <div className="p-3 bg-neutral-100 text-neutral-900 rounded">
              <Heart className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Voluntarios Registrados</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{volunteersCount} Personas</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donaciones Recientes Recibidas */}
        <Card title="Últimos Fondos y Materiales Recibidos">
          <div className="space-y-4">
            {receivedDonations.length === 0 ? (
              <p className="text-xs text-neutral-400 italic text-center py-6">Aún no has recibido donaciones mediante la plataforma.</p>
            ) : (
              receivedDonations.slice(-3).reverse().map((don) => (
                <div key={don.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded border border-neutral-150 text-xs">
                  <div>
                    <p className="font-bold text-neutral-900">{don.usuarioNombre}</p>
                    <p className="text-[10px] text-neutral-500">Causa: {don.categoria} | Tipo: {don.tipo}</p>
                  </div>
                  <div className="text-right">
                    {don.tipo === 'monetaria' ? (
                      <span className="font-extrabold text-red-600">+{formatCOP(don.monetaria?.valor || 0)}</span>
                    ) : (
                      <span className="font-semibold text-neutral-800">{don.objeto?.cantidad} x {don.objeto?.categoria}</span>
                    )}
                    <p className="text-[9px] text-neutral-400">{formatDate(don.fecha)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Guías rápidas de acción */}
        <Card title="Recursos Rápidos para el Gestor">
          <div className="space-y-3 text-xs leading-relaxed text-neutral-600">
            <p>1. <strong>Crea un evento atractivo</strong>: Describe la campaña con metas claras e indica fecha y hora de encuentro.</p>
            <p>2. <strong>Contacto con el Voluntario</strong>: En la sección de voluntarios puedes consultar correos y números telefónicos para conformar canales de comunicación directos.</p>
            <p>3. <strong>Gestión de Categorías</strong>: Si necesitas dar soporte a una nueva causa humanitaria, contacta con el administrador del sistema.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

/**
 * ==========================================
 * 2. ORGANIZATION EVENTS
 * ==========================================
 */
export const OrgEvents: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Evento[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);

  // Confirm
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Omit<Evento, 'id' | 'organizacionId'>>();

  useEffect(() => {
    loadMyEvents();
  }, [user]);

  async function loadMyEvents() {
    if (!user) return;
    const allEvents = await EventService.getAll();
    setEvents(allEvents.filter(e => e.organizacionId === user.id));

    const cats = await CategoryService.getAll();
    setCategories(cats.filter(c => c.estado === 'activo'));
  }

  const handleOpenCreate = () => {
    setEditingEvent(null);
    reset({
      nombre: '',
      categoria: categories[0]?.nombre || '',
      descripcion: '',
      fecha: '',
      estado: 'activo'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: Evento) => {
    setEditingEvent(evt);
    setValue('nombre', evt.nombre);
    setValue('categoria', evt.categoria);
    setValue('descripcion', evt.descripcion);
    setValue('fecha', evt.fecha);
    setValue('estado', evt.estado);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Omit<Evento, 'id' | 'organizacionId'>) => {
    if (!user) return;

    if (editingEvent) {
      await EventService.update(editingEvent.id, {
        ...data,
        organizacionId: user.id
      });
    } else {
      await EventService.create({
        ...data,
        organizacionId: user.id
      });
    }

    loadMyEvents();
    setIsModalOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setEventToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      await EventService.delete(eventToDelete);
      loadMyEvents();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Mis Eventos / Campañas</h1>
          <p className="text-xs text-neutral-500 mt-1">Crea y edita tus convocatorias de voluntariado e indica requerimientos.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Crear Evento
        </Button>
      </div>

      <Table<Evento>
        headers={['Campaña', 'Categoría', 'Fecha Programada', 'Estado', 'Acciones']}
        data={events}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50 text-xs">
            <td className="px-5 py-3">
              <span className="font-bold text-neutral-900 text-sm">{item.nombre}</span>
              <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{item.descripcion}</p>
            </td>
            <td className="px-5 py-3 font-semibold text-neutral-600">{item.categoria}</td>
            <td className="px-5 py-3 font-medium text-neutral-600">{formatDate(item.fecha)}</td>
            <td className="px-5 py-3">
              <Badge variant={item.estado === 'activo' ? 'success' : 'neutral'}>
                {item.estado}
              </Badge>
            </td>
            <td className="px-5 py-3 flex gap-2">
              <button onClick={() => handleOpenEdit(item)} className="p-1 rounded text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleOpenDelete(item.id)} className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre de la Convocatoria / Campaña"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Categoría"
              options={categories.map(c => ({ value: c.nombre, label: c.nombre }))}
              {...register('categoria')}
            />

            <Input
              type="date"
              label="Fecha del Evento"
              error={errors.fecha?.message}
              {...register('fecha', { required: 'La fecha es obligatoria' })}
            />
          </div>

          <Select
            label="Estado Inicial de la Convocatoria"
            options={[
              { value: 'activo', label: 'Activo / Abierto para inscripción' },
              { value: 'finalizado', label: 'Finalizado' },
              { value: 'cancelado', label: 'Cancelado' },
            ]}
            {...register('estado')}
          />

          <Textarea
            label="Descripción detallada de la labor y punto de encuentro"
            error={errors.descripcion?.message}
            {...register('descripcion', { required: 'La descripción es obligatoria' })}
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Guardar Evento
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Convocatoria"
        message="¿Está seguro de eliminar de forma permanente esta convocatoria? No podrá recuperarse."
      />
    </div>
  );
};

/**
 * ==========================================
 * 3. ORGANIZATION CAMPAIGNS (DONATIONS RECEIVED)
 * ==========================================
 */
export const OrgCampaigns: React.FC = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonacionCompleta[]>([]);

  useEffect(() => {
    if (!user) return;
    async function loadDonations() {
      const list = await DonationService.getByOrganization(user.id);
      setDonations(list);
    }
    loadDonations();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Donaciones Recibidas</h1>
        <p className="text-xs text-neutral-500 mt-1">Consulta los registros de apoyo y los fondos que los voluntarios han destinado a tu sede.</p>
      </div>

      <Table<DonacionCompleta>
        headers={['ID Registro', 'Donante', 'Categoría de Causa', 'Tipo', 'Aportación Recibida', 'Fecha']}
        data={donations}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50 text-xs">
            <td className="px-5 py-3 font-mono text-neutral-400">{item.id}</td>
            <td className="px-5 py-3 font-bold text-neutral-900">{item.usuarioNombre}</td>
            <td className="px-5 py-3 font-medium text-neutral-600">{item.categoria}</td>
            <td className="px-5 py-3">
              <Badge variant={item.tipo === 'monetaria' ? 'danger' : 'info'}>
                {item.tipo}
              </Badge>
            </td>
            <td className="px-5 py-3">
              {item.tipo === 'monetaria' ? (
                <span className="font-extrabold text-red-600">+{formatCOP(item.monetaria?.valor || 0)} ({item.monetaria?.metodo})</span>
              ) : (
                <span className="text-neutral-800 font-semibold">{item.objeto?.cantidad} u. de {item.objeto?.categoria}</span>
              )}
            </td>
            <td className="px-5 py-3 text-neutral-500 font-medium">{formatDate(item.fecha)}</td>
          </tr>
        )}
      />
    </div>
  );
};

/**
 * ==========================================
 * 4. ORGANIZATION VOLUNTEERS
 * ==========================================
 */
interface VolunteerAssoc {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  eventoNombre: string;
}

export const OrgVolunteers: React.FC = () => {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState<VolunteerAssoc[]>([]);

  useEffect(() => {
    if (!user) return;
    async function loadVolunteers() {
      const allEvents = await EventService.getAll();
      const orgEvents = allEvents.filter(e => e.organizacionId === user.id);
      
      const assocList: VolunteerAssoc[] = [];

      for (const evt of orgEvents) {
        const parts = await EventService.getParticipants(evt.id);
        parts.forEach(p => {
          assocList.push({
            id: `${evt.id}_${p.id}`,
            nombre: `${p.nombre1} ${p.apellido1}`,
            correo: p.correo,
            telefono: p.telefono,
            eventoNombre: evt.nombre,
          });
        });
      }

      setVolunteers(assocList);
    }
    loadVolunteers();
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Nuestros Voluntarios Inscritos</h1>
        <p className="text-xs text-neutral-500 mt-1">Lista completa de voluntarios que se han registrado para asistir a tus campañas activas.</p>
      </div>

      <Table<VolunteerAssoc>
        headers={['Voluntario', 'Campaña en la que participa', 'Correo Electrónico', 'Número de Teléfono']}
        data={volunteers}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50 text-xs">
            <td className="px-5 py-3 font-bold text-neutral-900">{item.nombre}</td>
            <td className="px-5 py-3 font-semibold text-red-600">{item.eventoNombre}</td>
            <td className="px-5 py-3 font-medium text-neutral-600 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>{item.correo}</span>
            </td>
            <td className="px-5 py-3 font-medium text-neutral-600">
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span>{item.telefono}</span>
              </div>
            </td>
          </tr>
        )}
      />
    </div>
  );
};
