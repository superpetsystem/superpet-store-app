import { VaccineStatus } from '../../../types';

export const formatVaccineStatus = (status: VaccineStatus): string => {
  const statusLabels: Record<VaccineStatus, string> = {
    applied: 'Aplicada',
    pending: 'Pendente',
    overdue: 'Vencida',
  };

  return statusLabels[status] || status;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

export const calculateDaysUntilDue = (nextDoseDate: string): number => {
  const today = new Date();
  const dueDate = new Date(nextDoseDate + 'T00:00:00');
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isOverdue = (nextDoseDate: string): boolean => {
  return calculateDaysUntilDue(nextDoseDate) < 0;
};

export const isUpcoming = (nextDoseDate: string, days: number = 30): boolean => {
  const daysUntil = calculateDaysUntilDue(nextDoseDate);
  return daysUntil >= 0 && daysUntil <= days;
};

