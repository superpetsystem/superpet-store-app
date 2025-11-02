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
// FORNECEDORES
// ============================================

export type SupplierCategory = 'food' | 'medicine' | 'accessories' | 'services' | 'equipment' | 'other';

export interface Supplier {
  id: string;
  name: string;
  cnpj?: string;
  email?: string;
  phone: string;
  address?: Address;
  category: SupplierCategory;
  products?: string[]; // Lista de produtos que fornece
  paymentTerms?: string; // Prazos de pagamento (ex: "30/60 dias")
  deliveryTime?: number; // Tempo de entrega em dias
  minimumOrder?: number; // Valor mínimo do pedido
  contactPerson?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SuppliersState {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// PREÇOS E PROMOÇÕES
// ============================================

export type PromotionType = 'percentage' | 'fixed' | 'combo' | 'buy-x-get-y';

export interface PriceTable {
  id: string;
  productId: string;
  productName: string;
  basePrice: number;
  salePrice?: number;
  memberPrice?: number; // Preço para clientes VIP
  minimumQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: PromotionType;
  discount: number; // Porcentagem ou valor fixo
  productIds?: string[]; // Produtos incluídos
  serviceIds?: string[]; // Serviços incluídos
  startDate: string;
  endDate: string;
  active: boolean;
  minimumPurchase?: number;
  maxUses?: number;
  usedCount: number;
  conditions?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PromotionsState {
  prices: PriceTable[];
  promotions: Promotion[];
  selectedPromotion: Promotion | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// LEMBRETES E NOTIFICAÇÕES
// ============================================

export type ReminderType = 'vaccination' | 'grooming' | 'appointment' | 'birthday' | 'custom';
export type ReminderChannel = 'email' | 'sms' | 'whatsapp' | 'push';
export type ReminderStatus = 'pending' | 'sent' | 'failed' | 'cancelled';

export interface Reminder {
  id: string;
  type: ReminderType;
  customerId: string;
  customerName: string;
  petId?: string;
  petName?: string;
  title: string;
  message: string;
  channel: ReminderChannel;
  scheduledDate: string;
  scheduledTime: string;
  status: ReminderStatus;
  sentAt?: string;
  error?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  type: ReminderType;
  subject: string;
  message: string;
  channel: ReminderChannel;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RemindersState {
  reminders: Reminder[];
  templates: ReminderTemplate[];
  selectedReminder: Reminder | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// CONTAS A RECEBER
// ============================================

export type AccountStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';
export type PaymentType = 'boleto' | 'pix' | 'credit-card' | 'debit-card' | 'cash';

export interface AccountReceivable {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentType?: PaymentType;
  status: AccountStatus;
  installment?: number; // Parcela atual
  totalInstallments?: number; // Total de parcelas
  notes?: string;
  saleId?: string; // Referência a uma venda
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountsReceivableState {
  accounts: AccountReceivable[];
  selectedAccount: AccountReceivable | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// PERFIS E PERMISSÕES
// ============================================

export type UserRole2 = 'admin' | 'manager' | 'attendant' | 'groomer' | 'veterinarian' | 'cashier';

export interface Permission {
  id: string;
  module: string;
  action: 'create' | 'read' | 'update' | 'delete';
  description: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  roleId: string;
  roleName: string;
  phone?: string;
  avatar?: string;
  active: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  description: string;
  ipAddress?: string;
  timestamp: string;
}

export interface UsersState {
  users: SystemUser[];
  roles: Role[];
  auditLogs: AuditLog[];
  selectedUser: SystemUser | null;
  selectedRole: Role | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// CRM - HISTÓRICO E TAGS
// ============================================

export type InteractionType = 'call' | 'email' | 'whatsapp' | 'visit' | 'purchase' | 'service' | 'complaint' | 'note';

export interface CustomerInteraction {
  id: string;
  customerId: string;
  type: InteractionType;
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  relatedId?: string; // ID de venda, serviço, etc.
  timestamp: string;
}

export interface CustomerTag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface CRMState {
  interactions: CustomerInteraction[];
  tags: CustomerTag[];
  loading: boolean;
  error: string | null;
}

// ============================================
// CARTEIRINHA DIGITAL DO PET
// ============================================

export interface PetCard {
  id: string;
  petId: string;
  qrCode?: string; // QR Code para acesso rápido
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalNotes?: string;
  lastCheckup?: string;
  veterinarian?: {
    name: string;
    clinic: string;
    phone: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    validUntil: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================
// AVALIAÇÕES E NPS
// ============================================

export type ReviewType = 'service' | 'product' | 'general';

export interface Review {
  id: string;
  customerId: string;
  customerName: string;
  type: ReviewType;
  relatedId?: string; // ID do serviço ou produto
  relatedName?: string;
  rating: number; // 1-5
  npsScore?: number; // 0-10
  comment?: string;
  wouldRecommend: boolean;
  tags?: string[]; // 'atendimento', 'qualidade', 'preço', etc.
  response?: string; // Resposta da loja
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsState {
  reviews: Review[];
  selectedReview: Review | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// GROOMING - FOTOS ANTES/DEPOIS
// ============================================

export interface GroomingPhoto {
  id: string;
  serviceOrderId: string;
  petId: string;
  petName: string;
  type: 'before' | 'after';
  url: string;
  notes?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface GroomingPhotosState {
  photos: GroomingPhoto[];
  loading: boolean;
  error: string | null;
}

// ============================================
// PROGRAMA DE FIDELIDADE
// ============================================

export type RewardType = 'points' | 'cashback' | 'discount';
export type LoyaltyTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface LoyaltyProgram {
  id: string;
  customerId: string;
  customerName: string;
  tier: LoyaltyTier;
  totalPoints: number;
  availablePoints: number;
  cashbackBalance: number;
  lifetimeSpent: number;
  joinDate: string;
  lastActivity: string;
}

export interface PointsTransaction {
  id: string;
  customerId: string;
  type: 'earned' | 'redeemed' | 'expired';
  points: number;
  description: string;
  relatedId?: string; // Sale ou Service ID
  timestamp: string;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  active: boolean;
  stock?: number;
  createdAt: string;
}

export interface LoyaltyState {
  programs: LoyaltyProgram[];
  transactions: PointsTransaction[];
  rewards: LoyaltyReward[];
  loading: boolean;
  error: string | null;
}

// ============================================
// E-COMMERCE / CARRINHO
// ============================================

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  stock: number;
}

export interface Cart {
  id: string;
  customerId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: Address;
  trackingCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartState {
  cart: Cart | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
}

// ============================================
// PAGAMENTOS ONLINE
// ============================================

export type PaymentMethod = 'pix' | 'credit-card' | 'debit-card' | 'boleto';
export type PaymentStatus = 'pending' | 'processing' | 'approved' | 'rejected' | 'cancelled';

export interface PaymentLink {
  id: string;
  customerId: string;
  amount: number;
  description: string;
  paymentMethod?: PaymentMethod;
  status: PaymentStatus;
  link: string;
  qrCode?: string; // Para PIX
  expiresAt: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  paymentLinkId: string;
  customerId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string; // ID da gateway
  authCode?: string;
  timestamp: string;
}

export interface PaymentsState {
  paymentLinks: PaymentLink[];
  transactions: PaymentTransaction[];
  loading: boolean;
  error: string | null;
}

// ============================================
// ASSINATURAS
// ============================================

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled' | 'expired';
export type SubscriptionInterval = 'weekly' | 'biweekly' | 'monthly' | 'bimonthly';

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  nextDelivery: string;
  startDate: string;
  endDate?: string;
  paymentMethod: string;
  shippingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionDelivery {
  id: string;
  subscriptionId: string;
  deliveryDate: string;
  status: 'scheduled' | 'shipped' | 'delivered' | 'failed';
  trackingCode?: string;
  createdAt: string;
}

export interface SubscriptionsState {
  subscriptions: Subscription[];
  deliveries: SubscriptionDelivery[];
  selectedSubscription: Subscription | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// COMPRAS E NOTAS DE ENTRADA
// ============================================

export type PurchaseOrderStatus = 'draft' | 'sent' | 'received' | 'cancelled';

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  orderNumber: string;
  orderDate: string;
  expectedDelivery: string;
  receivedDate?: string;
  status: PurchaseOrderStatus;
  items: PurchaseOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  notes?: string;
  invoiceNumber?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseOrdersState {
  orders: PurchaseOrder[];
  selectedOrder: PurchaseOrder | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// INVENTÁRIO E AJUSTES
// ============================================

export type InventoryCountStatus = 'in-progress' | 'completed' | 'cancelled';
export type AdjustmentReason = 'count' | 'damage' | 'expiration' | 'theft' | 'return' | 'other';

export interface InventoryCount {
  id: string;
  countDate: string;
  status: InventoryCountStatus;
  countedBy: string;
  items: InventoryCountItem[];
  totalAdjustments: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryCountItem {
  productId: string;
  productName: string;
  expectedQuantity: number;
  countedQuantity: number;
  difference: number;
  adjustmentReason?: AdjustmentReason;
  notes?: string;
}

export interface InventoryAdjustment {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  reason: AdjustmentReason;
  notes?: string;
  adjustedBy: string;
  timestamp: string;
}

export interface InventoryState {
  counts: InventoryCount[];
  adjustments: InventoryAdjustment[];
  selectedCount: InventoryCount | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// COMISSIONAMENTO
// ============================================

export type CommissionType = 'percentage' | 'fixed';
export type CommissionTrigger = 'sale' | 'service' | 'both';

export interface CommissionRule {
  id: string;
  name: string;
  description: string;
  type: CommissionType;
  value: number; // Percentage or fixed amount
  trigger: CommissionTrigger;
  minValue?: number; // Minimum sale/service value to trigger
  productCategories?: string[]; // Specific categories
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Commission {
  id: string;
  employeeId: string;
  employeeName: string;
  ruleId: string;
  ruleName: string;
  relatedType: 'sale' | 'service';
  relatedId: string;
  baseValue: number;
  commissionValue: number;
  status: 'pending' | 'paid';
  paidAt?: string;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface CommissionsState {
  rules: CommissionRule[];
  commissions: Commission[];
  selectedRule: CommissionRule | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// HOTEL E CRECHE
// ============================================

export type HotelServiceType = 'hotel' | 'daycare';
export type ReservationStatus = 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
export type RoomSize = 'small' | 'medium' | 'large' | 'suite';

export interface HotelRoom {
  id: string;
  number: string;
  size: RoomSize;
  capacity: number;
  dailyRate: number;
  amenities: string[];
  active: boolean;
}

export interface HotelReservation {
  id: string;
  customerId: string;
  customerName: string;
  petId: string;
  petName: string;
  serviceType: HotelServiceType;
  roomId?: string;
  roomNumber?: string;
  checkInDate: string;
  checkOutDate: string;
  status: ReservationStatus;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  services: string[]; // Bath, grooming, walks, etc.
  specialRequests?: string;
  emergencyContact: {
    name: string;
    phone: string;
  };
  medicalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HotelActivity {
  id: string;
  reservationId: string;
  petName: string;
  activityType: 'meal' | 'medication' | 'walk' | 'play' | 'grooming' | 'vet-visit' | 'photo' | 'note';
  description: string;
  time: string;
  performedBy: string;
  photos?: string[];
  timestamp: string;
}

export interface HotelState {
  rooms: HotelRoom[];
  reservations: HotelReservation[];
  activities: HotelActivity[];
  selectedReservation: HotelReservation | null;
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



