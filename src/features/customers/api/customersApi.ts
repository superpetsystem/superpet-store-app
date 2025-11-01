import { Customer, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dados mockados
let mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Maria Santos',
    email: 'maria@example.com',
    phone: '(11) 91234-5678',
    cpf: '123.456.789-00',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Jardim Primavera',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234-567',
    },
    preferences: {
      contactMethod: 'whatsapp',
      receivePromotions: true,
      receiveReminders: true,
    },
    notes: 'Cliente preferencial',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    name: 'João Silva',
    email: 'joao@example.com',
    phone: '(11) 98765-4321',
    cpf: '987.654.321-00',
    address: {
      street: 'Av. Paulista',
      number: '1000',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
    },
    preferences: {
      contactMethod: 'email',
      receivePromotions: false,
      receiveReminders: true,
    },
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
  },
  {
    id: '3',
    name: 'Ana Paula Costa',
    email: 'ana.costa@example.com',
    phone: '(11) 99887-6655',
    cpf: '456.789.123-00',
    address: {
      street: 'Rua Augusta',
      number: '500',
      complement: 'Casa',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01305-000',
    },
    preferences: {
      contactMethod: 'phone',
      receivePromotions: true,
      receiveReminders: true,
    },
    notes: 'Tem 3 pets',
    createdAt: '2024-03-05T09:15:00Z',
    updatedAt: '2024-03-05T09:15:00Z',
  },
];

export const customersApi = {
  // Listar clientes com paginação e busca
  getCustomers: async (
    params: PaginationParams = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<Customer>>> => {
    await delay(600);

    let filtered = [...mockCustomers];

    // Filtro de busca
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchLower) ||
          customer.email.toLowerCase().includes(searchLower) ||
          customer.phone.includes(params.search!) ||
          customer.cpf?.includes(params.search!)
      );
    }

    // Ordenação
    if (params.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Customer];
        const bValue = b[params.sortBy as keyof Customer];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          const comparison = aValue.localeCompare(bValue);
          return params.sortOrder === 'desc' ? -comparison : comparison;
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

  // Buscar cliente por ID
  getCustomerById: async (id: string): Promise<ApiResponse<Customer>> => {
    await delay(400);

    const customer = mockCustomers.find((c) => c.id === id);

    if (!customer) {
      return {
        success: false,
        error: 'Cliente não encontrado',
      };
    }

    return {
      success: true,
      data: customer,
    };
  },

  // Criar novo cliente
  createCustomer: async (customerData: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Customer>> => {
    await delay(800);

    // Validações
    if (!customerData.name || !customerData.email || !customerData.phone) {
      return {
        success: false,
        error: 'Nome, email e telefone são obrigatórios',
      };
    }

    // Verifica se email já existe
    const emailExists = mockCustomers.some((c) => c.email === customerData.email);
    if (emailExists) {
      return {
        success: false,
        error: 'Email já cadastrado',
      };
    }

    const newCustomer: Customer = {
      ...customerData,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCustomers.unshift(newCustomer);

    return {
      success: true,
      data: newCustomer,
      message: 'Cliente cadastrado com sucesso',
    };
  },

  // Atualizar cliente
  updateCustomer: async (id: string, customerData: Partial<Customer>): Promise<ApiResponse<Customer>> => {
    await delay(700);

    const index = mockCustomers.findIndex((c) => c.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Cliente não encontrado',
      };
    }

    // Se está mudando o email, verifica se já existe
    if (customerData.email && customerData.email !== mockCustomers[index].email) {
      const emailExists = mockCustomers.some(
        (c) => c.email === customerData.email && c.id !== id
      );
      if (emailExists) {
        return {
          success: false,
          error: 'Email já cadastrado para outro cliente',
        };
      }
    }

    const updatedCustomer: Customer = {
      ...mockCustomers[index],
      ...customerData,
      id, // Garante que o ID não muda
      updatedAt: new Date().toISOString(),
    };

    mockCustomers[index] = updatedCustomer;

    return {
      success: true,
      data: updatedCustomer,
      message: 'Cliente atualizado com sucesso',
    };
  },

  // Deletar cliente
  deleteCustomer: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);

    const index = mockCustomers.findIndex((c) => c.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Cliente não encontrado',
      };
    }

    mockCustomers.splice(index, 1);

    return {
      success: true,
      message: 'Cliente excluído com sucesso',
    };
  },

  // Buscar CEP (mock usando API pública do ViaCEP)
  searchZipCode: async (zipCode: string): Promise<ApiResponse<any>> => {
    await delay(500);

    // Simula resposta do ViaCEP
    const mockZipData: Record<string, any> = {
      '01310100': {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        bairro: 'Bela Vista',
        localidade: 'São Paulo',
        uf: 'SP',
      },
      '01234567': {
        cep: '01234-567',
        logradouro: 'Rua das Flores',
        bairro: 'Jardim Primavera',
        localidade: 'São Paulo',
        uf: 'SP',
      },
    };

    const cleanZip = zipCode.replace(/\D/g, '');
    const data = mockZipData[cleanZip];

    if (!data) {
      return {
        success: false,
        error: 'CEP não encontrado',
      };
    }

    return {
      success: true,
      data,
    };
  },
};



