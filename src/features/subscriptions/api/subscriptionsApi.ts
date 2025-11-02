import { Subscription, SubscriptionDelivery, SubscriptionStatus, SubscriptionInterval } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockSubscriptions: Subscription[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'João Silva',
    productId: '1',
    productName: 'Ração Golden Premium 15kg',
    quantity: 1,
    price: 189.90,
    interval: 'monthly',
    status: 'active',
    nextDelivery: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'Cartão de Crédito **** 1234',
    shippingAddress: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    notes: 'Entregar na portaria',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    customerId: '1',
    customerName: 'João Silva',
    productId: '2',
    productName: 'Areia Sanitária 10kg',
    quantity: 2,
    price: 45.90,
    interval: 'biweekly',
    status: 'active',
    nextDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'PIX Automático',
    shippingAddress: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockDeliveries: SubscriptionDelivery[] = [
  {
    id: '1',
    subscriptionId: '1',
    deliveryDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'delivered',
    trackingCode: 'BR123456789SP',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    subscriptionId: '1',
    deliveryDate: new Date(Date.now()).toISOString().split('T')[0],
    status: 'shipped',
    trackingCode: 'BR987654321SP',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    subscriptionId: '2',
    deliveryDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'delivered',
    trackingCode: 'BR456789123SP',
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const calculateNextDelivery = (lastDelivery: string, interval: SubscriptionInterval): string => {
  const date = new Date(lastDelivery);

  switch (interval) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'bimonthly':
      date.setMonth(date.getMonth() + 2);
      break;
  }

  return date.toISOString().split('T')[0];
};

export const subscriptionsApi = {
  // Assinaturas
  getAll: async (customerId?: string) => {
    await delay(500);

    let subscriptions = [...mockSubscriptions];

    if (customerId) {
      subscriptions = subscriptions.filter(s => s.customerId === customerId);
    }

    return {
      success: true,
      data: subscriptions.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  },

  getById: async (id: string) => {
    await delay(400);

    const subscription = mockSubscriptions.find(s => s.id === id);

    return {
      success: true,
      data: subscription || null,
    };
  },

  create: async (data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(800);

    const newSubscription: Subscription = {
      ...data,
      id: `${mockSubscriptions.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSubscriptions.push(newSubscription);

    return {
      success: true,
      data: newSubscription,
    };
  },

  update: async (id: string, data: Partial<Subscription>) => {
    await delay(500);

    const index = mockSubscriptions.findIndex(s => s.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Assinatura não encontrada',
      };
    }

    mockSubscriptions[index] = {
      ...mockSubscriptions[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockSubscriptions[index],
    };
  },

  updateStatus: async (id: string, status: SubscriptionStatus) => {
    await delay(400);

    const index = mockSubscriptions.findIndex(s => s.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Assinatura não encontrada',
      };
    }

    mockSubscriptions[index].status = status;
    mockSubscriptions[index].updatedAt = new Date().toISOString();

    if (status === 'cancelled' || status === 'expired') {
      mockSubscriptions[index].endDate = new Date().toISOString().split('T')[0];
    }

    return {
      success: true,
      data: mockSubscriptions[index],
    };
  },

  delete: async (id: string) => {
    await delay(400);

    const index = mockSubscriptions.findIndex(s => s.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Assinatura não encontrada',
      };
    }

    mockSubscriptions.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  // Entregas
  getDeliveries: async (subscriptionId: string) => {
    await delay(400);

    const deliveries = mockDeliveries
      .filter(d => d.subscriptionId === subscriptionId)
      .sort((a, b) => b.deliveryDate.localeCompare(a.deliveryDate));

    return {
      success: true,
      data: deliveries,
    };
  },

  createDelivery: async (subscriptionId: string) => {
    await delay(600);

    const subscription = mockSubscriptions.find(s => s.id === subscriptionId);
    if (!subscription) {
      return {
        success: false,
        error: 'Assinatura não encontrada',
      };
    }

    const newDelivery: SubscriptionDelivery = {
      id: `${mockDeliveries.length + 1}`,
      subscriptionId,
      deliveryDate: subscription.nextDelivery,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    mockDeliveries.push(newDelivery);

    // Atualizar próxima entrega
    subscription.nextDelivery = calculateNextDelivery(subscription.nextDelivery, subscription.interval);
    subscription.updatedAt = new Date().toISOString();

    return {
      success: true,
      data: newDelivery,
    };
  },

  updateDeliveryStatus: async (id: string, status: SubscriptionDelivery['status'], trackingCode?: string) => {
    await delay(400);

    const index = mockDeliveries.findIndex(d => d.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Entrega não encontrada',
      };
    }

    mockDeliveries[index].status = status;
    if (trackingCode) {
      mockDeliveries[index].trackingCode = trackingCode;
    }

    return {
      success: true,
      data: mockDeliveries[index],
    };
  },

  getStatistics: async () => {
    await delay(500);

    const totalSubscriptions = mockSubscriptions.length;
    const activeSubscriptions = mockSubscriptions.filter(s => s.status === 'active').length;
    const monthlyRecurringRevenue = mockSubscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        const monthly = s.interval === 'monthly' ? s.price * s.quantity : 
                       s.interval === 'biweekly' ? (s.price * s.quantity * 2) :
                       s.interval === 'weekly' ? (s.price * s.quantity * 4) :
                       (s.price * s.quantity / 2);
        return sum + monthly;
      }, 0);

    const intervalDistribution = {
      weekly: mockSubscriptions.filter(s => s.interval === 'weekly').length,
      biweekly: mockSubscriptions.filter(s => s.interval === 'biweekly').length,
      monthly: mockSubscriptions.filter(s => s.interval === 'monthly').length,
      bimonthly: mockSubscriptions.filter(s => s.interval === 'bimonthly').length,
    };

    const statusDistribution = {
      active: mockSubscriptions.filter(s => s.status === 'active').length,
      paused: mockSubscriptions.filter(s => s.status === 'paused').length,
      cancelled: mockSubscriptions.filter(s => s.status === 'cancelled').length,
      expired: mockSubscriptions.filter(s => s.status === 'expired').length,
    };

    return {
      success: true,
      data: {
        totalSubscriptions,
        activeSubscriptions,
        monthlyRecurringRevenue,
        intervalDistribution,
        statusDistribution,
        avgSubscriptionValue: totalSubscriptions > 0 ? monthlyRecurringRevenue / activeSubscriptions : 0,
      },
    };
  },
};

