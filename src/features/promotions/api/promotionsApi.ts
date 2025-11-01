import { Promotion, PriceTable, PromotionType } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockPromotions: Promotion[] = [
  {
    id: '1',
    name: 'Black Friday Pet',
    description: '30% de desconto em rações selecionadas',
    type: 'percentage',
    discount: 30,
    productIds: ['1', '2', '3'],
    startDate: '2024-11-20',
    endDate: '2024-11-30',
    active: true,
    minimumPurchase: 100,
    maxUses: 1000,
    usedCount: 45,
    conditions: 'Válido para rações Premium e Super Premium',
    createdBy: 'owner@superpet.com',
    createdAt: '2024-11-01T10:00:00.000Z',
    updatedAt: '2024-11-01T10:00:00.000Z',
  },
  {
    id: '2',
    name: 'Combo Banho e Tosa',
    description: 'Banho + Tosa por R$ 80,00',
    type: 'combo',
    discount: 20,
    serviceIds: ['1', '2'],
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    active: true,
    maxUses: 500,
    usedCount: 120,
    conditions: 'Válido de segunda a sexta',
    createdBy: 'owner@superpet.com',
    createdAt: '2024-10-15T14:00:00.000Z',
    updatedAt: '2024-10-15T14:00:00.000Z',
  },
];

let mockPrices: PriceTable[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Ração Golden Adulto 15kg',
    basePrice: 180.00,
    salePrice: 160.00,
    memberPrice: 150.00,
    minimumQuantity: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    productId: '2',
    productName: 'Ração Premier Filhote 10kg',
    basePrice: 150.00,
    salePrice: 135.00,
    memberPrice: 125.00,
    minimumQuantity: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const promotionsApi = {
  // Promoções
  promotions: {
    getAll: async (params?: { active?: boolean; type?: PromotionType }) => {
      await delay(500);

      let filtered = [...mockPromotions];

      if (params?.active !== undefined) {
        filtered = filtered.filter(p => p.active === params.active);
      }

      if (params?.type) {
        filtered = filtered.filter(p => p.type === params.type);
      }

      return {
        success: true,
        data: filtered,
      };
    },

    getById: async (id: string) => {
      await delay(300);
      const promotion = mockPromotions.find(p => p.id === id);
      return {
        success: !!promotion,
        data: promotion,
        error: !promotion ? 'Promoção não encontrada' : undefined,
      };
    },

    create: async (data: Omit<Promotion, 'id' | 'usedCount' | 'createdAt' | 'updatedAt'>) => {
      await delay(600);

      const newPromotion: Promotion = {
        ...data,
        id: `${mockPromotions.length + 1}`,
        usedCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockPromotions.push(newPromotion);

      return {
        success: true,
        data: newPromotion,
      };
    },

    update: async (id: string, data: Partial<Promotion>) => {
      await delay(500);

      const index = mockPromotions.findIndex(p => p.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Promoção não encontrada',
        };
      }

      mockPromotions[index] = {
        ...mockPromotions[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: mockPromotions[index],
      };
    },

    delete: async (id: string) => {
      await delay(400);

      const index = mockPromotions.findIndex(p => p.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Promoção não encontrada',
        };
      }

      mockPromotions.splice(index, 1);

      return {
        success: true,
        data: { id },
      };
    },
  },

  // Tabela de Preços
  prices: {
    getAll: async () => {
      await delay(500);
      return {
        success: true,
        data: mockPrices,
      };
    },

    update: async (productId: string, data: Partial<PriceTable>) => {
      await delay(500);

      const index = mockPrices.findIndex(p => p.productId === productId);
      
      if (index === -1) {
        // Criar novo preço
        const newPrice: PriceTable = {
          id: `${mockPrices.length + 1}`,
          productId,
          productName: data.productName || '',
          basePrice: data.basePrice || 0,
          salePrice: data.salePrice,
          memberPrice: data.memberPrice,
          minimumQuantity: data.minimumQuantity,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        mockPrices.push(newPrice);
        return {
          success: true,
          data: newPrice,
        };
      }

      mockPrices[index] = {
        ...mockPrices[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: mockPrices[index],
      };
    },
  },

  // Aplicar promoção
  applyPromotion: async (promotionId: string, amount: number) => {
    await delay(300);

    const promotion = mockPromotions.find(p => p.id === promotionId);
    
    if (!promotion) {
      return {
        success: false,
        error: 'Promoção não encontrada',
      };
    }

    if (!promotion.active) {
      return {
        success: false,
        error: 'Promoção inativa',
      };
    }

    if (promotion.minimumPurchase && amount < promotion.minimumPurchase) {
      return {
        success: false,
        error: `Compra mínima de R$ ${promotion.minimumPurchase.toFixed(2)}`,
      };
    }

    let discountAmount = 0;
    if (promotion.type === 'percentage') {
      discountAmount = (amount * promotion.discount) / 100;
    } else if (promotion.type === 'fixed') {
      discountAmount = promotion.discount;
    }

    return {
      success: true,
      data: {
        promotionId,
        discountAmount,
        finalAmount: amount - discountAmount,
      },
    };
  },
};

