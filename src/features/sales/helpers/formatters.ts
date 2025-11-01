import { PaymentMethod, SaleStatus } from '../../../types';

export const formatPaymentMethod = (method: PaymentMethod): string => {
  const methods: Record<PaymentMethod, string> = {
    cash: 'Dinheiro',
    debit: 'Débito',
    credit: 'Crédito',
    pix: 'PIX',
    check: 'Cheque',
    multiple: 'Múltiplos',
  };
  return methods[method] || method;
};

export const formatSaleStatus = (status: SaleStatus): string => {
  const statuses: Record<SaleStatus, string> = {
    pending: 'Pendente',
    completed: 'Concluída',
    cancelled: 'Cancelada',
    refunded: 'Reembolsada',
  };
  return statuses[status] || status;
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

export const calculateTotal = (items: Array<{ quantity: number; unitPrice: number; discount: number }>): number => {
  return items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice - item.discount;
    return sum + itemTotal;
  }, 0);
};

