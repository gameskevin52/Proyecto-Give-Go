export type UserRole = 'Voluntario' | 'Administrador';

export type DonationType = 'monetario' | 'objeto';

export type ObjectCategory =
  | 'Muebles'
  | 'Ropa y Calzado'
  | 'Electrodomésticos'
  | 'Juguetes'
  | 'Alimentos no perecederos'
  | 'Libros y Útiles'
  | 'Artículos del Hogar'
  | 'Otros';

export type ObjectCondition =
  | 'Nuevo'
  | 'Como nuevo'
  | 'Buen estado'
  | 'Usado con detalles';

export type DeliveryMethod = 'recogida_domicilio' | 'punto_entrega';

export type PaymentMethodType =
  | 'tarjeta'
  | 'pse'
  | 'nequi'
  | 'daviplata'
  | 'efecty';

export type DonationStatus =
  | 'Pendiente'
  | 'Aprobado'
  | 'Programado'
  | 'En tránsito'
  | 'Completado'
  | 'Rechazado';

export interface Organization {
  id: string;
  name: string;
  category: 'Niñez' | 'Alimentos' | 'Mascotas' | 'Salud' | 'Educación' | 'Desastres';
  description: string;
  logo: string;
  coverImage: string;
  verified: boolean;
  location: string;
  phone: string;
  email: string;
  impactSummary: string;
  targetAmount?: number;
  raisedAmount?: number;
  neededItems: string[];
}

export interface MonetaryDonationData {
  organizationId: string;
  amount: number;
  frequency: 'unica' | 'mensual';
  paymentMethod: PaymentMethodType;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  isAnonymous: boolean;
  needsTaxReceipt: boolean;
  taxRfc?: string; // NIT / Cédula para certificado donación
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardHolder?: string;
}

export interface ObjectDonationData {
  organizationId: string;
  title: string;
  category: ObjectCategory;
  condition: ObjectCondition;
  quantity: number;
  description: string;
  images: string[];
  deliveryMethod: DeliveryMethod;
  pickupAddress?: string;
  pickupCity?: string;
  pickupZip?: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
  dropoffLocationId?: string;
  donorName: string;
  donorPhone: string;
  donorEmail: string;
  notes?: string;
}

export interface DonationRecord {
  id: string;
  trackingNumber: string;
  type: DonationType;
  organizationId: string;
  organizationName: string;
  organizationLogo: string;
  date: string;
  status: DonationStatus;
  userRole: UserRole;
  // Monetary details
  amount?: number;
  paymentMethod?: PaymentMethodType;
  frequency?: 'unica' | 'mensual';
  // Object details
  itemTitle?: string;
  category?: ObjectCategory;
  condition?: ObjectCondition;
  quantity?: number;
  images?: string[];
  deliveryMethod?: DeliveryMethod;
  pickupDate?: string;
  pickupTimeSlot?: string;
  pickupAddress?: string;
}
