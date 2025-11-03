import { Review, ReviewType } from '../../../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

let mockReviews: Review[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'João Silva',
    type: 'service',
    relatedId: 'service-1',
    relatedName: 'Banho e Tosa',
    rating: 5,
    npsScore: 10,
    comment: 'Excelente atendimento! O Rex ficou lindo e cheiroso. Super recomendo!',
    wouldRecommend: true,
    tags: ['atendimento', 'qualidade', 'pontualidade'],
    response: 'Obrigado pelo feedback! Ficamos felizes em atender você e o Rex! 🐾',
    respondedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Ana Costa',
    type: 'service',
    relatedId: 'service-2',
    relatedName: 'Consulta Veterinária',
    rating: 4,
    npsScore: 8,
    comment: 'Veterinário muito atencioso, mas o tempo de espera foi um pouco longo.',
    wouldRecommend: true,
    tags: ['atendimento', 'tempo-espera'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    customerId: '3',
    customerName: 'Carlos Mendes',
    type: 'product',
    relatedId: 'product-1',
    relatedName: 'Ração Golden Premium',
    rating: 5,
    npsScore: 9,
    comment: 'Produto de ótima qualidade. Meu cachorro adorou!',
    wouldRecommend: true,
    tags: ['qualidade', 'custo-benefício'],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const reviewsApi = {
  getAll: async (params?: { customerId?: string; type?: ReviewType; minRating?: number }) => {
    await delay(500);

    let filtered = [...mockReviews];

    if (params?.customerId) {
      filtered = filtered.filter(r => r.customerId === params.customerId);
    }

    if (params?.type) {
      filtered = filtered.filter(r => r.type === params.type);
    }

    if (params?.minRating) {
      filtered = filtered.filter(r => r.rating >= params.minRating);
    }

    return {
      success: true,
      data: filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  },

  create: async (data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>) => {
    await delay(600);

    const newReview: Review = {
      ...data,
      id: `${mockReviews.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockReviews.push(newReview);

    return {
      success: true,
      data: newReview,
    };
  },

  respond: async (id: string, response: string) => {
    await delay(500);

    const index = mockReviews.findIndex(r => r.id === id);
    if (index === -1) {
      return {
        success: false,
        error: 'Avaliação não encontrada',
      };
    }

    mockReviews[index] = {
      ...mockReviews[index],
      response,
      respondedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: mockReviews[index],
    };
  },

  getStatistics: async () => {
    await delay(400);

    const totalReviews = mockReviews.length;
    const avgRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const avgNPS = mockReviews.filter(r => r.npsScore).reduce((sum, r) => sum + (r.npsScore || 0), 0) / 
                   mockReviews.filter(r => r.npsScore).length;

    const npsCategories = {
      promoters: mockReviews.filter(r => r.npsScore && r.npsScore >= 9).length,
      passives: mockReviews.filter(r => r.npsScore && r.npsScore >= 7 && r.npsScore < 9).length,
      detractors: mockReviews.filter(r => r.npsScore && r.npsScore < 7).length,
    };

    const npsScore = ((npsCategories.promoters - npsCategories.detractors) / totalReviews) * 100;

    return {
      success: true,
      data: {
        totalReviews,
        avgRating: Number(avgRating.toFixed(1)),
        avgNPS: Number(avgNPS.toFixed(1)),
        npsScore: Number(npsScore.toFixed(1)),
        npsCategories,
        ratingDistribution: {
          5: mockReviews.filter(r => r.rating === 5).length,
          4: mockReviews.filter(r => r.rating === 4).length,
          3: mockReviews.filter(r => r.rating === 3).length,
          2: mockReviews.filter(r => r.rating === 2).length,
          1: mockReviews.filter(r => r.rating === 1).length,
        },
      },
    };
  },
};

