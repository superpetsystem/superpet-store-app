import { Supplier, SupplierCategory } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Nutrição Pet Ltda',
    cnpj: '12.345.678/0001-90',
    email: 'contato@nutricaopet.com.br',
    phone: '(11) 98765-4321',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      complement: 'Sala 501',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    category: 'food',
    products: ['Ração Golden', 'Ração Premier', 'Petiscos Naturais'],
    paymentTerms: '30/60 dias',
    deliveryTime: 7,
    minimumOrder: 500,
    contactPerson: 'Carlos Alberto',
    notes: 'Fornecedor principal de rações premium',
    active: true,
    createdAt: '2024-01-15T10:00:00.000Z',
    updatedAt: '2024-01-15T10:00:00.000Z',
  },
  {
    id: '2',
    name: 'MedVet Distribuidora',
    cnpj: '98.765.432/0001-10',
    email: 'vendas@medvet.com.br',
    phone: '(11) 3456-7890',
    address: {
      street: 'Rua dos Veterinários',
      number: '250',
      neighborhood: 'Vila Mariana',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '04101-000',
    },
    category: 'medicine',
    products: ['Vacinas', 'Medicamentos', 'Material Cirúrgico'],
    paymentTerms: '30 dias',
    deliveryTime: 3,
    minimumOrder: 300,
    contactPerson: 'Dra. Ana Paula',
    notes: 'Entregas rápidas, especializada em medicamentos veterinários',
    active: true,
    createdAt: '2024-02-01T14:00:00.000Z',
    updatedAt: '2024-02-01T14:00:00.000Z',
  },
  {
    id: '3',
    name: 'Pet Acessórios e Brinquedos',
    cnpj: '45.678.901/0001-23',
    email: 'comercial@petacessorios.com',
    phone: '(11) 2345-6789',
    category: 'accessories',
    products: ['Coleiras', 'Brinquedos', 'Camas', 'Comedouros'],
    paymentTerms: '45 dias',
    deliveryTime: 10,
    minimumOrder: 200,
    contactPerson: 'Roberto Lima',
    notes: 'Variedade grande de acessórios',
    active: true,
    createdAt: '2024-03-10T09:00:00.000Z',
    updatedAt: '2024-03-10T09:00:00.000Z',
  },
];

export const suppliersApi = {
  getAll: async (params?: { category?: SupplierCategory; active?: boolean; search?: string }) => {
    await delay(500);

    let filtered = [...mockSuppliers];

    if (params?.category) {
      filtered = filtered.filter(s => s.category === params.category);
    }

    if (params?.active !== undefined) {
      filtered = filtered.filter(s => s.active === params.active);
    }

    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(search) ||
        s.cnpj?.toLowerCase().includes(search) ||
        s.email?.toLowerCase().includes(search)
      );
    }

    return {
      success: true,
      data: filtered.sort((a, b) => a.name.localeCompare(b.name)),
    };
  },

  getById: async (id: string) => {
    await delay(300);
    const supplier = mockSuppliers.find(s => s.id === id);
    return {
      success: !!supplier,
      data: supplier,
      error: !supplier ? 'Fornecedor não encontrado' : undefined,
    };
  },

  create: async (data: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    const newSupplier: Supplier = {
      ...data,
      id: `${mockSuppliers.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSuppliers.push(newSupplier);

    return {
      success: true,
      data: newSupplier,
    };
  },

  update: async (id: string, data: Partial<Supplier>) => {
    await delay(500);

    const index = mockSuppliers.findIndex(s => s.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Fornecedor não encontrado',
      };
    }

    mockSuppliers[index] = {
      ...mockSuppliers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockSuppliers[index],
    };
  },

  delete: async (id: string) => {
    await delay(400);

    const index = mockSuppliers.findIndex(s => s.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Fornecedor não encontrado',
      };
    }

    mockSuppliers.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  getStatistics: async () => {
    await delay(400);

    const stats = {
      total: mockSuppliers.length,
      active: mockSuppliers.filter(s => s.active).length,
      inactive: mockSuppliers.filter(s => !s.active).length,
      byCategory: {} as Record<string, number>,
    };

    mockSuppliers.forEach(s => {
      stats.byCategory[s.category] = (stats.byCategory[s.category] || 0) + 1;
    });

    return {
      success: true,
      data: stats,
    };
  },
};

