import React, { useEffect, useState } from 'react';
import { 
  PlusCircle, 
  CalendarDays, 
  Users, 
  Building2, 
  TrendingUp, 
  Clock, 
  MapPin, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { getEvents } from '../services/eventService';
import { EventItem } from '../types/event';

interface OrgDashboardScreenProps {
  onNavigateToCreateEvent: () => void;
  onNavigateToMyEvents: () => void;
  onNavigateToDetail: (event: EventItem) => void;
}

export const OrgDashboardScreen: React.FC<OrgDashboardScreenProps> = ({
  onNavigateToCreateEvent,
  onNavigateToMyEvents,
  onNavigateToDetail,
}) => {
  const [recentEvents, setRecentEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const res = await getEvents();
      if (res.success && res.data) {
        setRecentEvents(res.data.slice(0, 3));
      }
      setLoading(false);
    };
    fetchDashboardData();
  }, []);

  const totalRegistered = recentEvents.reduce((acc, curr) => acc + curr.registeredCount, 0);
  const totalSpots = recentEvents.reduce((acc, curr) => acc + curr.totalCapacity, 0);

  return (
    <div id="org-dashboard-screen" className="min-h-screen bg-gray-50/50 pb-28 pt-2">
      <Header
        title="Dashboard de Organización"
        subtitle="Panel de control general de Give&Go"
      />

      <main className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {/* Banner de bienvenida y acción principal */}
        <div className="bg-linear-to-r from-red-600 to-red-700 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
            <Building2 className="w-64 h-64 text-white" />
          </div>

          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Organización Verificada
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bienvenido, Fundación Give&Go
            </h2>
            <p className="text-sm text-red-100 mt-2 leading-relaxed">
              Crea y administra eventos sociales, gestiona la asistencia de voluntarios y publica nuevas oportunidades comunitarias.
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <PrimaryButton
                id="dashboard-create-event-btn"
                onClick={onNavigateToCreateEvent}
                fullWidth={false}
                icon={<PlusCircle className="w-5 h-5" />}
                className="bg-white text-red-600 hover:bg-gray-100 shadow-none border-none font-bold"
              >
                Crear Nuevo Evento (HU 013)
              </PrimaryButton>

              <SecondaryButton
                id="dashboard-my-events-btn"
                onClick={onNavigateToMyEvents}
                fullWidth={false}
                variant="outline"
                className="bg-red-700/50 border-white/30 text-white hover:bg-red-800/80"
              >
                Ver Todos Mis Eventos
              </SecondaryButton>
            </div>
          </div>
        </div>

        {/* Métrica / Estadísticas Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Eventos Activos</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{recentEvents.length}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Inscritos Totales</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{totalRegistered}</h3>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">Ocupación Promedio</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">
                {totalSpots > 0 ? Math.round((totalRegistered / totalSpots) * 100) : 0}%
              </h3>
            </div>
          </Card>
        </div>

        {/* Sección de Eventos Recientes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-red-600" /> Eventos Recientes
            </h3>
            <button
              type="button"
              onClick={onNavigateToMyEvents}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-gray-400 text-sm">
              Cargando eventos de la organización...
            </div>
          ) : recentEvents.length === 0 ? (
            <Card className="text-center py-10 space-y-3">
              <p className="text-sm text-gray-500">No hay eventos registrados aún.</p>
              <PrimaryButton
                id="create-first-event-btn"
                onClick={onNavigateToCreateEvent}
                fullWidth={false}
                icon={<PlusCircle className="w-4 h-4" />}
              >
                Crear mi primer evento
              </PrimaryButton>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recentEvents.map((event) => (
                <Card
                  key={event.id}
                  id={`dashboard-event-card-${event.id}`}
                  onClick={() => onNavigateToDetail(event)}
                  className="group hover:border-red-200 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-600">
                        {event.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {event.status}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 group-hover:text-red-600 transition-colors line-clamp-1">
                      {event.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> {event.date} - {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" /> {event.location.split(',')[0]}
                      </span>
                    </div>
                    <span className="font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                      {event.registeredCount}/{event.totalCapacity} cupos
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
