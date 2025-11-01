import { Sale, SaleItem } from '../../../types';

export interface SaleValidationErrors {
  items?: string;
  paymentMethod?: string;
  total?: string;
}

export const validateItems = (items: SaleItem[]): string | null => {
  if (!items || items.length === 0) {
    return 'Adicione pelo menos um produto';
  }
  
  for (const item of items) {
    if (!item.productName || item.quantity <= 0 || item.unitPrice <= 0) {
      return 'Todos os itens devem ter produto, quantidade e preço válidos';
    }
  }
  
  return null;
};

export const validatePaymentMethod = (paymentMethod: string): string | null => {
  const validMethods = ['cash', 'debit', 'credit', 'pix', 'check', 'multiple'];
  
  if (!validMethods.includes(paymentMethod)) {
    return 'Forma de pagamento inválida';
  }
  
  return null;
};

export const validateTotal = (total: number): string | null => {
  if (total <= 0) {
    return 'Total deve ser maior que zero';
  }
  return null;
};

export const validateSaleForm = (data: Partial<Sale>): SaleValidationErrors => {
  const errors: SaleValidationErrors = {};

  const itemsError = validateItems(data.items || []);
  if (itemsError) errors.items = itemsError;

  const paymentError = validatePaymentMethod(data.paymentMethod || '');
  if (paymentError) errors.paymentMethod = paymentError;

  const totalError = validateTotal(data.total || 0);
  if (totalError) errors.total = totalError;

  return errors;
};

