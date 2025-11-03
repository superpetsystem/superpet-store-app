import { CustomerInteraction, CustomerTag, InteractionType } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockInteractions: CustomerInteraction[] = [
  {
    id: '1',
    customerId: '1',
    type: 'purchase',
    title: 'Compra de Ração Premium',
    description: 'Cliente comprou 2 sacos de Ração Golden 15kg',
    userId: 'user1',
    userName: 'Pedro Silva',
    relatedId: 'sale-123',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    customerId: '1',
    type: 'service',
    title: 'Banho e Tosa - Rex',
    description: 'Serviço de banho e tosa completa realizado',
    userId: 'user2',
    userName: 'Maria Santos',
    relatedId: 'service-456',
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    customerId: '1',
    type: 'call',
    title: 'Ligação de acompanhamento',
    description: 'Cliente ligou para agendar consulta veterinária',
    userId: 'user1',
    userName: 'Pedro Silva',
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    customerId: '2',
    type: 'whatsapp',
    title: 'Mensagem WhatsApp',
    description: 'Cliente perguntou sobre horários disponíveis',
    userId: 'user1',
    userName: 'Pedro Silva',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockTags: CustomerTag[] = [
  { id: '1', name: 'VIP', color: '#9C27B0', description: 'Cliente frequente e alto valor' },
  { id: '2', name: 'Preferencial', color: '#4CAF50', description: 'Cliente com preferências especiais' },
  { id: '3', name: 'Atenção', color: '#FF9800', description: 'Requer atenção especial' },
  { id: '4', name: 'Inadimplente', color: '#F44336', description: 'Possui contas em atraso' },
  { id: '5', name: 'Novo Cliente', color: '#2196F3', description: 'Cliente recente (< 3 meses)' },
];

export const crmApi = {
  // Interações
  getInteractions: async (customerId: string) => {
    await delay(500);
    const interactions = mockInteractions
      .filter(i => i.customerId === customerId)
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    
    return {
      success: true,
      data: interactions,
    };
  },

  createInteraction: async (data: Omit<CustomerInteraction, 'id' | 'timestamp'>) => {
    await delay(400);

    const newInteraction: CustomerInteraction = {
      ...data,
      id: `${mockInteractions.length + 1}`,
      timestamp: new Date().toISOString(),
    };

    mockInteractions.push(newInteraction);

    return {
      success: true,
      data: newInteraction,
    };
  },

  // Tags
  getTags: async () => {
    await delay(300);
    return {
      success: true,
      data: mockTags,
    };
  },

  createTag: async (data: Omit<CustomerTag, 'id'>) => {
    await delay(400);

    const newTag: CustomerTag = {
      ...data,
      id: `${mockTags.length + 1}`,
    };

    mockTags.push(newTag);

    return {
      success: true,
      data: newTag,
    };
  },
};

