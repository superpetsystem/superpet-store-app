import { Sale, SaleItem, ApiResponse, PaginationParams } from '../../../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let mockSales: Sale[] = [
  {
    id: '1',
    customerId: '1',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Ração Premium Golden Adulto',
        quantity: 2,
        unitPrice: 189.90,
        discount: 0,
        total: 379.80,
      },
    ],
    subtotal: 379.80,
    discount: 0,
    total: 379.80,
    paymentMethod: 'credit',
    status: 'completed',
    cashierId: 'owner1',
    createdAt: '2024-03-10T10:30:00Z',
    updatedAt: '2024-03-10T10:30:00Z',
  },
  {
    id: '2',
    customerId: '2',
    items: [
      {
        id: '2',
        productId: '2',
        productName: 'Ração para Gatos Whiskas Sachê',
        quantity: 10,
        unitPrice: 3.50,
        discount: 0,
        total: 35.00,
      },
      {
        id: '3',
        productId: '3',
        productName: 'Brinquedo Kong Clássico',
        quantity: 1,
        unitPrice: 45.90,
        discount: 5.00,
        total: 40.90,
      },
    ],
    subtotal: 75.90,
    discount: 5.00,
    total: 70.90,
    paymentMethod: 'pix',
    status: 'completed',
    cashierId: 'owner1',
    createdAt: '2024-03-11T14:15:00Z',
    updatedAt: '2024-03-11T14:15:00Z',
  },
];

export const salesApi = {
  getSales: async (
    params: PaginationParams & { status?: string; customerId?: string } = { page: 1, limit: 50 }
  ): Promise<ApiResponse<any>> => {
    await delay(600);

    let filtered = [...mockSales];

    if (params.status) {
      filtered = filtered.filter((sale) => sale.status === params.status);
    }

    if (params.customerId) {
      filtered = filtered.filter((sale) => sale.customerId === params.customerId);
    }

    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  getSaleById: async (id: string): Promise<ApiResponse<Sale>> => {
    await delay(400);

    const sale = mockSales.find((s) => s.id === id);

    if (!sale) {
      return {
        success: false,
        error: 'Venda não encontrada',
      };
    }

    return {
      success: true,
      data: sale,
    };
  },

  createSale: async (saleData: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Sale>> => {
    await delay(800);

    if (!saleData.items || saleData.items.length === 0) {
      return {
        success: false,
        error: 'Adicione pelo menos um produto',
      };
    }

    const newSale: Sale = {
      ...saleData,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSales.unshift(newSale);

    return {
      success: true,
      data: newSale,
      message: 'Venda registrada com sucesso',
    };
  },

  getSalesStats: async (): Promise<ApiResponse<any>> => {
    await delay(400);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySales = mockSales.filter(
      (s) => new Date(s.createdAt) >= today && s.status === 'completed'
    );

    const stats = {
      total: mockSales.length,
      completed: mockSales.filter((s) => s.status === 'completed').length,
      totalRevenue: mockSales
        .filter((s) => s.status === 'completed')
        .reduce((sum, s) => sum + s.total, 0),
      todayRevenue: todaySales.reduce((sum, s) => sum + s.total, 0),
      todaySales: todaySales.length,
      averageTicket: todaySales.length > 0
        ? todaySales.reduce((sum, s) => sum + s.total, 0) / todaySales.length
        : 0,
    };

    return {
      success: true,
      data: stats,
    };
  },
};

