// ============================================
// TIPOS DE USUÁRIO E AUTENTICAÇÃO
// ============================================

export type UserRole = 'owner' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// CLIENTES (TUTORES)
// ============================================

export interface Address {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  address?: Address;
  preferences?: {
    contactMethod?: 'email' | 'phone' | 'whatsapp';
    receivePromotions?: boolean;
    receiveReminders?: boolean;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomersState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// PETS
// ============================================

export type PetSpecies = 'dog' | 'cat' | 'bird' | 'rabbit' | 'hamster' | 'other';
export type PetSize = 'small' | 'medium' | 'large' | 'extra-large';
export type PetGender = 'male' | 'female';

export interface Pet {
  id: string;
  customerId: string;
  name: string;
  species: PetSpecies;
  breed?: string;
  gender: PetGender;
  birthDate?: string;
  age?: number;
  weight?: number;
  size?: PetSize;
  color?: string;
  microchip?: string;
  neutered?: boolean;
  allergies?: string[];
  medications?: string[];
  specialCare?: string;
  photo?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetsState {
  pets: Pet[];
  selectedPet: Pet | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// SERVIÇOS
// ============================================

export type ServiceType = 'grooming' | 'veterinary' | 'hotel' | 'daycare' | 'training' | 'other';
export type ServiceStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

export interface Service {
  id: string;
  name: string;
  type: ServiceType;
  description?: string;
  duration: number; // em minutos
  price: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAppointment {
  id: string;
  customerId: string;
  petId: string;
  serviceId: string;
  date: string;
  time: string;
  status: ServiceStatus;
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesState {
  services: Service[];
  appointments: ServiceAppointment[];
  selectedAppointment: ServiceAppointment | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// AGENDA / AGENDAMENTOS
// ============================================

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  petId: string;
  petName: string;
  serviceId: string;
  serviceName: string;
  serviceType: ServiceType;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  duration: number; // minutos
  status: AppointmentStatus;
  employeeId?: string;
  employeeName?: string;
  notes?: string;
  reminderSent?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeBlock {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  createdBy: string;
  createdAt: string;
}

export interface AppointmentsState {
  appointments: Appointment[];
  timeBlocks: TimeBlock[];
  selectedAppointment: Appointment | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// VACINAÇÃO
// ============================================

export type VaccineStatus = 'pending' | 'applied' | 'overdue';

export interface Vaccination {
  id: string;
  petId: string;
  petName: string;
  vaccineName: string;
  manufacturer?: string;
  batchNumber?: string;
  applicationDate: string;
  nextDoseDate?: string;
  veterinarianName?: string;
  veterinarianCrmv?: string;
  clinicName?: string;
  notes?: string;
  attachments?: string[]; // URLs de fotos da carteirinha
  status: VaccineStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaccinationsState {
  vaccinations: Vaccination[];
  selectedVaccination: Vaccination | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// ORDEM DE SERVIÇO (BANHO/TOSA)
// ============================================

export type ServiceOrderStatus = 'waiting' | 'in-progress' | 'completed' | 'cancelled';

export interface ServiceItem {
  id: string;
  serviceId: string;
  serviceName: string;
  price: number;
  quantity: number;
}

export interface ServiceOrder {
  id: string;
  customerId: string;
  petId: string;
  appointmentId?: string;
  items: ServiceItem[];
  status: ServiceOrderStatus;
  checkInTime?: string;
  checkOutTime?: string;
  observations?: string;
  groomerNotes?: string;
  beforePhotos?: string[];
  afterPhotos?: string[];
  totalAmount: number;
  paid: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceOrdersState {
  orders: ServiceOrder[];
  selectedOrder: ServiceOrder | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// PRODUTOS
// ============================================

export type ProductCategory = 'food' | 'toy' | 'accessory' | 'medicine' | 'hygiene' | 'other';

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: ProductCategory;
  sku: string;
  barcode?: string;
  price: number;
  costPrice?: number;
  stock: number;
  minStock: number;
  unit: string;
  brand?: string;
  supplier?: string;
  expirationDate?: string;
  photo?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// PDV / VENDAS
// ============================================

export type PaymentMethod = 'cash' | 'debit' | 'credit' | 'pix' | 'check' | 'multiple';
export type SaleStatus = 'pending' | 'completed' | 'cancelled' | 'refunded';

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

export interface Sale {
  id: string;
  customerId?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: any;
  status: SaleStatus;
  notes?: string;
  cashierId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesState {
  sales: Sale[];
  currentSale: Sale | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// ESTOQUE
// ============================================

export type StockMovementType = 'entry' | 'exit' | 'adjustment' | 'return' | 'loss';

export interface StockMovement {
  id: string;
  productId: string;
  type: StockMovementType;
  quantity: number;
  reason: string;
  notes?: string;
  userId: string;
  createdAt: string;
}

export interface StockState {
  movements: StockMovement[];
  loading: boolean;
  error: string | null;
}

// ============================================
// HELPERS E UTILIDADES
// ============================================

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}



