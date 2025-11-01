import { Pet, ApiResponse, PaginatedResponse, PaginationParams } from '../../../types';

// Simula um delay de rede
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dados mockados
let mockPets: Pet[] = [
  {
    id: '1',
    customerId: '1',
    name: 'Rex',
    species: 'dog',
    breed: 'Golden Retriever',
    gender: 'male',
    birthDate: '2020-05-15',
    age: 4,
    weight: 32,
    size: 'large',
    color: 'Dourado',
    microchip: '123456789012345',
    neutered: true,
    allergies: ['Frango'],
    medications: [],
    specialCare: 'Precisa de exercícios diários',
    photo: '',
    notes: 'Muito dócil e brincalhão',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    customerId: '1',
    name: 'Luna',
    species: 'cat',
    breed: 'Persa',
    gender: 'female',
    birthDate: '2021-08-20',
    age: 3,
    weight: 4.5,
    size: 'small',
    color: 'Branco',
    microchip: '987654321098765',
    neutered: true,
    allergies: [],
    medications: ['Vermífugo mensal'],
    photo: '',
    notes: 'Gosta de lugares altos',
    createdAt: '2024-02-10T14:30:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
  },
  {
    id: '3',
    customerId: '2',
    name: 'Bob',
    species: 'dog',
    breed: 'Bulldog Francês',
    gender: 'male',
    birthDate: '2022-03-10',
    age: 2,
    weight: 12,
    size: 'medium',
    color: 'Tigrado',
    neutered: false,
    allergies: ['Pólen'],
    medications: [],
    specialCare: 'Atenção com temperatura alta',
    photo: '',
    notes: 'Ronca bastante',
    createdAt: '2024-03-05T09:15:00Z',
    updatedAt: '2024-03-05T09:15:00Z',
  },
  {
    id: '4',
    customerId: '3',
    name: 'Mel',
    species: 'dog',
    breed: 'Poodle',
    gender: 'female',
    birthDate: '2019-12-05',
    age: 5,
    weight: 8,
    size: 'medium',
    color: 'Caramelo',
    neutered: true,
    allergies: [],
    medications: ['Condroitina para articulações'],
    photo: '',
    notes: 'Adora brincar com água',
    createdAt: '2024-03-05T09:20:00Z',
    updatedAt: '2024-03-05T09:20:00Z',
  },
];

export const petsApi = {
  // Listar pets com paginação e busca
  getPets: async (
    params: PaginationParams & { customerId?: string } = { page: 1, limit: 10 }
  ): Promise<ApiResponse<PaginatedResponse<Pet>>> => {
    await delay(600);

    let filtered = [...mockPets];

    // Filtro por cliente
    if (params.customerId) {
      filtered = filtered.filter((pet) => pet.customerId === params.customerId);
    }

    // Filtro de busca
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchLower) ||
          pet.breed?.toLowerCase().includes(searchLower) ||
          pet.species.toLowerCase().includes(searchLower) ||
          pet.microchip?.includes(params.search!)
      );
    }

    // Ordenação
    if (params.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[params.sortBy as keyof Pet];
        const bValue = b[params.sortBy as keyof Pet];
        
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

  // Buscar pet por ID
  getPetById: async (id: string): Promise<ApiResponse<Pet>> => {
    await delay(400);

    const pet = mockPets.find((p) => p.id === id);

    if (!pet) {
      return {
        success: false,
        error: 'Pet não encontrado',
      };
    }

    return {
      success: true,
      data: pet,
    };
  },

  // Buscar pets por cliente
  getPetsByCustomer: async (customerId: string): Promise<ApiResponse<Pet[]>> => {
    await delay(500);

    const pets = mockPets.filter((p) => p.customerId === customerId);

    return {
      success: true,
      data: pets,
    };
  },

  // Criar novo pet
  createPet: async (petData: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Pet>> => {
    await delay(800);

    // Validações
    if (!petData.name || !petData.species || !petData.customerId) {
      return {
        success: false,
        error: 'Nome, espécie e cliente são obrigatórios',
      };
    }

    // Calcula idade se birthDate fornecido
    let age = petData.age;
    if (petData.birthDate && !age) {
      const birthDate = new Date(petData.birthDate);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
    }

    const newPet: Pet = {
      ...petData,
      age,
      id: `${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockPets.unshift(newPet);

    return {
      success: true,
      data: newPet,
      message: 'Pet cadastrado com sucesso',
    };
  },

  // Atualizar pet
  updatePet: async (id: string, petData: Partial<Pet>): Promise<ApiResponse<Pet>> => {
    await delay(700);

    const index = mockPets.findIndex((p) => p.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Pet não encontrado',
      };
    }

    // Recalcula idade se birthDate mudou
    let age = petData.age;
    if (petData.birthDate) {
      const birthDate = new Date(petData.birthDate);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
    }

    const updatedPet: Pet = {
      ...mockPets[index],
      ...petData,
      age: age || mockPets[index].age,
      id, // Garante que o ID não muda
      updatedAt: new Date().toISOString(),
    };

    mockPets[index] = updatedPet;

    return {
      success: true,
      data: updatedPet,
      message: 'Pet atualizado com sucesso',
    };
  },

  // Deletar pet
  deletePet: async (id: string): Promise<ApiResponse<void>> => {
    await delay(500);

    const index = mockPets.findIndex((p) => p.id === id);

    if (index === -1) {
      return {
        success: false,
        error: 'Pet não encontrado',
      };
    }

    mockPets.splice(index, 1);

    return {
      success: true,
      message: 'Pet excluído com sucesso',
    };
  },

  // Estatísticas de pets
  getPetStats: async (): Promise<ApiResponse<any>> => {
    await delay(400);

    const stats = {
      total: mockPets.length,
      bySpecies: {
        dog: mockPets.filter((p) => p.species === 'dog').length,
        cat: mockPets.filter((p) => p.species === 'cat').length,
        bird: mockPets.filter((p) => p.species === 'bird').length,
        other: mockPets.filter((p) => !['dog', 'cat', 'bird'].includes(p.species)).length,
      },
      bySize: {
        small: mockPets.filter((p) => p.size === 'small').length,
        medium: mockPets.filter((p) => p.size === 'medium').length,
        large: mockPets.filter((p) => p.size === 'large').length,
      },
      neutered: mockPets.filter((p) => p.neutered).length,
      withMicrochip: mockPets.filter((p) => p.microchip).length,
      withAllergies: mockPets.filter((p) => p.allergies && p.allergies.length > 0).length,
    };

    return {
      success: true,
      data: stats,
    };
  },
};



