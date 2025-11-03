import { Appointment, TimeBlock, AppointmentStatus } from '../../../types';

// Delay para simular chamada de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dados mockados
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

let mockAppointments: Appointment[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'João Silva',
    petId: '1',
    petName: 'Rex',
    serviceId: '1',
    serviceName: 'Banho e Tosa Completa',
    serviceType: 'grooming',
    date: today,
    startTime: '09:00',
    endTime: '10:30',
    duration: 90,
    status: 'confirmed',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: 'Cliente prefere produtos hipoalergênicos',
    reminderSent: true,
    createdBy: 'owner@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Ana Costa',
    petId: '2',
    petName: 'Luna',
    serviceId: '2',
    serviceName: 'Consulta Veterinária',
    serviceType: 'veterinary',
    date: today,
    startTime: '14:00',
    endTime: '14:30',
    duration: 30,
    status: 'scheduled',
    employeeId: 'emp2',
    employeeName: 'Dr. Carlos Lima',
    notes: 'Primeira consulta',
    reminderSent: false,
    createdBy: 'owner@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    customerId: '1',
    customerName: 'João Silva',
    petId: '3',
    petName: 'Bolinha',
    serviceId: '1',
    serviceName: 'Banho',
    serviceType: 'grooming',
    date: today,
    startTime: '15:30',
    endTime: '16:15',
    duration: 45,
    status: 'scheduled',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: '',
    reminderSent: false,
    createdBy: 'owner@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    customerId: '3',
    customerName: 'Carlos Mendes',
    petId: '4',
    petName: 'Thor',
    serviceId: '3',
    serviceName: 'Tosa Higiênica',
    serviceType: 'grooming',
    date: today,
    startTime: '11:00',
    endTime: '11:45',
    duration: 45,
    status: 'in-progress',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: 'Pet muito agitado, tomar cuidado',
    reminderSent: true,
    createdBy: 'owner@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    customerId: '2',
    customerName: 'Ana Costa',
    petId: '5',
    petName: 'Mel',
    serviceId: '4',
    serviceName: 'Vacinação Antirrábica',
    serviceType: 'veterinary',
    date: tomorrow,
    startTime: '10:00',
    endTime: '10:15',
    duration: 15,
    status: 'confirmed',
    employeeId: 'emp2',
    employeeName: 'Dr. Carlos Lima',
    notes: '',
    reminderSent: true,
    createdBy: 'owner@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    customerId: '4',
    customerName: 'Mariana Oliveira',
    petId: '6',
    petName: 'Bob',
    serviceId: '1',
    serviceName: 'Banho e Tosa',
    serviceType: 'grooming',
    date: yesterday,
    startTime: '14:00',
    endTime: '15:00',
    duration: 60,
    status: 'completed',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: '',
    reminderSent: true,
    createdBy: 'owner@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // Agendamentos do customer ID 2 (Maria Santos)
  {
    id: '7',
    customerId: '2',
    customerName: 'Maria Santos',
    petId: '3',
    petName: 'Bob',
    serviceId: '1',
    serviceName: 'Banho',
    serviceType: 'grooming',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    duration: 60,
    status: 'confirmed',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: 'Cliente pediu atenção especial com o clima quente',
    reminderSent: false,
    price: 50,
    createdBy: 'customer@superpet.com',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    customerId: '2',
    customerName: 'Maria Santos',
    petId: '3',
    petName: 'Bob',
    serviceId: '2',
    serviceName: 'Tosa Completa',
    serviceType: 'grooming',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:30',
    endTime: '16:00',
    duration: 90,
    status: 'scheduled',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: '',
    reminderSent: false,
    price: 80,
    createdBy: 'customer@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '9',
    customerId: '2',
    customerName: 'Maria Santos',
    petId: '3',
    petName: 'Bob',
    serviceId: '4',
    serviceName: 'Consulta Veterinária',
    serviceType: 'veterinary',
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '11:00',
    endTime: '11:30',
    duration: 30,
    status: 'completed',
    employeeId: 'emp2',
    employeeName: 'Dr. Carlos Lima',
    notes: 'Consulta de rotina realizada - tudo ok',
    reminderSent: true,
    price: 150,
    createdBy: 'owner@superpet.com',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '10',
    customerId: '2',
    customerName: 'Maria Santos',
    petId: '3',
    petName: 'Bob',
    serviceId: '3',
    serviceName: 'Banho e Tosa',
    serviceType: 'grooming',
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '11:00',
    duration: 120,
    status: 'completed',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: '',
    reminderSent: true,
    price: 120,
    createdBy: 'owner@superpet.com',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '11',
    customerId: '2',
    customerName: 'Maria Santos',
    petId: '3',
    petName: 'Bob',
    serviceId: '5',
    serviceName: 'Vacinação',
    serviceType: 'veterinary',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '09:30',
    endTime: '09:45',
    duration: 15,
    status: 'confirmed',
    employeeId: 'emp2',
    employeeName: 'Dr. Carlos Lima',
    notes: 'Vacina V10 - Reforço anual',
    reminderSent: true,
    price: 80,
    createdBy: 'customer@superpet.com',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '12',
    customerId: '2',
    customerName: 'Maria Santos',
    petId: '3',
    petName: 'Bob',
    serviceId: '1',
    serviceName: 'Banho',
    serviceType: 'grooming',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '15:00',
    endTime: '16:00',
    duration: 60,
    status: 'scheduled',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: '',
    reminderSent: false,
    price: 50,
    createdBy: 'customer@superpet.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '13',
    customerId: '2',
    customerName: 'Maria Santos',
    petId: '3',
    petName: 'Bob',
    serviceId: '1',
    serviceName: 'Banho',
    serviceType: 'grooming',
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '10:30',
    endTime: '11:30',
    duration: 60,
    status: 'completed',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: 'Cliente muito satisfeito com o resultado',
    reminderSent: true,
    price: 50,
    createdBy: 'owner@superpet.com',
    createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '14',
    customerId: '2',
    customerName: 'Maria Santos',
    petId: '3',
    petName: 'Bob',
    serviceId: '2',
    serviceName: 'Tosa Completa',
    serviceType: 'grooming',
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: 'completed',
    employeeId: 'emp1',
    employeeName: 'Maria Santos',
    notes: 'Tosa verão - pelo curto',
    reminderSent: true,
    price: 80,
    createdBy: 'owner@superpet.com',
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '15',
    customerId: '2',
    customerName: 'Maria Santos',
    petId: '3',
    petName: 'Bob',
    serviceId: '4',
    serviceName: 'Consulta Veterinária',
    serviceType: 'veterinary',
    date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '16:30',
    duration: 30,
    status: 'completed',
    employeeId: 'emp2',
    employeeName: 'Dr. Carlos Lima',
    notes: 'Check-up completo - saúde excelente',
    reminderSent: true,
    price: 150,
    createdBy: 'owner@superpet.com',
    createdAt: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let mockTimeBlocks: TimeBlock[] = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    startTime: '12:00',
    endTime: '13:00',
    reason: 'Almoço',
    createdBy: 'owner@superpet.com',
    createdAt: new Date().toISOString(),
  },
];

