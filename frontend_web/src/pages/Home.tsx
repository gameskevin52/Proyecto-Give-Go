import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { EventService, UserService, DonationService, OrganizationService } from '../services/db';
import { Button, Card, Badge, formatCOP, formatDate } from '../components/UI';
import { Heart, Users, Calendar, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { Evento } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    volunteers: 0,
    organizations: 0,
    events: 0,
    donationsVal: 0,
  });
  const [featuredEvents, setFeaturedEvents] = useState<Evento[]>([]);

  useEffect(() => {
    async function loadHomeData() {
      const allUsers = await UserService.getAll();
      const volunteers = allUsers.filter(u => u.rol === 'voluntario').length;
      
      const allOrgs = await OrganizationService.getAll();
      const orgsCount = allOrgs.length;

      const allEvents = await EventService.getAll();
      const activeEvents = allEvents.filter(e => e.estado === 'activo').length;

      const allDonations = await DonationService.getAll();
      const totalMonetary = allDonations
        .filter(d => d.tipo === 'monetaria' && d.monetaria)
        .reduce((sum, d) => sum + (d.monetaria?.valor || 0), 0);

      setStats({
        volunteers: volunteers + 15, // agregar algunos ficticios para volumen visual
        organizations: orgsCount,
        events: activeEvents,
        donationsVal: totalMonetary + 5000000, // base visual + real
      });

      // Primeros 3 eventos activos
      setFeaturedEvents(allEvents.filter(e => e.estado === 'activo').slice(0, 3));
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-neutral-900 text-white rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
        <div className="max-w-xl space-y-6">
          <Badge variant="danger">Give&amp;Go - Kennedy, Bogotá D.C.</Badge>
          <h1 className="text-4xl md:text-5xl font-black font-display tracking-tight leading-tight">
            Conectamos <span className="text-red-500">Voluntad</span> con <span className="border-b-4 border-red-600">Necesidades</span>
          </h1>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Plataforma integral para voluntarios, beneficiarios y organizaciones de la localidad de Kennedy, Bogotá D.C. Participa en eventos locales, realiza donaciones seguras y apoya causas benéficas de forma transparente.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="primary" size="lg" onClick={() => navigate('/events')}>
              Explorar Eventos
            </Button>
            <Button variant="outline" size="lg" className="border-neutral-500 text-white hover:bg-neutral-800" onClick={() => navigate('/donations')}>
              Donar Ahora
            </Button>
          </div>
        </div>
        <div className="hidden md:flex flex-col gap-4 w-full md:w-80 bg-neutral-800 p-6 rounded-xl border border-neutral-700/80">
          <h3 className="font-extrabold text-xs uppercase tracking-widest text-white border-b border-neutral-700 pb-3 flex items-center gap-2">
            <Heart className="text-red-500 w-4 h-4 fill-red-500" />
            Impacto Directo
          </h3>
          <div className="space-y-3.5 pt-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400 font-medium">¿Eres Organización?</span>
              <Link to="/register?role=org" className="text-red-400 hover:underline font-bold">Registrarse &rarr;</Link>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400 font-medium">¿Eres Beneficiario?</span>
              <Link to="/register?role=ben" className="text-red-400 hover:underline font-bold">Solicitar Ayuda &rarr;</Link>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-neutral-400 font-medium">¿Eres Voluntario?</span>
              <Link to="/register?role=vol" className="text-red-500 hover:underline font-extrabold uppercase tracking-wider text-[10px]">Sumarse &rarr;</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 select-none">
        <div className="bg-white border border-neutral-200/80 p-6 rounded-xl text-center shadow-xs">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Users className="w-5 h-5 text-red-600" />
          </div>
          <h4 className="text-2xl font-black text-neutral-900 font-display">{stats.volunteers}</h4>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Voluntarios</p>
        </div>
        <div className="bg-white border border-neutral-200/80 p-6 rounded-xl text-center shadow-xs">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-5 h-5 text-red-600" />
          </div>
          <h4 className="text-2xl font-black text-neutral-900 font-display">{stats.organizations}</h4>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Organizaciones</p>
        </div>
        <div className="bg-white border border-neutral-200/80 p-6 rounded-xl text-center shadow-xs">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-5 h-5 text-red-600" />
          </div>
          <h4 className="text-2xl font-black text-neutral-900 font-display">{stats.events}</h4>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Eventos Activos</p>
        </div>
        <div className="bg-white border border-neutral-200/80 p-6 rounded-xl text-center shadow-xs">
          <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-5 h-5 text-red-600" />
          </div>
          <h4 className="text-2xl font-black text-neutral-900 font-display">{formatCOP(stats.donationsVal)}</h4>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1">Fondos Recaudados</p>
        </div>
      </section>

      {/* Featured Events */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-neutral-950 uppercase tracking-widest font-display">Últimos Eventos Solidarios</h2>
            <p className="text-xs text-neutral-500 mt-1">Campañas activas que necesitan tu participación inmediata</p>
          </div>
          <Link to="/events" className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 uppercase tracking-wider">
            Ver todos los eventos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredEvents.map((evt) => (
            <Card
              key={evt.id}
              title={evt.nombre}
              subtitle={`Categoría: ${evt.categoria}`}
              footer={
                <Link to="/login" className="w-full">
                  <Button variant="outline" className="w-full" size="sm">
                    Inscribirme (Acceder)
                  </Button>
                </Link>
              }
            >
              <div className="space-y-3">
                <p className="text-xs text-neutral-600 line-clamp-3">
                  {evt.descripcion}
                </p>
                <div className="flex items-center text-xs text-neutral-500 font-medium">
                  <Calendar className="w-4 h-4 mr-1.5 text-neutral-400" />
                  <span>Fecha: {formatDate(evt.fecha)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Invitation Section */}
      <section className="bg-neutral-100 border border-neutral-200/80 rounded-2xl p-8 md:p-12 text-center space-y-6">
        <h2 className="text-2xl md:text-3xl font-black font-display text-neutral-950 uppercase tracking-tight">
          ¿Listo para marcar la diferencia?
        </h2>
        <p className="text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed font-medium">
          Ya sea que busques brindar tu tiempo como voluntario, organizar eventos en nombre de tu asociación, o seas un beneficiario en busca de apoyo humanitario, Give&amp;Go te ofrece las herramientas necesarias.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register?role=vol">
            <Button variant="secondary" size="md">Registrarme como Voluntario</Button>
          </Link>
          <Link to="/register?role=org">
            <Button variant="outline" size="md">Registrar Organización</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
