import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from '@mui/material';
import {
  Subscriptions as SubscriptionsIcon,
  TrendingUp,
  AttachMoney,
  CalendarMonth,
  People,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { subscriptionsApi } from '../api/subscriptionsApi';
import { Subscription } from '../../../types';

const SubscriptionsManagementPage = () => {
  const { isDark } = useThemeMode();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [subsRes, statsRes] = await Promise.all([
      subscriptionsApi.getAll(),
      subscriptionsApi.getStatistics(),
    ]);

    if (subsRes.success && subsRes.data) setSubscriptions(subsRes.data);
    if (statsRes.success && statsRes.data) setStats(statsRes.data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'paused': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'paused': return 'Pausada';
      case 'cancelled': return 'Cancelada';
      default: return 'Expirada';
    }
  };

  const getIntervalLabel = (interval: string) => {
    switch (interval) {
      case 'weekly': return 'Semanal';
      case 'biweekly': return 'Quinzenal';
      case 'monthly': return 'Mensal';
      default: return 'Bimestral';
    }
  };

  if (loading) return <Typography>Carregando...</Typography>;

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        📦 Gestão de Assinaturas
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Acompanhe as assinaturas recorrentes dos clientes
      </Typography>

      {/* Stats */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[
            { label: 'Total de Assinaturas', value: stats.totalSubscriptions, icon: <SubscriptionsIcon />, color: '#2196F3' },
            { label: 'Assinaturas Ativas', value: stats.activeSubscriptions, icon: <People />, color: '#4CAF50' },
            { label: 'MRR (Receita Mensal)', value: `R$ ${stats.monthlyRecurringRevenue.toFixed(2)}`, icon: <AttachMoney />, color: '#E47B24' },
            { label: 'Ticket Médio', value: `R$ ${stats.avgSubscriptionValue.toFixed(2)}`, icon: <TrendingUp />, color: '#9C27B0' },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? `1px solid ${stat.color}` : 'none', borderLeft: `4px solid ${stat.color}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>{stat.icon}</Avatar>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Subscriptions Table */}
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Todas as Assinaturas
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Cliente</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Produto</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Qtd</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Frequência</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Próx. Entrega</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Valor</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {subscriptions.map(sub => (
                  <TableRow key={sub.id} hover>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{sub.customerName}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{sub.productName}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{sub.quantity}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{getIntervalLabel(sub.interval)}</TableCell>
                    <TableCell sx={{ color: '#E47B24', fontWeight: 600 }}>
                      {new Date(sub.nextDelivery).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>R$ {sub.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={getStatusLabel(sub.status)}
                        size="small"
                        sx={{
                          bgcolor: getStatusColor(sub.status),
                          color: '#FFF',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubscriptionsManagementPage;

