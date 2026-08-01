export interface OrganizationHistory {
  id: string;
  organizationId: string;
  campo: string;
  valorAntiguo: string;
  valorNuevo: string;
  usuarioId: string;
  fecha: Date;
}