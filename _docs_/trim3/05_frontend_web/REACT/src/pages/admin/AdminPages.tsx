import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  UserService, 
  OrganizationService, 
  EventService, 
  DonationService, 
  CategoryService,
  RequestService,
  DonacionCompleta
} from '../../services/db';
import { Usuario, Organizacion, Evento, Categoria, UserRole } from '../../types';
import { 
  Button, 
  Input, 
  Select, 
  Card, 
  Modal, 
  Table, 
  Badge, 
  Alert, 
  ConfirmDialog, 
  SearchBar, 
  Pagination, 
  EmptyState,
  Textarea
} from '../../components/UI';
import { 
  Users, 
  Building2, 
  Calendar, 
  Heart, 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  TrendingUp, 
  Eye,
  AlertCircle
} from 'lucide-react';

/**
 * ==========================================
 * 1. ADMIN DASHBOARD
 * ==========================================
 */
export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    orgsCount: 0,
    eventsCount: 0,
    donationsCount: 0,
    monetaryTotal: 0,
    requestsCount: 0,
  });
  const [latestDonations, setLatestDonations] = useState<DonacionCompleta[]>([]);
  const [latestEvents, setLatestEvents] = useState<Evento[]>([]);

  useEffect(() => {
    async function loadStats() {
      const users = await UserService.getAll();
      const orgs = await OrganizationService.getAll();
      const events = await EventService.getAll();
      const donations = await DonationService.getAll();
      const requests = await RequestService.getAll();

      const monetaryVal = donations
        .filter(d => d.tipo === 'monetaria' && d.monetaria)
        .reduce((sum, d) => sum + (d.monetaria?.valor || 0), 0);

      setStats({
        usersCount: users.length,
        orgsCount: orgs.length,
        eventsCount: events.length,
        donationsCount: donations.length,
        monetaryTotal: monetaryVal,
        requestsCount: requests.length,
      });

      setLatestDonations(donations.slice(-4).reverse());
      setLatestEvents(events.slice(-3).reverse());
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Dashboard de Administración</h1>
        <p className="text-xs text-neutral-500 mt-1">Monitorea el estado de Give&Go y consulta métricas de participación.</p>
      </div>

      {/* Grid de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none">
        <Card className="border-l-4 border-l-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Usuarios Totales</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{stats.usersCount}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-neutral-900">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Organizaciones</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{stats.orgsCount}</h3>
            </div>
            <div className="p-3 bg-neutral-100 text-neutral-900 rounded">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-red-600">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Eventos Activos</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{stats.eventsCount}</h3>
            </div>
            <div className="p-3 bg-red-50 text-red-600 rounded">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-neutral-900">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Fondos Recaudados</p>
              <h3 className="text-2xl font-black text-neutral-900 mt-1">{stats.monetaryTotal}€</h3>
            </div>
            <div className="p-3 bg-neutral-100 text-neutral-900 rounded">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Donaciones recientes */}
        <Card title="Últimas Donaciones Registradas">
          <div className="space-y-4">
            {latestDonations.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No hay donaciones registradas.</p>
            ) : (
              latestDonations.map((don) => (
                <div key={don.id} className="flex justify-between items-center p-3 bg-neutral-50 rounded border border-neutral-150 text-xs">
                  <div>
                    <p className="font-semibold text-neutral-900">{don.usuarioNombre}</p>
                    <p className="text-[10px] text-neutral-500">Causa: {don.categoria} | Hacia: {don.organizacionNombre}</p>
                  </div>
                  <div className="text-right">
                    {don.tipo === 'monetaria' ? (
                      <span className="font-extrabold text-red-600 text-sm">+{don.monetaria?.valor}€</span>
                    ) : (
                      <span className="font-semibold text-neutral-800">{don.objeto?.cantidad} x {don.objeto?.categoria}</span>
                    )}
                    <p className="text-[9px] text-neutral-400 mt-0.5">{don.fecha}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Campañas recientes */}
        <Card title="Campañas Benéficas del Mes">
          <div className="space-y-4">
            {latestEvents.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No hay eventos benéficos registrados.</p>
            ) : (
              latestEvents.map((evt) => (
                <div key={evt.id} className="p-3 bg-neutral-50 rounded border border-neutral-150 text-xs space-y-1">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-neutral-800">{evt.nombre}</span>
                    <Badge variant={evt.estado === 'activo' ? 'success' : 'neutral'}>
                      {evt.estado}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-neutral-500 line-clamp-1">{evt.descripcion}</p>
                  <div className="flex justify-between text-[9px] text-neutral-400 pt-1">
                    <span>Categoría: {evt.categoria}</span>
                    <span>Fecha: {evt.fecha}</span>
                  </div>
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
 * 2. ADMIN USERS
 * ==========================================
 */
export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  
  // Confirm Dialog
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Omit<Usuario, 'id'>>();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    const list = await UserService.getAll();
    setUsers(list);
  }

  const handleOpenCreate = () => {
    setEditingUser(null);
    reset({
      nombre1: '',
      nombre2: '',
      apellido1: '',
      apellido2: '',
      correo: '',
      password: '',
      telefono: '',
      rol: 'voluntario',
      estado: 'activo'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: Usuario) => {
    setEditingUser(user);
    setValue('nombre1', user.nombre1);
    setValue('nombre2', user.nombre2 || '');
    setValue('apellido1', user.apellido1);
    setValue('apellido2', user.apellido2 || '');
    setValue('correo', user.correo);
    setValue('telefono', user.telefono);
    setValue('rol', user.rol);
    setValue('estado', user.estado);
    setValue('password', user.password || '');
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Omit<Usuario, 'id'>) => {
    if (editingUser) {
      await UserService.update(editingUser.id, data);
    } else {
      await UserService.create(data);
    }
    loadUsers();
    setIsModalOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setUserToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      await UserService.delete(userToDelete);
      loadUsers();
    }
  };

  // Filtrado
  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return (
      u.nombre1.toLowerCase().includes(term) ||
      u.apellido1.toLowerCase().includes(term) ||
      u.correo.toLowerCase().includes(term) ||
      u.rol.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Gestión de Usuarios</h1>
          <p className="text-xs text-neutral-500 mt-1">Administra accesos, roles y el estado de voluntarios y beneficiarios.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Registrar Usuario
        </Button>
      </div>

      <div className="bg-white border border-neutral-200 p-4 rounded shadow-xs flex items-center justify-between gap-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por nombre, correo..." />
      </div>

      <Table<Usuario>
        headers={['Nombre Completo', 'Correo Electrónico', 'Teléfono', 'Rol', 'Estado', 'Acciones']}
        data={filteredUsers}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3 font-semibold text-neutral-950">
              {item.nombre1} {item.nombre2} {item.apellido1} {item.apellido2}
            </td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.correo}</td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.telefono}</td>
            <td className="px-5 py-3 text-xs">
              <Badge variant={item.rol === 'admin' ? 'danger' : item.rol === 'organizacion' ? 'info' : 'success'}>
                {item.rol}
              </Badge>
            </td>
            <td className="px-5 py-3 text-xs">
              <Badge variant={item.estado === 'activo' ? 'success' : 'neutral'}>
                {item.estado}
              </Badge>
            </td>
            <td className="px-5 py-3 text-xs flex gap-2">
              <button onClick={() => handleOpenEdit(item)} className="p-1 rounded text-neutral-500 hover:text-neutral-950 hover:bg-neutral-100">
                <Edit className="w-4 h-4" />
              </button>
              {item.id !== 'user_admin' && (
                <button onClick={() => handleOpenDelete(item.id)} className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </td>
          </tr>
        )}
      />

      {/* Modal Formulario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? 'Editar Datos de Usuario' : 'Registrar Nuevo Usuario'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primer Nombre"
              error={errors.nombre1?.message}
              {...register('nombre1', { required: 'El nombre es obligatorio' })}
            />
            <Input
              label="Segundo Nombre"
              {...register('nombre2')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Primer Apellido"
              error={errors.apellido1?.message}
              {...register('apellido1', { required: 'El apellido es obligatorio' })}
            />
            <Input
              label="Segundo Apellido"
              {...register('apellido2')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Correo electrónico"
              type="email"
              error={errors.correo?.message}
              {...register('correo', { required: 'El correo electrónico es obligatorio' })}
            />
            <Input
              label="Contraseña"
              type="password"
              {...register('password', { required: editingUser ? false : 'La contraseña es obligatoria' })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Número de Teléfono"
              error={errors.telefono?.message}
              {...register('telefono', { required: 'El teléfono es obligatorio' })}
            />
            <Select
              label="Rol Asignado"
              options={[
                { value: 'voluntario', label: 'Voluntario' },
                { value: 'beneficiario', label: 'Beneficiario' },
                { value: 'organizacion', label: 'Organización' },
                { value: 'admin', label: 'Administrador' },
              ]}
              {...register('rol')}
            />
          </div>

          <Select
            label="Estado"
            options={[
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' },
            ]}
            {...register('estado')}
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Guardar Datos
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message="¿Está completamente seguro de eliminar este usuario? Sus credenciales de acceso quedarán inhabilitadas inmediatamente."
      />
    </div>
  );
};

/**
 * ==========================================
 * 3. ADMIN ORGANIZATIONS
 * ==========================================
 */
export const AdminOrganizations: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organizacion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organizacion | null>(null);
  
  // Confirm
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orgToDelete, setOrgToDelete] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Omit<Organizacion, 'id'>>();

  useEffect(() => {
    loadOrgs();
  }, []);

  async function loadOrgs() {
    const list = await OrganizationService.getAll();
    setOrganizations(list);
  }

  const handleOpenCreate = () => {
    setEditingOrg(null);
    reset({ nombre: '', direccion: '', correo: '', password: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (org: Organizacion) => {
    setEditingOrg(org);
    setValue('nombre', org.nombre);
    setValue('direccion', org.direccion);
    setValue('correo', org.correo);
    setValue('password', org.password || '');
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Omit<Organizacion, 'id'>) => {
    if (editingOrg) {
      await OrganizationService.update(editingOrg.id, data);
    } else {
      await OrganizationService.create(data);
    }
    loadOrgs();
    setIsModalOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setOrgToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (orgToDelete) {
      await OrganizationService.delete(orgToDelete);
      loadOrgs();
    }
  };

  const filteredOrgs = organizations.filter(o => 
    o.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.correo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Gestión de Organizaciones</h1>
          <p className="text-xs text-neutral-500 mt-1">Controla los perfiles institucionales de ONGs y fundaciones asociadas.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Registrar Organización
        </Button>
      </div>

      <div className="bg-white border border-neutral-200 p-4 rounded shadow-xs">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por organización, sede, email..." />
      </div>

      <Table<Organizacion>
        headers={['Id', 'Nombre de la ONG', 'Dirección Sede', 'Correo de Contacto', 'Acciones']}
        data={filteredOrgs}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3 text-xs font-semibold text-neutral-500">{item.id}</td>
            <td className="px-5 py-3 font-semibold text-neutral-900">{item.nombre}</td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.direccion}</td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.correo}</td>
            <td className="px-5 py-3 text-xs flex gap-2">
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
        title={editingOrg ? 'Editar Organización' : 'Registrar Nueva Sede/ONG'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Razón Social / Nombre ONG"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />

          <Input
            label="Dirección de la Sede"
            error={errors.direccion?.message}
            {...register('direccion', { required: 'La dirección es obligatoria' })}
          />

          <Input
            label="Correo de la Organización"
            type="email"
            error={errors.correo?.message}
            {...register('correo', { required: 'El correo es obligatorio' })}
          />

          <Input
            label="Contraseña"
            type="password"
            {...register('password', { required: editingOrg ? false : 'La contraseña es obligatoria' })}
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Guardar Datos
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Sede Organizativa"
        message="¿Está seguro de eliminar esta organización de la plataforma? Todos los eventos coordinados por esta sede quedarán huérfanos."
      />
    </div>
  );
};

/**
 * ==========================================
 * 4. ADMIN EVENTS
 * ==========================================
 */
export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Evento[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [organizations, setOrganizations] = useState<Organizacion[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);

  // Confirm
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Omit<Evento, 'id'>>();

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    const list = await EventService.getAll();
    setEvents(list);

    const cats = await CategoryService.getAll();
    setCategories(cats);

    const orgs = await OrganizationService.getAll();
    setOrganizations(orgs);
  }

  const handleOpenCreate = () => {
    setEditingEvent(null);
    reset({
      nombre: '',
      categoria: categories[0]?.nombre || '',
      descripcion: '',
      fecha: '',
      estado: 'activo',
      organizacionId: organizations[0]?.id || ''
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
    setValue('organizacionId', evt.organizacionId);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Omit<Evento, 'id'>) => {
    if (editingEvent) {
      await EventService.update(editingEvent.id, data);
    } else {
      await EventService.create(data);
    }
    loadAll();
    setIsModalOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setEventToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      await EventService.delete(eventToDelete);
      loadAll();
    }
  };

  const getOrgName = (orgId: string) => {
    return organizations.find(o => o.id === orgId)?.nombre || 'Organización';
  };

  const filteredEvents = events.filter(e => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Gestión de Eventos</h1>
          <p className="text-xs text-neutral-500 mt-1">Supervisa y autoriza campañas de reforestación, comedores y soporte social.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Crear Evento
        </Button>
      </div>

      <div className="bg-white border border-neutral-200 p-4 rounded shadow-xs">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por evento, categoría..." />
      </div>

      <Table<Evento>
        headers={['Campaña', 'Categoría', 'ONG Responsable', 'Fecha', 'Estado', 'Acciones']}
        data={filteredEvents}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3">
              <p className="font-semibold text-neutral-900">{item.nombre}</p>
              <p className="text-[10px] text-neutral-500 line-clamp-1">{item.descripcion}</p>
            </td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.categoria}</td>
            <td className="px-5 py-3 text-xs text-neutral-600 font-medium">{getOrgName(item.organizacionId)}</td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.fecha}</td>
            <td className="px-5 py-3 text-xs">
              <Badge variant={item.estado === 'activo' ? 'success' : 'neutral'}>
                {item.estado}
              </Badge>
            </td>
            <td className="px-5 py-3 text-xs flex gap-2">
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
        title={editingEvent ? 'Editar Evento de Voluntariado' : 'Crear Nuevo Evento'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Título del Evento / Campaña"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El título es obligatorio' })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Organización Organizadora"
              options={organizations.map(o => ({ value: o.id, label: o.nombre }))}
              {...register('organizacionId')}
            />

            <Select
              label="Categoría Temática"
              options={categories.map(c => ({ value: c.nombre, label: c.nombre }))}
              {...register('categoria')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Fecha Programada"
              error={errors.fecha?.message}
              {...register('fecha', { required: 'La fecha es obligatoria' })}
            />

            <Select
              label="Estado de la Campaña"
              options={[
                { value: 'activo', label: 'Activo / Abierto' },
                { value: 'finalizado', label: 'Finalizado' },
                { value: 'cancelado', label: 'Cancelado' },
              ]}
              {...register('estado')}
            />
          </div>

          <Textarea
            label="Descripción detallada"
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
        title="Eliminar Evento"
        message="¿Está seguro de eliminar esta campaña de voluntariado? Todos los registros de asistencia de los voluntarios se borrarán permanentemente."
      />
    </div>
  );
};

/**
 * ==========================================
 * 5. ADMIN DONATIONS
 * ==========================================
 */
export const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<DonacionCompleta[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [donationToDelete, setDonationToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadDonations();
  }, []);

  async function loadDonations() {
    const list = await DonationService.getAll();
    setDonations(list);
  }

  const handleDelete = (id: string) => {
    setDonationToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (donationToDelete) {
      await DonationService.delete(donationToDelete);
      loadDonations();
    }
  };

  const filteredDonations = donations.filter(d => 
    d.usuarioNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.organizacionNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Historial de Donaciones</h1>
        <p className="text-xs text-neutral-500 mt-1">Supervisa y verifica todas las aportaciones económicas y de insumos.</p>
      </div>

      <div className="bg-white border border-neutral-200 p-4 rounded shadow-xs">
        <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar por donante, ONG, categoría..." />
      </div>

      <Table<DonacionCompleta>
        headers={['ID', 'Donante', 'ONG Destinataria', 'Categoría', 'Tipo', 'Detalle Aportado', 'Fecha', 'Acción']}
        data={filteredDonations}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3 text-[10px] font-mono text-neutral-400">{item.id}</td>
            <td className="px-5 py-3 font-semibold text-neutral-900 text-xs">{item.usuarioNombre}</td>
            <td className="px-5 py-3 text-xs text-neutral-600 font-medium">{item.organizacionNombre}</td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.categoria}</td>
            <td className="px-5 py-3 text-xs">
              <Badge variant={item.tipo === 'monetaria' ? 'danger' : 'info'}>
                {item.tipo}
              </Badge>
            </td>
            <td className="px-5 py-3 text-xs">
              {item.tipo === 'monetaria' ? (
                <span className="font-extrabold text-red-600">{item.monetaria?.valor}€ ({item.monetaria?.metodo})</span>
              ) : (
                <span className="text-neutral-800 font-medium">{item.objeto?.cantidad} u. de {item.objeto?.categoria}</span>
              )}
            </td>
            <td className="px-5 py-3 text-xs text-neutral-600">{item.fecha}</td>
            <td className="px-5 py-3 text-xs">
              <button onClick={() => handleDelete(item.id)} className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        )}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Cancelar Donación"
        message="¿Está seguro de anular y borrar este registro de donación? Esto modificará los históricos del sistema."
      />
    </div>
  );
};

/**
 * ==========================================
 * 6. ADMIN CATEGORIES
 * ==========================================
 */
export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Categoria | null>(null);

  // Confirm
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<string | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<Omit<Categoria, 'id'>>();

  useEffect(() => {
    loadCats();
  }, []);

  async function loadCats() {
    const list = await CategoryService.getAll();
    setCategories(list);
  }

  const handleOpenCreate = () => {
    setEditingCat(null);
    reset({ nombre: '', descripcion: '', estado: 'activo' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Categoria) => {
    setEditingCat(cat);
    setValue('nombre', cat.nombre);
    setValue('descripcion', cat.descripcion);
    setValue('estado', cat.estado);
    setIsModalOpen(true);
  };

  const onSubmit = async (data: Omit<Categoria, 'id'>) => {
    if (editingCat) {
      await CategoryService.update(editingCat.id, data);
    } else {
      await CategoryService.create(data);
    }
    loadCats();
    setIsModalOpen(false);
  };

  const handleOpenDelete = (id: string) => {
    setCatToDelete(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (catToDelete) {
      await CategoryService.delete(catToDelete);
      loadCats();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 uppercase tracking-wider">Gestión de Categorías</h1>
          <p className="text-xs text-neutral-500 mt-1">Administra las etiquetas operativas de los eventos y donaciones.</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1" />
          Registrar Categoría
        </Button>
      </div>

      <Table<Categoria>
        headers={['ID', 'Categoría', 'Descripción', 'Estado', 'Acciones']}
        data={categories}
        renderRow={(item) => (
          <tr key={item.id} className="hover:bg-neutral-50">
            <td className="px-5 py-3 text-xs font-mono text-neutral-400">{item.id}</td>
            <td className="px-5 py-3 font-semibold text-neutral-950">{item.nombre}</td>
            <td className="px-5 py-3 text-xs text-neutral-600 max-w-sm">{item.descripcion}</td>
            <td className="px-5 py-3 text-xs">
              <Badge variant={item.estado === 'activo' ? 'success' : 'neutral'}>
                {item.estado}
              </Badge>
            </td>
            <td className="px-5 py-3 text-xs flex gap-2">
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
        title={editingCat ? 'Editar Categoría' : 'Crear Nueva Categoría'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nombre de Categoría"
            error={errors.nombre?.message}
            {...register('nombre', { required: 'El nombre es requerido' })}
          />

          <Textarea
            label="Descripción General"
            error={errors.descripcion?.message}
            {...register('descripcion', { required: 'La descripción es requerida' })}
          />

          <Select
            label="Estado"
            options={[
              { value: 'activo', label: 'Activo' },
              { value: 'inactivo', label: 'Inactivo' },
            ]}
            {...register('estado')}
          />

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Guardar Categoría
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Categoría"
        message="¿Está seguro de eliminar esta categoría del sistema?"
      />
    </div>
  );
};
