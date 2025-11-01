import { AccountReceivable, AccountStatus, PaymentType } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const today = new Date().toISOString().split('T')[0];

let mockAccounts: AccountReceivable[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'João Silva',
    description: 'Pacote de banho e tosa - 5 sessões',
    amount: 400.00,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending',
    installment: 1,
    totalInstallments: 2,
    notes: 'Parcelado em 2x',
    createdBy: 'owner@superpet.com',
    createdAt: '2024-10-20T10:00:00.000Z',
    updatedAt: '2024-10-20T10:00:00.000Z',
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Ana Costa',
    description: 'Consulta veterinária + medicamentos',
    amount: 250.00,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'overdue',
    notes: 'Cliente inadimplente',
    createdBy: 'owner@superpet.com',
    createdAt: '2024-10-10T14:00:00.000Z',
    updatedAt: '2024-10-10T14:00:00.000Z',
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Carlos Mendes',
    description: 'Ração Premium 15kg',
    amount: 180.00,
    dueDate: '2024-10-25',
    paymentDate: '2024-10-24',
    paymentType: 'pix',
    status: 'paid',
    saleId: '5',
    createdBy: 'owner@superpet.com',
    createdAt: '2024-10-15T09:00:00.000Z',
    updatedAt: '2024-10-24T16:00:00.000Z',
  },
];

export const accountsApi = {
  getAll: async (params?: { 
    status?: AccountStatus; 
    customerId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    await delay(500);

    let filtered = [...mockAccounts];

    if (params?.status) {
      filtered = filtered.filter(a => a.status === params.status);
    }

    if (params?.customerId) {
      filtered = filtered.filter(a => a.customerId === params.customerId);
    }

    if (params?.startDate) {
      filtered = filtered.filter(a => a.dueDate >= params.startDate!);
    }

    if (params?.endDate) {
      filtered = filtered.filter(a => a.dueDate <= params.endDate!);
    }

    return {
      success: true,
      data: filtered.sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    };
  },

  getById: async (id: string) => {
    await delay(300);
    const account = mockAccounts.find(a => a.id === id);
    return {
      success: !!account,
      data: account,
      error: !account ? 'Conta não encontrada' : undefined,
    };
  },

  create: async (data: Omit<AccountReceivable, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    const newAccount: AccountReceivable = {
      ...data,
      id: `${mockAccounts.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAccounts.push(newAccount);

    return {
      success: true,
      data: newAccount,
    };
  },

  update: async (id: string, data: Partial<AccountReceivable>) => {
    await delay(500);

    const index = mockAccounts.findIndex(a => a.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Conta não encontrada',
      };
    }

    mockAccounts[index] = {
      ...mockAccounts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockAccounts[index],
    };
  },

  markAsPaid: async (id: string, paymentType: PaymentType) => {
    await delay(500);

    const index = mockAccounts.findIndex(a => a.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Conta não encontrada',
      };
    }

    mockAccounts[index] = {
      ...mockAccounts[index],
      status: 'paid',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentType,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockAccounts[index],
    };
  },

  delete: async (id: string) => {
    await delay(400);

    const index = mockAccounts.findIndex(a => a.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Conta não encontrada',
      };
    }

    mockAccounts.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  getStatistics: async () => {
    await delay(400);

    const stats = {
      total: mockAccounts.reduce((sum, a) => sum + a.amount, 0),
      pending: mockAccounts.filter(a => a.status === 'pending').reduce((sum, a) => sum + a.amount, 0),
      overdue: mockAccounts.filter(a => a.status === 'overdue').reduce((sum, a) => sum + a.amount, 0),
      paid: mockAccounts.filter(a => a.status === 'paid').reduce((sum, a) => sum + a.amount, 0),
      count: {
        total: mockAccounts.length,
        pending: mockAccounts.filter(a => a.status === 'pending').length,
        overdue: mockAccounts.filter(a => a.status === 'overdue').length,
        paid: mockAccounts.filter(a => a.status === 'paid').length,
      },
    };

    return {
      success: true,
      data: stats,
    };
  },

  getOverdueReport: async () => {
    await delay(500);

    const overdue = mockAccounts.filter(a => a.status === 'overdue');

    const report = overdue.map(account => ({
      ...account,
      daysOverdue: Math.floor(
        (new Date().getTime() - new Date(account.dueDate).getTime()) / (1000 * 60 * 60 * 24)
      ),
    }));

    return {
      success: true,
      data: report.sort((a, b) => b.daysOverdue - a.daysOverdue),
    };
  },
};

