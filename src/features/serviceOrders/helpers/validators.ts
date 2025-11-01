import { ServiceOrder, ServiceItem, ServiceOrderStatus } from '../../../types';

export interface ServiceOrderValidationErrors {
  customerId?: string;
  petId?: string;
  items?: string;
  totalAmount?: string;
}

export const validateCustomerId = (customerId: string): string | null => {
  if (!customerId || customerId.trim().length === 0) {
    return 'Cliente é obrigatório';
  }
  return null;
};

export const validatePetId = (petId: string): string | null => {
  if (!petId || petId.trim().length === 0) {
    return 'Pet é obrigatório';
  }
  return null;
};

export const validateItems = (items: ServiceItem[]): string | null => {
  if (!items || items.length === 0) {
    return 'Adicione pelo menos um serviço';
  }
  
  for (const item of items) {
    if (!item.serviceName || item.price <= 0 || item.quantity <= 0) {
      return 'Todos os serviços devem ter nome, preço e quantidade válidos';
    }
  }
  
  return null;
};

export const validateTotalAmount = (totalAmount: number): string | null => {
  if (totalAmount <= 0) {
    return 'Valor total deve ser maior que zero';
  }
  return null;
};

export const validateServiceOrderForm = (data: Partial<ServiceOrder>): ServiceOrderValidationErrors => {
  const errors: ServiceOrderValidationErrors = {};

  const customerError = validateCustomerId(data.customerId || '');
  if (customerError) errors.customerId = customerError;

  const petError = validatePetId(data.petId || '');
  if (petError) errors.petId = petError;

  const itemsError = validateItems(data.items || []);
  if (itemsError) errors.items = itemsError;

  const totalError = validateTotalAmount(data.totalAmount || 0);
  if (totalError) errors.totalAmount = totalError;

  return errors;
};

export const hasErrors = (errors: ServiceOrderValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

