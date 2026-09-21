export interface OrgDashboardStats {
  totalDonacionesRecibidas: number;
  totalDonacionesCount: number;
  totalVoluntariosPostulados: number;
  totalBeneficiariosPostulados: number;
  eventosActivosCount: number;
  verificada: boolean;
  verificacionEstado?: 'pendiente' | 'aprobada' | 'rechazada' | 'ninguna';
}

export interface VolunteerDashboardStats {
  horasAportadas: number;
  eventosAsistidos: number;
  eventosPendientes: number;
  certificadosCount: number;
  impactoPersonas: number;
}

export interface BeneficiaryDashboardStats {
  solicitudesPendientes: number;
  solicitudesAprobadas: number;
  solicitudesEntregadas: number;
  totalAyudasRecibidas: number;
}

export interface AdminDashboardStats {
  totalUsuarios: number;
  totalOrganizaciones: number;
  totalEventos: number;
  totalDonaciones: number;
  montoTotalRecaudado: number;
  solicitudesVerificacionPendientes: number;
}
