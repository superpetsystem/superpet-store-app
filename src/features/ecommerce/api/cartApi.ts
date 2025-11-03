import { Cart, CartItem, Order } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock carts
let mockCarts: Record<string, Cart> = {
  '1': {
    id: 'cart-1',
    customerId: '1',
    items: [],
    subtotal: 0,
    discount: 0,
    shipping: 0,
    total: 0,
    updatedAt: new Date().toISOString(),
  },
};

// Mock orders
let mockOrders: Order[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'João Silva',
    items: [
      {
        productId: '1',
        productName: 'Ração Golden Premium 15kg',
        price: 189.90,
        quantity: 2,
        stock: 48,
      },
      {
        productId: '2',
        productName: 'Areia Sanitária 10kg',
        price: 45.90,
        quantity: 1,
        stock: 99,
      },
    ],
    subtotal: 425.70,
    discount: 0,
    shipping: 25.00,
    total: 450.70,
    status: 'delivered',
    paymentMethod: 'PIX',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    trackingCode: 'BR123456789SP',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Pedidos do customer ID 2
  {
    id: '2',
    customerId: '2',
    customerName: 'Maria Santos',
    items: [
      {
        productId: '1',
        productName: 'Ração Premium Golden Adulto',
        price: 189.90,
        quantity: 1,
        stock: 45,
      },
      {
        productId: '5',
        productName: 'Antipulgas NexGard',
        price: 89.90,
        quantity: 1,
        stock: 25,
      },
    ],
    subtotal: 279.80,
    discount: 0,
    shipping: 0,
    total: 279.80,
    status: 'delivered',
    paymentMethod: 'credit-card',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Av. Paulista',
      number: '1500',
      complement: 'Casa 2',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    trackingCode: 'BR987654321SP',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    customerId: '2',
    customerName: 'Maria Santos',
    items: [
      {
        productId: '3',
        productName: 'Brinquedo Kong Clássico',
        price: 45.90,
        quantity: 2,
        stock: 30,
      },
      {
        productId: '6',
        productName: 'Shampoo Neutro Pet',
        price: 24.90,
        quantity: 3,
        stock: 60,
      },
    ],
    subtotal: 166.50,
    shipping: 25.00,
    discount: 0,
    total: 191.50,
    status: 'shipped',
    paymentMethod: 'pix',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Av. Paulista',
      number: '1500',
      complement: 'Casa 2',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    trackingCode: 'BR456123789SP',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    customerId: '2',
    customerName: 'Maria Santos',
    items: [
      {
        productId: '7',
        productName: 'Areia Sanitária Granulada',
        price: 19.90,
        quantity: 4,
        stock: 80,
      },
    ],
    subtotal: 79.60,
    shipping: 25.00,
    discount: 0,
    total: 104.60,
    status: 'processing',
    paymentMethod: 'credit-card',
    paymentStatus: 'paid',
    shippingAddress: {
      street: 'Av. Paulista',
      number: '1500',
      complement: 'Casa 2',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const calculateCart = (cart: Cart): Cart => {
  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 200 ? 0 : 25;
  const total = subtotal - cart.discount + shipping;

  return {
    ...cart,
    subtotal,
    shipping,
    total,
    updatedAt: new Date().toISOString(),
  };
};

export const cartApi = {
  // Carrinho
  getCart: async (customerId: string) => {
    await delay(400);

    if (!mockCarts[customerId]) {
      mockCarts[customerId] = {
        id: `cart-${customerId}`,
        customerId,
        items: [],
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      success: true,
      data: mockCarts[customerId],
    };
  },

  addItem: async (customerId: string, item: CartItem) => {
    await delay(400);

    let cart = mockCarts[customerId];
    if (!cart) {
      cart = {
        id: `cart-${customerId}`,
        customerId,
        items: [],
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0,
        updatedAt: new Date().toISOString(),
      };
      mockCarts[customerId] = cart;
    }

    // Verificar se item já existe
    const existingIndex = cart.items.findIndex(i => i.productId === item.productId);

    if (existingIndex >= 0) {
      // Atualizar quantidade
      cart.items[existingIndex].quantity += item.quantity;
    } else {
      // Adicionar novo item
      cart.items.push(item);
    }

    cart = calculateCart(cart);
    mockCarts[customerId] = cart;

    return {
      success: true,
      data: cart,
    };
  },

  updateItem: async (customerId: string, productId: string, quantity: number) => {
    await delay(300);

    let cart = mockCarts[customerId];
    if (!cart) {
      return {
        success: false,
        error: 'Carrinho não encontrado',
      };
    }

    const itemIndex = cart.items.findIndex(i => i.productId === productId);
    if (itemIndex === -1) {
      return {
        success: false,
        error: 'Item não encontrado no carrinho',
      };
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    cart = calculateCart(cart);
    mockCarts[customerId] = cart;

    return {
      success: true,
      data: cart,
    };
  },

  removeItem: async (customerId: string, productId: string) => {
    await delay(300);

    let cart = mockCarts[customerId];
    if (!cart) {
      return {
        success: false,
        error: 'Carrinho não encontrado',
      };
    }

    cart.items = cart.items.filter(i => i.productId !== productId);
    cart = calculateCart(cart);
    mockCarts[customerId] = cart;

    return {
      success: true,
      data: cart,
    };
  },

  clearCart: async (customerId: string) => {
    await delay(300);

    mockCarts[customerId] = {
      id: `cart-${customerId}`,
      customerId,
      items: [],
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockCarts[customerId],
    };
  },

  applyCoupon: async (customerId: string, couponCode: string) => {
    await delay(500);

    let cart = mockCarts[customerId];
    if (!cart) {
      return {
        success: false,
        error: 'Carrinho não encontrado',
      };
    }

    // Cupons mockados
    const coupons: Record<string, number> = {
      'DESC10': 10,
      'DESC20': 20,
      'PRIMEIRACOMPRA': 15,
      'FRETEGRATIS': 0, // Zera o frete
    };

    const discount = coupons[couponCode.toUpperCase()];

    if (discount === undefined) {
      return {
        success: false,
        error: 'Cupom inválido',
      };
    }

    if (couponCode.toUpperCase() === 'FRETEGRATIS') {
      cart.shipping = 0;
    } else {
      cart.discount = (cart.subtotal * discount) / 100;
    }

    cart = calculateCart(cart);
    mockCarts[customerId] = cart;

    return {
      success: true,
      data: cart,
      message: `Cupom aplicado! ${discount > 0 ? `${discount}% de desconto` : 'Frete grátis'}`,
    };
  },

  // Pedidos
  checkout: async (customerId: string, customerName: string, shippingAddress: any, paymentMethod: string) => {
    await delay(1000);

    const cart = mockCarts[customerId];
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        error: 'Carrinho vazio',
      };
    }

    const order: Order = {
      id: `${mockOrders.length + 1}`,
      customerId,
      customerName,
      items: [...cart.items],
      subtotal: cart.subtotal,
      discount: cart.discount,
      shipping: cart.shipping,
      total: cart.total,
      status: 'pending',
      paymentMethod,
      paymentStatus: 'pending',
      shippingAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockOrders.push(order);

    // Limpar carrinho
    mockCarts[customerId] = {
      id: `cart-${customerId}`,
      customerId,
      items: [],
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: order,
    };
  },

  getOrders: async (customerId?: string) => {
    await delay(500);

    let orders = [...mockOrders];

    if (customerId) {
      orders = orders.filter(o => o.customerId === customerId);
    }

    return {
      success: true,
      data: orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  },

  getOrder: async (orderId: string) => {
    await delay(400);

    const order = mockOrders.find(o => o.id === orderId);

    return {
      success: true,
      data: order || null,
    };
  },

  updateOrderStatus: async (orderId: string, status: Order['status']) => {
    await delay(500);

    const index = mockOrders.findIndex(o => o.id === orderId);
    if (index === -1) {
      return {
        success: false,
        error: 'Pedido não encontrado',
      };
    }

    mockOrders[index].status = status;
    mockOrders[index].updatedAt = new Date().toISOString();

    return {
      success: true,
      data: mockOrders[index],
    };
  },
};

