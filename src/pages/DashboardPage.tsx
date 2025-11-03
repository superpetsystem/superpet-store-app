import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Avatar,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingCart,
  AttachMoney,
  Pets,
  CalendarMonth,
  Star,
} from '@mui/icons-material';
import { useThemeMode } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import { useAppSelector } from '../store/hooks';
import { calculateDashboardKPIs, formatCurrency, formatGrowth } from '../features/dashboard/helpers/kpiCalculations';

const DashboardPage = () => {
  const { isDark } = useThemeMode();
  
  // Dados do Redux
  const { sales } = useAppSelector(state => state.sales);
  const { appointments } = useAppSelector(state => state.appointments);
  const { customers } = useAppSelector(state => state.customers);
  const { pets } = useAppSelector(state => state.pets);
  const { orders } = useAppSelector(state => state.serviceOrders);

  const [kpis, setKpis] = useState<any>(null);

  useEffect(() => {
    const calculated = calculateDashboardKPIs(sales, appointments, customers, pets, orders);
    setKpis(calculated);
  }, [sales, appointments, customers, pets, orders]);

  if (!kpis) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
          Carregando KPIs...
        </Typography>
      </Box>
    );
  }

  const mainStats = [
    {
      title: 'Receita Total (30 dias)',
      value: formatCurrency(kpis.totalRevenue),
      change: formatGrowth(kpis.revenueGrowth),
      icon: <AttachMoney />,
      color: '#0E6A6B',
      positive: kpis.revenueGrowth >= 0,
    },
    {
      title: 'Total de Vendas',
      value: kpis.totalSales,
      change: formatGrowth(kpis.salesGrowth),
      icon: <ShoppingCart />,
      color: '#4CAF50',
      positive: kpis.salesGrowth >= 0,
    },
    {
      title: 'Ticket Médio',
      value: formatCurrency(kpis.averageTicket),
      change: formatGrowth(kpis.ticketGrowth),
      icon: <TrendingUp />,
      color: '#2196F3',
      positive: kpis.ticketGrowth >= 0,
    },
    {
      title: 'Agendamentos Hoje',
      value: kpis.todayAppointments,
      change: `${kpis.weekAppointments} esta semana`,
      icon: <CalendarMonth />,
      color: '#FF9800',
      positive: true,
    },
  ];

  const secondaryStats = [
    {
      title: 'Total de Clientes',
      value: kpis.totalCustomers,
      subtitle: `${kpis.activeCustomers} ativos`,
      icon: <People />,
      color: '#9C27B0',
    },
    {
      title: 'Total de Pets',
      value: kpis.totalPets,
      subtitle: `${kpis.newCustomers} novos clientes`,
      icon: <Pets />,
      color: '#E47B24',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 1,
          color: isDark ? '#12888A' : '#0E6A6B',
          ...typography.h4,
        }}
      >
        📊 Dashboard - Visão Geral
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: isDark ? '#E6E1D6' : '#666',
          mb: 4,
          ...typography.body1,
        }}
      >
        Acompanhe os principais indicadores da sua loja
      </Typography>

      {/* Main KPIs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {mainStats.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                border: isDark ? `1px solid ${stat.color}` : 'none',
                borderLeft: `4px solid ${stat.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                  <Chip
                    icon={stat.positive ? <TrendingUp /> : <TrendingDown />}
                    label={stat.change}
                    size="small"
                    sx={{
                      bgcolor: stat.positive ? '#4CAF50' : '#F44336',
                      color: '#FFF',
                      fontWeight: 600,
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  fontWeight="bold"
                  sx={{
                    mb: 0.5,
                    color: isDark ? '#F8F5EE' : stat.color,
                  }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {secondaryStats.map((stat, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Box>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: isDark ? '#12888A' : '#999' }}>
                  {stat.subtitle}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Top 5 Lists */}
      <Grid container spacing={3}>
        {/* Top Produtos */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                🏆 Top 5 Produtos
              </Typography>
              <List sx={{ p: 0 }}>
                {kpis.topProducts.map((product: any, index: number) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                              {index + 1}. {product.name}
                            </Typography>
                            <Chip 
                              label={formatCurrency(product.revenue)} 
                              size="small" 
                              sx={{ bgcolor: '#4CAF50', color: '#FFF', fontWeight: 600 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                            {product.quantity} unidades vendidas
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < kpis.topProducts.length - 1 && <Divider sx={{ borderColor: isDark ? '#12888A' : '#E0E0E0' }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Serviços */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                ✂️ Top 5 Serviços
              </Typography>
              <List sx={{ p: 0 }}>
                {kpis.topServices.map((service: any, index: number) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                              {index + 1}. {service.name}
                            </Typography>
                            <Chip 
                              label={`${service.count}x`} 
                              size="small" 
                              sx={{ bgcolor: '#2196F3', color: '#FFF', fontWeight: 600 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                            {formatCurrency(service.revenue)}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < kpis.topServices.length - 1 && <Divider sx={{ borderColor: isDark ? '#12888A' : '#E0E0E0' }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Clientes */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                👑 Top 5 Clientes
              </Typography>
              <List sx={{ p: 0 }}>
                {kpis.topCustomers.map((customer: any, index: number) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                              {index + 1}. {customer.name}
                            </Typography>
                            <Chip 
                              label={formatCurrency(customer.totalSpent)} 
                              size="small" 
                              sx={{ bgcolor: '#9C27B0', color: '#FFF', fontWeight: 600 }}
                            />
                          </Box>
                        }
                        secondary={
                          <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                            {customer.visits} visitas
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < kpis.topCustomers.length - 1 && <Divider sx={{ borderColor: isDark ? '#12888A' : '#E0E0E0' }} />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
