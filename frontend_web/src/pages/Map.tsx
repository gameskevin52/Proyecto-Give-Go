import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { OrganizationService, EventService, CategoryService } from '../services/db';
import { Organizacion, Evento, Categoria } from '../types';
import { Card, Button, formatDate, SearchBar } from '../components/UI';
import { MapPin, Building2, Phone, Mail, Navigation, Calendar, Eye, Layers, Filter, RotateCcw, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  createBaseTileLayers,
  createBeneficiaryEventMarkerIcon,
  createVolunteerEventMarkerIcon,
  createOrgMarkerIcon,
  createUserLocationMarkerIcon,
} from '../utils/mapConfig';

// Haversine formula to calculate distance between two coordinates in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getEventAudience = (evt: Evento): 'voluntarios' | 'beneficiarios' | 'ambos' => {
  if (
    evt.publicoObjetivo === 'beneficiarios' ||
    evt.publicoObjetivo === 'voluntarios' ||
    evt.publicoObjetivo === 'ambos'
  ) {
    return evt.publicoObjetivo;
  }
  const vol = evt.vacantesVoluntarios ?? 0;
  const ben = evt.vacantesBeneficiarios ?? 0;
  if (ben > 0 && vol <= 0) return 'beneficiarios';
  if (vol > 0 && ben <= 0) return 'voluntarios';
  return 'ambos';
};

