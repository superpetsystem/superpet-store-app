import { Vaccination, VaccineStatus } from '../../../types';

// Delay para simular chamada de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Dados mockados
let mockVaccinations: Vaccination[] = [
  {
    id: '1',
    petId: '1',
    petName: 'Rex',
    vaccineName: 'V10 (Décupla)',
    manufacturer: 'Zoetis',
    batchNumber: 'LOT12345',
    applicationDate: '2024-06-15',
    nextDoseDate: '2025-06-15',
    veterinarianName: 'Dr. Carlos Lima',
    veterinarianCrmv: 'CRMV-SP 12345',
    clinicName: 'SuperPet Clínica Veterinária',
    notes: 'Pet apresentou-se saudável para vacinação',
    attachments: [],
    status: 'applied',
    createdBy: 'owner@superpet.com',
    createdAt: '2024-06-15T10:00:00.000Z',
    updatedAt: '2024-06-15T10:00:00.000Z',
  },
  {
    id: '2',
    petId: '1',
    petName: 'Rex',
    vaccineName: 'Antirrábica',
    manufacturer: 'Merial',
    batchNumber: 'RAB789',
    applicationDate: '2024-07-01',
    nextDoseDate: '2025-07-01',
    veterinarianName: 'Dr. Carlos Lima',
    veterinarianCrmv: 'CRMV-SP 12345',
    clinicName: 'SuperPet Clínica Veterinária',
    notes: 'Vacinação obrigatória',
    attachments: [],
    status: 'applied',
    createdBy: 'owner@superpet.com',
    createdAt: '2024-07-01T14:00:00.000Z',
    updatedAt: '2024-07-01T14:00:00.000Z',
  },
  {
    id: '3',
    petId: '2',
    petName: 'Luna',
    vaccineName: 'V4 (Quádrupla Felina)',
    manufacturer: 'Zoetis',
    batchNumber: 'FEL456',
    applicationDate: '2024-08-10',
    nextDoseDate: '2025-08-10',
    veterinarianName: 'Dra. Ana Paula',
    veterinarianCrmv: 'CRMV-SP 67890',
    clinicName: 'SuperPet Clínica Veterinária',
    notes: 'Primeira dose aplicada com sucesso',
    attachments: [],
    status: 'applied',
    createdBy: 'owner@superpet.com',
    createdAt: '2024-08-10T11:00:00.000Z',
    updatedAt: '2024-08-10T11:00:00.000Z',
  },
  {
    id: '4',
    petId: '3',
    petName: 'Bolinha',
    vaccineName: 'V10 (Décupla)',
    manufacturer: 'Zoetis',
    batchNumber: 'DOG999',
    applicationDate: '2024-05-01',
    nextDoseDate: '2024-11-15',
    veterinarianName: 'Dr. Carlos Lima',
    veterinarianCrmv: 'CRMV-SP 12345',
    clinicName: 'SuperPet Clínica Veterinária',
    notes: 'Reforço necessário em breve',
    attachments: [],
    status: 'overdue',
    createdBy: 'owner@superpet.com',
    createdAt: '2024-05-01T09:00:00.000Z',
    updatedAt: '2024-05-01T09:00:00.000Z',
  },
];

