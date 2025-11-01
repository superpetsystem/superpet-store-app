import { StockMovement, ApiResponse, PaginationParams } from '../../../types';

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dados mockados
let mockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    type: 'entry',
    quantity: 50,
    reason: 'Compra de fornecedor',
    notes: 'Nota Fiscal 12345',
    userId: 'owner1',
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: '2',
    productId: '1',
    type: 'exit',
    quantity: 5,
    reason: 'Venda',
    notes: 'Venda #123',
    userId: 'owner1',
    createdAt: '2024-03-02T14:30:00Z',
  },
  {
    id: '3',
    productId: '2',
    type: 'entry',
    quantity: 300,
    reason: 'Compra de fornecedor',
    notes: 'Nota Fiscal 12346',
    userId: 'owner1',
    createdAt: '2024-03-03T09:15:00Z',
  },
  {
    id: '4',
    productId: '3',
    type: 'entry',
    quantity: 40,
    reason: 'Compra de fornecedor',
    userId: 'owner1',
    createdAt: '2024-03-04T11:00:00Z',
  },
  {
    id: '5',
    productId: '1',
    type: 'adjustment',
    quantity: -5,
    reason: 'Ajuste de inventário',
    notes: 'Produto danificado',
    userId: 'owner1',
    createdAt: '2024-03-05T16:20:00Z',
  },
  {
    id: '6',
    productId: '5',
    type: 'loss',
    quantity: 2,
    reason: 'Produto vencido',
    notes: 'Validade expirada',
    userId: 'owner1',
    createdAt: '2024-03-06T10:00:00Z',
  },
];

export const stockApi = {
  // Listar movimentações de estoque
  getMovements: async (
    params: PaginationParams & { productId?: string; type?: string } = { page: 1, limit: 50 }
  ): Promise<ApiResponse<any>> => {
    await delay(600);

    let filtered = [...mockMovements];

    // Filtro por produto
    if (params.productId) {
      filtered = filtered.filter((m) => m.productId === params.productId);
    }

    // Filtro por tipo
    if (params.type) {
      filtered = filtered.filter((m) => m.type === params.type);
    }

    // Ordenação por data (mais recentes primeiro)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  // Buscar movimentação por ID
  getMovementById: async (id: string): Promise<ApiResponse<StockMovement>> => {
    await delay(400);

    const movement = mockMovements.find((m) => m.id === id);

    if (!movement) {
      return {
        success: false,
        error: 'Movimentação não encontrada',
      };
    }

    return {
      success: true,
      data: movement,
    };
  },

  // Buscar movimentações por produto
  getMovementsByProduct: async (productId: string): Promise<ApiResponse<StockMovement[]>> => {
    await delay(500);

    const movements = mockMovements.filter((m) => m.productId === productId);
    
    // Ordena por data (mais recentes primeiro)
    movements.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return {
      success: true,
      data: movements,
    };
  },

  // Criar movimentação de estoque
  createMovement: async (
    movementData: Omit<StockMovement, 'id' | 'createdAt'>
  ): Promise<ApiResponse<StockMovement>> => {
    await delay(700);

    // Validações
    if (!movementData.productId || !movementData.type || !movementData.quantity || !movementData.reason) {
      return {
        success: false,
        error: 'Produto, tipo, quantidade e motivo são obrigatórios',
      };
    }

    if (movementData.quantity <= 0) {
      return {
        success: false,
        error: 'Quantidade deve ser maior que zero',
      };
    }

    const newMovement: StockMovement = {
      ...movementData,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    mockMovements.unshift(newMovement);

    return {
      success: true,
      data: newMovement,
      message: 'Movimentação registrada com sucesso',
    };
  },

  // Deletar movimentação (raramente usado, mas pode ser útil para correções)
  deleteMovement: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);

    const index = mockMovements.findIndex((m) => m.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Movimentação não encontrada',
      };
    }

    mockMovements.splice(index, 1);

    return {
      success: true,
      message: 'Movimentação excluída com sucesso',
    };
  },

  // Estatísticas de movimentação
  getMovementStats: async (
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<any>> => {
    await delay(400);

    let filtered = [...mockMovements];

    // Filtro por período
    if (startDate) {
      filtered = filtered.filter((m) => new Date(m.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter((m) => new Date(m.createdAt) <= new Date(endDate));
    }

    const stats = {
      total: filtered.length,
      byType: {
        entry: filtered.filter((m) => m.type === 'entry').length,
        exit: filtered.filter((m) => m.type === 'exit').length,
        adjustment: filtered.filter((m) => m.type === 'adjustment').length,
        return: filtered.filter((m) => m.type === 'return').length,
        loss: filtered.filter((m) => m.type === 'loss').length,
      },
      totalEntry: filtered
        .filter((m) => m.type === 'entry')
        .reduce((sum, m) => sum + m.quantity, 0),
      totalExit: filtered
        .filter((m) => m.type === 'exit')
        .reduce((sum, m) => sum + m.quantity, 0),
      totalLoss: filtered
        .filter((m) => m.type === 'loss')
        .reduce((sum, m) => sum + m.quantity, 0),
    };

    return {
      success: true,
      data: stats,
    };
  },

  // Relatório de movimentações por período
  getMovementReport: async (
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<any>> => {
    await delay(500);

    const filtered = mockMovements.filter(
      (m) =>
        new Date(m.createdAt) >= new Date(startDate) &&
        new Date(m.createdAt) <= new Date(endDate)
    );

    // Agrupa por produto
    const byProduct: Record<string, any> = {};

    filtered.forEach((movement) => {
      if (!byProduct[movement.productId]) {
        byProduct[movement.productId] = {
          productId: movement.productId,
          entries: 0,
          exits: 0,
          adjustments: 0,
          losses: 0,
          returns: 0,
          movements: [],
        };
      }

      const productData = byProduct[movement.productId];
      productData.movements.push(movement);

      if (movement.type === 'entry') productData.entries += movement.quantity;
      if (movement.type === 'exit') productData.exits += movement.quantity;
      if (movement.type === 'adjustment') productData.adjustments += movement.quantity;
      if (movement.type === 'loss') productData.losses += movement.quantity;
      if (movement.type === 'return') productData.returns += movement.quantity;
    });

    return {
      success: true,
      data: {
        period: { startDate, endDate },
        byProduct: Object.values(byProduct),
        summary: {
          totalMovements: filtered.length,
          totalEntries: filtered.filter((m) => m.type === 'entry').reduce((sum, m) => sum + m.quantity, 0),
          totalExits: filtered.filter((m) => m.type === 'exit').reduce((sum, m) => sum + m.quantity, 0),
          totalLosses: filtered.filter((m) => m.type === 'loss').reduce((sum, m) => sum + m.quantity, 0),
        },
      },
    };
  },
};

