import { StockMovement, StockMovementType } from '../../../types';

export interface StockMovementValidationErrors {
  productId?: string;
  type?: string;
  quantity?: string;
  reason?: string;
}

// Valida produto
export const validateProductId = (productId: string): string | null => {
  if (!productId || productId.trim().length === 0) {
    return 'Produto é obrigatório';
  }
  return null;
};

// Valida tipo de movimentação
export const validateMovementType = (type: StockMovementType | string): string | null => {
  const validTypes: StockMovementType[] = ['entry', 'exit', 'adjustment', 'return', 'loss'];
  
  if (!validTypes.includes(type as StockMovementType)) {
    return 'Tipo de movimentação inválido';
  }
  
  return null;
};

// Valida quantidade
export const validateQuantity = (quantity: number | string, type?: StockMovementType): string | null => {
  const quantityNum = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
  
  if (isNaN(quantityNum)) {
    return 'Quantidade inválida';
  }
  
  if (quantityNum === 0) {
    return 'Quantidade deve ser diferente de zero';
  }
  
  // Para entrada, devolução sempre positivo
  if ((type === 'entry' || type === 'return') && quantityNum < 0) {
    return 'Quantidade deve ser positiva';
  }
  
  // Para saída e perda sempre positivo (será convertido para negativo depois)
  if ((type === 'exit' || type === 'loss') && quantityNum < 0) {
    return 'Quantidade deve ser positiva';
  }
  
  if (quantityNum > 999999) {
    return 'Quantidade muito alta';
  }
  
  return null;
};

// Valida motivo
export const validateReason = (reason: string): string | null => {
  if (!reason || reason.trim().length === 0) {
    return 'Motivo é obrigatório';
  }
  
  if (reason.length < 3) {
    return 'Motivo deve ter no mínimo 3 caracteres';
  }
  
  if (reason.length > 200) {
    return 'Motivo deve ter no máximo 200 caracteres';
  }
  
  return null;
};

// Valida observações
export const validateNotes = (notes?: string): string | null => {
  if (!notes) {
    return null; // Observações são opcionais
  }
  
  if (notes.length > 500) {
    return 'Observações devem ter no máximo 500 caracteres';
  }
  
  return null;
};

// Valida formulário completo
export const validateMovementForm = (data: Partial<StockMovement>): StockMovementValidationErrors => {
  const errors: StockMovementValidationErrors = {};

  const productError = validateProductId(data.productId || '');
  if (productError) errors.productId = productError;

  const typeError = validateMovementType(data.type || '');
  if (typeError) errors.type = typeError;

  const quantityError = validateQuantity(data.quantity ?? 0, data.type);
  if (quantityError) errors.quantity = quantityError;

  const reasonError = validateReason(data.reason || '');
  if (reasonError) errors.reason = reasonError;

  return errors;
};

// Verifica se há erros
export const hasErrors = (errors: StockMovementValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