export const vaccinationsApi = {
  // Listar vacinações
  getAll: async (params?: { 
    petId?: string;
    status?: VaccineStatus;
    startDate?: string;
    endDate?: string;
  }) => {
    await delay(500);

    let filtered = [...mockVaccinations];

    if (params?.petId) {
      filtered = filtered.filter(v => v.petId === params.petId);
    }

    if (params?.status) {
      filtered = filtered.filter(v => v.status === params.status);
    }

    if (params?.startDate) {
      filtered = filtered.filter(v => v.applicationDate >= params.startDate!);
    }

    if (params?.endDate) {
      filtered = filtered.filter(v => v.applicationDate <= params.endDate!);
    }

    // Ordenar por data de aplicação (mais recente primeiro)
    filtered.sort((a, b) => b.applicationDate.localeCompare(a.applicationDate));

    return {
      success: true,
      data: filtered,
    };
  },

  // Buscar por ID
  getById: async (id: string) => {
    await delay(300);
    const vaccination = mockVaccinations.find(v => v.id === id);
    return {
      success: !!vaccination,
      data: vaccination,
      error: !vaccination ? 'Vacinação não encontrada' : undefined,
    };
  },

  // Buscar por Pet
  getByPet: async (petId: string) => {
    await delay(400);
    const vaccinations = mockVaccinations
      .filter(v => v.petId === petId)
      .sort((a, b) => b.applicationDate.localeCompare(a.applicationDate));

    return {
      success: true,
      data: vaccinations,
    };
  },

  // Criar vacinação
  create: async (data: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    const newVaccination: Vaccination = {
      ...data,
      id: `${mockVaccinations.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockVaccinations.push(newVaccination);

    return {
      success: true,
      data: newVaccination,
    };
  },

  // Atualizar vacinação
  update: async (id: string, data: Partial<Vaccination>) => {
    await delay(500);

    const index = mockVaccinations.findIndex(v => v.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Vacinação não encontrada',
      };
    }

    mockVaccinations[index] = {
      ...mockVaccinations[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockVaccinations[index],
    };
  },

  // Deletar vacinação
  delete: async (id: string) => {
    await delay(400);

    const index = mockVaccinations.findIndex(v => v.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Vacinação não encontrada',
      };
    }

    mockVaccinations.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  // Verificar vacinas próximas do vencimento
  getUpcoming: async (days: number = 30) => {
    await delay(400);

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const todayStr = today.toISOString().split('T')[0];
    const futureDateStr = futureDate.toISOString().split('T')[0];

    const upcoming = mockVaccinations.filter(v => 
      v.nextDoseDate && 
      v.nextDoseDate >= todayStr && 
      v.nextDoseDate <= futureDateStr &&
      v.status !== 'overdue'
    );

    return {
      success: true,
      data: upcoming.sort((a, b) => 
        (a.nextDoseDate || '').localeCompare(b.nextDoseDate || '')
      ),
    };
  },

  // Verificar vacinas vencidas
  getOverdue: async () => {
    await delay(400);

    const today = new Date().toISOString().split('T')[0];

    const overdue = mockVaccinations.filter(v => 
      v.nextDoseDate && 
      v.nextDoseDate < today &&
      v.status !== 'applied'
    );

    return {
      success: true,
      data: overdue,
    };
  },

  // Estatísticas
  getStatistics: async (petId?: string) => {
    await delay(400);

    const filtered = petId 
      ? mockVaccinations.filter(v => v.petId === petId)
      : mockVaccinations;

    const today = new Date().toISOString().split('T')[0];

    const stats = {
      total: filtered.length,
      applied: filtered.filter(v => v.status === 'applied').length,
      pending: filtered.filter(v => v.status === 'pending').length,
      overdue: filtered.filter(v => v.status === 'overdue' || (v.nextDoseDate && v.nextDoseDate < today)).length,
      byVaccine: {} as Record<string, number>,
    };

    filtered.forEach(v => {
      stats.byVaccine[v.vaccineName] = (stats.byVaccine[v.vaccineName] || 0) + 1;
    });

    return {
      success: true,
      data: stats,
    };
  },

  // Exportar carteira de vacinação
  exportVaccinationCard: async (petId: string) => {
    await delay(600);

    const vaccinations = mockVaccinations
      .filter(v => v.petId === petId)
      .sort((a, b) => b.applicationDate.localeCompare(a.applicationDate));

    // Simula geração de PDF (na vida real, usaria uma biblioteca como jsPDF)
    return {
      success: true,
      data: {
        petId,
        vaccinations,
        exportDate: new Date().toISOString(),
        format: 'pdf',
      },
    };
  },
};

