import { Sale, Appointment, Customer, Pet, ServiceOrder } from '../../../types';

export interface DashboardKPIs {
  // Vendas
  totalRevenue: number;
  revenueGrowth: number;
  totalSales: number;
  salesGrowth: number;
  averageTicket: number;
  ticketGrowth: number;

  // Agendamentos
  todayAppointments: number;
  weekAppointments: number;
  appointmentsGrowth: number;

  // Clientes
  totalCustomers: number;
  activeCustomers: number;
  newCustomers: number;
  customersGrowth: number;

  // Pets
  totalPets: number;
  petsGrowth: number;

  // Serviços
  servicesCompleted: number;
  servicesInProgress: number;
  servicesRevenue: number;

  // Top performers
  topProducts: { name: string; quantity: number; revenue: number }[];
  topServices: { name: string; count: number; revenue: number }[];
  topCustomers: { name: string; totalSpent: number; visits: number }[];
}

export const calculateDashboardKPIs = (
  sales: Sale[],
  appointments: Appointment[],
  customers: Customer[],
  pets: Pet[],
  serviceOrders: ServiceOrder[]
): DashboardKPIs => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  // Período atual (últimos 30 dias)
  const currentPeriodStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Período anterior (30 dias antes)
  const previousPeriodStart = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const previousPeriodEnd = currentPeriodStart;

  // Vendas atuais e anteriores
  const currentSales = sales.filter(s => s.date >= currentPeriodStart && s.date <= todayStr);
  const previousSales = sales.filter(s => s.date >= previousPeriodStart && s.date < previousPeriodEnd);

  // Receita
  const totalRevenue = currentSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const previousRevenue = previousSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const revenueGrowth = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0;

  // Vendas
  const totalSales = currentSales.length;
  const previousSalesCount = previousSales.length;
  const salesGrowth = previousSalesCount > 0 ? ((totalSales - previousSalesCount) / previousSalesCount) * 100 : 0;

  // Ticket médio
  const averageTicket = totalSales > 0 ? totalRevenue / totalSales : 0;
  const previousTicket = previousSalesCount > 0 ? previousRevenue / previousSalesCount : 0;
  const ticketGrowth = previousTicket > 0 ? ((averageTicket - previousTicket) / previousTicket) * 100 : 0;

  // Agendamentos
  const todayAppointments = appointments.filter(a => a.date === todayStr).length;
  const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const weekAppointments = appointments.filter(a => a.date >= weekStart && a.date <= todayStr).length;
  const previousWeekAppointments = appointments.filter(a => {
    const prevWeekStart = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const prevWeekEnd = weekStart;
    return a.date >= prevWeekStart && a.date < prevWeekEnd;
  }).length;
  const appointmentsGrowth = previousWeekAppointments > 0 
    ? ((weekAppointments - previousWeekAppointments) / previousWeekAppointments) * 100 
    : 0;

  // Clientes
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => {
    // Clientes com compra ou serviço nos últimos 30 dias
    return sales.some(s => s.customerId === c.id && s.date >= currentPeriodStart);
  }).length;
  const newCustomers = customers.filter(c => c.createdAt >= currentPeriodStart).length;
  const previousNewCustomers = customers.filter(c => 
    c.createdAt >= previousPeriodStart && c.createdAt < previousPeriodEnd
  ).length;
  const customersGrowth = previousNewCustomers > 0 
    ? ((newCustomers - previousNewCustomers) / previousNewCustomers) * 100 
    : 0;

  // Pets
  const totalPets = pets.length;
  const newPets = pets.filter(p => p.createdAt >= currentPeriodStart).length;
  const previousNewPets = pets.filter(p => p.createdAt >= previousPeriodStart && p.createdAt < previousPeriodEnd).length;
  const petsGrowth = previousNewPets > 0 ? ((newPets - previousNewPets) / previousNewPets) * 100 : 0;

  // Serviços
  const servicesCompleted = serviceOrders.filter(so => so.status === 'completed').length;
  const servicesInProgress = serviceOrders.filter(so => so.status === 'in-progress').length;
  const servicesRevenue = serviceOrders
    .filter(so => so.status === 'completed')
    .reduce((sum, so) => sum + so.totalAmount, 0);

  // Top produtos
  const productSales: Record<string, { quantity: number; revenue: number }> = {};
  currentSales.forEach(sale => {
    sale.items.forEach(item => {
      if (!productSales[item.productName]) {
        productSales[item.productName] = { quantity: 0, revenue: 0 };
      }
      productSales[item.productName].quantity += item.quantity;
      productSales[item.productName].revenue += item.total;
    });
  });

  const topProducts = Object.entries(productSales)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Top serviços
  const serviceCounts: Record<string, { count: number; revenue: number }> = {};
  serviceOrders.forEach(so => {
    const name = so.items[0]?.serviceName || 'Serviço';
    if (!serviceCounts[name]) {
      serviceCounts[name] = { count: 0, revenue: 0 };
    }
    serviceCounts[name].count++;
    serviceCounts[name].revenue += so.totalAmount;
  });

  const topServices = Object.entries(serviceCounts)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Top clientes
  const customerSpending: Record<string, { totalSpent: number; visits: number; name: string }> = {};
  currentSales.forEach(sale => {
    if (sale.customerId) {
      const customer = customers.find(c => c.id === sale.customerId);
      if (customer) {
        if (!customerSpending[sale.customerId]) {
          customerSpending[sale.customerId] = { totalSpent: 0, visits: 0, name: customer.name };
        }
        customerSpending[sale.customerId].totalSpent += sale.totalAmount;
        customerSpending[sale.customerId].visits++;
      }
    }
  });

  const topCustomers = Object.values(customerSpending)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  return {
    totalRevenue,
    revenueGrowth,
    totalSales,
    salesGrowth,
    averageTicket,
    ticketGrowth,
    todayAppointments,
    weekAppointments,
    appointmentsGrowth,
    totalCustomers,
    activeCustomers,
    newCustomers,
    customersGrowth,
    totalPets,
    petsGrowth,
    servicesCompleted,
    servicesInProgress,
    servicesRevenue,
    topProducts,
    topServices,
    topCustomers,
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatGrowth = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

