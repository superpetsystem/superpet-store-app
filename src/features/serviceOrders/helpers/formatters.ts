import { ServiceOrderStatus } from '../../../types';

export const formatOrderStatus = (status: ServiceOrderStatus): string => {
  const statuses: Record<ServiceOrderStatus, string> = {
    waiting: 'Aguardando',
    'in-progress': 'Em Andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  };
  return statuses[status] || status;
};

export const getOrderStatusColor = (status: ServiceOrderStatus): string => {
  const colors: Record<ServiceOrderStatus, string> = {
    waiting: '#FF9800',
    'in-progress': '#2196F3',
    completed: '#4CAF50',
    cancelled: '#F44336',
  };
  return colors[status] || '#607D8B';
};

export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatDateTime = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDuration = (checkIn?: string, checkOut?: string): string => {
  if (!checkIn || !checkOut) return '-';
  
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hours}h ${minutes}min`;
};

