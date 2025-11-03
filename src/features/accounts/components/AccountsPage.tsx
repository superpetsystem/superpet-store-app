import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, List, ListItem, ListItemText, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import { Add as AddIcon, AttachMoney, Warning, CheckCircle, Schedule, Payment } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { accountsApi } from '../api/accountsApi';
import { AccountReceivable } from '../../../types';
import { customersApi } from '../../customers/api/customersApi';

const AccountsPage = () => {
  const { isDark } = useThemeMode();
  const [accounts, setAccounts] = useState<AccountReceivable[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [dialog, setDialog] = useState(false);
  const [payDialog, setPayDialog] = useState<AccountReceivable | null>(null);
  const [formData, setFormData] = useState({
    customerId: '',
    amount: 0,
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    paymentType: 'boleto' as 'boleto' | 'pix' | 'card' | 'cash',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [accRes, custRes] = await Promise.all([
      accountsApi.getAll(),
      customersApi.getCustomers({ page: 1, limit: 1000 }),
    ]);
    if (accRes.success && accRes.data) setAccounts(accRes.data);
    if (custRes.success && custRes.data) setCustomers(custRes.data.items);
  };

  const handleCreate = async () => {
    const customer = customers.find(c => c.id === formData.customerId);
    if (!customer) return;

    const res = await accountsApi.create({
      ...formData,
      customerName: customer.name,
      status: 'pending',
      issueDate: new Date().toISOString().split('T')[0],
    });

    if (res.success) {
      setDialog(false);
      setFormData({ customerId: '', amount: 0, description: '', dueDate: new Date().toISOString().split('T')[0], paymentType: 'boleto' });
      loadData();
      alert('✅ Conta criada!');
    }
  };

  const handlePay = async () => {
    if (!payDialog) return;

    const res = await accountsApi.updateStatus(payDialog.id, 'paid', new Date().toISOString().split('T')[0]);
    if (res.success) {
      setPayDialog(null);
      loadData();
      alert('✅ Pagamento registrado!');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = { pending: '#FF9800', paid: '#4CAF50', overdue: '#F44336', cancelled: '#757575' };
    return colors[status as keyof typeof colors];
  };

  const stats = {
    total: accounts.reduce((sum, a) => sum + a.amount, 0),
    pending: accounts.filter(a => a.status === 'pending').reduce((sum, a) => sum + a.amount, 0),
    overdue: accounts.filter(a => a.status === 'overdue').reduce((sum, a) => sum + a.amount, 0),
    paid: accounts.filter(a => a.status === 'paid').reduce((sum, a) => sum + a.amount, 0),
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', ...typography.h4 }}>
            💰 Contas a Receber
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Gerencie pagamentos e inadimplência
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog(true)} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
          Nova Conta
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total a Receber', value: `R$ ${stats.total.toFixed(2)}`, color: '#0E6A6B', icon: <AttachMoney /> },
          { label: 'Pendente', value: `R$ ${stats.pending.toFixed(2)}`, color: '#FF9800', icon: <Schedule /> },
          { label: 'Vencidas', value: `R$ ${stats.overdue.toFixed(2)}`, color: '#F44336', icon: <Warning /> },
          { label: 'Recebidas', value: `R$ ${stats.paid.toFixed(2)}`, color: '#4CAF50', icon: <CheckCircle /> },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', borderLeft: `4px solid ${stat.color}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2, width: 40, height: 40 }}>{stat.icon}</Avatar>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: stat.color }}>{stat.value}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
        <CardContent>
          <List sx={{ p: 0 }}>
            {accounts.map((account, index) => (
              <ListItem
                key={account.id}
                sx={{
                  bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                  borderRadius: 2,
                  mb: index < accounts.length - 1 ? 2 : 0,
                  border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                }}
                secondaryAction={
                  account.status === 'pending' && (
                    <IconButton edge="end" onClick={() => setPayDialog(account)} sx={{ color: '#4CAF50' }}>
                      <Payment />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                        {account.customerName}
                      </Typography>
                      <Chip label={account.status} size="small" sx={{ bgcolor: getStatusColor(account.status), color: '#FFF' }} />
                      <Typography variant="h6" sx={{ color: '#E47B24', ml: 'auto' }}>
                        R$ {account.amount.toFixed(2)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                      {account.description} • Venc: {new Date(account.dueDate).toLocaleDateString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          💰 Nova Conta a Receber
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Cliente"
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                {(customers || []).map(c => (
                  <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Valor"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                InputProps={{ startAdornment: 'R$' }}
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
                label="Vencimento"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
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
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!formData.customerId || formData.amount <= 0} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Criar Conta
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pay Dialog */}
      <Dialog open={!!payDialog} onClose={() => setPayDialog(null)}>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          ✅ Confirmar Pagamento
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
            Confirmar recebimento de <strong>R$ {payDialog?.amount.toFixed(2)}</strong> de <strong>{payDialog?.customerName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setPayDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handlePay} sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}>
            Confirmar Recebimento
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountsPage;
