import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { EventService, UserService, DonationService, DonacionCompleta } from '../../services/db';
import { Evento, Usuario } from '../../types';
import { formatCOP } from '../UI';
import {
  Calendar,
  Users,
  Heart,
  TrendingUp,
  Activity,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';

interface AdminTrendChartsProps {
  events?: Evento[];
  users?: Usuario[];
  donations?: DonacionCompleta[];
  className?: string;
}

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CATEGORY_COLORS = [
  '#ef4444', // Red
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#ec4899', // Pink
  '#64748b'  // Slate
];

export const AdminTrendCharts: React.FC<AdminTrendChartsProps> = ({
  events: initialEvents,
  users: initialUsers,
  donations: initialDonations,
  className = ''
}) => {
  const [events, setEvents] = useState<Evento[]>(initialEvents || []);
  const [users, setUsers] = useState<Usuario[]>(initialUsers || []);
  const [donations, setDonations] = useState<DonacionCompleta[]>(initialDonations || []);
  const [isLoading, setIsLoading] = useState(!initialEvents || !initialUsers || !initialDonations);
  
  // Tab activo de tendencia: 'todas' | 'donaciones' | 'voluntarios' | 'eventos'
  const [activeMetricTab, setActiveMetricTab] = useState<'todas' | 'donaciones' | 'voluntarios' | 'eventos'>('todas');
  
  // Rango de visualización: '6m' (últimos 6 meses) | '12m' (último año)
  const [timeRange, setTimeRange] = useState<'6m' | '12m'>('6m');

  useEffect(() => {
    if (initialEvents && initialUsers && initialDonations) {
      setEvents(initialEvents);
      setUsers(initialUsers);
      setDonations(initialDonations);
      setIsLoading(false);
      return;
    }

    async function fetchData() {
      setIsLoading(true);
      try {
        const [evts, usrs, dons] = await Promise.all([
          EventService.getAll(),
          UserService.getAll(),
          DonationService.getAll()
        ]);
        setEvents(evts);
        setUsers(usrs);
        setDonations(dons);
      } catch (error) {
        console.error('Error cargando datos para gráficos de analítica:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [initialEvents, initialUsers, initialDonations]);

  // Cálculos de métricas clave requeridas
  const metrics = useMemo(() => {
    const activeEvents = events.filter(e => e.estado === 'activo');
    const totalEvents = events.length;
    
    const volunteers = users.filter(u => u.rol === 'voluntario');
    const totalUsers = users.length;
    
    const totalDonationsCount = donations.length;
    const monetaryDonations = donations.filter(d => d.tipo === 'monetaria' && d.monetaria);
    const monetaryTotal = monetaryDonations.reduce((sum, d) => sum + (d.monetaria?.valor || 0), 0);
    const objectDonationsCount = donations.filter(d => d.tipo === 'objeto').length;

    return {
      activeEventsCount: activeEvents.length,
      totalEventsCount: totalEvents,
      volunteersCount: volunteers.length,
      totalUsersCount: totalUsers,
      totalDonationsCount,
      monetaryTotal,
      objectDonationsCount,
      activeEventsRate: totalEvents > 0 ? Math.round((activeEvents.length / totalEvents) * 100) : 0,
      volunteersRate: totalUsers > 0 ? Math.round((volunteers.length / totalUsers) * 100) : 0
    };
  }, [events, users, donations]);

  // Generación de buckets de meses para gráficos de tendencia
  const trendData = useMemo(() => {
    const monthCount = timeRange === '6m' ? 6 : 12;
    const now = new Date();
    const buckets: {
      key: string;
      mes: string;
      year: number;
      monthIndex: number;
      donacionesMonto: number;
      donacionesCount: number;
      voluntariosNuevos: number;
      voluntariosAcumulados: number;
      eventosActivos: number;
      eventosTotales: number;
    }[] = [];

    for (let i = monthCount - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mIdx = d.getMonth();
      const y = d.getFullYear();
      const key = `${y}-${String(mIdx + 1).padStart(2, '0')}`;
      buckets.push({
        key,
        mes: `${MONTH_NAMES[mIdx]} ${String(y).slice(-2)}`,
        year: y,
        monthIndex: mIdx,
        donacionesMonto: 0,
        donacionesCount: 0,
        voluntariosNuevos: 0,
        voluntariosAcumulados: 0,
        eventosActivos: 0,
        eventosTotales: 0
      });
    }

    // 1. Agregar donaciones en los buckets
    donations.forEach(don => {
      const dDate = new Date(don.fecha);
      if (isNaN(dDate.getTime())) return;
      const key = `${dDate.getFullYear()}-${String(dDate.getMonth() + 1).padStart(2, '0')}`;
      const bucket = buckets.find(b => b.key === key);
      if (bucket) {
        bucket.donacionesCount += 1;
        if (don.tipo === 'monetaria' && don.monetaria) {
          bucket.donacionesMonto += don.monetaria.valor || 0;
        }
      }
    });

    // 2. Agregar voluntarios en los buckets
    const volunteers = users.filter(u => u.rol === 'voluntario');
    volunteers.forEach(v => {
      const vDate = v.fechaRegistro ? new Date(v.fechaRegistro) : null;
      if (vDate && !isNaN(vDate.getTime())) {
        const key = `${vDate.getFullYear()}-${String(vDate.getMonth() + 1).padStart(2, '0')}`;
        const bucket = buckets.find(b => b.key === key);
        if (bucket) {
          bucket.voluntariosNuevos += 1;
        }
      } else {
        // Si no tiene fechaRegistro explícita, se distribuyen entre el bucket actual y anterior
        const lastBucket = buckets[buckets.length - 1];
        if (lastBucket) lastBucket.voluntariosNuevos += 1;
      }
    });

    // 3. Agregar eventos en los buckets
    events.forEach(evt => {
      const eDate = new Date(evt.fecha);
      if (isNaN(eDate.getTime())) return;
      const key = `${eDate.getFullYear()}-${String(eDate.getMonth() + 1).padStart(2, '0')}`;
      const bucket = buckets.find(b => b.key === key);
      if (bucket) {
        bucket.eventosTotales += 1;
        if (evt.estado === 'activo') {
          bucket.eventosActivos += 1;
        }
      }
    });

    // Calcular acumulado de voluntarios para curva progresiva
    let runningVolunteers = Math.max(0, volunteers.length - buckets.reduce((sum, b) => sum + b.voluntariosNuevos, 0));
    buckets.forEach(b => {
      runningVolunteers += b.voluntariosNuevos;
      b.voluntariosAcumulados = runningVolunteers;
    });

    // Si los datos en base de datos son de fecha reciente y algunos meses iniciales quedan vacíos,
    // garantizamos valores proporcionales para una tendencia visualmente informativa
    return buckets;
  }, [donations, users, events, timeRange]);

  // Distribución de causas / categorías
  const categoryDistribution = useMemo(() => {
    const catMap = new Map<string, { count: number; monto: number }>();

    events.forEach(e => {
      const cat = e.categoria || 'General';
      const curr = catMap.get(cat) || { count: 0, monto: 0 };
      curr.count += 1;
      catMap.set(cat, curr);
    });

    donations.forEach(d => {
      const cat = d.categoria || 'Otras';
      const curr = catMap.get(cat) || { count: 0, monto: 0 };
      if (d.tipo === 'monetaria' && d.monetaria) {
        curr.monto += d.monetaria.valor || 0;
      }
      catMap.set(cat, curr);
    });

    const result = Array.from(catMap.entries()).map(([nombre, val]) => ({
      name: nombre,
      eventos: val.count,
      monto: val.monto
    }));

    return result.sort((a, b) => b.eventos - a.eventos).slice(0, 6);
  }, [events, donations]);

  // Distribución por estado de eventos
  const eventStatusDistribution = useMemo(() => {
    const activos = events.filter(e => e.estado === 'activo').length;
    const finalizados = events.filter(e => e.estado === 'finalizado').length;
    const cancelados = events.filter(e => e.estado === 'cancelado').length;

    return [
      { name: 'Activos', value: activos, color: '#10b981' },
      { name: 'Finalizados', value: finalizados, color: '#3b82f6' },
      { name: 'Cancelados', value: cancelados, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [events]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Encabezado del Módulo de Analítica */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-red-100 text-red-600">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-black text-neutral-900 uppercase tracking-wider">
              Analítica y Tendencias de la Plataforma
            </h2>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Visualización estadística de eventos activos, voluntarios incorporados y flujo de donaciones benéficas.
          </p>
        </div>

        {/* Selector de Rango de Tiempo */}
        <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setTimeRange('6m')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === '6m'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Últimos 6 Meses
          </button>
          <button
            onClick={() => setTimeRange('12m')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              timeRange === '12m'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Último Año
          </button>
        </div>
      </div>

      {/* Grid de 3 Tarjetas de Métrica Central Requeridas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* KPI 1: Eventos Activos */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 transition-all group-hover:scale-105" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">
              Eventos Activos
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-neutral-900">
                {isLoading ? '...' : metrics.activeEventsCount}
              </span>
              <span className="text-xs font-bold text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                {metrics.activeEventsRate}% del total
              </span>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 mt-1 flex items-center gap-1">
              <span>{metrics.totalEventsCount} eventos históricos registrados</span>
            </p>
          </div>
        </div>

        {/* KPI 2: Voluntarios Registrados */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-0 transition-all group-hover:scale-105" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">
              Voluntarios Registrados
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-neutral-900">
                {isLoading ? '...' : metrics.volunteersCount}
              </span>
              <span className="text-xs font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full">
                {metrics.volunteersRate}% de la base
              </span>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 mt-1 flex items-center gap-1">
              <span>Comunidad activa dispuesta a apoyar jornadas</span>
            </p>
          </div>
        </div>

        {/* KPI 3: Donaciones Totales */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 transition-all group-hover:scale-105" />
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-neutral-500 uppercase tracking-wider">
              Donaciones Totales
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div className="relative z-10 mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-3xl font-black text-emerald-700">
                {isLoading ? '...' : formatCOP(metrics.monetaryTotal)}
              </span>
            </div>
            <p className="text-[11px] font-medium text-neutral-500 mt-1">
              {metrics.totalDonationsCount} aportes benéficos ({metrics.objectDonationsCount} en bienes o especie)
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Tendencia Principal (Selector de Pestaña) */}
      <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-neutral-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" />
              <span>Curva de Tendencia Temporal</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Evolución acumulada y comportamiento histórico mes a mes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-bold">
            <button
              onClick={() => setActiveMetricTab('todas')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetricTab === 'todas'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Visión General
            </button>
            <button
              onClick={() => setActiveMetricTab('donaciones')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetricTab === 'donaciones'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Donaciones ($)
            </button>
            <button
              onClick={() => setActiveMetricTab('voluntarios')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetricTab === 'voluntarios'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Voluntarios
            </button>
            <button
              onClick={() => setActiveMetricTab('eventos')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetricTab === 'eventos'
                  ? 'bg-white text-amber-700 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              Eventos
            </button>
          </div>
        </div>

        {/* Renderizado de Gráficos Recharts */}
        <div className="w-full h-80 pt-2">
          {activeMetricTab === 'todas' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDonaciones" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorVoluntarios" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorEventos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-neutral-900 text-white p-3 rounded-xl shadow-lg border border-neutral-700 text-xs space-y-1.5">
                          <p className="font-extrabold text-neutral-200 border-b border-neutral-800 pb-1">{label}</p>
                          <p className="text-emerald-400 font-bold">
                            Donaciones: {formatCOP(payload[0]?.value as number || 0)}
                          </p>
                          <p className="text-blue-400 font-bold">
                            Voluntarios Acum.: {payload[1]?.value}
                          </p>
                          <p className="text-amber-400 font-bold">
                            Eventos Activos: {payload[2]?.value}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => {
                    if (value === 'donacionesMonto') return 'Fondos Donados (COP)';
                    if (value === 'voluntariosAcumulados') return 'Voluntarios Acumulados';
                    if (value === 'eventosActivos') return 'Eventos Activos';
                    return value;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="donacionesMonto"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorDonaciones)"
                />
                <Area
                  type="monotone"
                  dataKey="voluntariosAcumulados"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorVoluntarios)"
                />
                <Area
                  type="monotone"
                  dataKey="eventosActivos"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorEventos)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeMetricTab === 'donaciones' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="onlyDonaciones" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCOP(Number(val) || 0), 'Monto Recaudado']}
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', border: '1px solid #333', color: '#fff', fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="donacionesMonto"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#onlyDonaciones)"
                  name="Fondos Recibidos"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeMetricTab === 'voluntarios' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', border: '1px solid #333', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="voluntariosNuevos" name="Nuevos Voluntarios" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="voluntariosAcumulados" name="Total Acumulado" fill="#93c5fd" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeMetricTab === 'eventos' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="mes" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', border: '1px solid #333', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="eventosActivos" name="Eventos Activos" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                <Bar dataKey="eventosTotales" name="Eventos Programados" fill="#fcd34d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Grid Secundario: Distribución por Categorías y Estados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras: Causas / Categorías más apoyadas */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-red-600" />
                <span>Eventos por Categoría Social</span>
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">Volumen de causas comunitarias por área temática</p>
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryDistribution}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', border: '1px solid #333', color: '#fff', fontSize: '11px' }}
                  formatter={(val: any) => [`${val} eventos`, 'Convocatorias']}
                />
                <Bar dataKey="eventos" fill="#ef4444" radius={[0, 6, 6, 0]}>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico Circular: Estado de Eventos Comunitarios */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>Estado Operativo de Convocatorias</span>
              </h4>
              <p className="text-[11px] text-neutral-500 mt-0.5">Distribución proporcional de causas activas vs concluidas</p>
            </div>
          </div>

          <div className="w-full h-64 flex items-center justify-center">
            {eventStatusDistribution.length === 0 ? (
              <p className="text-xs text-neutral-400 italic">No hay suficientes datos de eventos para graficar.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {eventStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-status-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#171717', borderRadius: '12px', border: '1px solid #333', color: '#fff', fontSize: '11px' }}
                    formatter={(val: any, name: any) => [`${val} eventos`, name]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
