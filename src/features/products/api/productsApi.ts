import { Product, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dados mockados
let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ração Premium Golden Adulto',
    description: 'Ração completa para cães adultos de raças médias e grandes',
    category: 'food',
    sku: 'RAC-GOL-15KG',
    barcode: '7891234567890',
    price: 189.90,
    costPrice: 120.00,
    stock: 45,
    minStock: 10,
    unit: 'un',
    brand: 'Golden',
    supplier: 'Distribuidora Pet Center',
    expirationDate: '2025-12-31',
    photo: '',
    active: true,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: '2',
    name: 'Ração para Gatos Whiskas Sachê',
    description: 'Sachê de ração úmida sabor frango para gatos adultos',
    category: 'food',
    sku: 'RAC-WHI-SACHE',
    barcode: '7891234567891',
    price: 3.50,
    costPrice: 2.10,
    stock: 200,
    minStock: 50,
    unit: 'un',
    brand: 'Whiskas',
    supplier: 'Distribuidora Pet Center',
    expirationDate: '2025-06-30',
    photo: '',
    active: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'Brinquedo Kong Clássico',
    description: 'Brinquedo resistente de borracha para cães',
    category: 'toy',
    sku: 'BRI-KONG-M',
    barcode: '7891234567892',
    price: 45.90,
    costPrice: 28.00,
    stock: 30,
    minStock: 5,
    unit: 'un',
    brand: 'Kong',
    supplier: 'Importadora Pet Toys',
    active: true,
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-02-01T09:00:00Z',
  },
  {
    id: '4',
    name: 'Coleira Ajustável Nylon',
    description: 'Coleira de nylon resistente com fivela plástica - Tamanho M',
    category: 'accessory',
    sku: 'COL-NYL-M-AZ',
    barcode: '7891234567893',
    price: 25.90,
    costPrice: 12.50,
    stock: 50,
    minStock: 10,
    unit: 'un',
    brand: 'PetLife',
    supplier: 'Acessórios Pet Brasil',
    active: true,
    createdAt: '2024-02-05T11:00:00Z',
    updatedAt: '2024-02-05T11:00:00Z',
  },
  {
    id: '5',
    name: 'Antipulgas NexGard',
    description: 'Antipulgas e carrapatos mastigável para cães de 4-10kg',
    category: 'medicine',
    sku: 'MED-NEX-M',
    barcode: '7891234567894',
    price: 89.90,
    costPrice: 65.00,
    stock: 25,
    minStock: 5,
    unit: 'un',
    brand: 'NexGard',
    supplier: 'Distribuidora Veterinária',
    expirationDate: '2025-10-31',
    active: true,
    createdAt: '2024-02-10T14:00:00Z',
    updatedAt: '2024-02-10T14:00:00Z',
  },
  {
    id: '6',
    name: 'Shampoo Neutro Pet',
    description: 'Shampoo neutro hipoalergênico para cães e gatos',
    category: 'hygiene',
    sku: 'HIG-SHAM-500ML',
    barcode: '7891234567895',
    price: 24.90,
    costPrice: 14.00,
    stock: 60,
    minStock: 15,
    unit: 'un',
    brand: 'PetClean',
    supplier: 'Higiene Pet Ltda',
    expirationDate: '2026-03-31',
    active: true,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: '7',
    name: 'Areia Sanitária Granulada',
    description: 'Areia higiênica granulada para gatos - 4kg',
    category: 'hygiene',
    sku: 'HIG-ARE-4KG',
    barcode: '7891234567896',
    price: 19.90,
    costPrice: 10.50,
    stock: 80,
    minStock: 20,
    unit: 'un',
    brand: 'CatClean',
    supplier: 'Higiene Pet Ltda',
    active: true,
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-02-20T09:00:00Z',
  },
  {
    id: '8',
    name: 'Petiscos Natural Bife Desidratado',
    description: 'Petisco natural de carne bovina desidratada - 100g',
    category: 'food',
    sku: 'PET-BIF-100G',
    barcode: '7891234567897',
    price: 15.90,
    costPrice: 8.50,
    stock: 100,
    minStock: 25,
    unit: 'un',
    brand: 'NaturalPet',
    supplier: 'Distribuidora Pet Center',
    expirationDate: '2025-08-31',
    active: true,
    createdAt: '2024-03-01T08:30:00Z',
    updatedAt: '2024-03-01T08:30:00Z',
  },
];

