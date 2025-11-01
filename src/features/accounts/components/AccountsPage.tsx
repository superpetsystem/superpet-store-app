import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, List, ListItem, ListItemText, Chip, Avatar } from '@mui/material';
import { Add as AddIcon, AttachMoney, Warning, CheckCircle, Schedule } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { accountsApi } from '../api/accountsApi';
import { AccountReceivable } from '../../../types';

const AccountsPage = () => {
  const { isDark } = useThemeMode();
  const [accounts, setAccounts] = useState<AccountReceivable[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    const response = await accountsApi.getAll();
    if (response.success && response.data) {
      setAccounts(response.data);
    }
    setLoading(false);
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
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#E47B24', color: '#F8F5EE', '&:hover': { bgcolor: '#C26619' } }}>
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
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? `1px solid ${stat.color}` : 'none', borderLeft: `4px solid ${stat.color}` }}>
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

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Contas a Receber
          </Typography>
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
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                        {account.customerName}
                      </Typography>
                      <Chip label={account.status} size="small" sx={{ bgcolor: getStatusColor(account.status), color: '#FFF' }} />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography component="span" variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block' }}>
                        {account.description} • R$ {account.amount.toFixed(2)}
                      </Typography>
                      <Typography component="span" variant="caption" sx={{ color: isDark ? '#12888A' : '#999', display: 'block' }}>
                        Vencimento: {new Date(account.dueDate).toLocaleDateString('pt-BR')}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccountsPage;