export const Map: React.FC = () => {
  const { user } = useAuth();
  const role = (user?.rol || '').toLowerCase();
  const isBeneficiary = role === 'beneficiario';
  const isVolunteer = role === 'voluntario';

  const [organizations, setOrganizations] = useState<Organizacion[]>([]);
  const [events, setEvents] = useState<Evento[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);

  const [selectedItem, setSelectedItem] = useState<{
    type: 'organization' | 'event';
    data: any;
  } | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(0);

  const [filterType, setFilterType] = useState<'all' | 'event_beneficiarios' | 'event_voluntarios' | 'org'>('all');
  const [filterCat, setFilterCat] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);

  const centerLat = 4.6215;
  const centerLng = -74.1280;

  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización GPS.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        setIsLocating(false);
        if (mapRef.current) {
          mapRef.current.setView([coords.lat, coords.lng], 14);
        }
      },
      (error) => {
        console.warn('Geolocation unavailable or permission denied:', error?.message || 'Access denied');
        setIsLocating(false);
        setLocationError('Activa el permiso de ubicación en tu navegador para ver tu posición exacta en rojo.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    requestUserLocation();
  }, []);

  useEffect(() => {
    if (isBeneficiary && (filterType === 'org' || filterType === 'event_voluntarios')) {
      setFilterType('all');
    }
    if (isVolunteer && filterType === 'event_beneficiarios') {
      setFilterType('all');
    }
  }, [isBeneficiary, isVolunteer, filterType]);

  const roleVisibleEvents = useMemo(() => {
    return events.filter((evt) => {
      const aud = getEventAudience(evt);
      if (isBeneficiary) {
        return aud === 'beneficiarios' || aud === 'ambos';
      }
      if (isVolunteer) {
        return aud === 'voluntarios' || aud === 'ambos';
      }
      return true;
    });
  }, [events, isBeneficiary, isVolunteer]);

  useEffect(() => {
    async function loadData() {
      const [orgs, evts, cats] = await Promise.all([
        OrganizationService.getAll(),
        EventService.getAll(),
        CategoryService.getAll(),
      ]);

      const activeEvts = evts.filter((e) => e.estado === 'activo');
      setOrganizations(orgs);
      setEvents(activeEvts);
      setCategories(cats);

      if (role === 'beneficiario') {
        const benEvts = activeEvts.filter((e) => {
          const aud = getEventAudience(e);
          return aud === 'beneficiarios' || aud === 'ambos';
        });
        setSelectedItem(benEvts.length > 0 ? { type: 'event', data: benEvts[0] } : null);
      } else if (role === 'voluntario') {
        const volEvts = activeEvts.filter((e) => {
          const aud = getEventAudience(e);
          return aud === 'voluntarios' || aud === 'ambos';
        });
        if (volEvts.length > 0) {
          setSelectedItem({ type: 'event', data: volEvts[0] });
        } else if (orgs.length > 0) {
          setSelectedItem({ type: 'organization', data: orgs[0] });
        }
      } else if (orgs.length > 0) {
        setSelectedItem({ type: 'organization', data: orgs[0] });
      } else if (activeEvts.length > 0) {
        setSelectedItem({ type: 'event', data: activeEvts[0] });
      }
    }
    loadData();
  }, [role]);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    const map = L.map(mapContainerRef.current).setView([centerLat, centerLng], 13);
    mapRef.current = map;

    const { defaultLayer, baseMaps } = createBaseTileLayers();
    defaultLayer.addTo(map);
    L.control.layers(baseMaps, undefined, { position: 'topright' }).addTo(map);

    const group = L.layerGroup().addTo(map);
    markersGroupRef.current = group;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markersGroupRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    const bounds: L.LatLngExpression[] = [];

    const getFallbackCoords = (index: number) => {
      const offsetLat = [0, -0.005, 0.006, -0.003, 0.004, -0.006];
      const offsetLng = [0, 0.007, -0.004, -0.007, 0.005, 0.003];
      const i = index % offsetLat.length;
      return {
        lat: centerLat + offsetLat[i],
        lng: centerLng + offsetLng[i],
      };
    };

    const refLat = userLocation ? userLocation.lat : centerLat;
    const refLng = userLocation ? userLocation.lng : centerLng;

    // 0. GPS Ubicación Actual de la Persona -> ROJO
    if (userLocation) {
      const userIcon = createUserLocationMarkerIcon();
      const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon, zIndexOffset: 1000 });
      userMarker.bindPopup(`
        <div class="text-neutral-900 font-sans p-1.5 text-center">
          <span class="text-[9px] font-extrabold uppercase tracking-widest text-red-600">Ubicación Actual</span>
          <h4 class="font-bold text-xs leading-tight m-0 text-neutral-950">Tu Posición GPS</h4>
          <p class="text-[9px] text-neutral-500 m-0">Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}</p>
        </div>
      `);
      userMarker.addTo(markersGroupRef.current);
      bounds.push([userLocation.lat, userLocation.lng]);
    }

    // 1. Sedes de Organizaciones (Morado) -> Nunca visible para Beneficiario
    if (!isBeneficiary && (filterType === 'all' || filterType === 'org')) {
      const shouldSkipOrgsForCategory = filterType === 'all' && filterCat !== 'todos';

      if (!shouldSkipOrgsForCategory) {
        organizations.forEach((org, idx) => {
          if (
            searchTerm &&
            !org.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !(org.direccion || '').toLowerCase().includes(searchTerm.toLowerCase())
          ) {
            return;
          }

          const orgLat = org.latitud ? Number(org.latitud) : getFallbackCoords(idx).lat;
          const orgLng = org.longitud ? Number(org.longitud) : getFallbackCoords(idx).lng;

          const distance = calculateDistance(refLat, refLng, orgLat, orgLng);
          if (maxDistance > 0 && distance > maxDistance) {
            return;
          }

          const orgIcon = createOrgMarkerIcon();
          const marker = L.marker([orgLat, orgLng], { icon: orgIcon });
          const distanceStr = `<p class="text-[9px] font-bold text-violet-700 m-0 bg-violet-50 px-1.5 py-0.5 rounded w-fit">A ${distance.toFixed(2)} km ${userLocation ? 'de ti' : 'del centro'}</p>`;

          marker.bindPopup(`
            <div class="text-neutral-900 font-sans p-1.5 space-y-1">
              <span class="text-[9px] font-extrabold uppercase tracking-widest text-violet-600">Sede de Organización</span>
              <h4 class="font-bold text-xs leading-tight m-0 text-neutral-950">${org.nombre}</h4>
              <p class="text-[10px] text-neutral-500 m-0">${org.direccion || ''}</p>
              ${distanceStr}
              <div class="pt-1.5 flex gap-1">
                <button id="btn-select-org-${org.id}" class="bg-violet-600 text-white text-[9px] font-bold px-2 py-1 rounded hover:bg-violet-700 transition-colors cursor-pointer border-none w-full">
                  Ver Detalles
                </button>
              </div>
            </div>
          `);

          marker.on('popupopen', () => {
            const btn = document.getElementById(`btn-select-org-${org.id}`);
            if (btn) {
              btn.addEventListener('click', () => {
                setSelectedItem({ type: 'organization', data: org });
              });
            }
          });

          marker.addTo(markersGroupRef.current!);
          bounds.push([orgLat, orgLng]);
        });
      }
    }

    // 2. Eventos -> Verde (Beneficiarios) / Azul (Voluntarios)
    if (filterType === 'all' || filterType === 'event_beneficiarios' || filterType === 'event_voluntarios') {
      roleVisibleEvents.forEach((evt, idx) => {
        const aud = getEventAudience(evt);

        if (filterType === 'event_beneficiarios' && aud !== 'beneficiarios' && aud !== 'ambos') {
          return;
        }
        if (filterType === 'event_voluntarios' && aud !== 'voluntarios' && aud !== 'ambos') {
          return;
        }

        if (
          searchTerm &&
          !evt.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !(evt.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
          !(evt.direccion || '').toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return;
        }

        if (filterCat !== 'todos' && evt.categoria.toLowerCase() !== filterCat.toLowerCase()) {
          return;
        }

        const evtLat = evt.latitud ? Number(evt.latitud) : getFallbackCoords(idx + 10).lat;
        const evtLng = evt.longitud ? Number(evt.longitud) : getFallbackCoords(idx + 10).lng;

        const distance = calculateDistance(refLat, refLng, evtLat, evtLng);
        if (maxDistance > 0 && distance > maxDistance) {
          return;
        }

        // Si el usuario es Beneficiario, todo evento visible para él se muestra en Verde.
        // Si es Voluntario, todo evento visible para él se muestra en Azul.
        // Para Admin/Org/Público: 'beneficiarios' en Verde, 'voluntarios'/'ambos' en Azul.
        const renderAsBeneficiary =
          isBeneficiary || (!isVolunteer && (aud === 'beneficiarios' || (filterType === 'event_beneficiarios' && aud === 'ambos')));

        const evtIcon = renderAsBeneficiary
          ? createBeneficiaryEventMarkerIcon()
          : createVolunteerEventMarkerIcon();

        const marker = L.marker([evtLat, evtLng], { icon: evtIcon });

        const tagText = renderAsBeneficiary
          ? 'Evento para Beneficiarios'
          : aud === 'ambos'
            ? 'Voluntarios y Beneficiarios'
            : 'Evento para Voluntarios';

        const accentTextClass = renderAsBeneficiary ? 'text-emerald-700' : 'text-blue-700';
        const accentBgClass = renderAsBeneficiary ? 'bg-emerald-50' : 'bg-blue-50';
        const btnBgClass = renderAsBeneficiary ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700';

        const distanceStr = `<p class="text-[9px] font-bold ${accentTextClass} m-0 ${accentBgClass} px-1.5 py-0.5 rounded w-fit">A ${distance.toFixed(2)} km ${userLocation ? 'de ti' : 'del centro'}</p>`;

        marker.bindPopup(`
          <div class="text-neutral-900 font-sans p-1.5 space-y-1">
            <span class="text-[9px] font-extrabold uppercase tracking-widest ${accentTextClass}">${tagText}</span>
            <h4 class="font-bold text-xs leading-tight m-0 text-neutral-950">${evt.nombre}</h4>
            <p class="text-[10px] text-neutral-500 m-0">${evt.direccion || ''}</p>
            <p class="text-[9px] text-neutral-400 m-0">Categoría: <span class="font-semibold text-neutral-700">${evt.categoria}</span></p>
            ${distanceStr}
            <div class="pt-1.5 flex gap-1">
              <button id="btn-select-evt-${evt.id}" class="${btnBgClass} text-white text-[9px] font-bold px-2 py-1 rounded transition-colors cursor-pointer border-none w-full">
                Ver Detalles
              </button>
            </div>
          </div>
        `);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-select-evt-${evt.id}`);
          if (btn) {
            btn.addEventListener('click', () => {
              setSelectedItem({ type: 'event', data: evt });
            });
          }
        });

        marker.addTo(markersGroupRef.current!);
        bounds.push([evtLat, evtLng]);
      });
    }

    if (bounds.length > 0 && mapRef.current) {
      mapRef.current.fitBounds(L.latLngBounds(bounds), { padding: [40, 40], maxZoom: 14 });
    }
  }, [organizations, roleVisibleEvents, filterType, filterCat, searchTerm, userLocation, maxDistance, isBeneficiary, isVolunteer]);

  const handleCenterOnMap = () => {
    if (!selectedItem || !mapRef.current) return;
    const item = selectedItem.data;
    if (item.latitud && item.longitud) {
      mapRef.current.setView([Number(item.latitud), Number(item.longitud)], 16);
    }
  };

  const getOrgName = (orgId: string) => {
    return organizations.find((o) => o.id === orgId)?.nombre || 'Organización';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-neutral-900 uppercase tracking-wider">
          {isBeneficiary ? 'Mapa de Ayudas para Beneficiarios' : 'Mapa Solidario Interactivo'}
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          {isBeneficiary
            ? 'Explora únicamente los eventos y jornadas habilitadas para beneficiarios cerca de tu ubicación en Kennedy y Bogotá.'
            : isVolunteer
              ? 'Encuentra convocatorias de voluntariado activas y sedes solidarias cerca de tu ubicación.'
              : 'Explora eventos para beneficiarios (verde), eventos para voluntarios (azul), organizaciones y tu ubicación actual (rojo).'}
        </p>
      </div>

      {/* Controladores de Filtro */}
      <div className="bg-white border border-neutral-200 p-4 rounded shadow-xs grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-3">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            Tipo de Marcador
          </label>
          <select
            value={filterType}
            onChange={(e: any) => setFilterType(e.target.value)}
            disabled={isBeneficiary}
            className="w-full text-xs border border-neutral-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white font-medium disabled:bg-neutral-50 disabled:text-neutral-700"
          >
            {isBeneficiary ? (
              <option value="all">Solo Eventos para Beneficiarios</option>
            ) : isVolunteer ? (
              <>
                <option value="all">Todos los marcadores</option>
                <option value="event_voluntarios">Eventos para Voluntarios (Azul)</option>
                <option value="org">Sedes de Organizaciones (Morado)</option>
              </>
            ) : (
              <>
                <option value="all">Todos los marcadores</option>
                <option value="event_beneficiarios">Eventos para Beneficiarios (Verde)</option>
                <option value="event_voluntarios">Eventos para Voluntarios (Azul)</option>
                <option value="org">Sedes de Organizaciones (Morado)</option>
              </>
            )}
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Categoría del Evento
          </label>
          <select
            value={filterCat}
            onChange={(e: any) => setFilterCat(e.target.value)}
            disabled={filterType === 'org'}
            className="w-full text-xs border border-neutral-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white font-medium disabled:opacity-50"
          >
            <option value="todos">Todas las categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-500 mb-1.5 flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" />
            Rango de Cercanía {userLocation ? '(GPS Activo)' : '(Ref: Kennedy)'}
          </label>
          <select
            value={maxDistance}
            onChange={(e: any) => setMaxDistance(Number(e.target.value))}
            className="w-full text-xs border border-neutral-300 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-neutral-900 bg-white font-medium"
          >
            <option value={0}>Todas las distancias (Mostrar todo)</option>
            <option value={1}>Cercanos (A menos de 1 km)</option>
            <option value={3}>Cercanos (A menos de 3 km)</option>
            <option value={5}>Cercanos (A menos de 5 km)</option>
            <option value={10}>Cercanos (A menos de 10 km)</option>
            <option value={20}>Cercanos (A menos de 20 km)</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <button
            type="button"
            onClick={requestUserLocation}
            disabled={isLocating}
            className="w-full bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-3 py-2 rounded-lg border border-red-200 transition-colors flex items-center justify-center gap-1.5 shrink-0 h-[38px] disabled:opacity-50 cursor-pointer"
          >
            <Navigation className={`w-3.5 h-3.5 text-red-600 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Obteniendo GPS...' : userLocation ? 'GPS Activo (Actualizar)' : 'Usar Mi Ubicación'}</span>
          </button>
        </div>

        {locationError && (
          <div className="md:col-span-12 text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            {locationError}
          </div>
        )}

        <div className="md:col-span-12 flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex-1 w-full">
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Búsqueda rápida en el mapa por nombre o dirección..." />
          </div>
          {(filterType !== 'all' || filterCat !== 'todos' || maxDistance !== 0 || searchTerm !== '') && (
            <button
              type="button"
              onClick={() => {
                setFilterType('all');
                setFilterCat('todos');
                setMaxDistance(0);
                setSearchTerm('');
              }}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 h-[38px] cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Filtros (Ver Todo)</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leaflet Map Container */}
        <div className="lg:col-span-2 border border-neutral-200 rounded-lg overflow-hidden relative shadow-xs">
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded border border-neutral-200 text-xs font-semibold text-neutral-700 shadow-xs z-[1000] flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-red-600 animate-pulse" />
            <span>Zona de Cobertura Activa: Kennedy • Bogotá D.C.</span>
          </div>

          <div ref={mapContainerRef} className="w-full h-[500px] z-0" />

          {/* Leyenda de Colores: Rojo = GPS Persona, Verde = Beneficiarios, Azul = Voluntarios */}
          <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-neutral-200 p-3 rounded-lg text-xs text-neutral-700 font-bold flex gap-4 shadow-sm z-[1000] flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 inline-block border-2 border-white shadow-xs" />
              <span>Tu Ubicación Actual (Rojo)</span>
            </div>
            {(isBeneficiary || !isVolunteer) && (
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 inline-block border-2 border-white shadow-xs" />
                <span>Eventos para Beneficiarios (Verde)</span>
              </div>
            )}
            {!isBeneficiary && (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block border-2 border-white shadow-xs" />
                  <span>Eventos para Voluntarios (Azul)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-violet-600 inline-block border-2 border-white shadow-xs" />
                  <span>Sedes ONG (Morado)</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="space-y-6">
              {selectedItem.type === 'organization' ? (
                <Card
                  title={selectedItem.data.nombre}
                  subtitle="Información de la ONG"
                  footer={
                    <div className="w-full space-y-2">
                      {selectedItem.data.latitud && selectedItem.data.longitud && (
                        <Button variant="outline" size="sm" className="w-full" onClick={handleCenterOnMap}>
                          <Navigation className="w-4 h-4 mr-1.5" />
                          Centrar en el Mapa
                        </Button>
                      )}
                      <Link to="/events" className="block w-full">
                        <Button variant="primary" size="sm" className="w-full">
                          Ver Convocatorias de Voluntariado
                        </Button>
                      </Link>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      {selectedItem.data.descripcion || 'Esta organización trabaja en Kennedy impulsando causas de apoyo social.'}
                    </p>

                    {userLocation && selectedItem.data.latitud && selectedItem.data.longitud && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-900 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Navigation className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                          <span>Distancia desde ti:</span>
                        </div>
                        <span className="font-extrabold text-xs text-red-700 bg-white px-2 py-0.5 rounded border border-red-100">
                          {calculateDistance(userLocation.lat, userLocation.lng, Number(selectedItem.data.latitud), Number(selectedItem.data.longitud)).toFixed(2)} km
                        </span>
                      </div>
                    )}

                    <div className="space-y-3 text-xs text-neutral-600 font-medium">
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2.5 text-neutral-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-neutral-950">{selectedItem.data.direccion}</p>
                          <p className="text-[10px] text-neutral-400">
                            {selectedItem.data.barrio ? `Barrio: ${selectedItem.data.barrio}` : ''}
                            {selectedItem.data.localidad ? ` | Localidad: ${selectedItem.data.localidad}` : ''}
                          </p>
                        </div>
                      </div>

                      {selectedItem.data.telefono && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2.5 text-neutral-400 shrink-0" />
                          <span>{selectedItem.data.telefono}</span>
                        </div>
                      )}

                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2.5 text-neutral-400 shrink-0" />
                        <a href={`mailto:${selectedItem.data.correo}`} className="text-neutral-900 hover:underline">{selectedItem.data.correo}</a>
                      </div>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card
                  title={selectedItem.data.nombre}
                  subtitle={`${isBeneficiary || getEventAudience(selectedItem.data) === 'beneficiarios' ? 'Evento para Beneficiarios' : 'Evento para Voluntarios'} • ${selectedItem.data.categoria}`}
                  footer={
                    <div className="w-full space-y-2">
                      {selectedItem.data.latitud && selectedItem.data.longitud && (
                        <Button variant="outline" size="sm" className="w-full" onClick={handleCenterOnMap}>
                          <Navigation className="w-4 h-4 mr-1.5" />
                          Centrar en el Mapa
                        </Button>
                      )}
                      <Link to={isBeneficiary ? '/beneficiary' : '/events'} className="block w-full">
                        <Button
                          variant="primary"
                          size="sm"
                          className={`w-full ${isBeneficiary || getEventAudience(selectedItem.data) === 'beneficiarios' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                          {isBeneficiary ? (
                            <>
                              <HeartHandshake className="w-4 h-4 mr-1.5" />
                              Postularme para Recibir Ayuda
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-1.5" />
                              Ver Detalles & Registrarme
                            </>
                          )}
                        </Button>
                      </Link>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                      {selectedItem.data.descripcion}
                    </p>

                    {selectedItem.data.ayudaOfrecida && (isBeneficiary || getEventAudience(selectedItem.data) !== 'voluntarios') && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-emerald-900 text-xs">
                        <span className="font-extrabold uppercase tracking-wider text-[10px] block mb-0.5 text-emerald-700">Ayuda ofrecida</span>
                        <p className="font-medium">{selectedItem.data.ayudaOfrecida}</p>
                      </div>
                    )}

                    {userLocation && selectedItem.data.latitud && selectedItem.data.longitud && (
                      <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-red-900 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Navigation className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                          <span>Distancia desde ti:</span>
                        </div>
                        <span className="font-extrabold text-xs text-red-700 bg-white px-2 py-0.5 rounded border border-red-100">
                          {calculateDistance(userLocation.lat, userLocation.lng, Number(selectedItem.data.latitud), Number(selectedItem.data.longitud)).toFixed(2)} km
                        </span>
                      </div>
                    )}

                    <div className="space-y-3 text-xs text-neutral-600 font-medium">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2.5 text-neutral-400 shrink-0" />
                        <span>Organiza: <strong className="text-neutral-900">{getOrgName(selectedItem.data.organizacionId)}</strong></span>
                      </div>

                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2.5 text-neutral-400 shrink-0" />
                        <span>Fecha: <strong className="text-neutral-950">{formatDate(selectedItem.data.fecha)}</strong></span>
                      </div>

                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 mr-2.5 text-neutral-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-neutral-950">{selectedItem.data.direccion}</p>
                          {selectedItem.data.nombre_lugar && (
                            <p className="text-xs text-neutral-500 font-semibold mt-0.5">
                              Lugar: <span className="text-neutral-800 font-bold">{selectedItem.data.nombre_lugar}</span>
                            </p>
                          )}
                          <p className="text-[10px] text-neutral-400 mt-0.5">
                            {selectedItem.data.barrio ? `Barrio: ${selectedItem.data.barrio}` : ''}
                            {selectedItem.data.localidad ? ` | Localidad: ${selectedItem.data.localidad}` : ''}
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            Bogotá, Colombia
                          </p>
                        </div>
                      </div>

                      {selectedItem.data.punto_referencia && (
                        <div className="bg-neutral-50 p-3 rounded-xl text-xs border border-neutral-100">
                          <span className="font-bold text-neutral-700 block mb-0.5">Punto de referencia:</span>
                          <span className="text-neutral-600">{selectedItem.data.punto_referencia}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded p-6 text-center text-xs text-neutral-400">
              Selecciona un marcador en el mapa para consultar su ficha detallada.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
