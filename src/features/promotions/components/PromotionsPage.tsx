import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  LocalOffer,
  AttachMoney,
  TrendingUp,
  Delete,
  Edit,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { promotionsApi } from '../api/promotionsApi';
import { Promotion } from '../../../types';

const PromotionsPage = () => {
  const { isDark } = useThemeMode();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [dialog, setDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'percentage' as 'percentage' | 'fixed',
    value: 10,
    minPurchase: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await promotionsApi.promotions.getAll();
    if (res.success && res.data) setPromotions(res.data);
  };

  const handleCreate = async () => {
    const res = await promotionsApi.promotions.create({ ...formData, active: true, code: `PROMO${Date.now()}` });
    if (res.success) {
      setDialog(false);
      setFormData({ name: '', description: '', type: 'percentage', value: 10, minPurchase: 0, startDate: new Date().toISOString().split('T')[0], endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] });
      loadData();
      alert('✅ Promoção criada!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirma exclusão?')) return;
    const res = await promotionsApi.promotions.delete(id);
    if (res.success) {
      loadData();
      alert('✅ Promoção excluída!');
    }
  };

  const activePromotions = promotions.filter(p => p.active);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', ...typography.h4 }}>
            💰 Preços e Promoções
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Gerencie campanhas promocionais
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog(true)}
          sx={{ bgcolor: '#E47B24', color: '#F8F5EE', '&:hover': { bgcolor: '#C26619' } }}
        >
          Nova Promoção
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Promoções Ativas', value: activePromotions.length, color: '#4CAF50' },
          { label: 'Total', value: promotions.length, color: '#2196F3' },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} key={idx}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', borderLeft: `4px solid ${stat.color}` }}>
              <CardContent>
                <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color, mb: 1 }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
        <CardContent>
          <List sx={{ p: 0 }}>
            {promotions.map((promo, index) => (
              <ListItem
                key={promo.id}
                sx={{
                  bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                  borderRadius: 2,
                  mb: index < promotions.length - 1 ? 2 : 0,
                  border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                }}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(promo.id)} sx={{ color: '#F44336' }}>
                    <Delete />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>
                        {promo.name}
                      </Typography>
                      <Chip label={promo.active ? 'Ativa' : 'Inativa'} size="small" sx={{ bgcolor: promo.active ? '#4CAF50' : '#999', color: '#FFF' }} />
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                        {promo.description}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#E47B24', fontWeight: 600 }}>
                        {promo.type === 'percentage' ? `${promo.value}% de desconto` : `R$ ${promo.value} de desconto`}
                        {promo.minPurchase > 0 && ` • Min: R$ ${promo.minPurchase}`}
                      </Typography>
                    </>
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
          💰 Nova Promoção
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Promoção"
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
                <MenuItem value="fixed">Valor Fixo (R$)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Valor"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
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
                label="Data Início"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
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
                label="Data Fim"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
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
          <Button variant="contained" onClick={handleCreate} disabled={!formData.name} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Criar Promoção
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PromotionsPage;
