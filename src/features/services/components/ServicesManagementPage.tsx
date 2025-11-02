import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, List, ListItem, ListItemText, Chip, Avatar, ListItemAvatar } from '@mui/material';
import { Add, Edit, Delete, ContentCut } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { servicesApi } from '../api/servicesApi';
import { Service } from '../../../types';

const ServicesManagementPage = () => {
  const { isDark } = useThemeMode();
  const [services, setServices] = useState<Service[]>([]);
  const [dialog, setDialog] = useState(false);
  const [editDialog, setEditDialog] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 60,
    category: 'grooming',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await servicesApi.getServices({ page: 1, limit: 1000 });
      if (res.success && res.data) setServices(res.data.items || []);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setServices([]);
    }
  };

  const handleCreate = async () => {
    const res = await servicesApi.create({ ...formData, active: true });
    if (res.success) {
      setDialog(false);
      setFormData({ name: '', description: '', price: 0, duration: 60, category: 'grooming' });
      loadData();
      alert('✅ Serviço criado!');
    }
  };

  const handleUpdate = async () => {
    if (!editDialog) return;
    
    const res = await servicesApi.update(editDialog.id, formData);
    if (res.success) {
      setEditDialog(null);
      setFormData({ name: '', description: '', price: 0, duration: 60, category: 'grooming' });
      loadData();
      alert('✅ Serviço atualizado!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirma exclusão?')) return;
    
    const res = await servicesApi.delete(id);
    if (res.success) {
      loadData();
      alert('✅ Serviço excluído!');
    }
  };

  const openEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
      duration: service.duration,
      category: service.category,
    });
    setEditDialog(service);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', ...typography.h4 }}>
          ✂️ Catálogo de Serviços
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialog(true)}
          sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
        >
          Novo Serviço
        </Button>
      </Box>

      <Grid container spacing={3}>
        {(services || []).map(service => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#E47B24' }}><ContentCut /></Avatar>
                  <Box>
                    <IconButton size="small" onClick={() => openEdit(service)} sx={{ color: '#2196F3' }}>
                      <Edit />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(service.id)} sx={{ color: '#F44336' }}>
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600, mb: 1 }}>
                  {service.name}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 2 }}>
                  {service.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" sx={{ color: '#E47B24', fontWeight: 'bold' }}>
                    R$ {service.price.toFixed(2)}
                  </Typography>
                  <Chip label={`${service.duration} min`} size="small" sx={{ bgcolor: '#2196F3', color: '#FFF' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          ✂️ Novo Serviço
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Serviço"
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
                rows={3}
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
                fullWidth
                type="number"
                label="Preço (R$)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duração (min)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
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
          <Button variant="contained" onClick={handleCreate} disabled={!formData.name || formData.price <= 0} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Criar Serviço
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onClose={() => setEditDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          ✏️ Editar Serviço
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Serviço"
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
                rows={3}
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
                fullWidth
                type="number"
                label="Preço (R$)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Duração (min)"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setEditDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpdate} disabled={!formData.name || formData.price <= 0} sx={{ bgcolor: '#2196F3', '&:hover': { bgcolor: '#1976D2' } }}>
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServicesManagementPage;

