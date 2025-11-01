import { AppointmentStatus } from '../../../types';

export const formatAppointmentStatus = (status: AppointmentStatus): string => {
  const statusLabels: Record<AppointmentStatus, string> = {
    scheduled: 'Agendado',
    confirmed: 'Confirmado',
    'in-progress': 'Em Andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    'no-show': 'Não Compareceu',
  };

  return statusLabels[status] || status;
};

export const formatTime = (time: string): string => {
  return time;
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0 && mins > 0) {
    return `${hours}h ${mins}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${mins}min`;
  }
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateTime = (dateStr: string, timeStr: string): string => {
  return `${formatDate(dateStr)} às ${timeStr}`;
};

