import React, { useEffect, useState } from 'react';
import { 
  CalendarDays, 
  PlusCircle, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Tag, 
  Trash2, 
  Eye, 
  Building2,
  CheckCircle2
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { Toast, ToastMessage } from '../components/common/Toast';
import { getEvents, deleteEvent } from '../services/eventService';
import { EventItem, EventCategory } from '../types/event';

interface MyEventsScreenProps {
  onNavigateToCreateEvent: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToDetail: (event: EventItem) => void;
}

export const MyEventsScreen: React.FC<MyEventsScreenProps> = ({
  onNavigateToCreateEvent,
  onNavigateToDashboard,
  onNavigateToDetail,
}) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const loadEvents = async () => {
    setLoading(true);
    const res = await getEvents();
    if (res.success && res.data) {
      setEvents(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`¿Estás seguro de cancelar y eliminar el evento "${title}"?`)) {
      const res = await deleteEvent(id);
      if (res.success) {
        setToast({
          id: `del-${Date.now()}`,
          type: 'success',
          title: 'Evento Eliminado',
          message: `El evento "${title}" ha sido removido del sistema.`,
        });
        loadEvents();
      }
    }
  };

  const filteredEvents = events.filter((e) => {
    const matchesSearch = 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div id="my-events-screen" className="min-h-screen bg-gray-50/50 pb-28 pt-2">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <Header
        title="Gestión de Eventos"
        subtitle="Listado y control de eventos creados por tu organización"
        showBackButton={true}
        onBackClick={onNavigateToDashboard}
        rightAction={
          <button
            type="button"
            id="my-events-create-btn"
            onClick={onNavigateToCreateEvent}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs sm:text-sm py-2 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Crear Evento</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-5">
        {/* Barra de Búsqueda y Filtro */}
        <Card className="p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Input Búsqueda */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar por título, descripción o lugar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-3.5 text-sm focus:outline-hidden focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              />
            </div>

            {/* Selector de Filtro de Categoría */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Tag className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs sm:text-sm rounded-xl py-2.5 pl-10 pr-8 appearance-none focus:outline-hidden focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              >
                <option value="ALL">Todas las Categorías</option>
                <option value="Voluntariado">Voluntariado</option>
                <option value="Deporte">Deporte</option>
                <option value="Cultura y Arte">Cultura y Arte</option>
                <option value="Educación">Educación</option>
                <option value="Salud y Bienestar">Salud y Bienestar</option>
                <option value="Medio Ambiente">Medio Ambiente</option>
                <option value="Donación y Colecta">Donación y Colecta</option>
                <option value="Comunidad">Comunidad</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Lista de Eventos */}
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            Cargando lista de eventos de Give&Go...
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="text-center py-12 space-y-3">
            <CalendarDays className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-700">No se encontraron eventos</h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'ALL'
                ? 'Prueba ajustando tus términos de búsqueda o filtros.'
                : 'Aún no has creado ningún evento en Give&Go.'}
            </p>
            <PrimaryButton
              id="my-events-create-first"
              onClick={onNavigateToCreateEvent}
              fullWidth={false}
              icon={<PlusCircle className="w-4 h-4" />}
            >
              Crear Nuevo Evento (HU 013)
            </PrimaryButton>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEvents.map((evt) => {
              const capacityPercentage = Math.round((evt.registeredCount / evt.totalCapacity) * 100);

              return (
                <Card key={evt.id} id={`my-event-item-${evt.id}`} className="hover:border-red-200 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600">
                          {evt.category}
                        </span>
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {evt.status}
                        </span>
                        <span className="text-[11px] text-gray-400">
                          ID: {evt.id}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {evt.title}
                      </h3>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-gray-500 pt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" /> {evt.date} a las {evt.time} hs
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {evt.location}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar & Actions */}
                    <div className="sm:w-56 shrink-0 bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-1">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-gray-500" /> Cupos
                          </span>
                          <span>{evt.registeredCount} / {evt.totalCapacity}</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-red-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onNavigateToDetail(evt)}
                          className="flex-1 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 font-semibold text-xs py-2 px-2.5 rounded-lg transition-colors flex items-center justify-center gap-1"
                          title="Ver detalle del evento"
                        >
                          <Eye className="w-3.5 h-3.5 text-gray-600" /> Detalle
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(evt.id, evt.title)}
                          className="bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-red-600 font-semibold text-xs p-2 rounded-lg transition-colors"
                          title="Eliminar evento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