export const productsApi = {
  // Listar produtos com paginação e busca
  getProducts: async (
    params: PaginationParams & { category?: string; lowStock?: boolean } = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<Product>>> => {
    await delay(600);

    let filtered = [...mockProducts];

    // Filtro por categoria
    if (params.category) {
      filtered = filtered.filter((product) => product.category === params.category);
    }

    // Filtro de estoque baixo
    if (params.lowStock) {
      filtered = filtered.filter((product) => product.stock <= product.minStock);
    }

    // Filtro de busca
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.barcode?.includes(params.search!) ||
          product.brand?.toLowerCase().includes(searchLower)
      );
    }

    // Ordenação
    if (params.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Product];
        const bValue = b[params.sortBy as keyof Product];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return params.sortOrder === 'desc' ? -comparison : comparison;
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return params.sortOrder === 'desc' ? bValue - aValue : aValue - bValue;
        }

        return 0;
      });
    }

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

  // Buscar produto por ID
  getProductById: async (id: string): Promise<ApiResponse<Product>> => {
    await delay(400);

    const product = mockProducts.find((p) => p.id === id);

    if (!product) {
      return {
        success: false,
        error: 'Produto não encontrado',
      };
    }

    return {
      success: true,
      data: product,
    };
  },

  // Buscar produto por SKU ou código de barras
  getProductByCode: async (code: string): Promise<ApiResponse<Product>> => {
    await delay(400);

    const product = mockProducts.find(
      (p) => p.sku === code || p.barcode === code
    );

    if (!product) {
      return {
        success: false,
        error: 'Produto não encontrado',
      };
    }

    return {
      success: true,
      data: product,
    };
  },

  // Criar novo produto
  createProduct: async (
    productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<Product>> => {
    await delay(800);

    // Validações
    if (!productData.name || !productData.sku || productData.price === undefined) {
      return {
        success: false,
        error: 'Nome, SKU e preço são obrigatórios',
      };
    }

    // Verifica se SKU já existe
    const skuExists = mockProducts.some((p) => p.sku === productData.sku);
    if (skuExists) {
      return {
        success: false,
        error: 'SKU já cadastrado',
      };
    }

    // Verifica se código de barras já existe
    if (productData.barcode) {
      const barcodeExists = mockProducts.some((p) => p.barcode === productData.barcode);
      if (barcodeExists) {
        return {
          success: false,
          error: 'Código de barras já cadastrado',
        };
      }
    }

    const newProduct: Product = {
      ...productData,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockProducts.unshift(newProduct);

    return {
      success: true,
      data: newProduct,
      message: 'Produto cadastrado com sucesso',
    };
  },

  // Atualizar produto
  updateProduct: async (
    id: string,
    productData: Partial<Product>
  ): Promise<ApiResponse<Product>> => {
    await delay(700);

    const index = mockProducts.findIndex((p) => p.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Produto não encontrado',
      };
    }

    // Se está mudando o SKU, verifica se já existe
    if (productData.sku && productData.sku !== mockProducts[index].sku) {
      const skuExists = mockProducts.some(
        (p) => p.sku === productData.sku && p.id !== id
      );
      if (skuExists) {
        return {
          success: false,
          error: 'SKU já cadastrado para outro produto',
        };
      }
    }

    // Se está mudando o código de barras, verifica se já existe
    if (productData.barcode && productData.barcode !== mockProducts[index].barcode) {
      const barcodeExists = mockProducts.some(
        (p) => p.barcode === productData.barcode && p.id !== id
      );
      if (barcodeExists) {
        return {
          success: false,
          error: 'Código de barras já cadastrado para outro produto',
        };
      }
    }

    const updatedProduct: Product = {
      ...mockProducts[index],
      ...productData,
      id, // Garante que o ID não muda
      updatedAt: new Date().toISOString(),
    };

    mockProducts[index] = updatedProduct;

    return {
      success: true,
      data: updatedProduct,
      message: 'Produto atualizado com sucesso',
    };
  },

  // Deletar produto
  deleteProduct: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);

    const index = mockProducts.findIndex((p) => p.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Produto não encontrado',
      };
    }

    mockProducts.splice(index, 1);

    return {
      success: true,
      message: 'Produto excluído com sucesso',
    };
  },

  // Atualizar estoque de um produto
  updateStock: async (
    id: string,
    quantity: number,
    operation: 'add' | 'subtract' | 'set'
  ): Promise<ApiResponse<Product>> => {
    await delay(500);

    const index = mockProducts.findIndex((p) => p.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Produto não encontrado',
      };
    }

    let newStock = mockProducts[index].stock;

    if (operation === 'add') {
      newStock += quantity;
    } else if (operation === 'subtract') {
      newStock -= quantity;
      if (newStock < 0) {
        return {
          success: false,
          error: 'Estoque insuficiente',
        };
      }
    } else {
      newStock = quantity;
    }

    mockProducts[index] = {
      ...mockProducts[index],
      stock: newStock,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockProducts[index],
      message: 'Estoque atualizado com sucesso',
    };
  },

  // Estatísticas de produtos
  getProductStats: async (): Promise<ApiResponse<any>> => {
    await delay(400);

    const stats = {
      total: mockProducts.length,
      active: mockProducts.filter((p) => p.active).length,
      inactive: mockProducts.filter((p) => !p.active).length,
      lowStock: mockProducts.filter((p) => p.stock <= p.minStock).length,
      byCategory: {
        food: mockProducts.filter((p) => p.category === 'food').length,
        toy: mockProducts.filter((p) => p.category === 'toy').length,
        accessory: mockProducts.filter((p) => p.category === 'accessory').length,
        medicine: mockProducts.filter((p) => p.category === 'medicine').length,
        hygiene: mockProducts.filter((p) => p.category === 'hygiene').length,
        other: mockProducts.filter((p) => p.category === 'other').length,
      },
      totalValue: mockProducts.reduce((sum, p) => sum + p.price * p.stock, 0),
      totalCost: mockProducts.reduce((sum, p) => sum + (p.costPrice || 0) * p.stock, 0),
    };

    return {
      success: true,
      data: stats,
    };
  },

  // Produtos com estoque baixo
  getLowStockProducts: async (): Promise<ApiResponse<Product[]>> => {
    await delay(500);

    const lowStockProducts = mockProducts.filter((p) => p.stock <= p.minStock);

    return {
      success: true,
      data: lowStockProducts,
    };
  },
};

