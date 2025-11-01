import { User, ApiResponse } from '../types';

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Usuários mockados para testes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'owner@superpet.com',
    name: 'João Silva - Dono',
    role: 'owner',
    phone: '(11) 98765-4321',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'customer@superpet.com',
    name: 'Maria Santos - Tutora',
    role: 'customer',
    phone: '(11) 91234-5678',
    avatar: '',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  password: string;
}

export const authApi = {
  register: async (data: RegisterData): Promise<ApiResponse<LoginResponse>> => {
    await delay(1000);

    // Validação
    if (!data.name || !data.email || !data.phone || !data.password) {
      return {
        success: false,
        error: 'Todos os campos obrigatórios devem ser preenchidos',
      };
    }

    // Verifica se email já existe
    const emailExists = mockUsers.some((u) => u.email === data.email);
    if (emailExists) {
      return {
        success: false,
        error: 'Este email já está cadastrado',
      };
    }

    // Cria novo usuário customer
    const newUser: User = {
      id: `${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'customer',
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    const token = `mock_token_${newUser.id}_${Date.now()}`;

    return {
      success: true,
      data: {
        user: newUser,
        token,
      },
      message: 'Cadastro realizado com sucesso!',
    };
  },

  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> => {
    await delay(800);

    // Validação simples
    const user = mockUsers.find((u) => u.email === credentials.email);

    if (!user) {
      return {
        success: false,
        error: 'Email ou senha inválidos',
      };
    }

    // Senhas mockadas para demo
    // Em produção, isso seria verificado no backend com hash
    const validPasswords: Record<string, string> = {
      'owner@superpet.com': '123456',
      'customer@superpet.com': '123456',
    };

    if (validPasswords[credentials.email] !== credentials.password) {
      return {
        success: false,
        error: 'Email ou senha inválidos',
      };
    }

    const token = `mock_token_${user.id}_${Date.now()}`;

    return {
      success: true,
      data: {
        user,
        token,
      },
    };
  },

  logout: async (): Promise<ApiResponse<void>> => {
    await delay(300);
    return {
      success: true,
      message: 'Logout realizado com sucesso',
    };
  },

  getCurrentUser: async (token: string): Promise<ApiResponse<User>> => {
    await delay(500);

    // Extrai o ID do token mockado
    const userId = token.split('_')[2];
    const user = mockUsers.find((u) => u.id === userId);

    if (!user) {
      return {
        success: false,
        error: 'Usuário não encontrado',
      };
    }

    return {
      success: true,
      data: user,
    };
  },

  updateProfile: async (userId: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    await delay(600);

    const userIndex = mockUsers.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return {
        success: false,
        error: 'Usuário não encontrado',
      };
    }

    mockUsers[userIndex] = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockUsers[userIndex],
    };
  },
};

