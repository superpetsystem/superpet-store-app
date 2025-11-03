import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Subscriptions as SubscriptionsIcon,
  Pause,
  PlayArrow,
  Edit,
  Delete,
  LocalShipping,
  CalendarMonth,
  Add,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';
import { subscriptionsApi } from '../../features/subscriptions/api/subscriptionsApi';
import { Subscription, SubscriptionDelivery, Product } from '../../types';
import { productsApi } from '../../features/products/api/productsApi';

const CustomerSubscriptionsPage = () => {
  const { isDark } = useThemeMode();
  const user = useAppSelector(state => state.auth.user);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [deliveries, setDeliveries] = useState<Record<string, SubscriptionDelivery[]>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialog, setCreateDialog] = useState(false);

  // Form states
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [interval, setInterval] = useState<'weekly' | 'biweekly' | 'monthly' | 'bimonthly'>('monthly');

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    const [subsRes, productsRes] = await Promise.all([
      subscriptionsApi.getAll(user.id),
      productsApi.getProducts({ page: 1, limit: 1000 }),
    ]);

    if (subsRes.success && subsRes.data) {
      setSubscriptions(subsRes.data);

      // Load deliveries for each subscription
      const deliveriesMap: Record<string, SubscriptionDelivery[]> = {};
      for (const sub of subsRes.data) {
        const delivRes = await subscriptionsApi.getDeliveries(sub.id);
        if (delivRes.success && delivRes.data) {
          deliveriesMap[sub.id] = delivRes.data;
        }
      }
      setDeliveries(deliveriesMap);
    }

    if (productsRes.success && productsRes.data) setProducts((productsRes.data.data || []).filter(p => p.category === 'food'));
    setLoading(false);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const response = await subscriptionsApi.updateStatus(id, newStatus);

    if (response.success && response.data) {
      setSubscriptions(subscriptions.map(s => s.id === id ? response.data! : s));
    }
  };

  const handleCancelSubscription = async (id: string) => {
    if (!confirm('Tem certeza que deseja cancelar esta assinatura?')) return;

    const response = await subscriptionsApi.updateStatus(id, 'cancelled');
    if (response.success) {
      loadData();
    }
  };

  const handleCreateSubscription = async () => {
    if (!user || !selectedProductId) return;

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const nextDelivery = new Date();
    nextDelivery.setDate(nextDelivery.getDate() + (interval === 'weekly' ? 7 : interval === 'biweekly' ? 14 : interval === 'monthly' ? 30 : 60));

    const newSub = {
      customerId: user.id,
      customerName: user.name,
      productId: product.id,
      productName: product.name,
      quantity,
      price: product.price,
      interval,
      status: 'active' as const,
      nextDelivery: nextDelivery.toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cartão de Crédito **** 1234',
      shippingAddress: {
        street: 'Rua das Flores',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Centro',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567',
      },
    };

    const response = await subscriptionsApi.create(newSub);
    if (response.success) {
      setCreateDialog(false);
      loadData();
      alert('✅ Assinatura criada com sucesso!');
    }
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

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
            📦 Minhas Assinaturas
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Receba produtos regularmente sem esquecer
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialog(true)}
          sx={{
            bgcolor: '#E47B24',
            color: '#FFF',
            '&:hover': { bgcolor: '#C26619' },
          }}
        >
          Nova Assinatura
        </Button>
      </Box>

      {loading ? (
        <Typography>Carregando...</Typography>
      ) : subscriptions.length === 0 ? (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', textAlign: 'center', py: 6 }}>
          <SubscriptionsIcon sx={{ fontSize: 80, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 2 }}>
            Você ainda não tem assinaturas
          </Typography>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 3 }}>
            Assine e receba ração, areia ou outros produtos automaticamente
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialog(true)}
            sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
          >
            Criar Primeira Assinatura
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {subscriptions.map(sub => (
            <Grid item xs={12} key={sub.id}>
              <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? `2px solid ${getStatusColor(sub.status)}` : `2px solid ${getStatusColor(sub.status)}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          bgcolor: '#E0E0E0',
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                        }}
                      >
                        🍖
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                          {sub.productName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                          {sub.quantity}x • {getIntervalLabel(sub.interval)} • R$ {sub.price.toFixed(2)}/entrega
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={getStatusLabel(sub.status)}
                      sx={{
                        bgcolor: getStatusColor(sub.status),
                        color: '#FFF',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: isDark ? '#0D1117' : '#FFFFFF', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                          <CalendarMonth sx={{ verticalAlign: 'middle', fontSize: 16, mr: 0.5 }} />
                          Próxima Entrega
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#E47B24' }}>
                          {new Date(sub.nextDelivery).toLocaleDateString('pt-BR')}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ p: 2, bgcolor: isDark ? '#0D1117' : '#FFFFFF', borderRadius: 2 }}>
                        <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                          Pagamento
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                          {sub.paymentMethod}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Delivery History */}
                  {deliveries[sub.id] && deliveries[sub.id].length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight="600" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1 }}>
                        Histórico de Entregas
                      </Typography>
                      <List dense sx={{ p: 0 }}>
                        {deliveries[sub.id].slice(0, 3).map((delivery, index) => (
                          <ListItem
                            key={delivery.id}
                            sx={{
                              bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                              borderRadius: 1,
                              mb: index < Math.min(deliveries[sub.id].length, 3) - 1 ? 1 : 0,
                            }}
                          >
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                                    {new Date(delivery.deliveryDate).toLocaleDateString('pt-BR')}
                                  </Typography>
                                  <Chip
                                    label={delivery.status === 'delivered' ? 'Entregue' : delivery.status === 'shipped' ? 'A caminho' : 'Agendada'}
                                    size="small"
                                    sx={{
                                      bgcolor: delivery.status === 'delivered' ? '#4CAF50' : delivery.status === 'shipped' ? '#2196F3' : '#FF9800',
                                      color: '#FFF',
                                      fontSize: '0.7rem',
                                    }}
                                  />
                                </Box>
                              }
                              secondary={
                                delivery.trackingCode && (
                                  <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                                    <LocalShipping sx={{ verticalAlign: 'middle', fontSize: 12, mr: 0.5 }} />
                                    {delivery.trackingCode}
                                  </Typography>
                                )
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  {/* Actions */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {sub.status === 'active' && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Pause />}
                        onClick={() => handleToggleStatus(sub.id, sub.status)}
                        sx={{
                          borderColor: '#FF9800',
                          color: '#FF9800',
                          '&:hover': { borderColor: '#F57C00', bgcolor: 'rgba(255, 152, 0, 0.1)' },
                        }}
                      >
                        Pausar
                      </Button>
                    )}
                    {sub.status === 'paused' && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<PlayArrow />}
                        onClick={() => handleToggleStatus(sub.id, sub.status)}
                        sx={{
                          borderColor: '#4CAF50',
                          color: '#4CAF50',
                          '&:hover': { borderColor: '#388E3C', bgcolor: 'rgba(76, 175, 80, 0.1)' },
                        }}
                      >
                        Reativar
                      </Button>
                    )}
                    {(sub.status === 'active' || sub.status === 'paused') && (
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleCancelSubscription(sub.id)}
                        sx={{
                          borderColor: '#F44336',
                          color: '#F44336',
                          '&:hover': { borderColor: '#D32F2F', bgcolor: 'rgba(244, 67, 54, 0.1)' },
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          📦 Nova Assinatura
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>Produto</InputLabel>
            <Select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              label="Produto"
              sx={{
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
              }}
            >
              {products.map(product => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} - R$ {product.price.toFixed(2)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            type="number"
            label="Quantidade"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1 }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
              },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
            }}
          />

          <FormControl fullWidth>
            <InputLabel sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>Frequência</InputLabel>
            <Select
              value={interval}
              onChange={(e) => setInterval(e.target.value as any)}
              label="Frequência"
              sx={{
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
              }}
            >
              <MenuItem value="weekly">Semanal (a cada 7 dias)</MenuItem>
              <MenuItem value="biweekly">Quinzenal (a cada 14 dias)</MenuItem>
              <MenuItem value="monthly">Mensal (a cada 30 dias)</MenuItem>
              <MenuItem value="bimonthly">Bimestral (a cada 60 dias)</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleCreateSubscription}
            disabled={!selectedProductId}
            sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
          >
            Criar Assinatura
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerSubscriptionsPage;

