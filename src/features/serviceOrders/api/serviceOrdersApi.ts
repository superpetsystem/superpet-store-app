import { ServiceOrder, ServiceItem, ApiResponse, PaginationParams } from '../../../types';

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dados mockados
let mockServiceOrders: ServiceOrder[] = [
  {
    id: '1',
    customerId: '1',
    petId: '1',
    appointmentId: undefined,
    items: [
      {
        id: '1',
        serviceId: 'srv1',
        serviceName: 'Banho Completo',
        price: 60.00,
        quantity: 1,
      },
      {
        id: '2',
        serviceId: 'srv2',
        serviceName: 'Tosa Higiênica',
        price: 40.00,
        quantity: 1,
      },
    ],
    status: 'completed',
    checkInTime: '2024-03-10T09:00:00Z',
    checkOutTime: '2024-03-10T11:30:00Z',
    observations: 'Pet muito dócil e comportado',
    groomerNotes: 'Pelagem em bom estado. Cliente gostou do resultado.',
    beforePhotos: [],
    afterPhotos: [],
    totalAmount: 100.00,
    paid: true,
    createdBy: 'owner1',
    createdAt: '2024-03-10T08:45:00Z',
    updatedAt: '2024-03-10T11:30:00Z',
  },
  {
    id: '2',
    customerId: '1',
    petId: '2',
    items: [
      {
        id: '3',
        serviceId: 'srv1',
        serviceName: 'Banho para Gatos',
        price: 50.00,
        quantity: 1,
      },
    ],
    status: 'in-progress',
    checkInTime: '2024-03-15T14:00:00Z',
    observations: 'Gato estressado, cuidado ao manusear',
    totalAmount: 50.00,
    paid: false,
    createdBy: 'owner1',
    createdAt: '2024-03-15T13:50:00Z',
    updatedAt: '2024-03-15T14:00:00Z',
  },
  {
    id: '3',
    customerId: '2',
    petId: '3',
    items: [
      {
        id: '4',
        serviceId: 'srv3',
        serviceName: 'Tosa Completa',
        price: 80.00,
        quantity: 1,
      },
      {
        id: '5',
        serviceId: 'srv4',
        serviceName: 'Hidratação',
        price: 30.00,
        quantity: 1,
      },
    ],
    status: 'waiting',
    observations: 'Cliente pediu tosa mais curta no corpo',
    totalAmount: 110.00,
    paid: false,
    createdBy: 'owner1',
    createdAt: '2024-03-15T15:00:00Z',
    updatedAt: '2024-03-15T15:00:00Z',
  },
];

