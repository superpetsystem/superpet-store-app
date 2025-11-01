import { Product, ProductCategory } from '../../../types';

export interface ProductValidationErrors {
  name?: string;
  sku?: string;
  barcode?: string;
  price?: string;
  costPrice?: string;
  stock?: string;
  minStock?: string;
  category?: string;
  unit?: string;
  expirationDate?: string;
}

// Valida nome do produto
export const validateProductName = (name: string): string | null => {
  if (!name || name.trim().length === 0) {
    return 'Nome é obrigatório';
  }
  if (name.length < 3) {
    return 'Nome deve ter no mínimo 3 caracteres';
  }
  if (name.length > 100) {
    return 'Nome deve ter no máximo 100 caracteres';
  }
  return null;
};

// Valida SKU
export const validateSKU = (sku: string): string | null => {
  if (!sku || sku.trim().length === 0) {
    return 'SKU é obrigatório';
  }
  if (sku.length < 3) {
    return 'SKU deve ter no mínimo 3 caracteres';
  }
  if (sku.length > 50) {
    return 'SKU deve ter no máximo 50 caracteres';
  }
  // Aceita letras, números e hífens
  const skuRegex = /^[A-Z0-9-]+$/;
  if (!skuRegex.test(sku)) {
    return 'SKU deve conter apenas letras maiúsculas, números e hífens';
  }
  return null;
};

// Valida código de barras (EAN-13 ou similar)
export const validateBarcode = (barcode?: string): string | null => {
  if (!barcode || barcode.trim().length === 0) {
    return null; // Barcode é opcional
  }
  // Remove espaços
  const cleanBarcode = barcode.replace(/\s/g, '');
  // Valida se tem apenas números
  if (!/^\d+$/.test(cleanBarcode)) {
    return 'Código de barras deve conter apenas números';
  }
  // Valida comprimento (EAN-8, EAN-13, UPC-12, etc.)
  if (![8, 12, 13, 14].includes(cleanBarcode.length)) {
    return 'Código de barras inválido (aceita 8, 12, 13 ou 14 dígitos)';
  }
  return null;
};

// Valida preço
export const validatePrice = (price: number | string): string | null => {
  const priceNum = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(priceNum)) {
    return 'Preço inválido';
  }
  if (priceNum <= 0) {
    return 'Preço deve ser maior que zero';
  }
  if (priceNum > 999999.99) {
    return 'Preço muito alto';
  }
  return null;
};

// Valida custo
export const validateCostPrice = (costPrice: number | string | undefined, price?: number): string | null => {
  if (!costPrice) {
    return null; // Custo é opcional
  }
  
  const costNum = typeof costPrice === 'string' ? parseFloat(costPrice) : costPrice;
  
  if (isNaN(costNum)) {
    return 'Custo inválido';
  }
  if (costNum < 0) {
    return 'Custo não pode ser negativo';
  }
  if (costNum > 999999.99) {
    return 'Custo muito alto';
  }
  // Aviso se custo for maior que preço de venda
  if (price && costNum > price) {
    return 'Aviso: Custo maior que preço de venda';
  }
  return null;
};

// Valida quantidade em estoque
export const validateStock = (stock: number | string): string | null => {
  const stockNum = typeof stock === 'string' ? parseInt(stock, 10) : stock;
  
  if (isNaN(stockNum)) {
    return 'Quantidade inválida';
  }
  if (stockNum < 0) {
    return 'Estoque não pode ser negativo';
  }
  if (stockNum > 999999) {
    return 'Quantidade muito alta';
  }
  return null;
};

// Valida estoque mínimo
export const validateMinStock = (minStock: number | string): string | null => {
  const minStockNum = typeof minStock === 'string' ? parseInt(minStock, 10) : minStock;
  
  if (isNaN(minStockNum)) {
    return 'Estoque mínimo inválido';
  }
  if (minStockNum < 0) {
    return 'Estoque mínimo não pode ser negativo';
  }
  if (minStockNum > 999999) {
    return 'Quantidade muito alta';
  }
  return null;
};

// Valida data de validade
export const validateExpirationDate = (date?: string): string | null => {
  if (!date || date.trim().length === 0) {
    return null; // Data é opcional
  }
  
  const expirationDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(expirationDate.getTime())) {
    return 'Data inválida';
  }
  
  // Avisa se já está vencido
  if (expirationDate < today) {
    return 'Aviso: Produto com validade vencida';
  }
  
  // Avisa se vence em menos de 30 dias
  const daysUntilExpiration = Math.floor((expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (daysUntilExpiration <= 30 && daysUntilExpiration >= 0) {
    return `Aviso: Vence em ${daysUntilExpiration} dias`;
  }
  
  return null;
};

// Valida categoria
export const validateCategory = (category: ProductCategory | string): string | null => {
  const validCategories: ProductCategory[] = ['food', 'toy', 'accessory', 'medicine', 'hygiene', 'other'];
  
  if (!validCategories.includes(category as ProductCategory)) {
    return 'Categoria inválida';
  }
  
  return null;
};

// Valida unidade
export const validateUnit = (unit: string): string | null => {
  if (!unit || unit.trim().length === 0) {
    return 'Unidade é obrigatória';
  }
  
  const validUnits = ['un', 'kg', 'g', 'l', 'ml', 'cx', 'pct'];
  if (!validUnits.includes(unit.toLowerCase())) {
    return 'Unidade inválida (use: un, kg, g, l, ml, cx, pct)';
  }
  
  return null;
};

// Valida formulário completo
export const validateProductForm = (data: Partial<Product>): ProductValidationErrors => {
  const errors: ProductValidationErrors = {};

  const nameError = validateProductName(data.name || '');
  if (nameError) errors.name = nameError;

  const skuError = validateSKU(data.sku || '');
  if (skuError) errors.sku = skuError;

  const barcodeError = validateBarcode(data.barcode);
  if (barcodeError) errors.barcode = barcodeError;

  const priceError = validatePrice(data.price ?? '');
  if (priceError) errors.price = priceError;

  const costError = validateCostPrice(data.costPrice, data.price);
  if (costError) errors.costPrice = costError;

  const stockError = validateStock(data.stock ?? 0);
  if (stockError) errors.stock = stockError;

  const minStockError = validateMinStock(data.minStock ?? 0);
  if (minStockError) errors.minStock = minStockError;

  const categoryError = validateCategory(data.category || '');
  if (categoryError) errors.category = categoryError;

  const unitError = validateUnit(data.unit || '');
  if (unitError) errors.unit = unitError;

  const expirationError = validateExpirationDate(data.expirationDate);
  if (expirationError && expirationError.startsWith('Aviso:')) {
    // Avisos não são erros bloqueantes
  } else if (expirationError) {
    errors.expirationDate = expirationError;
  }

  return errors;
};

// Verifica se há erros críticos
export const hasErrors = (errors: ProductValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};

