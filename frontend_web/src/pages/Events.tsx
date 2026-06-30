import React, { useEffect, useState } from 'react';
import { EventService, CategoryService, OrganizationService } from '../services/db';
import { Evento, Categoria, Organizacion } from '../types';
import { Card, Button, SearchBar, Select, Badge, Alert, EmptyState, formatDate } from '../components/UI';
import { Calendar, Building2, Tag, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Events: React.FC = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Evento[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [organizations, setOrganizations] = useState<Organizacion[]>([]);
  const [myEventIds, setMyEventIds] = useState<string[]>([]);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('todos');
  const [selectedOrg, setSelectedOrg] = useState('todos');

  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  async function loadData() {
    const evts = await EventService.getAll();
    setEvents(evts);

    const cats = await CategoryService.getAll();
    setCategories(cats.filter(c => c.estado === 'activo'));

    const orgs = await OrganizationService.getAll();
    setOrganizations(orgs);

    if (user && user.rol === 'voluntario') {
      const myEvts = await EventService.getEventsByVolunteer(user.id);
      setMyEventIds(myEvts.map(e => e.id));
    }
  }

  // Filtrado de eventos
  const filteredEvents = events.filter(evt => {
    const matchesSearch = 
      evt.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCat = selectedCat === 'todos' || evt.categoria === selectedCat;
    const matchesOrg = selectedOrg === 'todos' || evt.organizacionId === selectedOrg;
    const isActive = evt.estado === 'activo';

    return matchesSearch && matchesCat && matchesOrg && isActive;
  });

  const handleInscribe = async (eventoId: string) => {
    if (!user) {
      setMessage({ type: 'danger', text: 'Debes iniciar sesión como voluntario para inscribirte.' });
      return;
    }
    if (user.rol !== 'voluntario') {
      setMessage({ type: 'danger', text: 'Solo las cuentas con el rol de Voluntario pueden inscribirse en eventos.' });
      return;
    }

    const success = await EventService.registerParticipant(eventoId, user.id);
    if (success) {
      setMessage({ type: 'success', text: '¡Te has inscrito exitosamente en el evento!' });
      setMyEventIds([...myEventIds, eventoId]);
    } else {
      setMessage({ type: 'danger', text: 'Ya estás inscrito en este evento.' });
    }
  };

  const handleUnsubscribe = async (eventoId: string) => {
    if (!user) return;
    const success = await EventService.unregisterParticipant(eventoId, user.id);
    if (success) {
      setMessage({ type: 'success', text: 'Has cancelado tu inscripción en el evento.' });
      setMyEventIds(myEventIds.filter(id => id !== eventoId));
    }
  };

  const getOrgName = (orgId: string) => {
    return organizations.find(o => o.id === orgId)?.nombre || 'Organización';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-wider">Eventos de Voluntariado</h1>
        <p className="text-xs text-neutral-500 mt-1">Busca e inscríbete en causas benéficas creadas por nuestras organizaciones asociadas.</p>
      </div>

      {message && (
        <Alert 
          type={message.type === 'success' ? 'success' : 'danger'} 
          message={message.text} 
          className="mb-4"
        />
      )}

      {/* Panel de Filtros */}
      <div className="bg-white border border-neutral-200 p-5 rounded shadow-xs flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">Buscar por nombre o palabra clave</label>
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Ej: recogida, reforestación..." 
          />
        </div>
        
        <div className="w-full md:w-56">
          <Select
            label="Filtrar Categoría"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            options={[
              { value: 'todos', label: 'Todas las categorías' },
              ...categories.map(c => ({ value: c.nombre, label: c.nombre }))
            ]}
          />
        </div>

        <div className="w-full md:w-56">
          <Select
            label="Filtrar Organización"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
            options={[
              { value: 'todos', label: 'Todas las organizaciones' },
              ...organizations.map(o => ({ value: o.id, label: o.nombre }))
            ]}
          />
        </div>
      </div>

      {/* Grid de Eventos */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          title="Sin Eventos"
          description="No se encontraron eventos activos que coincidan con los criterios de búsqueda establecidos."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const isRegistered = myEventIds.includes(evt.id);
            return (
              <Card
                key={evt.id}
                title={evt.nombre}
                subtitle={`Categoría: ${evt.categoria}`}
                footer={
                  user?.rol === 'voluntario' ? (
                    isRegistered ? (
                      <Button variant="outline" className="w-full border-red-200 hover:bg-red-50 text-red-600" size="sm" onClick={() => handleUnsubscribe(evt.id)}>
                        Cancelar Inscripción
                      </Button>
                    ) : (
                      <Button variant="primary" className="w-full" size="sm" onClick={() => handleInscribe(evt.id)}>
                        Inscribirme al Evento
                      </Button>
                    )
                  ) : (
                    <Button variant="secondary" className="w-full" size="sm" onClick={() => handleInscribe(evt.id)}>
                      Inscribirme (Requiere Login)
                    </Button>
                  )
                }
              >
                <div className="space-y-4">
                  <p className="text-xs text-neutral-600 min-h-[4.5rem] leading-relaxed">
                    {evt.descripcion}
                  </p>
                  
                  <div className="pt-2 border-t border-neutral-100 space-y-2 text-xs text-neutral-600 font-medium">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2 text-neutral-400 shrink-0" />
                      <span className="truncate">Organiza: <span className="text-neutral-900 font-semibold">{getOrgName(evt.organizacionId)}</span></span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-neutral-400 shrink-0" />
                      <span>Fecha del Evento: <span className="text-neutral-950">{formatDate(evt.fecha)}</span></span>
                    </div>
                  </div>

                  {isRegistered && (
                    <div className="bg-green-50 border border-green-200 p-2.5 rounded flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                      <span className="text-xs text-green-800 font-bold">¡Estás inscrito en este evento!</span>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
