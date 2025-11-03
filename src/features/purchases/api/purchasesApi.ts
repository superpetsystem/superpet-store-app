import { PurchaseOrder, PurchaseOrderItem, PurchaseOrderStatus } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockOrders: PurchaseOrder[] = [
  {
    id: '1',
    supplierId: '1',
    supplierName: 'Distribuidora Pet Food Ltda',
    orderNumber: 'PO-2024-001',
    orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expectedDelivery: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    receivedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'received',
    items: [
      { productId: '1', productName: 'Ração Golden Premium 15kg', quantity: 50, unitCost: 150.00, total: 7500.00 },
      { productId: '2', productName: 'Ração Special Cat 10kg', quantity: 30, unitCost: 80.00, total: 2400.00 },
    ],
    subtotal: 9900.00,
    shipping: 200.00,
    total: 10100.00,
    invoiceNumber: 'NF-12345',
    notes: 'Entrega realizada conforme previsto',
    createdBy: 'Pedro Silva',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    supplierId: '2',
    supplierName: 'Pet Toys Brasil',
    orderNumber: 'PO-2024-002',
    orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    expectedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'sent',
    items: [
      { productId: '3', productName: 'Bola de Tênis', quantity: 100, unitCost: 5.00, total: 500.00 },
      { productId: '4', productName: 'Corda para Brincar', quantity: 50, unitCost: 12.00, total: 600.00 },
    ],
    subtotal: 1100.00,
    shipping: 50.00,
    total: 1150.00,
    notes: 'Aguardando recebimento',
    createdBy: 'Maria Santos',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const purchasesApi = {
  getAll: async () => {
    await delay(500);
    return {
      success: true,
      data: mockOrders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  },

  getById: async (id: string) => {
    await delay(400);
    const order = mockOrders.find(o => o.id === id);
    return {
      success: true,
      data: order || null,
    };
  },

  create: async (data: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    const newOrder: PurchaseOrder = {
      ...data,
      id: `${mockOrders.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOrders.push(newOrder);

    return {
      success: true,
      data: newOrder,
    };
  },

  update: async (id: string, data: Partial<PurchaseOrder>) => {
    await delay(500);

    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Pedido não encontrado',
      };
    }

    mockOrders[index] = {
      ...mockOrders[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockOrders[index],
    };
  },

  updateStatus: async (id: string, status: PurchaseOrderStatus, receivedDate?: string, invoiceNumber?: string) => {
    await delay(400);

    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Pedido não encontrado',
      };
    }

    mockOrders[index].status = status;
    if (receivedDate) mockOrders[index].receivedDate = receivedDate;
    if (invoiceNumber) mockOrders[index].invoiceNumber = invoiceNumber;
    mockOrders[index].updatedAt = new Date().toISOString();

    return {
      success: true,
      data: mockOrders[index],
    };
  },

  delete: async (id: string) => {
    await delay(400);

    const index = mockOrders.findIndex(o => o.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Pedido não encontrado',
      };
    }

    mockOrders.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  getStatistics: async () => {
    await delay(400);

    const totalOrders = mockOrders.length;
    const pendingOrders = mockOrders.filter(o => o.status === 'sent' || o.status === 'draft').length;
    const receivedOrders = mockOrders.filter(o => o.status === 'received').length;
    const totalValue = mockOrders.reduce((sum, o) => sum + o.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalValue / totalOrders : 0;

    const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const recentOrders = mockOrders.filter(o => o.orderDate >= last30Days);
    const recentValue = recentOrders.reduce((sum, o) => sum + o.total, 0);

    return {
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        receivedOrders,
        totalValue,
        avgOrderValue,
        recentOrders: recentOrders.length,
        recentValue,
      },
    };
  },
};

