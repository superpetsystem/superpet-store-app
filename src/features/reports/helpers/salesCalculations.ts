import { Sale } from '../../../types';

export interface SalesReportData {
  totalRevenue: number;
  totalSales: number;
  averageTicket: number;
  topProducts: { name: string; quantity: number; revenue: number }[];
  salesByPaymentMethod: { method: string; count: number; total: number }[];
  salesByPeriod: { date: string; count: number; revenue: number }[];
  salesByProduct: { productName: string; quantity: number; revenue: number }[];
  dailyAverage: number;
  weeklyTrend: { week: string; sales: number; revenue: number }[];
  conversionRate?: number;
}

export const calculateSalesReport = (
  sales: Sale[],
  startDate: string,
  endDate: string
): SalesReportData => {
  // Filtrar vendas no período
  const filteredSales = sales.filter(
    (sale) => sale.date >= startDate && sale.date <= endDate
  );

  // Receita total
  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.totalAmount, 0);

  // Total de vendas
  const totalSales = filteredSales.length;

  // Ticket médio
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Produtos mais vendidos
  const productSales: Record<string, { quantity: number; revenue: number }> = {};
  filteredSales.forEach((sale) => {
    sale.items.forEach((item) => {
      if (!productSales[item.productName]) {
        productSales[item.productName] = { quantity: 0, revenue: 0 };
      }
      productSales[item.productName].quantity += item.quantity;
      productSales[item.productName].revenue += item.price * item.quantity;
    });
  });

  const topProducts = Object.entries(productSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  // Vendas por forma de pagamento
  const paymentMethodSales: Record<string, { count: number; total: number }> = {};
  filteredSales.forEach((sale) => {
    if (!paymentMethodSales[sale.paymentMethod]) {
      paymentMethodSales[sale.paymentMethod] = { count: 0, total: 0 };
    }
    paymentMethodSales[sale.paymentMethod].count++;
    paymentMethodSales[sale.paymentMethod].total += sale.totalAmount;
  });

  const salesByPaymentMethod = Object.entries(paymentMethodSales).map(
    ([method, data]) => ({
      method,
      ...data,
    })
  );

  // Vendas por período (diário)
  const dailySales: Record<string, { count: number; revenue: number }> = {};
  filteredSales.forEach((sale) => {
    if (!dailySales[sale.date]) {
      dailySales[sale.date] = { count: 0, revenue: 0 };
    }
    dailySales[sale.date].count++;
    dailySales[sale.date].revenue += sale.totalAmount;
  });

  const salesByPeriod = Object.entries(dailySales)
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Vendas por produto
  const salesByProduct = Object.entries(productSales).map(([productName, data]) => ({
    productName,
    ...data,
  }));

  // Média diária
  const daysInPeriod = calculateDaysBetween(startDate, endDate);
  const dailyAverage = daysInPeriod > 0 ? totalRevenue / daysInPeriod : 0;

  // Tendência semanal
  const weeklyTrend = calculateWeeklyTrend(filteredSales, startDate, endDate);

  return {
    totalRevenue,
    totalSales,
    averageTicket,
    topProducts,
    salesByPaymentMethod,
    salesByPeriod,
    salesByProduct,
    dailyAverage,
    weeklyTrend,
  };
};

const calculateDaysBetween = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Inclusive
};

const calculateWeeklyTrend = (
  sales: Sale[],
  startDate: string,
  endDate: string
): { week: string; sales: number; revenue: number }[] => {
  const weeklySales: Record<string, { sales: number; revenue: number }> = {};

  sales.forEach((sale) => {
    const weekNumber = getWeekNumber(new Date(sale.date));
    const weekKey = `Semana ${weekNumber}`;

    if (!weeklySales[weekKey]) {
      weeklySales[weekKey] = { sales: 0, revenue: 0 };
    }

    weeklySales[weekKey].sales++;
    weeklySales[weekKey].revenue += sale.totalAmount;
  });

  return Object.entries(weeklySales).map(([week, data]) => ({
    week,
    ...data,
  }));
};

const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Formatar moeda
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Formatar porcentagem
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Calcular crescimento percentual
export const calculateGrowth = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

// Agrupar vendas por categoria
export const groupByCategory = (sales: Sale[]) => {
  const categoryRevenue: Record<string, number> = {};

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      // Assumindo que productName contém informação de categoria
      // Em produção, você teria item.category
      const category = item.productName.includes('Ração') ? 'Alimentos' :
                      item.productName.includes('Brinquedo') ? 'Brinquedos' :
                      item.productName.includes('Coleira') ? 'Acessórios' : 'Outros';

      if (!categoryRevenue[category]) {
        categoryRevenue[category] = 0;
      }
      categoryRevenue[category] += item.price * item.quantity;
    });
  });

  return Object.entries(categoryRevenue).map(([category, revenue]) => ({
    category,
    revenue,
  }));
};

// Exportar dados para CSV
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => `"${row[header]}"`).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

