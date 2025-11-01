import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { useServiceOrders } from '../hooks/useServiceOrders';
import { useCustomers } from '../../customers/hooks/useCustomers';
import { usePets } from '../../pets/hooks/usePets';
import {
  formatOrderStatus,
  getOrderStatusColor,
  formatPrice,
  formatDateTime,
} from '../helpers/formatters';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';

const ServiceOrdersPage = () => {
  const { isDark } = useThemeMode();
  const { orders, loading, error, fetchServiceOrders, deleteServiceOrder, checkIn, checkOut, fetchStats, clearError } = useServiceOrders();
  const { customers, fetchCustomers } = useCustomers();
  const { pets, fetchPets } = usePets();

  const [stats, setStats] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchServiceOrders({ page: 1, limit: 1000 });
    await fetchCustomers({ page: 1, limit: 1000 });
    await fetchPets({ page: 1, limit: 1000 });
    const statsData = await fetchStats();
    setStats(statsData);
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.name : 'Cliente não encontrado';
  };

  const getPetName = (petId: string) => {
    const pet = pets.find((p) => p.id === petId);
    return pet ? pet.name : 'Pet não encontrado';
  };

  const handleCheckIn = async (orderId: string) => {
    await checkIn(orderId);
    loadData();
  };

  const handleCheckOut = async (orderId: string) => {
    await checkOut(orderId, 'Serviço concluído com sucesso');
    loadData();
  };

  const handleDeleteClick = (order: any) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (orderToDelete) {
      await deleteServiceOrder(orderToDelete.id);
      setDeleteDialogOpen(false);
      setOrderToDelete(null);
      loadData();
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, fontSize: typography.pageTitle }}>
            Ordens de Serviço
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', fontSize: typography.pageSubtitle }}>
            Gerencie ordens de banho, tosa e outros serviços
          </Typography>
        </Box>
      </Box>

      {stats && (
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: '#FFF3E0', borderLeft: '4px solid #FF9800' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#FF9800' }}>
                    {stats.waiting}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>Aguardando</Typography>
                </Box>
                <ScheduleIcon sx={{ fontSize: 48, color: '#FF9800', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: '#E3F2FD', borderLeft: '4px solid #2196F3' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#2196F3' }}>
                    {stats.inProgress}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>Em Andamento</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: '#E8F5E9', borderLeft: '4px solid #4CAF50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                    {stats.completed}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>Concluídos</Typography>
                </Box>
                <CheckIcon sx={{ fontSize: 48, color: '#4CAF50', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, bgcolor: '#F8F5EE', borderLeft: '4px solid #0E6A6B' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#0E6A6B' }}>
                    {formatPrice(stats.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>Faturado</Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 48, color: '#0E6A6B', opacity: 0.3 }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} lg={4} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      OS #{order.id}
                    </Typography>
                    <Chip
                      label={formatOrderStatus(order.status)}
                      size="small"
                      sx={{
                        bgcolor: getOrderStatusColor(order.status),
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Cliente: <strong>{getCustomerName(order.customerId)}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Pet: <strong>{getPetName(order.petId)}</strong>
                  </Typography>

                  <Box sx={{ mt: 2, mb: 2 }}>
                    {order.items.map((item) => (
                      <Typography key={item.id} variant="body2">
                        • {item.serviceName} - {formatPrice(item.price)}
                      </Typography>
                    ))}
                  </Box>

                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Total: {formatPrice(order.totalAmount)}
                  </Typography>

                  {order.paid && (
                    <Chip label="Pago" size="small" color="success" sx={{ mt: 1 }} />
                  )}
                </CardContent>

                <CardActions>
                  {order.status === 'waiting' && (
                    <Button size="small" onClick={() => handleCheckIn(order.id)}>
                      Check-in
                    </Button>
                  )}
                  {order.status === 'in-progress' && (
                    <Button size="small" onClick={() => handleCheckOut(order.id)}>
                      Check-out
                    </Button>
                  )}
                  <Button size="small" color="error" onClick={() => handleDeleteClick(order)}>
                    Excluir
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir esta ordem de serviço?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceOrdersPage;