export const appointmentsApi = {
  // Listar agendamentos
  getAll: async (params?: { 
    date?: string; 
    startDate?: string; 
    endDate?: string; 
    status?: AppointmentStatus;
    customerId?: string;
    petId?: string;
    employeeId?: string;
  }) => {
    await delay(500);

    let filtered = [...mockAppointments];

    if (params?.date) {
      filtered = filtered.filter(a => a.date === params.date);
    }

    if (params?.startDate && params?.endDate) {
      filtered = filtered.filter(a => a.date >= params.startDate! && a.date <= params.endDate!);
    }

    if (params?.status) {
      filtered = filtered.filter(a => a.status === params.status);
    }

    if (params?.customerId) {
      filtered = filtered.filter(a => a.customerId === params.customerId);
    }

    if (params?.petId) {
      filtered = filtered.filter(a => a.petId === params.petId);
    }

    if (params?.employeeId) {
      filtered = filtered.filter(a => a.employeeId === params.employeeId);
    }

    return {
      success: true,
      data: filtered.sort((a, b) => {
        if (a.date !== b.date) {
          return a.date.localeCompare(b.date);
        }
        return a.startTime.localeCompare(b.startTime);
      }),
    };
  },

  // Buscar por ID
  getById: async (id: string) => {
    await delay(300);
    const appointment = mockAppointments.find(a => a.id === id);
    return {
      success: !!appointment,
      data: appointment,
      error: !appointment ? 'Agendamento não encontrado' : undefined,
    };
  },

  // Criar agendamento
  create: async (data: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    // Validar conflitos de horário
    const hasConflict = mockAppointments.some(a => 
      a.date === data.date &&
      a.status !== 'cancelled' &&
      a.status !== 'no-show' &&
      (
        (data.startTime >= a.startTime && data.startTime < a.endTime) ||
        (data.endTime > a.startTime && data.endTime <= a.endTime) ||
        (data.startTime <= a.startTime && data.endTime >= a.endTime)
      )
    );

    if (hasConflict) {
      return {
        success: false,
        error: 'Já existe um agendamento neste horário',
      };
    }

    const newAppointment: Appointment = {
      ...data,
      id: `${mockAppointments.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockAppointments.push(newAppointment);

    return {
      success: true,
      data: newAppointment,
    };
  },

  // Atualizar agendamento
  update: async (id: string, data: Partial<Appointment>) => {
    await delay(500);

    const index = mockAppointments.findIndex(a => a.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Agendamento não encontrado',
      };
    }

    mockAppointments[index] = {
      ...mockAppointments[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockAppointments[index],
    };
  },

  // Deletar agendamento
  delete: async (id: string) => {
    await delay(400);

    const index = mockAppointments.findIndex(a => a.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Agendamento não encontrado',
      };
    }

    mockAppointments.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  // Atualizar status
  updateStatus: async (id: string, status: AppointmentStatus) => {
    await delay(400);

    const index = mockAppointments.findIndex(a => a.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Agendamento não encontrado',
      };
    }

    mockAppointments[index] = {
      ...mockAppointments[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockAppointments[index],
    };
  },

  // Verificar disponibilidade
  checkAvailability: async (date: string, startTime: string, endTime: string, excludeId?: string) => {
    await delay(300);

    const conflicts = mockAppointments.filter(a => 
      a.id !== excludeId &&
      a.date === date &&
      a.status !== 'cancelled' &&
      a.status !== 'no-show' &&
      (
        (startTime >= a.startTime && startTime < a.endTime) ||
        (endTime > a.startTime && endTime <= a.endTime) ||
        (startTime <= a.startTime && endTime >= a.endTime)
      )
    );

    return {
      success: true,
      data: {
        available: conflicts.length === 0,
        conflicts,
      },
    };
  },

  // Bloqueios de horário
  timeBlocks: {
    getAll: async (date?: string) => {
      await delay(300);
      
      let filtered = [...mockTimeBlocks];
      if (date) {
        filtered = filtered.filter(tb => tb.date === date);
      }

      return {
        success: true,
        data: filtered,
      };
    },

    create: async (data: Omit<TimeBlock, 'id' | 'createdAt'>) => {
      await delay(400);

      const newBlock: TimeBlock = {
        ...data,
        id: `tb-${mockTimeBlocks.length + 1}`,
        createdAt: new Date().toISOString(),
      };

      mockTimeBlocks.push(newBlock);

      return {
        success: true,
        data: newBlock,
      };
    },

    delete: async (id: string) => {
      await delay(300);

      const index = mockTimeBlocks.findIndex(tb => tb.id === id);
      if (index === -1) {
        return {
          success: false,
          error: 'Bloqueio não encontrado',
        };
      }

      mockTimeBlocks.splice(index, 1);

      return {
        success: true,
        data: { id },
      };
    },
  },

  // Estatísticas
  getStatistics: async (startDate: string, endDate: string) => {
    await delay(400);

    const filtered = mockAppointments.filter(a => 
      a.date >= startDate && a.date <= endDate
    );

    const stats = {
      total: filtered.length,
      scheduled: filtered.filter(a => a.status === 'scheduled').length,
      confirmed: filtered.filter(a => a.status === 'confirmed').length,
      completed: filtered.filter(a => a.status === 'completed').length,
      cancelled: filtered.filter(a => a.status === 'cancelled').length,
      noShow: filtered.filter(a => a.status === 'no-show').length,
      byService: {} as Record<string, number>,
      byEmployee: {} as Record<string, number>,
    };

    filtered.forEach(a => {
      stats.byService[a.serviceName] = (stats.byService[a.serviceName] || 0) + 1;
      if (a.employeeName) {
        stats.byEmployee[a.employeeName] = (stats.byEmployee[a.employeeName] || 0) + 1;
      }
    });

    return {
      success: true,
      data: stats,
    };
  },
};

