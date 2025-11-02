import { CommissionRule, Commission, CommissionType, CommissionTrigger } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockRules: CommissionRule[] = [
  {
    id: '1',
    name: 'Comissão Padrão de Vendas',
    description: 'Comissão de 5% sobre todas as vendas',
    type: 'percentage',
    value: 5,
    trigger: 'sale',
    active: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    name: 'Comissão de Serviços Premium',
    description: 'Comissão de 10% em serviços acima de R$ 200',
    type: 'percentage',
    value: 10,
    trigger: 'service',
    minValue: 200,
    active: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Bônus Fixo por Venda',
    description: 'R$ 10,00 fixo por venda realizada',
    type: 'fixed',
    value: 10,
    trigger: 'sale',
    active: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockCommissions: Commission[] = [
  {
    id: '1',
    employeeId: 'emp1',
    employeeName: 'Pedro Silva',
    ruleId: '1',
    ruleName: 'Comissão Padrão de Vendas',
    relatedType: 'sale',
    relatedId: 'sale-1',
    baseValue: 500.00,
    commissionValue: 25.00,
    status: 'paid',
    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    employeeId: 'emp2',
    employeeName: 'Maria Santos',
    ruleId: '2',
    ruleName: 'Comissão de Serviços Premium',
    relatedType: 'service',
    relatedId: 'service-1',
    baseValue: 300.00,
    commissionValue: 30.00,
    status: 'pending',
    periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    periodEnd: new Date().toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const commissionsApi = {
  // Regras
  getRules: async () => {
    await delay(500);
    return {
      success: true,
      data: mockRules,
    };
  },

  getRule: async (id: string) => {
    await delay(400);
    const rule = mockRules.find(r => r.id === id);
    return {
      success: true,
      data: rule || null,
    };
  },

  createRule: async (data: Omit<CommissionRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    const newRule: CommissionRule = {
      ...data,
      id: `${mockRules.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockRules.push(newRule);

    return {
      success: true,
      data: newRule,
    };
  },

  updateRule: async (id: string, data: Partial<CommissionRule>) => {
    await delay(500);

    const index = mockRules.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Regra não encontrada',
      };
    }

    mockRules[index] = {
      ...mockRules[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockRules[index],
    };
  },

  deleteRule: async (id: string) => {
    await delay(400);

    const index = mockRules.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Regra não encontrada',
      };
    }

    mockRules.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  // Comissões
  getCommissions: async (employeeId?: string) => {
    await delay(500);

    let commissions = [...mockCommissions];

    if (employeeId) {
      commissions = commissions.filter(c => c.employeeId === employeeId);
    }

    return {
      success: true,
      data: commissions.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  },

  payCommission: async (id: string) => {
    await delay(500);

    const index = mockCommissions.findIndex(c => c.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Comissão não encontrada',
      };
    }

    mockCommissions[index].status = 'paid';
    mockCommissions[index].paidAt = new Date().toISOString();

    return {
      success: true,
      data: mockCommissions[index],
    };
  },

  getStatistics: async () => {
    await delay(400);

    const totalCommissions = mockCommissions.length;
    const pendingCommissions = mockCommissions.filter(c => c.status === 'pending').length;
    const paidCommissions = mockCommissions.filter(c => c.status === 'paid').length;

    const totalPending = mockCommissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.commissionValue, 0);

    const totalPaid = mockCommissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.commissionValue, 0);

    const byEmployee: Record<string, { name: string; total: number; count: number }> = {};
    mockCommissions.forEach(c => {
      if (!byEmployee[c.employeeId]) {
        byEmployee[c.employeeId] = { name: c.employeeName, total: 0, count: 0 };
      }
      byEmployee[c.employeeId].total += c.commissionValue;
      byEmployee[c.employeeId].count++;
    });

    return {
      success: true,
      data: {
        totalCommissions,
        pendingCommissions,
        paidCommissions,
        totalPending,
        totalPaid,
        byEmployee,
      },
    };
  },
};

