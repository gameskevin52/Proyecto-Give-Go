import React, { useState, useEffect } from 'react';
import { OrganizationService, EventService } from '../services/db';
import { Organizacion, Evento } from '../types';
import { Card, Badge, Button } from '../components/UI';
import { MapPin, Building2, Phone, Mail, Navigation, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MapOrg extends Organizacion {
  x: number; // Coordenada X relativa (%)
  y: number; // Coordenada Y relativa (%)
  color: string;
}

export const Map: React.FC = () => {
  const [organizations, setOrganizations] = useState<MapOrg[]>([]);
  const [selectedOrg, setSelectedOrg] = useState<MapOrg | null>(null);
  const [orgEvents, setOrgEvents] = useState<Evento[]>([]);

  useEffect(() => {
    async function loadMapData() {
      const orgs = await OrganizationService.getAll();
      
      // Coordenadas fijas para representarlas en el mapa interactivo
      const mapPositions = [
        { x: 30, y: 40, color: 'text-red-600' },
        { x: 65, y: 30, color: 'text-neutral-900' },
        { x: 50, y: 70, color: 'text-red-700' },
      ];

      const enriched: MapOrg[] = orgs.map((org, idx) => {
        const pos = mapPositions[idx % mapPositions.length];
        return {
          ...org,
          x: pos.x,
          y: pos.y,
          color: pos.color,
        };
      });

      setOrganizations(enriched);
      if (enriched.length > 0) {
        setSelectedOrg(enriched[0]);
      }
    }
    loadMapData();
  }, []);

  useEffect(() => {
    if (!selectedOrg) return;
    async function getEvents() {
      const evts = await EventService.getAll();
      setOrgEvents(evts.filter(e => e.organizacionId === selectedOrg.id && e.estado === 'activo'));
    }
    getEvents();
  }, [selectedOrg]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-wider">Mapa Solidario</h1>
        <p className="text-xs text-neutral-500 mt-1">
          Visualiza la distribución geográfica de nuestras organizaciones asociadas y descubre los puntos de acción benéfica.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mapa Interactivo (SVG) */}
        <div className="lg:col-span-2 bg-neutral-100 border border-neutral-200 rounded-lg p-6 relative min-h-[400px] flex flex-col justify-between overflow-hidden">
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-xs z-10 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-red-600 animate-pulse" />
            <span>Región Central (Zonas de Acción Activa)</span>
          </div>

          {/* Grid de fondo y representación abstracta del territorio */}
          <div className="absolute inset-0 opacity-10 flex flex-wrap">
            {Array.from({ length: 150 }).map((_, i) => (
              <div key={i} className="w-12 h-12 border-t border-l border-neutral-400" />
            ))}
          </div>

          {/* Rutas ficticias (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Ríos y carreteras abstractas para dar "vida" al mapa */}
            <path d="M 0,150 Q 250,150 400,300 T 800,200" fill="none" stroke="#E5E7EB" strokeWidth="8" />
            <path d="M 100,0 Q 150,200 300,400 T 600,600" fill="none" stroke="#E5E7EB" strokeWidth="4" strokeDasharray="5,5" />
          </svg>

          {/* Render Pins de Organizaciones */}
          <div className="relative flex-1">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => setSelectedOrg(org)}
                style={{ left: `${org.x}%`, top: `${org.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none transition-transform active:scale-95"
              >
                <div className="relative flex flex-col items-center">
                  {/* Tooltip rápido en Hover */}
                  <span className="absolute bottom-full mb-1.5 whitespace-nowrap bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150">
                    {org.nombre}
                  </span>
                  
                  {/* Icono del Pin */}
                  <div className={`w-8 h-8 bg-white border-2 border-red-600 rounded-full flex items-center justify-center shadow-md transition-all group-hover:bg-red-600 group-hover:text-white ${selectedOrg?.id === org.id ? 'bg-red-600 text-white border-black scale-110' : 'text-red-600'}`}>
                    <Building2 className="w-4 h-4" />
                  </div>
                  
                  {/* Efecto de sonar si está seleccionado */}
                  {selectedOrg?.id === org.id && (
                    <span className="absolute -inset-1 rounded-full border-2 border-red-500 animate-ping opacity-25 pointer-events-none" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Leyenda del Mapa */}
          <div className="bg-white/95 backdrop-blur-xs border border-neutral-200 p-3 rounded text-xs text-neutral-600 font-semibold flex gap-4 mt-auto relative z-10 w-fit">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block border border-white" />
              <span>Sede de Organización</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-white inline-block border-2 border-red-600" />
              <span>Actividades Vinculadas</span>
            </div>
          </div>
        </div>

        {/* Panel Lateral con Información Detallada */}
        <div className="lg:col-span-1">
          {selectedOrg ? (
            <div className="space-y-6">
              <Card
                title={selectedOrg.nombre}
                subtitle="Ficha de la Organización"
              >
                <div className="space-y-4">
                  <div className="space-y-3 text-xs text-neutral-600 font-medium pt-2">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span>{selectedOrg.direccion}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2.5 text-neutral-400 shrink-0" />
                      <a href={`mailto:${selectedOrg.correo}`} className="text-neutral-900 hover:underline">{selectedOrg.correo}</a>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-red-600" />
                      Campañas de Voluntariado Activas
                    </h4>
                    
                    {orgEvents.length === 0 ? (
                      <p className="text-xs text-neutral-400 italic">No hay campañas de voluntariado planificadas para esta sede en este momento.</p>
                    ) : (
                      <div className="space-y-2.5">
                        {orgEvents.map((evt) => (
                          <div key={evt.id} className="p-3 bg-neutral-50 border border-neutral-150 rounded flex flex-col justify-between items-start gap-1">
                            <span className="text-xs font-semibold text-neutral-800">{evt.nombre}</span>
                            <div className="flex justify-between items-center w-full mt-1">
                              <span className="text-[10px] text-neutral-500">Fecha: {evt.fecha}</span>
                              <Badge variant="success">Abierto</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex gap-2">
                    <Link to="/events" className="w-full">
                      <Button variant="primary" size="sm" className="w-full">
                        Inscribirse en Campañas
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded p-6 text-center text-xs text-neutral-400">
              Seleccione una organización en el mapa para consultar su información.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
