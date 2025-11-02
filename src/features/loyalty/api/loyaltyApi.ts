import { LoyaltyProgram, PointsTransaction, LoyaltyReward, LoyaltyTier } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
let mockPrograms: LoyaltyProgram[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'João Silva',
    tier: 'gold',
    totalPoints: 2500,
    availablePoints: 1800,
    cashbackBalance: 150.00,
    lifetimeSpent: 12500.00,
    joinDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Ana Costa',
    tier: 'silver',
    totalPoints: 1200,
    availablePoints: 900,
    cashbackBalance: 45.00,
    lifetimeSpent: 4500.00,
    joinDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Carlos Mendes',
    tier: 'bronze',
    totalPoints: 450,
    availablePoints: 450,
    cashbackBalance: 15.00,
    lifetimeSpent: 1500.00,
    joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    lastActivity: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockTransactions: PointsTransaction[] = [
  {
    id: '1',
    customerId: '1',
    type: 'earned',
    points: 250,
    description: 'Compra de R$ 250,00',
    relatedId: 'sale-1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    customerId: '1',
    type: 'redeemed',
    points: -500,
    description: 'Resgate: Desconto de R$ 50,00',
    relatedId: 'sale-2',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    customerId: '1',
    type: 'earned',
    points: 180,
    description: 'Serviço de banho e tosa',
    relatedId: 'service-1',
    timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockRewards: LoyaltyReward[] = [
  {
    id: '1',
    name: 'Desconto R$ 10',
    description: 'R$ 10,00 de desconto em qualquer compra',
    pointsCost: 100,
    active: true,
    stock: 50,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Desconto R$ 25',
    description: 'R$ 25,00 de desconto em compras acima de R$ 100',
    pointsCost: 250,
    active: true,
    stock: 30,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Banho Grátis',
    description: 'Um banho completo grátis para seu pet',
    pointsCost: 500,
    active: true,
    stock: 20,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'Desconto R$ 50',
    description: 'R$ 50,00 de desconto em compras acima de R$ 200',
    pointsCost: 500,
    active: true,
    stock: 15,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    name: 'Kit Premium',
    description: 'Kit com produtos premium para seu pet',
    pointsCost: 1000,
    active: true,
    stock: 10,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const getTierFromSpent = (spent: number): LoyaltyTier => {
  if (spent >= 10000) return 'platinum';
  if (spent >= 5000) return 'gold';
  if (spent >= 2000) return 'silver';
  return 'bronze';
};

export const loyaltyApi = {
  // Programas
  getAll: async () => {
    await delay(500);
    return {
      success: true,
      data: mockPrograms,
    };
  },

  getByCustomer: async (customerId: string) => {
    await delay(400);
    const program = mockPrograms.find(p => p.customerId === customerId);
    return {
      success: true,
      data: program || null,
    };
  },

  createProgram: async (customerId: string, customerName: string) => {
    await delay(500);

    const newProgram: LoyaltyProgram = {
      id: `${mockPrograms.length + 1}`,
      customerId,
      customerName,
      tier: 'bronze',
      totalPoints: 0,
      availablePoints: 0,
      cashbackBalance: 0,
      lifetimeSpent: 0,
      joinDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    };

    mockPrograms.push(newProgram);

    return {
      success: true,
      data: newProgram,
    };
  },

  addPoints: async (customerId: string, points: number, description: string, relatedId?: string) => {
    await delay(400);

    const program = mockPrograms.find(p => p.customerId === customerId);
    if (!program) {
      return {
        success: false,
        error: 'Programa não encontrado',
      };
    }

    program.totalPoints += points;
    program.availablePoints += points;
    program.lastActivity = new Date().toISOString();

    const transaction: PointsTransaction = {
      id: `${mockTransactions.length + 1}`,
      customerId,
      type: 'earned',
      points,
      description,
      relatedId,
      timestamp: new Date().toISOString(),
    };

    mockTransactions.push(transaction);

    return {
      success: true,
      data: { program, transaction },
    };
  },

  redeemPoints: async (customerId: string, points: number, description: string) => {
    await delay(400);

    const program = mockPrograms.find(p => p.customerId === customerId);
    if (!program) {
      return {
        success: false,
        error: 'Programa não encontrado',
      };
    }

    if (program.availablePoints < points) {
      return {
        success: false,
        error: 'Pontos insuficientes',
      };
    }

    program.availablePoints -= points;
    program.lastActivity = new Date().toISOString();

    const transaction: PointsTransaction = {
      id: `${mockTransactions.length + 1}`,
      customerId,
      type: 'redeemed',
      points: -points,
      description,
      timestamp: new Date().toISOString(),
    };

    mockTransactions.push(transaction);

    return {
      success: true,
      data: { program, transaction },
    };
  },

  // Transações
  getTransactions: async (customerId: string) => {
    await delay(400);
    const transactions = mockTransactions
      .filter(t => t.customerId === customerId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return {
      success: true,
      data: transactions,
    };
  },

  // Recompensas
  getRewards: async () => {
    await delay(300);
    return {
      success: true,
      data: mockRewards.filter(r => r.active),
    };
  },

  createReward: async (data: Omit<LoyaltyReward, 'id' | 'createdAt'>) => {
    await delay(500);

    const newReward: LoyaltyReward = {
      ...data,
      id: `${mockRewards.length + 1}`,
      createdAt: new Date().toISOString(),
    };

    mockRewards.push(newReward);

    return {
      success: true,
      data: newReward,
    };
  },

  updateReward: async (id: string, data: Partial<LoyaltyReward>) => {
    await delay(400);

    const index = mockRewards.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Recompensa não encontrada',
      };
    }

    mockRewards[index] = { ...mockRewards[index], ...data };

    return {
      success: true,
      data: mockRewards[index],
    };
  },

  getStatistics: async () => {
    await delay(400);

    const totalMembers = mockPrograms.length;
    const activeMembers = mockPrograms.filter(
      p => new Date(p.lastActivity) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length;

    const tierDistribution = {
      bronze: mockPrograms.filter(p => p.tier === 'bronze').length,
      silver: mockPrograms.filter(p => p.tier === 'silver').length,
      gold: mockPrograms.filter(p => p.tier === 'gold').length,
      platinum: mockPrograms.filter(p => p.tier === 'platinum').length,
    };

    const totalPointsIssued = mockPrograms.reduce((sum, p) => sum + p.totalPoints, 0);
    const totalPointsRedeemed = mockPrograms.reduce((sum, p) => sum + (p.totalPoints - p.availablePoints), 0);

    return {
      success: true,
      data: {
        totalMembers,
        activeMembers,
        tierDistribution,
        totalPointsIssued,
        totalPointsRedeemed,
        redemptionRate: totalPointsIssued > 0 ? (totalPointsRedeemed / totalPointsIssued) * 100 : 0,
      },
    };
  },
};

