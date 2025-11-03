import { HotelRoom, HotelReservation, HotelActivity, HotelServiceType, ReservationStatus, RoomSize } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockRooms: HotelRoom[] = [
  {
    id: '1',
    number: '101',
    size: 'small',
    capacity: 1,
    dailyRate: 80.00,
    amenities: ['Ar condicionado', 'Cama confortável', 'Água e comida'],
    active: true,
  },
  {
    id: '2',
    number: '102',
    size: 'medium',
    capacity: 2,
    dailyRate: 120.00,
    amenities: ['Ar condicionado', 'Área de lazer', 'Água e comida', 'TV com sons relaxantes'],
    active: true,
  },
  {
    id: '3',
    number: '103',
    size: 'large',
    capacity: 3,
    dailyRate: 180.00,
    amenities: ['Ar condicionado', 'Área de lazer', 'Água e comida', 'TV', 'Piscina para pets'],
    active: true,
  },
  {
    id: '4',
    number: '201',
    size: 'suite',
    capacity: 4,
    dailyRate: 250.00,
    amenities: ['Ar condicionado', 'Área VIP', 'Comida premium', 'TV', 'Piscina', 'Câmera 24h'],
    active: true,
  },
];

let mockReservations: HotelReservation[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'João Silva',
    petId: '1',
    petName: 'Rex',
    serviceType: 'hotel',
    roomId: '1',
    roomNumber: '101',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'checked-in',
    dailyRate: 80.00,
    totalDays: 3,
    totalAmount: 240.00,
    services: ['Banho diário', 'Passeios'],
    specialRequests: 'Rex gosta de brincar com bola',
    emergencyContact: {
      name: 'João Silva',
      phone: '(11) 98765-4321',
    },
    medicalNotes: 'Nenhuma restrição',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Ana Costa',
    petId: '2',
    petName: 'Luna',
    serviceType: 'daycare',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date().toISOString().split('T')[0],
    status: 'checked-in',
    dailyRate: 50.00,
    totalDays: 1,
    totalAmount: 50.00,
    services: ['Recreação', 'Socialização'],
    emergencyContact: {
      name: 'Ana Costa',
      phone: '(11) 99999-8888',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockActivities: HotelActivity[] = [
  {
    id: '1',
    reservationId: '1',
    petName: 'Rex',
    activityType: 'meal',
    description: 'Café da manhã - Ração premium',
    time: '08:00',
    performedBy: 'Maria Santos',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    reservationId: '1',
    petName: 'Rex',
    activityType: 'walk',
    description: 'Passeio matinal no jardim',
    time: '09:30',
    performedBy: 'Pedro Silva',
    timestamp: new Date().toISOString(),
  },
  {
    id: '3',
    reservationId: '1',
    petName: 'Rex',
    activityType: 'play',
    description: 'Brincadeira com bola',
    time: '10:30',
    performedBy: 'Pedro Silva',
    timestamp: new Date().toISOString(),
  },
];

export const hotelApi = {
  // Rooms
  getRooms: async () => {
    await delay(400);
    return {
      success: true,
      data: mockRooms.filter(r => r.active),
    };
  },

  getAvailableRooms: async (checkIn: string, checkOut: string) => {
    await delay(500);

    // Verificar quais quartos estão ocupados no período
    const occupiedRooms = mockReservations
      .filter(r => {
        if (r.serviceType === 'daycare') return false; // Creche não ocupa quarto
        if (r.status === 'cancelled' || r.status === 'checked-out') return false;

        const resStart = r.checkInDate;
        const resEnd = r.checkOutDate;

        return !(checkOut < resStart || checkIn > resEnd);
      })
      .map(r => r.roomId);

    const available = mockRooms.filter(r => r.active && !occupiedRooms.includes(r.id));

    return {
      success: true,
      data: available,
    };
  },

  // Reservations
  getReservations: async (customerId?: string) => {
    await delay(500);

    let reservations = [...mockReservations];

    if (customerId) {
      reservations = reservations.filter(r => r.customerId === customerId);
    }

    return {
      success: true,
      data: reservations.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  },

  getReservation: async (id: string) => {
    await delay(400);
    const reservation = mockReservations.find(r => r.id === id);
    return {
      success: true,
      data: reservation || null,
    };
  },

  createReservation: async (data: Omit<HotelReservation, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(800);

    const newReservation: HotelReservation = {
      ...data,
      id: `${mockReservations.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockReservations.push(newReservation);

    return {
      success: true,
      data: newReservation,
    };
  },

  updateReservationStatus: async (id: string, status: ReservationStatus) => {
    await delay(500);

    const index = mockReservations.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Reserva não encontrada',
      };
    }

    mockReservations[index].status = status;
    mockReservations[index].updatedAt = new Date().toISOString();

    return {
      success: true,
      data: mockReservations[index],
    };
  },

  // Activities
  getActivities: async (reservationId: string) => {
    await delay(400);

    const activities = mockActivities
      .filter(a => a.reservationId === reservationId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return {
      success: true,
      data: activities,
    };
  },

  addActivity: async (data: Omit<HotelActivity, 'id' | 'timestamp'>) => {
    await delay(500);

    const newActivity: HotelActivity = {
      ...data,
      id: `${mockActivities.length + 1}`,
      timestamp: new Date().toISOString(),
    };

    mockActivities.push(newActivity);

    return {
      success: true,
      data: newActivity,
    };
  },

  getStatistics: async () => {
    await delay(400);

    const totalReservations = mockReservations.length;
    const activeReservations = mockReservations.filter(r => r.status === 'checked-in').length;
    const totalRevenue = mockReservations
      .filter(r => r.status === 'checked-out')
      .reduce((sum, r) => sum + r.totalAmount, 0);

    const occupancyRate = (activeReservations / mockRooms.length) * 100;

    const byServiceType = {
      hotel: mockReservations.filter(r => r.serviceType === 'hotel').length,
      daycare: mockReservations.filter(r => r.serviceType === 'daycare').length,
    };

    return {
      success: true,
      data: {
        totalReservations,
        activeReservations,
        totalRevenue,
        occupancyRate,
        byServiceType,
        totalRooms: mockRooms.length,
        availableRooms: mockRooms.length - activeReservations,
      },
    };
  },
};

