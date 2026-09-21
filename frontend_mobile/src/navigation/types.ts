export type RootStackParamList = {
  Auth: undefined;
  MainTabs: undefined;
  EventDetail: { eventId: number };
  CreateEvent: undefined;
  EditEvent: { event: any };
  CreateDonation: { defaultOrgId?: number | string } | undefined;
  CreateRequest: undefined;
  EditProfile: { profile: any };
  MapaSocial: undefined;
  Dashboard: undefined;
  AdminUsers: undefined;
  AdminOrganizations: undefined;
  AdminVerifications: undefined;
  AdminEvents: undefined;
  AdminDonations: undefined;
  AdminCategories: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  RegisterVolunteer: undefined;
  RegisterBeneficiary: undefined;
  RegisterOrganization: undefined;
  ForgotPassword: undefined;
};

export type BottomTabParamList = {
  Inicio: undefined;
  Mapa: undefined;
  Eventos: undefined;
  Donaciones: undefined;
  Dashboard: undefined;
  Solicitudes: undefined;
  Notificaciones: undefined;
  Perfil: undefined;
};
