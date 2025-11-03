import { InventoryCount, InventoryCountItem, InventoryAdjustment, InventoryCountStatus, AdjustmentReason } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockCounts: InventoryCount[] = [
  {
    id: '1',
    countDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'completed',
    countedBy: 'Maria Santos',
    items: [
      {
        productId: '1',
        productName: 'Ração Golden Premium 15kg',
        expectedQuantity: 50,
        countedQuantity: 48,
        difference: -2,
        adjustmentReason: 'damage',
        notes: '2 sacos com embalagem danificada',
      },
      {
        productId: '2',
        productName: 'Areia Sanitária 10kg',
        expectedQuantity: 100,
        countedQuantity: 100,
        difference: 0,
      },
    ],
    totalAdjustments: -2,
    notes: 'Contagem mensal realizada',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockAdjustments: InventoryAdjustment[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Ração Golden Premium 15kg',
    quantity: -2,
    reason: 'damage',
    notes: 'Embalagem danificada durante transporte',
    adjustedBy: 'Maria Santos',
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    productId: '3',
    productName: 'Shampoo Pet 500ml',
    quantity: -5,
    reason: 'expiration',
    notes: 'Produto vencido',
    adjustedBy: 'Pedro Silva',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const inventoryApi = {
  // Contagens
  getCounts: async () => {
    await delay(500);
    return {
      success: true,
      data: mockCounts.sort((a, b) => b.countDate.localeCompare(a.countDate)),
    };
  },

  getCount: async (id: string) => {
    await delay(400);
    const count = mockCounts.find(c => c.id === id);
    return {
      success: true,
      data: count || null,
    };
  },

  createCount: async (data: Omit<InventoryCount, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    const newCount: InventoryCount = {
      ...data,
      id: `${mockCounts.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCounts.push(newCount);

    return {
      success: true,
      data: newCount,
    };
  },

  updateCount: async (id: string, data: Partial<InventoryCount>) => {
    await delay(500);

    const index = mockCounts.findIndex(c => c.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Contagem não encontrada',
      };
    }

    mockCounts[index] = {
      ...mockCounts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockCounts[index],
    };
  },

  completeCount: async (id: string) => {
    await delay(500);

    const index = mockCounts.findIndex(c => c.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Contagem não encontrada',
      };
    }

    const count = mockCounts[index];
    count.status = 'completed';
    count.updatedAt = new Date().toISOString();

    // Criar ajustes para itens com diferença
    const adjustments: InventoryAdjustment[] = [];
    count.items.forEach(item => {
      if (item.difference !== 0) {
        const adjustment: InventoryAdjustment = {
          id: `${mockAdjustments.length + adjustments.length + 1}`,
          productId: item.productId,
          productName: item.productName,
          quantity: item.difference,
          reason: item.adjustmentReason || 'count',
          notes: item.notes || `Ajuste de contagem #${id}`,
          adjustedBy: count.countedBy,
          timestamp: new Date().toISOString(),
        };
        adjustments.push(adjustment);
      }
    });

    mockAdjustments.push(...adjustments);

    return {
      success: true,
      data: { count, adjustments },
    };
  },

  // Ajustes
  getAdjustments: async () => {
    await delay(500);
    return {
      success: true,
      data: mockAdjustments.sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    };
  },

  createAdjustment: async (data: Omit<InventoryAdjustment, 'id' | 'timestamp'>) => {
    await delay(500);

    const newAdjustment: InventoryAdjustment = {
      ...data,
      id: `${mockAdjustments.length + 1}`,
      timestamp: new Date().toISOString(),
    };

    mockAdjustments.push(newAdjustment);

    return {
      success: true,
      data: newAdjustment,
    };
  },

  getStatistics: async () => {
    await delay(400);

    const totalCounts = mockCounts.length;
    const completedCounts = mockCounts.filter(c => c.status === 'completed').length;
    const totalAdjustments = mockAdjustments.length;
    const adjustmentsByReason = {
      count: mockAdjustments.filter(a => a.reason === 'count').length,
      damage: mockAdjustments.filter(a => a.reason === 'damage').length,
      expiration: mockAdjustments.filter(a => a.reason === 'expiration').length,
      theft: mockAdjustments.filter(a => a.reason === 'theft').length,
      return: mockAdjustments.filter(a => a.reason === 'return').length,
      other: mockAdjustments.filter(a => a.reason === 'other').length,
    };

    return {
      success: true,
      data: {
        totalCounts,
        completedCounts,
        totalAdjustments,
        adjustmentsByReason,
      },
    };
  },
};

