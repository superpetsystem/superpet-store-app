import { Service, ServiceAppointment, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Serviços mockados
let mockServices: Service[] = [
  {
    id: '1',
    name: 'Banho',
    type: 'grooming',
    description: 'Banho completo com shampoo e condicionador',
    duration: 60,
    price: 50,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Tosa Completa',
    type: 'grooming',
    description: 'Tosa completa com acabamento',
    duration: 90,
    price: 80,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Banho e Tosa',
    type: 'grooming',
    description: 'Pacote completo de banho e tosa',
    duration: 120,
    price: 120,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Consulta Veterinária',
    type: 'veterinary',
    description: 'Consulta clínica geral',
    duration: 30,
    price: 150,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    name: 'Vacinação',
    type: 'veterinary',
    description: 'Aplicação de vacina',
    duration: 15,
    price: 80,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '6',
    name: 'Hotel - Diária',
    type: 'hotel',
    description: 'Hospedagem de pet por dia',
    duration: 1440, // 24 horas
    price: 100,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '7',
    name: 'Creche - Day Care',
    type: 'daycare',
    description: 'Creche durante o dia',
    duration: 480, // 8 horas
    price: 60,
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// Agendamentos mockados
let mockAppointments: ServiceAppointment[] = [
  {
    id: '1',
    customerId: '1',
    petId: '1',
    serviceId: '3',
    date: '2025-11-15',
    time: '14:00',
    status: 'scheduled',
    notes: '',
    createdBy: '1',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-01T10:00:00Z',
  },
  {
    id: '2',
    customerId: '1',
    petId: '2',
    serviceId: '4',
    date: '2025-11-18',
    time: '10:30',
    status: 'scheduled',
    notes: 'Consulta de rotina',
    createdBy: '1',
    createdAt: '2024-11-01T11:00:00Z',
    updatedAt: '2024-11-01T11:00:00Z',
  },
  {
    id: '3',
    customerId: '2',
    petId: '3',
    serviceId: '1',
    date: '2025-11-10',
    time: '09:00',
    status: 'in-progress',
    notes: '',
    createdBy: '1',
    createdAt: '2024-11-01T08:00:00Z',
    updatedAt: '2024-11-10T09:00:00Z',
  },
];

export const servicesApi = {
  // ========== SERVIÇOS ==========
  
  // Listar serviços
  getServices: async (
    params: PaginationParams = { page: 1, limit: 100 }
  ): Promise<ApiResponse<PaginatedResponse<Service>>> => {
    await delay(400);

    let filtered = [...mockServices];

    // Filtro de busca
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(searchLower) ||
          service.description?.toLowerCase().includes(searchLower) ||
          service.type.toLowerCase().includes(searchLower)
      );
    }

    // Ordenação
    if (params.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Service];
        const bValue = b[params.sortBy as keyof Service];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return params.sortOrder === 'desc' ? -comparison : comparison;
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          const comparison = aValue - bValue;
          return params.sortOrder === 'desc' ? -comparison : comparison;
        }
        
        return 0;
      });
    }

    // Paginação
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const paginatedData = filtered.slice(start, end);

    return {
      success: true,
      data: {
        data: paginatedData,
        total: filtered.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(filtered.length / params.limit),
      },
    };
  },

  // Buscar serviço por ID
  getServiceById: async (id: string): Promise<ApiResponse<Service>> => {
    await delay(300);

    const service = mockServices.find((s) => s.id === id);

    if (!service) {
      return {
        success: false,
        error: 'Serviço não encontrado',
      };
    }

    return {
      success: true,
      data: service,
    };
  },

  // Criar serviço
  createService: async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Service>> => {
    await delay(600);

    if (!serviceData.name || !serviceData.type || !serviceData.duration || !serviceData.price) {
      return {
        success: false,
        error: 'Nome, tipo, duração e preço são obrigatórios',
      };
    }

    const newService: Service = {
      ...serviceData,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockServices.unshift(newService);

    return {
      success: true,
      data: newService,
      message: 'Serviço cadastrado com sucesso',
    };
  },

  // Atualizar serviço
  updateService: async (id: string, serviceData: Partial<Service>): Promise<ApiResponse<Service>> => {
    await delay(500);

    const index = mockServices.findIndex((s) => s.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Serviço não encontrado',
      };
    }

    const updatedService: Service = {
      ...mockServices[index],
      ...serviceData,
      id,
      updatedAt: new Date().toISOString(),
    };

    mockServices[index] = updatedService;

    return {
      success: true,
      data: updatedService,
      message: 'Serviço atualizado com sucesso',
    };
  },

  // Deletar serviço
  deleteService: async (id: string): Promise<ApiResponse<void>> => {
    await delay(400);

    const index = mockServices.findIndex((s) => s.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Serviço não encontrado',
      };
    }

    mockServices.splice(index, 1);

    return {
      success: true,
      message: 'Serviço excluído com sucesso',
    };
  },

  // ========== AGENDAMENTOS ==========

  // Listar agendamentos
  getAppointments: async (
    params: PaginationParams & { date?: string; status?: string; customerId?: string } = { page: 1, limit: 100 }
  ): Promise<ApiResponse<PaginatedResponse<ServiceAppointment>>> => {
    await delay(500);

    let filtered = [...mockAppointments];

    // Filtro por data
    if (params.date) {
      filtered = filtered.filter((apt) => apt.date === params.date);
    }

    // Filtro por status
    if (params.status) {
      filtered = filtered.filter((apt) => apt.status === params.status);
    }

    // Filtro por cliente
    if (params.customerId) {
      filtered = filtered.filter((apt) => apt.customerId === params.customerId);
    }

    // Ordenação
    filtered.sort((a, b) => {
      const dateComparison = a.date.localeCompare(b.date);
      if (dateComparison !== 0) return dateComparison;
      return a.time.localeCompare(b.time);
    });

    // Paginação
    const start = (params.page - 1) * params.limit;
    const end = start + params.limit;
    const paginatedData = filtered.slice(start, end);

    return {
      success: true,
      data: {
        data: paginatedData,
        total: filtered.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(filtered.length / params.limit),
      },
    };
  },

  // Buscar agendamento por ID
  getAppointmentById: async (id: string): Promise<ApiResponse<ServiceAppointment>> => {
    await delay(300);

    const appointment = mockAppointments.find((a) => a.id === id);

    if (!appointment) {
      return {
        success: false,
        error: 'Agendamento não encontrado',
      };
    }

    return {
      success: true,
      data: appointment,
    };
  },

  // Criar agendamento
  createAppointment: async (
    appointmentData: Omit<ServiceAppointment, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<ServiceAppointment>> => {
    await delay(700);

    if (!appointmentData.customerId || !appointmentData.petId || !appointmentData.serviceId || !appointmentData.date || !appointmentData.time) {
      return {
        success: false,
        error: 'Cliente, pet, serviço, data e horário são obrigatórios',
      };
    }

    // Verifica conflito de horário
    const conflictExists = mockAppointments.some(
      (apt) =>
        apt.date === appointmentData.date &&
        apt.time === appointmentData.time &&
        apt.status !== 'cancelled'
    );

    if (conflictExists) {
      return {
        success: false,
        error: 'Já existe um agendamento para este horário',
      };
    }

    const newAppointment: ServiceAppointment = {
      ...appointmentData,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAppointments.unshift(newAppointment);

    return {
      success: true,
      data: newAppointment,
      message: 'Agendamento criado com sucesso',
    };
  },

  // Atualizar agendamento
  updateAppointment: async (
    id: string,
    appointmentData: Partial<ServiceAppointment>
  ): Promise<ApiResponse<ServiceAppointment>> => {
    await delay(600);

    const index = mockAppointments.findIndex((a) => a.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Agendamento não encontrado',
      };
    }

    const updatedAppointment: ServiceAppointment = {
      ...mockAppointments[index],
      ...appointmentData,
      id,
      updatedAt: new Date().toISOString(),
    };

    mockAppointments[index] = updatedAppointment;

    return {
      success: true,
      data: updatedAppointment,
      message: 'Agendamento atualizado com sucesso',
    };
  },

  // Cancelar agendamento
  cancelAppointment: async (id: string): Promise<ApiResponse<ServiceAppointment>> => {
    await delay(500);

    return servicesApi.updateAppointment(id, { status: 'cancelled' });
  },

  // Deletar agendamento
  deleteAppointment: async (id: string): Promise<ApiResponse<void>> => {
    await delay(400);

    const index = mockAppointments.findIndex((a) => a.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Agendamento não encontrado',
      };
    }

    mockAppointments.splice(index, 1);

    return {
      success: true,
      message: 'Agendamento excluído com sucesso',
    };
  },

  // Buscar horários disponíveis
  getAvailableSlots: async (date: string, serviceId: string): Promise<ApiResponse<string[]>> => {
    await delay(400);

    // Gera horários das 8h às 18h
    const slots: string[] = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }

    // Remove horários já agendados
    const bookedSlots = mockAppointments
      .filter((apt) => apt.date === date && apt.status !== 'cancelled')
      .map((apt) => apt.time);

    const availableSlots = slots.filter((slot) => !bookedSlots.includes(slot));

    return {
      success: true,
      data: availableSlots,
    };
  },
};




