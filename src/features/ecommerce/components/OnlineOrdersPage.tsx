import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from '@mui/material';
import { ShoppingCart, LocalShipping, CheckCircle } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { cartApi } from '../api/cartApi';
import { Order } from '../../../types';

const OnlineOrdersPage = () => {
  const { isDark } = useThemeMode();
  const [orders, setOrders] = useState<Order[]>([]);
  const [detailDialog, setDetailDialog] = useState<Order | null>(null);
  const [statusDialog, setStatusDialog] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('processing');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await cartApi.getOrders();
    if (res.success && res.data) setOrders(res.data);
  };

  const handleUpdateStatus = async () => {
    if (!statusDialog) return;

    const res = await cartApi.updateOrderStatus(statusDialog.id, newStatus);
    if (res.success) {
      setStatusDialog(null);
      loadData();
      alert('✅ Status atualizado!');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: '#FF9800',
      processing: '#2196F3',
      shipped: '#9C27B0',
      delivered: '#4CAF50',
      cancelled: '#F44336',
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendente',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
    };
    return labels[status as keyof typeof labels];
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 3, ...typography.h4 }}>
        🛒 Pedidos Online (E-commerce)
      </Typography>

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Pedido #</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Cliente</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Data</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Pagamento</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id} hover onClick={() => setDetailDialog(order)} sx={{ cursor: 'pointer' }}>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>#{order.id}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{order.customerName}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>R$ {order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={order.paymentMethod} size="small" sx={{ bgcolor: order.paymentStatus === 'paid' ? '#4CAF50' : '#FF9800', color: '#FFF' }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={getStatusLabel(order.status)} size="small" sx={{ bgcolor: getStatusColor(order.status), color: '#FFF' }} />
                    </TableCell>
                    <TableCell>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setStatusDialog(order); setNewStatus(order.status === 'pending' ? 'processing' : order.status === 'processing' ? 'shipped' : 'delivered'); }} sx={{ color: '#2196F3' }}>
                          <LocalShipping />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!detailDialog} onClose={() => setDetailDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          📦 Pedido #{detailDialog?.id}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          {detailDialog && (
            <>
              <Typography variant="subtitle2" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1 }}>Itens:</Typography>
              {detailDialog.items.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, p: 1, bgcolor: isDark ? '#0D1117' : '#F8F5EE', borderRadius: 1 }}>
                  <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{item.quantity}x {item.productName}</Typography>
                  <Typography sx={{ color: '#E47B24', fontWeight: 600 }}>R$ {(item.price * item.quantity).toFixed(2)}</Typography>
                </Box>
              ))}
              <Typography variant="subtitle2" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mt: 2, mb: 1 }}>Endereço de Entrega:</Typography>
              <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                {detailDialog.shippingAddress.street}, {detailDialog.shippingAddress.number}<br />
                {detailDialog.shippingAddress.city} - {detailDialog.shippingAddress.state}<br />
                CEP: {detailDialog.shippingAddress.zipCode}
              </Typography>
              {detailDialog.trackingCode && (
                <>
                  <Typography variant="subtitle2" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mt: 2, mb: 1 }}>Rastreamento:</Typography>
                  <Chip label={detailDialog.trackingCode} sx={{ bgcolor: '#2196F3', color: '#FFF' }} />
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDetailDialog(null)}>Fechar</Button>
        </DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={!!statusDialog} onClose={() => setStatusDialog(null)}>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          🚚 Atualizar Status
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <TextField
            select
            fullWidth
            label="Novo Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as Order['status'])}
            sx={{
              '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
              '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
            }}
          >
            <MenuItem value="pending">Pendente</MenuItem>
            <MenuItem value="processing">Processando</MenuItem>
            <MenuItem value="shipped">Enviado</MenuItem>
            <MenuItem value="delivered">Entregue</MenuItem>
            <MenuItem value="cancelled">Cancelado</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setStatusDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdateStatus} sx={{ bgcolor: '#2196F3', '&:hover': { bgcolor: '#1976D2' } }}>
            Atualizar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnlineOrdersPage;

