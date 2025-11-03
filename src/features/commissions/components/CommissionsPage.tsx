import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, Chip, Tabs, Tab } from '@mui/material';
import { Add, Payment } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { commissionsApi } from '../api/commissionsApi';
import { CommissionRule, Commission } from '../../../types';

const CommissionsPage = () => {
  const { isDark } = useThemeMode();
  const [tab, setTab] = useState(0);
  const [rules, setRules] = useState<CommissionRule[]>([]);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [dialog, setDialog] = useState(false);
  const [payDialog, setPayDialog] = useState<Commission | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 5,
    trigger: 'sale' as 'sale' | 'service' | 'both',
    minValue: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [rulesRes, comRes] = await Promise.all([
      commissionsApi.getRules(),
      commissionsApi.getCommissions(),
    ]);
    if (rulesRes.success && rulesRes.data) setRules(rulesRes.data);
    if (comRes.success && comRes.data) setCommissions(comRes.data);
  };

  const handleCreateRule = async () => {
    const res = await commissionsApi.createRule({ ...formData, active: true });
    if (res.success) {
      setDialog(false);
      setFormData({ name: '', description: '', type: 'percentage', value: 5, trigger: 'sale', minValue: 0 });
      loadData();
      alert('✅ Regra criada!');
    }
  };

  const handlePay = async () => {
    if (!payDialog) return;

    const res = await commissionsApi.payCommission(payDialog.id);
    if (res.success) {
      setPayDialog(null);
      loadData();
      alert('✅ Comissão paga!');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
          💰 Comissionamento
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialog(true)}
          sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
        >
          Nova Regra
        </Button>
      </Box>

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: isDark ? '#12888A' : '#E0E0E0' }}>
          <Tab label="Regras" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }} />
          <Tab label="Comissões" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }} />
        </Tabs>

        <CardContent>
          {tab === 0 ? (
            <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Nome</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Valor</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Gatilho</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rules.map(rule => (
                    <TableRow key={rule.id} hover>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{rule.name}</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{rule.type === 'percentage' ? 'Percentual' : 'Fixo'}</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{rule.type === 'percentage' ? `${rule.value}%` : `R$ ${rule.value}`}</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{rule.trigger}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Funcionário</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Regra</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Valor Base</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Comissão</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {commissions.map(com => (
                    <TableRow key={com.id} hover>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{com.employeeName}</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{com.ruleName}</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>R$ {com.baseValue.toFixed(2)}</TableCell>
                      <TableCell sx={{ color: '#E47B24', fontWeight: 600 }}>R$ {com.commissionValue.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip label={com.status === 'paid' ? 'Paga' : 'Pendente'} size="small" sx={{ bgcolor: com.status === 'paid' ? '#4CAF50' : '#FF9800', color: '#FFF' }} />
                      </TableCell>
                      <TableCell>
                        {com.status === 'pending' && (
                          <Button size="small" startIcon={<Payment />} onClick={() => setPayDialog(com)} sx={{ color: '#4CAF50' }}>
                            Pagar
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Rule Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          💰 Nova Regra de Comissão
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Regra"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                rows={2}
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& textarea': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Tipo"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                <MenuItem value="percentage">Percentual (%)</MenuItem>
                <MenuItem value="fixed">Fixo (R$)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label={formData.type === 'percentage' ? 'Percentual' : 'Valor Fixo'}
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                InputProps={{ endAdornment: formData.type === 'percentage' ? '%' : 'R$' }}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Gatilho"
                value={formData.trigger}
                onChange={(e) => setFormData({ ...formData, trigger: e.target.value as any })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                <MenuItem value="sale">Vendas</MenuItem>
                <MenuItem value="service">Serviços</MenuItem>
                <MenuItem value="both">Ambos</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreateRule} disabled={!formData.name || !formData.description} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Criar Regra
          </Button>
        </DialogActions>
      </Dialog>

      {/* Pay Dialog */}
      <Dialog open={!!payDialog} onClose={() => setPayDialog(null)}>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          💰 Confirmar Pagamento
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
            Confirmar pagamento de <strong>R$ {payDialog?.commissionValue.toFixed(2)}</strong> para <strong>{payDialog?.employeeName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setPayDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handlePay} sx={{ bgcolor: '#4CAF50', '&:hover': { bgcolor: '#388E3C' } }}>
            Confirmar Pagamento
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionsPage;
