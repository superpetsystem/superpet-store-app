import { StockMovementType } from '../../../types';

// Formata tipo de movimentação para exibição
export const formatMovementType = (type: StockMovementType): string => {
  const types: Record<StockMovementType, string> = {
    entry: 'Entrada',
    exit: 'Saída',
    adjustment: 'Ajuste',
    return: 'Devolução',
    loss: 'Perda',
  };

  return types[type] || type;
};

// Cor por tipo de movimentação
export const getMovementTypeColor = (type: StockMovementType): string => {
  const colors: Record<StockMovementType, string> = {
    entry: '#4CAF50', // Verde
    exit: '#2196F3', // Azul
    adjustment: '#FF9800', // Laranja
    return: '#9C27B0', // Roxo
    loss: '#F44336', // Vermelho
  };

  return colors[type] || '#607D8B';
};

// Ícone por tipo (emoji)
export const getMovementTypeIcon = (type: StockMovementType): string => {
  const icons: Record<StockMovementType, string> = {
    entry: '📦',
    exit: '📤',
    adjustment: '⚙️',
    return: '↩️',
    loss: '❌',
  };

  return icons[type] || '📋';
};

// Formata quantidade com sinal
export const formatQuantityWithSign = (quantity: number, type: StockMovementType): string => {
  // Entrada e devolução são positivos
  if (type === 'entry' || type === 'return') {
    return `+${quantity}`;
  }
  
  // Saída e perda são negativos
  if (type === 'exit' || type === 'loss') {
    return `-${quantity}`;
  }
  
  // Ajuste pode ser positivo ou negativo
  if (quantity >= 0) {
    return `+${quantity}`;
  }
  
  return `${quantity}`;
};

// Formata data e hora
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

// Formata apenas a data
export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('pt-BR');
};

// Formata motivo abreviado
export const formatReasonShort = (reason: string, maxLength: number = 50): string => {
  if (reason.length <= maxLength) {
    return reason;
  }
  
  return `${reason.substring(0, maxLength)}...`;
};

// Calcula balanço de movimentações
export const calculateBalance = (movements: Array<{ type: StockMovementType; quantity: number }>): number => {
  return movements.reduce((balance, movement) => {
    if (movement.type === 'entry' || movement.type === 'return') {
      return balance + movement.quantity;
    }
    if (movement.type === 'exit' || movement.type === 'loss') {
      return balance - movement.quantity;
    }
    // Para ajustes, a quantidade já vem com o sinal correto
    return balance + movement.quantity;
  }, 0);
};

// Formata resumo de movimentação
export const formatMovementSummary = (movement: {
  type: StockMovementType;
  quantity: number;
  reason: string;
}): string => {
  const typeLabel = formatMovementType(movement.type);
  const quantityStr = formatQuantityWithSign(movement.quantity, movement.type);
  
  return `${typeLabel}: ${quantityStr} - ${movement.reason}`;
};

// Status de estoque baseado em movimentações
export const getStockStatus = (
  currentStock: number,
  minStock: number
): {
  status: 'ok' | 'low' | 'out';
  label: string;
  color: string;
} => {
  if (currentStock === 0) {
    return {
      status: 'out',
      label: 'Sem estoque',
      color: '#F44336',
    };
  }
  
  if (currentStock <= minStock) {
    return {
      status: 'low',
      label: 'Estoque baixo',
      color: '#FF9800',
    };
  }
  
  return {
    status: 'ok',
    label: 'Estoque OK',
    color: '#4CAF50',
  };
};

