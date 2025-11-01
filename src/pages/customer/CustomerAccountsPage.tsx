import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
} from '@mui/material';
import {
  AttachMoney,
  Warning,
  CheckCircle,
  Schedule,
  Receipt,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';
import { accountsApi } from '../../features/accounts/api/accountsApi';
import { AccountReceivable } from '../../types';

const CustomerAccountsPage = () => {
  const { isDark } = useThemeMode();
  const user = useAppSelector((state) => state.auth.user);
  const [accounts, setAccounts] = useState<AccountReceivable[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadAccounts();
    }
  }, [user?.id]);

  const loadAccounts = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    const response = await accountsApi.getAll({ customerId: user.id });
    if (response.success && response.data) {
      setAccounts(response.data);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: '#FF9800',
      paid: '#4CAF50',
      overdue: '#F44336',
      cancelled: '#757575',
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: 'Pendente',
      paid: 'Pago',
      overdue: 'Vencido',
      cancelled: 'Cancelado',
    };
    return labels[status as keyof typeof labels] || status;
  };

  const stats = {
    total: accounts.reduce((sum, a) => sum + a.amount, 0),
    pending: accounts.filter(a => a.status === 'pending').reduce((sum, a) => sum + a.amount, 0),
    overdue: accounts.filter(a => a.status === 'overdue').reduce((sum, a) => sum + a.amount, 0),
    paid: accounts.filter(a => a.status === 'paid').reduce((sum, a) => sum + a.amount, 0),
  };

  const overdueCount = accounts.filter(a => a.status === 'overdue').length;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 0.5, ...typography.h4 }}
        >
          💳 Minhas Contas
        </Typography>
        <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
          Acompanhe seus pagamentos e faturas
        </Typography>
      </Box>

      {/* Alerta de Contas Vencidas */}
      {overdueCount > 0 && (
        <Alert
          severity="error"
          icon={<Warning />}
          sx={{
            mb: 3,
            bgcolor: isDark ? 'rgba(244, 67, 54, 0.1)' : undefined,
            color: isDark ? '#F8F5EE' : undefined,
            '& .MuiAlert-icon': { color: '#F44336' },
          }}
        >
          <Typography variant="body2" fontWeight="600">
            Você tem {overdueCount} conta{overdueCount > 1 ? 's vencidas' : ' vencida'}. Entre em contato com a loja!
          </Typography>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total', value: `R$ ${stats.total.toFixed(2)}`, color: '#0E6A6B', icon: <AttachMoney /> },
          { label: 'Pendentes', value: `R$ ${stats.pending.toFixed(2)}`, color: '#FF9800', icon: <Schedule /> },
          { label: 'Vencidas', value: `R$ ${stats.overdue.toFixed(2)}`, color: '#F44336', icon: <Warning /> },
          { label: 'Pagas', value: `R$ ${stats.paid.toFixed(2)}`, color: '#4CAF50', icon: <CheckCircle /> },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                border: isDark ? `1px solid ${stat.color}` : 'none',
                borderLeft: `4px solid ${stat.color}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ bgcolor: stat.color, borderRadius: '50%', p: 1.5, mr: 2 }}>
                    {React.cloneElement(stat.icon, { sx: { color: '#FFF', fontSize: 24 } })}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lista de Contas */}
      <Card
        sx={{
          bgcolor: isDark ? '#1C2128' : '#F8F5EE',
          border: isDark ? '1px solid #12888A' : 'none',
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Histórico de Contas
          </Typography>

          {loading ? (
            <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
              Carregando...
            </Typography>
          ) : accounts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Receipt sx={{ fontSize: 64, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
              <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                Nenhuma conta encontrada
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {accounts
                .sort((a, b) => b.dueDate.localeCompare(a.dueDate))
                .map((account, index) => (
                  <ListItem
                    key={account.id}
                    sx={{
                      bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                      borderRadius: 2,
                      mb: index < accounts.length - 1 ? 2 : 0,
                      border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                      '&:hover': {
                        borderColor: account.status === 'overdue' ? '#F44336' : '#E47B24',
                        boxShadow: 2,
                      },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                            {account.description}
                          </Typography>
                          <Chip
                            label={getStatusLabel(account.status)}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(account.status),
                              color: '#FFF',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold', display: 'block', mb: 0.5 }}>
                            R$ {account.amount.toFixed(2)}
                          </Typography>
                          <Typography component="span" variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block' }}>
                            📅 Vencimento: {new Date(account.dueDate).toLocaleDateString('pt-BR')}
                          </Typography>
                          {account.paymentDate && (
                            <Typography component="span" variant="body2" sx={{ color: '#4CAF50', display: 'block' }}>
                              ✅ Pago em: {new Date(account.paymentDate).toLocaleDateString('pt-BR')}
                            </Typography>
                          )}
                          {account.installment && account.totalInstallments && (
                            <Typography component="span" variant="caption" sx={{ color: isDark ? '#12888A' : '#999', display: 'block' }}>
                              Parcela {account.installment}/{account.totalInstallments}
                            </Typography>
                          )}
                          {account.notes && (
                            <Typography component="span" variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block', mt: 0.5 }}>
                              📝 {account.notes}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CustomerAccountsPage;

