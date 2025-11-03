import { PaymentLink, PaymentTransaction, PaymentMethod, PaymentStatus } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockPaymentLinks: PaymentLink[] = [
  {
    id: '1',
    customerId: '1',
    amount: 250.00,
    description: 'Consulta Veterinária + Vacinas',
    paymentMethod: 'pix',
    status: 'approved',
    link: 'https://superpet.com/pay/abc123',
    qrCode: '00020126330014br.gov.bcb.pix...',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    paidAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

let mockTransactions: PaymentTransaction[] = [
  {
    id: '1',
    paymentLinkId: '1',
    customerId: '1',
    amount: 250.00,
    method: 'pix',
    status: 'approved',
    transactionId: 'TXN123456789',
    authCode: 'AUTH987654',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

export const paymentsApi = {
  // Payment Links
  createPaymentLink: async (data: {
    customerId: string;
    amount: number;
    description: string;
    method?: PaymentMethod;
  }) => {
    await delay(800);

    const newLink: PaymentLink = {
      id: `${mockPaymentLinks.length + 1}`,
      customerId: data.customerId,
      amount: data.amount,
      description: data.description,
      paymentMethod: data.method,
      status: 'pending',
      link: `https://superpet.com/pay/${Math.random().toString(36).substring(7)}`,
      qrCode: data.method === 'pix' ? '00020126330014br.gov.bcb.pix...' : undefined,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
    };

    mockPaymentLinks.push(newLink);

    return {
      success: true,
      data: newLink,
    };
  },

  getPaymentLink: async (id: string) => {
    await delay(400);

    const link = mockPaymentLinks.find(l => l.id === id);

    return {
      success: true,
      data: link || null,
    };
  },

  getPaymentLinks: async (customerId?: string) => {
    await delay(500);

    let links = [...mockPaymentLinks];

    if (customerId) {
      links = links.filter(l => l.customerId === customerId);
    }

    return {
      success: true,
      data: links.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  },

  processPayment: async (linkId: string, method: PaymentMethod, data?: any) => {
    await delay(2000); // Simula processamento

    const linkIndex = mockPaymentLinks.findIndex(l => l.id === linkId);
    if (linkIndex === -1) {
      return {
        success: false,
        error: 'Link de pagamento não encontrado',
      };
    }

    const link = mockPaymentLinks[linkIndex];

    // Simular aprovação (90% de sucesso)
    const approved = Math.random() > 0.1;
    const status: PaymentStatus = approved ? 'approved' : 'rejected';

    // Atualizar link
    link.status = status;
    link.paymentMethod = method;
    if (approved) {
      link.paidAt = new Date().toISOString();
    }
    mockPaymentLinks[linkIndex] = link;

    // Criar transação
    const transaction: PaymentTransaction = {
      id: `${mockTransactions.length + 1}`,
      paymentLinkId: linkId,
      customerId: link.customerId,
      amount: link.amount,
      method,
      status,
      transactionId: `TXN${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      authCode: approved ? `AUTH${Math.random().toString(36).substring(2, 10).toUpperCase()}` : undefined,
      timestamp: new Date().toISOString(),
    };

    mockTransactions.push(transaction);

    return {
      success: approved,
      data: transaction,
      error: approved ? undefined : 'Pagamento recusado. Tente outro método.',
    };
  },

  cancelPaymentLink: async (id: string) => {
    await delay(400);

    const index = mockPaymentLinks.findIndex(l => l.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Link não encontrado',
      };
    }

    mockPaymentLinks[index].status = 'cancelled';

    return {
      success: true,
      data: mockPaymentLinks[index],
    };
  },

  // Transactions
  getTransactions: async (customerId?: string) => {
    await delay(500);

    let transactions = [...mockTransactions];

    if (customerId) {
      transactions = transactions.filter(t => t.customerId === customerId);
    }

    return {
      success: true,
      data: transactions.sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
    };
  },

  getTransaction: async (id: string) => {
    await delay(400);

    const transaction = mockTransactions.find(t => t.id === id);

    return {
      success: true,
      data: transaction || null,
    };
  },

  getStatistics: async () => {
    await delay(500);

    const totalTransactions = mockTransactions.length;
    const approvedTransactions = mockTransactions.filter(t => t.status === 'approved');
    const totalVolume = approvedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const avgTicket = totalVolume / (approvedTransactions.length || 1);

    const methodDistribution = {
      pix: mockTransactions.filter(t => t.method === 'pix').length,
      'credit-card': mockTransactions.filter(t => t.method === 'credit-card').length,
      'debit-card': mockTransactions.filter(t => t.method === 'debit-card').length,
      boleto: mockTransactions.filter(t => t.method === 'boleto').length,
    };

    const approvalRate = (approvedTransactions.length / totalTransactions) * 100;

    return {
      success: true,
      data: {
        totalTransactions,
        approvedTransactions: approvedTransactions.length,
        rejectedTransactions: mockTransactions.filter(t => t.status === 'rejected').length,
        totalVolume,
        avgTicket,
        methodDistribution,
        approvalRate,
      },
    };
  },
};

