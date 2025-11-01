import { SystemUser, Role, Permission, AuditLog } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const mockPermissions: Permission[] = [
  { id: '1', module: 'products', action: 'create', description: 'Criar produtos' },
  { id: '2', module: 'products', action: 'read', description: 'Visualizar produtos' },
  { id: '3', module: 'products', action: 'update', description: 'Editar produtos' },
  { id: '4', module: 'products', action: 'delete', description: 'Deletar produtos' },
  { id: '5', module: 'sales', action: 'create', description: 'Criar vendas' },
  { id: '6', module: 'sales', action: 'read', description: 'Visualizar vendas' },
  { id: '7', module: 'customers', action: 'create', description: 'Criar clientes' },
  { id: '8', module: 'customers', action: 'read', description: 'Visualizar clientes' },
  { id: '9', module: 'reports', action: 'read', description: 'Visualizar relatórios' },
  { id: '10', module: 'settings', action: 'update', description: 'Alterar configurações' },
];

let mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: mockPermissions,
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Gerente',
    description: 'Gestão de operações e relatórios',
    permissions: mockPermissions.filter(p => p.module !== 'settings'),
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Atendente',
    description: 'Vendas e atendimento ao cliente',
    permissions: mockPermissions.filter(p => 
      (p.module === 'sales' && p.action !== 'delete') ||
      (p.module === 'customers' && p.action !== 'delete') ||
      (p.module === 'products' && p.action === 'read')
    ),
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '4',
    name: 'Tosador',
    description: 'Apenas execução de serviços',
    permissions: mockPermissions.filter(p => p.action === 'read'),
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

let mockUsers: SystemUser[] = [
  {
    id: '1',
    name: 'Admin SuperPet',
    email: 'admin@superpet.com',
    roleId: '1',
    roleName: 'Administrador',
    phone: '(11) 99999-9999',
    active: true,
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@superpet.com',
    roleId: '4',
    roleName: 'Tosador',
    phone: '(11) 98888-8888',
    active: true,
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pedro Silva',
    email: 'pedro@superpet.com',
    roleId: '3',
    roleName: 'Atendente',
    phone: '(11) 97777-7777',
    active: true,
    lastLogin: new Date(Date.now() - 7200000).toISOString(),
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: new Date().toISOString(),
  },
];

let mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Admin SuperPet',
    action: 'Login',
    module: 'auth',
    description: 'Usuário fez login no sistema',
    ipAddress: '192.168.1.100',
    timestamp: new Date().toISOString(),
  },
  {
    id: '2',
    userId: '2',
    userName: 'Maria Santos',
    action: 'Criou ordem de serviço',
    module: 'service-orders',
    description: 'Ordem de serviço #123 criada para Rex',
    ipAddress: '192.168.1.101',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: '3',
    userId: '3',
    userName: 'Pedro Silva',
    action: 'Venda realizada',
    module: 'sales',
    description: 'Venda #456 no valor de R$ 250,00',
    ipAddress: '192.168.1.102',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
  },
];

export const usersApi = {
  // Usuários
  getAll: async (params?: { roleId?: string; active?: boolean }) => {
    await delay(500);

    let filtered = [...mockUsers];

    if (params?.roleId) {
      filtered = filtered.filter(u => u.roleId === params.roleId);
    }

    if (params?.active !== undefined) {
      filtered = filtered.filter(u => u.active === params.active);
    }

    return {
      success: true,
      data: filtered,
    };
  },

  getById: async (id: string) => {
    await delay(300);
    const user = mockUsers.find(u => u.id === id);
    return {
      success: !!user,
      data: user,
      error: !user ? 'Usuário não encontrado' : undefined,
    };
  },

  create: async (data: Omit<SystemUser, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    // Verificar email duplicado
    const exists = mockUsers.some(u => u.email === data.email);
    if (exists) {
      return {
        success: false,
        error: 'Email já cadastrado',
      };
    }

    const newUser: SystemUser = {
      ...data,
      id: `${mockUsers.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return {
      success: true,
      data: newUser,
    };
  },

  update: async (id: string, data: Partial<SystemUser>) => {
    await delay(500);

    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Usuário não encontrado',
      };
    }

    mockUsers[index] = {
      ...mockUsers[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockUsers[index],
    };
  },

  delete: async (id: string) => {
    await delay(400);

    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Usuário não encontrado',
      };
    }

    mockUsers.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  // Roles
  roles: {
    getAll: async () => {
      await delay(400);
      return {
        success: true,
        data: mockRoles,
      };
    },

    getById: async (id: string) => {
      await delay(300);
      const role = mockRoles.find(r => r.id === id);
      return {
        success: !!role,
        data: role,
        error: !role ? 'Perfil não encontrado' : undefined,
      };
    },

    create: async (data: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>) => {
      await delay(500);

      const newRole: Role = {
        ...data,
        id: `${mockRoles.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockRoles.push(newRole);

      return {
        success: true,
        data: newRole,
      };
    },

    update: async (id: string, data: Partial<Role>) => {
      await delay(500);

      const index = mockRoles.findIndex(r => r.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Perfil não encontrado',
        };
      }

      mockRoles[index] = {
        ...mockRoles[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: mockRoles[index],
      };
    },

    delete: async (id: string) => {
      await delay(400);

      const index = mockRoles.findIndex(r => r.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Perfil não encontrado',
        };
      }

      mockRoles.splice(index, 1);

      return {
        success: true,
        data: { id },
      };
    },
  },

  // Audit Logs
  auditLogs: {
    getAll: async (params?: { userId?: string; module?: string; startDate?: string; endDate?: string }) => {
      await delay(500);

      let filtered = [...mockAuditLogs];

      if (params?.userId) {
        filtered = filtered.filter(log => log.userId === params.userId);
      }

      if (params?.module) {
        filtered = filtered.filter(log => log.module === params.module);
      }

      if (params?.startDate) {
        filtered = filtered.filter(log => log.timestamp >= params.startDate!);
      }

      if (params?.endDate) {
        filtered = filtered.filter(log => log.timestamp <= params.endDate!);
      }

      return {
        success: true,
        data: filtered.sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
      };
    },

    log: async (data: Omit<AuditLog, 'id' | 'timestamp'>) => {
      await delay(200);

      const newLog: AuditLog = {
        ...data,
        id: `${mockAuditLogs.length + 1}`,
        timestamp: new Date().toISOString(),
      };

      mockAuditLogs.push(newLog);

      return {
        success: true,
        data: newLog,
      };
    },
  },

  // Permissions
  permissions: {
    getAll: async () => {
      await delay(300);
      return {
        success: true,
        data: mockPermissions,
      };
    },
  },
};

