import { Reminder, ReminderTemplate, ReminderType, ReminderChannel, ReminderStatus } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockReminders: Reminder[] = [
  {
    id: '1',
    type: 'vaccination',
    customerId: '1',
    customerName: 'João Silva',
    petId: '1',
    petName: 'Rex',
    title: 'Lembrete de Vacina',
    message: 'Olá João! O Rex precisa tomar a vacina antirrábica em 7 dias. Agende conosco!',
    channel: 'whatsapp',
    scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    scheduledTime: '10:00',
    status: 'pending',
    createdBy: 'owner@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    type: 'grooming',
    customerId: '2',
    customerName: 'Ana Costa',
    petId: '2',
    petName: 'Luna',
    title: 'Lembrete de Banho',
    message: 'Oi Ana! A Luna está com banho marcado para amanhã às 14h. Confirme sua presença!',
    channel: 'sms',
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTime: '09:00',
    status: 'sent',
    sentAt: new Date().toISOString(),
    createdBy: 'owner@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let mockTemplates: ReminderTemplate[] = [
  {
    id: '1',
    name: 'Lembrete de Vacina',
    type: 'vaccination',
    subject: 'Vacina do {petName} em {days} dias',
    message: 'Olá {customerName}! O {petName} precisa tomar a vacina {vaccineName} em {days} dias. Agende conosco pelo telefone {phone}!',
    channel: 'whatsapp',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Confirmação de Agendamento',
    type: 'appointment',
    subject: 'Confirmação de Agendamento',
    message: 'Oi {customerName}! Confirmamos o agendamento do {petName} para {serviceName} no dia {date} às {time}. Te esperamos!',
    channel: 'sms',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Aniversário do Pet',
    type: 'birthday',
    subject: 'Feliz Aniversário {petName}! 🎉',
    message: 'Parabéns {petName}! Hoje é seu dia especial! {customerName}, ganhe 15% de desconto em qualquer serviço neste mês!',
    channel: 'email',
    active: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];

export const remindersApi = {
  // Lembretes
  getAll: async (params?: { status?: ReminderStatus; type?: ReminderType; customerId?: string }) => {
    await delay(500);

    let filtered = [...mockReminders];

    if (params?.status) {
      filtered = filtered.filter(r => r.status === params.status);
    }

    if (params?.type) {
      filtered = filtered.filter(r => r.type === params.type);
    }

    if (params?.customerId) {
      filtered = filtered.filter(r => r.customerId === params.customerId);
    }

    return {
      success: true,
      data: filtered.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate)),
    };
  },

  create: async (data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    const newReminder: Reminder = {
      ...data,
      id: `${mockReminders.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockReminders.push(newReminder);

    return {
      success: true,
      data: newReminder,
    };
  },

  updateStatus: async (id: string, status: ReminderStatus) => {
    await delay(400);

    const index = mockReminders.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Lembrete não encontrado',
      };
    }

    mockReminders[index] = {
      ...mockReminders[index],
      status,
      sentAt: status === 'sent' ? new Date().toISOString() : mockReminders[index].sentAt,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockReminders[index],
    };
  },

  delete: async (id: string) => {
    await delay(400);

    const index = mockReminders.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Lembrete não encontrado',
      };
    }

    mockReminders.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  // Templates
  templates: {
    getAll: async (params?: { type?: ReminderType; active?: boolean }) => {
      await delay(400);

      let filtered = [...mockTemplates];

      if (params?.type) {
        filtered = filtered.filter(t => t.type === params.type);
      }

      if (params?.active !== undefined) {
        filtered = filtered.filter(t => t.active === params.active);
      }

      return {
        success: true,
        data: filtered,
      };
    },

    create: async (data: Omit<ReminderTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
      await delay(500);

      const newTemplate: ReminderTemplate = {
        ...data,
        id: `${mockTemplates.length + 1}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      mockTemplates.push(newTemplate);

      return {
        success: true,
        data: newTemplate,
      };
    },

    update: async (id: string, data: Partial<ReminderTemplate>) => {
      await delay(500);

      const index = mockTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Template não encontrado',
        };
      }

      mockTemplates[index] = {
        ...mockTemplates[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };

      return {
        success: true,
        data: mockTemplates[index],
      };
    },

    delete: async (id: string) => {
      await delay(400);

      const index = mockTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Template não encontrado',
        };
      }

      mockTemplates.splice(index, 1);

      return {
        success: true,
        data: { id },
      };
    },
  },

  // Enviar lembrete manual
  send: async (id: string) => {
    await delay(1000); // Simula tempo de envio

    const index = mockReminders.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Lembrete não encontrado',
      };
    }

    mockReminders[index].status = 'sent';
    mockReminders[index].sentAt = new Date().toISOString();

    return {
      success: true,
      data: mockReminders[index],
    };
  },

  // Estatísticas
  getStatistics: async () => {
    await delay(400);

    const stats = {
      total: mockReminders.length,
      pending: mockReminders.filter(r => r.status === 'pending').length,
      sent: mockReminders.filter(r => r.status === 'sent').length,
      failed: mockReminders.filter(r => r.status === 'failed').length,
      byChannel: {} as Record<string, number>,
      byType: {} as Record<string, number>,
    };

    mockReminders.forEach(r => {
      stats.byChannel[r.channel] = (stats.byChannel[r.channel] || 0) + 1;
      stats.byType[r.type] = (stats.byType[r.type] || 0) + 1;
    });

    return {
      success: true,
      data: stats,
    };
  },
};

