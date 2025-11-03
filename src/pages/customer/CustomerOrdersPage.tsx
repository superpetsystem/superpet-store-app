import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider } from '@mui/material';
import { ShoppingCart, LocalShipping, Visibility } from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';
import { cartApi } from '../../features/ecommerce/api/cartApi';
import { Order } from '../../types';

const CustomerOrdersPage = () => {
  const { isDark } = useThemeMode();
  const user = useAppSelector(state => state.auth.user);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailDialog, setDetailDialog] = useState<Order | null>(null);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    const res = await cartApi.getOrders(user.id);
    if (res.success && res.data) setOrders(res.data);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: '#FF9800',
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336',
    };
    return colors[status as keyof typeof colors] || '#999';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendente',
      processing: 'Em Processamento',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        📦 Meus Pedidos
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Acompanhe suas compras online
      </Typography>

      {loading ? (
        <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
          Carregando...
        </Typography>
      ) : orders.length === 0 ? (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', textAlign: 'center', py: 6 }}>
          <ShoppingCart sx={{ fontSize: 80, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 2 }}>
            Você ainda não fez nenhum pedido
          </Typography>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 3 }}>
            Navegue pela nossa loja online e faça seu primeiro pedido!
          </Typography>
          <Button
            variant="contained"
            href="/customer/shop"
            sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
          >
            Ir para Loja Online
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {orders.map(order => (
            <Grid item xs={12} key={order.id}>
              <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '2px solid #12888A' : 'none' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600, mb: 1 }}>
                        Pedido #{order.id}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                        📅 Realizado em {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                        💳 Pagamento: {order.paymentMethod} • {order.paymentStatus === 'paid' ? '✅ Pago' : '⏳ Pendente'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={getStatusLabel(order.status)}
                        sx={{
                          bgcolor: getStatusColor(order.status),
                          color: '#FFF',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      />
                      <Typography variant="h5" sx={{ color: '#E47B24', fontWeight: 'bold' }}>
                        R$ {order.total.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  {order.trackingCode && (
                    <Box sx={{ p: 2, bgcolor: isDark ? '#0D1117' : '#FFFFFF', borderRadius: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalShipping sx={{ color: '#2196F3' }} />
                        <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>
                          Código de Rastreamento:
                        </Typography>
                        <Chip label={order.trackingCode} size="small" sx={{ bgcolor: '#2196F3', color: '#FFF', fontWeight: 600 }} />
                      </Box>
                    </Box>
                  )}

                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => setDetailDialog(order)}
                    sx={{
                      borderColor: '#E47B24',
                      color: '#E47B24',
                      '&:hover': { borderColor: '#C26619', bgcolor: 'rgba(228, 123, 36, 0.1)' },
                    }}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!detailDialog} onClose={() => setDetailDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          📦 Detalhes do Pedido #{detailDialog?.id}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          {detailDialog && (
            <>
              {/* Items */}
              <Typography variant="subtitle2" fontWeight="600" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                Itens do Pedido:
              </Typography>
              <List dense sx={{ mb: 3 }}>
                {detailDialog.items.map((item, idx) => (
                  <ListItem
                    key={idx}
                    sx={{
                      bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                      borderRadius: 1,
                      mb: 1,
                      border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>
                            {item.quantity}x {item.productName}
                          </Typography>
                          <Typography sx={{ color: '#E47B24', fontWeight: 600 }}>
                            R$ {(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>

              {/* Totais */}
              <Box sx={{ p: 2, bgcolor: isDark ? '#0D1117' : '#FFFFFF', borderRadius: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>Subtotal:</Typography>
                  <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>R$ {detailDialog.subtotal.toFixed(2)}</Typography>
                </Box>
                {detailDialog.discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>Desconto:</Typography>
                    <Typography sx={{ color: '#4CAF50' }}>-R$ {detailDialog.discount.toFixed(2)}</Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>Frete:</Typography>
                  <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                    {detailDialog.shipping === 0 ? 'GRÁTIS' : `R$ ${detailDialog.shipping.toFixed(2)}`}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1, borderColor: isDark ? '#12888A' : '#E0E0E0' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#E47B24' }}>
                    R$ {detailDialog.total.toFixed(2)}
                  </Typography>
                </Box>
              </Box>

              {/* Endereço */}
              <Typography variant="subtitle2" fontWeight="600" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1 }}>
                Endereço de Entrega:
              </Typography>
              <Box sx={{ p: 2, bgcolor: isDark ? '#0D1117' : '#FFFFFF', borderRadius: 2 }}>
                <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                  {detailDialog.shippingAddress.street}, {detailDialog.shippingAddress.number}
                  {detailDialog.shippingAddress.complement && ` - ${detailDialog.shippingAddress.complement}`}
                </Typography>
                <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  {detailDialog.shippingAddress.neighborhood} - {detailDialog.shippingAddress.city}/{detailDialog.shippingAddress.state}
                </Typography>
                <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  CEP: {detailDialog.shippingAddress.zipCode}
                </Typography>
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDetailDialog(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerOrdersPage;
