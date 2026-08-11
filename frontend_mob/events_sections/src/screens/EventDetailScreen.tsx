import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  CheckCircle2, 
  Share2, 
  Building2, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { PrimaryButton } from '../components/common/PrimaryButton';
import { SecondaryButton } from '../components/common/SecondaryButton';
import { EventItem } from '../types/event';

interface EventDetailScreenProps {
  event: EventItem | null;
  onNavigateToMyEvents: () => void;
  onNavigateToDashboard: () => void;
  onNavigateToCreateEvent: () => void;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  event,
  onNavigateToMyEvents,
  onNavigateToDashboard,
  onNavigateToCreateEvent,
}) => {
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full text-center space-y-4">
          <h3 className="text-lg font-bold text-gray-900">No hay información de evento seleccionada</h3>
          <p className="text-xs text-gray-500">
            Regresa al panel principal para seleccionar o publicar un evento.
          </p>
          <PrimaryButton onClick={onNavigateToDashboard}>
            Ir al Dashboard
          </PrimaryButton>
        </Card>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('¡Enlace del evento copiado al portapapeles!');
    }
  };

  return (
    <div id="event-detail-screen" className="min-h-screen bg-gray-50/50 pb-28 pt-2">
      <Header
        title="Detalle del Evento"
        subtitle="Vista pública y resumen de información de Give&Go"
        showBackButton={true}
        onBackClick={onNavigateToMyEvents}
        rightAction={
          <button
            type="button"
            onClick={handleShare}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Compartir evento"
          >
            <Share2 className="w-5 h-5" />
          </button>
        }
      />

      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-6">
        {/* Banner superior con la Categoría y Estado */}
        <Card className="p-6 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" /> {event.category}
            </span>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" /> Evento {event.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight leading-tight">
            {event.title}
          </h1>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <Building2 className="w-4 h-4 text-red-600" />
            <span>Organizado por: <strong className="text-gray-700 font-semibold">{event.organizationName}</strong></span>
            <span>•</span>
            <span>Publicado: {new Date(event.createdAt).toLocaleDateString()}</span>
          </div>
        </Card>

        {/* Tarjetas de Información Clave */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase text-gray-400">Fecha y Hora</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{event.date}</p>
              <p className="text-xs text-gray-500">{event.time} hs</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase text-gray-400">Ubicación</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5 line-clamp-1">{event.location}</p>
              <p className="text-xs text-gray-500">Presencial</p>
            </div>
          </Card>

          <Card className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase text-gray-400">Cupos Disponibles</p>
              <p className="text-sm font-bold text-gray-900 mt-0.5">{event.totalCapacity} cupos totales</p>
              <p className="text-xs text-emerald-600 font-semibold">{event.registeredCount} voluntario(s) anotado(s)</p>
            </div>
          </Card>
        </div>

        {/* Descripción Completa */}
        <Card className="space-y-3">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-red-600" /> Descripción del Evento
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </Card>

        {/* Acciones de Navegación */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <PrimaryButton
            id="detail-back-to-events-btn"
            onClick={onNavigateToMyEvents}
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Ir a Gestión de Eventos
          </PrimaryButton>

          <SecondaryButton
            id="detail-create-another-btn"
            onClick={onNavigateToCreateEvent}
          >
            Crear Otro Evento (HU 013)
          </SecondaryButton>
        </div>
      </main>
    </div>
  );
};