export const serviceOrdersApi = {
  // Listar ordens de serviço
  getServiceOrders: async (
    params: PaginationParams & { status?: string; customerId?: string; petId?: string } = {
      page: 1,
      limit: 50,
    }
  ): Promise<ApiResponse<any>> => {
    await delay(600);

    let filtered = [...mockServiceOrders];

    // Filtro por status
    if (params.status) {
      filtered = filtered.filter((order) => order.status === params.status);
    }

    // Filtro por cliente
    if (params.customerId) {
      filtered = filtered.filter((order) => order.customerId === params.customerId);
    }

    // Filtro por pet
    if (params.petId) {
      filtered = filtered.filter((order) => order.petId === params.petId);
    }

    // Ordenação por data (mais recentes primeiro)
    filtered.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

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

  // Buscar ordem de serviço por ID
  getServiceOrderById: async (id: string): Promise<ApiResponse<ServiceOrder>> => {
    await delay(400);

    const order = mockServiceOrders.find((o) => o.id === id);

    if (!order) {
      return {
        success: false,
        error: 'Ordem de serviço não encontrada',
      };
    }

    return {
      success: true,
      data: order,
    };
  },

  // Criar ordem de serviço
  createServiceOrder: async (
    orderData: Omit<ServiceOrder, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<ServiceOrder>> => {
    await delay(800);

    // Validações
    if (!orderData.customerId || !orderData.petId || !orderData.items.length) {
      return {
        success: false,
        error: 'Cliente, pet e serviços são obrigatórios',
      };
    }

    const newOrder: ServiceOrder = {
      ...orderData,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockServiceOrders.unshift(newOrder);

    return {
      success: true,
      data: newOrder,
      message: 'Ordem de serviço criada com sucesso',
    };
  },

  // Atualizar ordem de serviço
  updateServiceOrder: async (
    id: string,
    orderData: Partial<ServiceOrder>
  ): Promise<ApiResponse<ServiceOrder>> => {
    await delay(700);

    const index = mockServiceOrders.findIndex((o) => o.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Ordem de serviço não encontrada',
      };
    }

    const updatedOrder: ServiceOrder = {
      ...mockServiceOrders[index],
      ...orderData,
      id,
      updatedAt: new Date().toISOString(),
    };

    mockServiceOrders[index] = updatedOrder;

    return {
      success: true,
      data: updatedOrder,
      message: 'Ordem de serviço atualizada com sucesso',
    };
  },

  // Deletar ordem de serviço
  deleteServiceOrder: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);

    const index = mockServiceOrders.findIndex((o) => o.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Ordem de serviço não encontrada',
      };
    }

    mockServiceOrders.splice(index, 1);

    return {
      success: true,
      message: 'Ordem de serviço excluída com sucesso',
    };
  },

  // Fazer check-in
  checkIn: async (id: string): Promise<ApiResponse<ServiceOrder>> => {
    await delay(500);

    const index = mockServiceOrders.findIndex((o) => o.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Ordem de serviço não encontrada',
      };
    }

    mockServiceOrders[index] = {
      ...mockServiceOrders[index],
      status: 'in-progress',
      checkInTime: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockServiceOrders[index],
      message: 'Check-in realizado com sucesso',
    };
  },

  // Fazer check-out
  checkOut: async (
    id: string,
    groomerNotes?: string,
    afterPhotos?: string[]
  ): Promise<ApiResponse<ServiceOrder>> => {
    await delay(500);

    const index = mockServiceOrders.findIndex((o) => o.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Ordem de serviço não encontrada',
      };
    }

    mockServiceOrders[index] = {
      ...mockServiceOrders[index],
      status: 'completed',
      checkOutTime: new Date().toISOString(),
      groomerNotes,
      afterPhotos: afterPhotos || mockServiceOrders[index].afterPhotos,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockServiceOrders[index],
      message: 'Check-out realizado com sucesso',
    };
  },

  // Marcar como pago
  markAsPaid: async (id: string): Promise<ApiResponse<ServiceOrder>> => {
    await delay(400);

    const index = mockServiceOrders.findIndex((o) => o.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Ordem de serviço não encontrada',
      };
    }

    mockServiceOrders[index] = {
      ...mockServiceOrders[index],
      paid: true,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockServiceOrders[index],
      message: 'Pagamento registrado com sucesso',
    };
  },

  // Estatísticas
  getServiceOrderStats: async (): Promise<ApiResponse<any>> => {
    await delay(400);

    const stats = {
      total: mockServiceOrders.length,
      waiting: mockServiceOrders.filter((o) => o.status === 'waiting').length,
      inProgress: mockServiceOrders.filter((o) => o.status === 'in-progress').length,
      completed: mockServiceOrders.filter((o) => o.status === 'completed').length,
      cancelled: mockServiceOrders.filter((o) => o.status === 'cancelled').length,
      totalRevenue: mockServiceOrders
        .filter((o) => o.paid)
        .reduce((sum, o) => sum + o.totalAmount, 0),
      pendingPayments: mockServiceOrders
        .filter((o) => !o.paid)
        .reduce((sum, o) => sum + o.totalAmount, 0),
    };

    return {
      success: true,
      data: stats,
    };
  },
};

