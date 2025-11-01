import { ProductCategory } from '../../../types';

// Formata categoria para exibição
export const formatCategory = (category: ProductCategory): string => {
  const categories: Record<ProductCategory, string> = {
    food: 'Alimentação',
    toy: 'Brinquedos',
    accessory: 'Acessórios',
    medicine: 'Medicamentos',
    hygiene: 'Higiene',
    other: 'Outros',
  };

  return categories[category] || category;
};

// Formata preço em BRL
export const formatPrice = (price: number): string => {
  return price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

// Formata preço simples (sem símbolo)
export const formatPriceSimple = (price: number): string => {
  return price.toFixed(2).replace('.', ',');
};

// Formata SKU (maiúsculas e sem espaços)
export const formatSKU = (sku: string): string => {
  return sku.toUpperCase().replace(/\s/g, '');
};

// Formata código de barras (remove espaços e caracteres especiais)
export const formatBarcode = (barcode: string): string => {
  return barcode.replace(/\D/g, '');
};

// Remove formatação de código de barras
export const unformatBarcode = (barcode: string): string => {
  return barcode.replace(/\D/g, '');
};

// Formata quantidade com unidade
export const formatQuantity = (quantity: number, unit: string): string => {
  return `${quantity} ${unit}`;
};

// Formata unidade por extenso
export const formatUnit = (unit: string): string => {
  const units: Record<string, string> = {
    un: 'unidade(s)',
    kg: 'quilograma(s)',
    g: 'grama(s)',
    l: 'litro(s)',
    ml: 'mililitro(s)',
    cx: 'caixa(s)',
    pct: 'pacote(s)',
  };

  return units[unit.toLowerCase()] || unit;
};

// Formata margem de lucro
export const formatMargin = (price: number, costPrice?: number): string => {
  if (!costPrice || costPrice === 0) return '-';
  
  const margin = ((price - costPrice) / costPrice) * 100;
  return `${margin.toFixed(1)}%`;
};

// Calcula e formata margem percentual
export const calculateMarginPercentage = (price: number, costPrice?: number): number => {
  if (!costPrice || costPrice === 0) return 0;
  
  return ((price - costPrice) / costPrice) * 100;
};

// Formata status de estoque
export const formatStockStatus = (stock: number, minStock: number): {
  status: 'ok' | 'low' | 'out';
  label: string;
  color: string;
} => {
  if (stock === 0) {
    return {
      status: 'out',
      label: 'Sem estoque',
      color: 'error',
    };
  }
  
  if (stock <= minStock) {
    return {
      status: 'low',
      label: 'Estoque baixo',
      color: 'warning',
    };
  }
  
  return {
    status: 'ok',
    label: 'Em estoque',
    color: 'success',
  };
};

// Formata data de validade com alerta
export const formatExpirationDate = (date?: string): {
  formatted: string;
  status: 'ok' | 'warning' | 'expired';
  label: string;
  color: string;
} => {
  if (!date) {
    return {
      formatted: '-',
      status: 'ok',
      label: 'Sem validade',
      color: 'default',
    };
  }

  const expirationDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysUntilExpiration = Math.floor(
    (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const formatted = expirationDate.toLocaleDateString('pt-BR');

  if (expirationDate < today) {
    return {
      formatted,
      status: 'expired',
      label: 'Vencido',
      color: 'error',
    };
  }

  if (daysUntilExpiration <= 30) {
    return {
      formatted,
      status: 'warning',
      label: `Vence em ${daysUntilExpiration} dias`,
      color: 'warning',
    };
  }

  return {
    formatted,
    status: 'ok',
    label: 'Dentro da validade',
    color: 'success',
  };
};

// Formata valor total em estoque
export const formatStockValue = (price: number, stock: number): string => {
  const total = price * stock;
  return formatPrice(total);
};

// Cor por categoria
export const getCategoryColor = (category: ProductCategory): string => {
  const colors: Record<ProductCategory, string> = {
    food: '#4CAF50',
    toy: '#FF9800',
    accessory: '#2196F3',
    medicine: '#F44336',
    hygiene: '#9C27B0',
    other: '#607D8B',
  };

  return colors[category] || '#607D8B';
};

// Ícone por categoria (emoji)
export const getCategoryIcon = (category: ProductCategory): string => {
  const icons: Record<ProductCategory, string> = {
    food: '🍖',
    toy: '🎾',
    accessory: '🦴',
    medicine: '💊',
    hygiene: '🧴',
    other: '📦',
  };

  return icons[category] || '📦';
};

// Formata dados do produto para exibição resumida
export const formatProductSummary = (product: {
  name: string;
  price: number;
  stock: number;
  category: ProductCategory;
}): string => {
  return `${product.name} - ${formatPrice(product.price)} - ${product.stock} em estoque`;
};

