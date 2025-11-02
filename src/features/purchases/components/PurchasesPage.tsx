import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid } from '@mui/material';
import { Add, Edit, CheckCircle, Delete } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { purchasesApi } from '../api/purchasesApi';
import { PurchaseOrder, Supplier } from '../../../types';
import { suppliersApi } from '../../suppliers/api/suppliersApi';

const PurchasesPage = () => {
  const { isDark } = useThemeMode();
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [dialog, setDialog] = useState(false);
  const [receiveDialog, setReceiveDialog] = useState<PurchaseOrder | null>(null);
  const [formData, setFormData] = useState({
    supplierId: '',
    orderNumber: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDelivery: '',
    notes: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [ordersRes, suppRes] = await Promise.all([
      purchasesApi.getAll(),
      suppliersApi.getAll(),
    ]);
    if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
    if (suppRes.success && suppRes.data) setSuppliers(suppRes.data);
  };

  const handleCreate = async () => {
    const supplier = suppliers.find(s => s.id === formData.supplierId);
    if (!supplier) return;

    const newOrder = {
      supplierId: formData.supplierId,
      supplierName: supplier.name,
      orderNumber: formData.orderNumber || `PO-${Date.now()}`,
      orderDate: formData.orderDate,
      expectedDelivery: formData.expectedDelivery || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft' as const,
      items: [],
      subtotal: 0,
      shipping: 0,
      total: 0,
      notes: formData.notes,
      createdBy: 'Admin',
    };

    const res = await purchasesApi.create(newOrder);
    if (res.success) {
      setDialog(false);
      loadData();
      alert('✅ Pedido criado!');
    }
  };

  const handleReceive = async () => {
    if (!receiveDialog) return;

    const res = await purchasesApi.updateStatus(
      receiveDialog.id,
      'received',
      new Date().toISOString().split('T')[0],
      `NF-${Date.now()}`
    );

    if (res.success) {
      setReceiveDialog(null);
      loadData();
      alert('✅ Pedido recebido!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return '#4CAF50';
      case 'sent': return '#2196F3';
      case 'draft': return '#FF9800';
      default: return '#F44336';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
          📦 Compras e Notas de Entrada
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialog(true)}
          sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
        >
          Novo Pedido
        </Button>
      </Box>

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
        <CardContent>
          <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Pedido</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Fornecedor</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Data</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Total</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map(order => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{order.orderNumber}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{order.supplierName}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>R$ {order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip label={order.status} size="small" sx={{ bgcolor: getStatusColor(order.status), color: '#FFF' }} />
                    </TableCell>
                    <TableCell>
                      {order.status === 'sent' && (
                        <IconButton size="small" onClick={() => setReceiveDialog(order)} sx={{ color: '#4CAF50' }}>
                          <CheckCircle />
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

      {/* Create Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          📦 Novo Pedido de Compra
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Fornecedor"
                value={formData.supplierId}
                onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                {(suppliers || []).map(s => (
                  <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nº do Pedido"
                value={formData.orderNumber}
                onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                placeholder="Auto-gerado"
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Data Prevista"
                value={formData.expectedDelivery}
                onChange={(e) => setFormData({ ...formData, expectedDelivery: e.target.value })}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Observações"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& textarea': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!formData.supplierId} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Criar Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Receive Dialog */}
      <Dialog open={!!receiveDialog} onClose={() => setReceiveDialog(null)}>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          ✅ Confirmar Recebimento
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
            Confirmar recebimento do pedido <strong>{receiveDialog?.orderNumber}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setReceiveDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleReceive} sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}>
            Confirmar Recebimento
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchasesPage;
