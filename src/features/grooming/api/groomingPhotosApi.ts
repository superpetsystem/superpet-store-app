import { GroomingPhoto } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// URLs de imagens mockadas (placeholders locais com emojis)
const mockImageUrls = [
  '', // Será renderizado como emoji
  '',
  '',
  '',
];

let mockPhotos: GroomingPhoto[] = [
  {
    id: '1',
    serviceOrderId: '1',
    petId: '1',
    petName: 'Rex',
    type: 'before',
    url: mockImageUrls[0],
    notes: 'Pelo embaraçado, precisa de tosa completa',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    serviceOrderId: '1',
    petId: '1',
    petName: 'Rex',
    type: 'after',
    url: mockImageUrls[1],
    notes: 'Tosa completa realizada com sucesso',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date().toISOString(),
  },
  {
    id: '3',
    serviceOrderId: '2',
    petId: '2',
    petName: 'Luna',
    type: 'before',
    url: mockImageUrls[2],
    notes: 'Banho simples',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    serviceOrderId: '2',
    petId: '2',
    petName: 'Luna',
    type: 'after',
    url: mockImageUrls[3],
    notes: 'Pelagem sedosa e perfumada',
    uploadedBy: 'Maria Santos',
    uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const groomingPhotosApi = {
  getByServiceOrder: async (serviceOrderId: string) => {
    await delay(400);
    
    const photos = mockPhotos.filter(p => p.serviceOrderId === serviceOrderId);
    
    return {
      success: true,
      data: photos,
    };
  },

  getByPet: async (petId: string) => {
    await delay(500);
    
    const photos = mockPhotos
      .filter(p => p.petId === petId)
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
    
    return {
      success: true,
      data: photos,
    };
  },

  upload: async (data: Omit<GroomingPhoto, 'id' | 'uploadedAt'>) => {
    await delay(1000); // Simula upload

    const newPhoto: GroomingPhoto = {
      ...data,
      id: `${mockPhotos.length + 1}`,
      uploadedAt: new Date().toISOString(),
    };

    mockPhotos.push(newPhoto);

    return {
      success: true,
      data: newPhoto,
    };
  },

  delete: async (id: string) => {
    await delay(300);

    const index = mockPhotos.findIndex(p => p.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Foto não encontrada',
      };
    }

    mockPhotos.splice(index, 1);

    return {
      success: true,
      data: { id },
    };
  },

  getGallery: async (petId?: string) => {
    await delay(500);

    let photos = [...mockPhotos];

    if (petId) {
      photos = photos.filter(p => p.petId === petId);
    }

    // Agrupar por ordem de serviço
    const grouped = photos.reduce((acc, photo) => {
      if (!acc[photo.serviceOrderId]) {
        acc[photo.serviceOrderId] = [];
      }
      acc[photo.serviceOrderId].push(photo);
      return acc;
    }, {} as Record<string, GroomingPhoto[]>);

    return {
      success: true,
      data: {
        photos,
        grouped,
      },
    };
  },
};

