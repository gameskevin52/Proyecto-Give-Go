import { 
  Usuario, 
  Organizacion, 
  Evento, 
  SeguimientoEvento, 
  Donacion, 
  DonacionMonetaria, 
  DonacionObjeto, 
  Categoria, 
  Solicitud 
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_ORGANIZATIONS, 
  INITIAL_ORG_USERS,
  INITIAL_CATEGORIES, 
  INITIAL_EVENTS, 
  INITIAL_REQUESTS, 
  INITIAL_DONATIONS, 
  INITIAL_DONATIONS_MONETARY, 
  INITIAL_DONATIONS_OBJECTS 
} from '../mockData/initialData';

// Claves de LocalStorage
const KEYS = {
  USERS: 'gg_users',
  ORGANIZATIONS: 'gg_organizations',
  EVENTS: 'gg_events',
  TRACKING: 'gg_tracking',
  DONATIONS: 'gg_donations',
  DONATIONS_MONETARY: 'gg_donations_monetary',
  DONATIONS_OBJECTS: 'gg_donations_objects',
  CATEGORIES: 'gg_categories',
  REQUESTS: 'gg_requests',
};

// Función de inicialización
export function initializeDB() {
  if (!localStorage.getItem(KEYS.USERS)) {
    // Combinar usuarios normales y usuarios de organizaciones para login simplificado
    const allUsers = [...INITIAL_USERS, ...INITIAL_ORG_USERS];
    localStorage.setItem(KEYS.USERS, JSON.stringify(allUsers));
  }
  if (!localStorage.getItem(KEYS.ORGANIZATIONS)) {
    localStorage.setItem(KEYS.ORGANIZATIONS, JSON.stringify(INITIAL_ORGANIZATIONS));
  }
  if (!localStorage.getItem(KEYS.EVENTS)) {
    localStorage.setItem(KEYS.EVENTS, JSON.stringify(INITIAL_EVENTS));
  }
  if (!localStorage.getItem(KEYS.TRACKING)) {
    localStorage.setItem(KEYS.TRACKING, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.DONATIONS)) {
    localStorage.setItem(KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
  }
  if (!localStorage.getItem(KEYS.DONATIONS_MONETARY)) {
    localStorage.setItem(KEYS.DONATIONS_MONETARY, JSON.stringify(INITIAL_DONATIONS_MONETARY));
  }
  if (!localStorage.getItem(KEYS.DONATIONS_OBJECTS)) {
    localStorage.setItem(KEYS.DONATIONS_OBJECTS, JSON.stringify(INITIAL_DONATIONS_OBJECTS));
  }
  if (!localStorage.getItem(KEYS.CATEGORIES)) {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(KEYS.REQUESTS)) {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
}

// Ejecutar la inicialización inmediatamente al importar
initializeDB();

// Métodos auxiliares genéricos (simulación de latencia de red)
const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

function getFromStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function saveToStorage<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * SERVICIOS DE USUARIO
 */
export const UserService = {
  async getAll(): Promise<Usuario[]> {
    await delay();
    return getFromStorage<Usuario>(KEYS.USERS);
  },

  async getById(id: string): Promise<Usuario | undefined> {
    await delay();
    const users = getFromStorage<Usuario>(KEYS.USERS);
    return users.find(u => u.id === id);
  },

  async getByEmail(correo: string): Promise<Usuario | undefined> {
    await delay();
    const users = getFromStorage<Usuario>(KEYS.USERS);
    return users.find(u => u.correo.toLowerCase() === correo.toLowerCase());
  },

  async create(user: Omit<Usuario, 'id'>): Promise<Usuario> {
    await delay();
    const users = getFromStorage<Usuario>(KEYS.USERS);
    const newUser: Usuario = {
      ...user,
      id: `usr_${Date.now()}`,
    };
    users.push(newUser);
    saveToStorage(KEYS.USERS, users);
    return newUser;
  },

  async update(id: string, updatedData: Partial<Usuario>): Promise<Usuario> {
    await delay();
    const users = getFromStorage<Usuario>(KEYS.USERS);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuario no encontrado');
    
    users[index] = { ...users[index], ...updatedData };
    saveToStorage(KEYS.USERS, users);
    return users[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const users = getFromStorage<Usuario>(KEYS.USERS);
    const filtered = users.filter(u => u.id !== id);
    saveToStorage(KEYS.USERS, filtered);
    return true;
  }
};

/**
 * SERVICIOS DE ORGANIZACIÓN
 */
export const OrganizationService = {
  async getAll(): Promise<Organizacion[]> {
    await delay();
    return getFromStorage<Organizacion>(KEYS.ORGANIZATIONS);
  },

  async getById(id: string): Promise<Organizacion | undefined> {
    await delay();
    const orgs = getFromStorage<Organizacion>(KEYS.ORGANIZATIONS);
    return orgs.find(o => o.id === id);
  },

  async create(org: Omit<Organizacion, 'id'>): Promise<Organizacion> {
    await delay();
    const orgs = getFromStorage<Organizacion>(KEYS.ORGANIZATIONS);
    const newOrg: Organizacion = {
      ...org,
      id: `org_${Date.now()}`,
    };
    orgs.push(newOrg);
    saveToStorage(KEYS.ORGANIZATIONS, orgs);

    // Agregar también a usuarios para que puedan hacer login
    await UserService.create({
      rol: 'organizacion',
      nombre1: org.nombre,
      apellido1: 'Organización',
      telefono: '+34600000000',
      correo: org.correo,
      password: org.password,
      estado: 'activo'
    });

    return newOrg;
  },

  async update(id: string, updatedData: Partial<Organizacion>): Promise<Organizacion> {
    await delay();
    const orgs = getFromStorage<Organizacion>(KEYS.ORGANIZATIONS);
    const index = orgs.findIndex(o => o.id === id);
    if (index === -1) throw new Error('Organización no encontrada');
    
    orgs[index] = { ...orgs[index], ...updatedData };
    saveToStorage(KEYS.ORGANIZATIONS, orgs);

    // Actualizar también el perfil de usuario asociado por correo
    const user = await UserService.getByEmail(orgs[index].correo);
    if (user) {
      await UserService.update(user.id, {
        nombre1: orgs[index].nombre,
        correo: orgs[index].correo,
        password: orgs[index].password
      });
    }

    return orgs[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const orgs = getFromStorage<Organizacion>(KEYS.ORGANIZATIONS);
    const orgToDelete = orgs.find(o => o.id === id);
    
    const filtered = orgs.filter(o => o.id !== id);
    saveToStorage(KEYS.ORGANIZATIONS, filtered);

    if (orgToDelete) {
      const user = await UserService.getByEmail(orgToDelete.correo);
      if (user) {
        await UserService.delete(user.id);
      }
    }
    return true;
  }
};

/**
 * SERVICIOS DE EVENTOS
 */
export const EventService = {
  async getAll(): Promise<Evento[]> {
    await delay();
    return getFromStorage<Evento>(KEYS.EVENTS);
  },

  async getById(id: string): Promise<Evento | undefined> {
    await delay();
    const evts = getFromStorage<Evento>(KEYS.EVENTS);
    return evts.find(e => e.id === id);
  },

  async create(evt: Omit<Evento, 'id'>): Promise<Evento> {
    await delay();
    const evts = getFromStorage<Evento>(KEYS.EVENTS);
    const newEvt: Evento = {
      ...evt,
      id: `evt_${Date.now()}`,
    };
    evts.push(newEvt);
    saveToStorage(KEYS.EVENTS, evts);
    return newEvt;
  },

  async update(id: string, updatedData: Partial<Evento>): Promise<Evento> {
    await delay();
    const evts = getFromStorage<Evento>(KEYS.EVENTS);
    const index = evts.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Evento no encontrado');

    evts[index] = { ...evts[index], ...updatedData };
    saveToStorage(KEYS.EVENTS, evts);
    return evts[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const evts = getFromStorage<Evento>(KEYS.EVENTS);
    const filtered = evts.filter(e => e.id !== id);
    saveToStorage(KEYS.EVENTS, filtered);
    return true;
  },

  // Obtener participantes registrados de un evento
  async getParticipants(eventoId: string): Promise<Usuario[]> {
    await delay();
    const tracking = getFromStorage<SeguimientoEvento>(KEYS.TRACKING);
    const userIds = tracking.filter(t => t.eventoId === eventoId).map(t => t.usuarioId);
    const users = getFromStorage<Usuario>(KEYS.USERS);
    return users.filter(u => userIds.includes(u.id));
  },

  // Inscribir voluntario en evento
  async registerParticipant(eventoId: string, usuarioId: string): Promise<boolean> {
    await delay();
    const tracking = getFromStorage<SeguimientoEvento>(KEYS.TRACKING);
    const exists = tracking.some(t => t.eventoId === eventoId && t.usuarioId === usuarioId);
    if (exists) return false;

    tracking.push({
      eventoId,
      usuarioId,
      fechaRegistro: new Date().toISOString().split('T')[0],
    });
    saveToStorage(KEYS.TRACKING, tracking);
    return true;
  },

  // Cancelar inscripción de voluntario
  async unregisterParticipant(eventoId: string, usuarioId: string): Promise<boolean> {
    await delay();
    const tracking = getFromStorage<SeguimientoEvento>(KEYS.TRACKING);
    const filtered = tracking.filter(t => !(t.eventoId === eventoId && t.usuarioId === usuarioId));
    saveToStorage(KEYS.TRACKING, filtered);
    return true;
  },

  // Obtener eventos en los que participa un usuario voluntario
  async getEventsByVolunteer(usuarioId: string): Promise<Evento[]> {
    await delay();
    const tracking = getFromStorage<SeguimientoEvento>(KEYS.TRACKING);
    const eventIds = tracking.filter(t => t.usuarioId === usuarioId).map(t => t.eventoId);
    const evts = getFromStorage<Evento>(KEYS.EVENTS);
    return evts.filter(e => eventIds.includes(e.id));
  }
};

/**
 * SERVICIOS DE CATEGORÍA
 */
export const CategoryService = {
  async getAll(): Promise<Categoria[]> {
    await delay();
    return getFromStorage<Categoria>(KEYS.CATEGORIES);
  },

  async getById(id: string): Promise<Categoria | undefined> {
    await delay();
    const categories = getFromStorage<Categoria>(KEYS.CATEGORIES);
    return categories.find(c => c.id === id);
  },

  async create(cat: Omit<Categoria, 'id'>): Promise<Categoria> {
    await delay();
    const categories = getFromStorage<Categoria>(KEYS.CATEGORIES);
    const newCat: Categoria = {
      ...cat,
      id: `cat_${Date.now()}`,
    };
    categories.push(newCat);
    saveToStorage(KEYS.CATEGORIES, categories);
    return newCat;
  },

  async update(id: string, updatedData: Partial<Categoria>): Promise<Categoria> {
    await delay();
    const categories = getFromStorage<Categoria>(KEYS.CATEGORIES);
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Categoría no encontrada');

    categories[index] = { ...categories[index], ...updatedData };
    saveToStorage(KEYS.CATEGORIES, categories);
    return categories[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const categories = getFromStorage<Categoria>(KEYS.CATEGORIES);
    const filtered = categories.filter(c => c.id !== id);
    saveToStorage(KEYS.CATEGORIES, filtered);
    return true;
  }
};

/**
 * SERVICIOS DE SOLICITUDES (BENEFICIARIOS)
 */
export const RequestService = {
  async getAll(): Promise<Solicitud[]> {
    await delay();
    return getFromStorage<Solicitud>(KEYS.REQUESTS);
  },

  async getById(id: string): Promise<Solicitud | undefined> {
    await delay();
    const requests = getFromStorage<Solicitud>(KEYS.REQUESTS);
    return requests.find(r => r.id === id);
  },

  async getByBeneficiary(beneficiarioId: string): Promise<Solicitud[]> {
    await delay();
    const requests = getFromStorage<Solicitud>(KEYS.REQUESTS);
    return requests.filter(r => r.beneficiarioId === beneficiarioId);
  },

  async create(req: Omit<Solicitud, 'id' | 'fecha'>): Promise<Solicitud> {
    await delay();
    const requests = getFromStorage<Solicitud>(KEYS.REQUESTS);
    const newReq: Solicitud = {
      ...req,
      id: `sol_${Date.now()}`,
      fecha: new Date().toISOString().split('T')[0],
    };
    requests.push(newReq);
    saveToStorage(KEYS.REQUESTS, requests);
    return newReq;
  },

  async update(id: string, updatedData: Partial<Solicitud>): Promise<Solicitud> {
    await delay();
    const requests = getFromStorage<Solicitud>(KEYS.REQUESTS);
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Solicitud no encontrada');

    requests[index] = { ...requests[index], ...updatedData };
    saveToStorage(KEYS.REQUESTS, requests);
    return requests[index];
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const requests = getFromStorage<Solicitud>(KEYS.REQUESTS);
    const filtered = requests.filter(r => r.id !== id);
    saveToStorage(KEYS.REQUESTS, filtered);
    return true;
  }
};

/**
 * SERVICIOS DE DONACIÓN
 */
export interface DonacionCompleta extends Donacion {
  organizacionNombre?: string;
  usuarioNombre?: string;
  monetaria?: DonacionMonetaria;
  objeto?: DonacionObjeto;
}

export const DonationService = {
  async getAll(): Promise<DonacionCompleta[]> {
    await delay();
    const donations = getFromStorage<Donacion>(KEYS.DONATIONS);
    const monetary = getFromStorage<DonacionMonetaria>(KEYS.DONATIONS_MONETARY);
    const objects = getFromStorage<DonacionObjeto>(KEYS.DONATIONS_OBJECTS);
    const orgs = getFromStorage<Organizacion>(KEYS.ORGANIZATIONS);
    const users = getFromStorage<Usuario>(KEYS.USERS);

    return donations.map(d => {
      const org = orgs.find(o => o.id === d.organizacionId);
      const user = users.find(u => u.id === d.usuarioId);
      const m = monetary.find(mon => mon.donacionId === d.id);
      const o = objects.find(obj => obj.donacionId === d.id);

      return {
        ...d,
        organizacionNombre: org ? org.nombre : 'Organización General',
        usuarioNombre: user ? `${user.nombre1} ${user.apellido1}` : 'Donante Anónimo',
        monetaria: m,
        objeto: o,
      };
    });
  },

  async getById(id: string): Promise<DonacionCompleta | undefined> {
    const list = await this.getAll();
    return list.find(d => d.id === id);
  },

  async getByVolunteer(usuarioId: string): Promise<DonacionCompleta[]> {
    const list = await this.getAll();
    return list.filter(d => d.usuarioId === usuarioId);
  },

  async getByOrganization(organizacionId: string): Promise<DonacionCompleta[]> {
    const list = await this.getAll();
    return list.filter(d => d.organizacionId === organizacionId);
  },

  async createMonetary(
    donation: Omit<Donacion, 'id' | 'fecha' | 'tipo'>,
    monetary: Omit<DonacionMonetaria, 'id' | 'donacionId'>
  ): Promise<DonacionCompleta> {
    await delay();
    const donations = getFromStorage<Donacion>(KEYS.DONATIONS);
    const monetaryList = getFromStorage<DonacionMonetaria>(KEYS.DONATIONS_MONETARY);

    const donationId = `don_${Date.now()}`;
    const newDonation: Donacion = {
      ...donation,
      id: donationId,
      tipo: 'monetaria',
      fecha: new Date().toISOString().split('T')[0],
    };

    const newMonetary: DonacionMonetaria = {
      ...monetary,
      id: `dm_${Date.now()}`,
      donacionId: donationId,
    };

    donations.push(newDonation);
    monetaryList.push(newMonetary);

    saveToStorage(KEYS.DONATIONS, donations);
    saveToStorage(KEYS.DONATIONS_MONETARY, monetaryList);

    return {
      ...newDonation,
      monetaria: newMonetary,
    };
  },

  async createObject(
    donation: Omit<Donacion, 'id' | 'fecha' | 'tipo'>,
    objectDetail: Omit<DonacionObjeto, 'id' | 'donacionId'>
  ): Promise<DonacionCompleta> {
    await delay();
    const donations = getFromStorage<Donacion>(KEYS.DONATIONS);
    const objectsList = getFromStorage<DonacionObjeto>(KEYS.DONATIONS_OBJECTS);

    const donationId = `don_${Date.now()}`;
    const newDonation: Donacion = {
      ...donation,
      id: donationId,
      tipo: 'objeto',
      fecha: new Date().toISOString().split('T')[0],
    };

    const newObject: DonacionObjeto = {
      ...objectDetail,
      id: `do_${Date.now()}`,
      donacionId: donationId,
    };

    donations.push(newDonation);
    objectsList.push(newObject);

    saveToStorage(KEYS.DONATIONS, donations);
    saveToStorage(KEYS.DONATIONS_OBJECTS, objectsList);

    return {
      ...newDonation,
      objeto: newObject,
    };
  },

  async delete(id: string): Promise<boolean> {
    await delay();
    const donations = getFromStorage<Donacion>(KEYS.DONATIONS);
    const monetary = getFromStorage<DonacionMonetaria>(KEYS.DONATIONS_MONETARY);
    const objects = getFromStorage<DonacionObjeto>(KEYS.DONATIONS_OBJECTS);

    saveToStorage(KEYS.DONATIONS, donations.filter(d => d.id !== id));
    saveToStorage(KEYS.DONATIONS_MONETARY, monetary.filter(m => m.donacionId !== id));
    saveToStorage(KEYS.DONATIONS_OBJECTS, objects.filter(o => o.donacionId !== id));

    return true;
  }
};
