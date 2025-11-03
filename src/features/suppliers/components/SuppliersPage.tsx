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
  ListItemAvatar,
  Avatar,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Business,
  Phone,
  Email,
  LocalShipping,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { useSuppliers } from '../hooks/useSuppliers';
import { SupplierCategory } from '../../../types';
import { suppliersApi } from '../api/suppliersApi';

const SuppliersPage = () => {
  const { isDark } = useThemeMode();
  const { suppliers, loading, loadSuppliers: loadSuppliersHook } = useSuppliers();
  const [categoryFilter, setCategoryFilter] = useState<SupplierCategory | 'all'>('all');
  const [dialog, setDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'food' as SupplierCategory,
    cnpj: '',
    phone: '',
    email: '',
    contactPerson: '',
    paymentTerms: '',
    deliveryTime: '',
  });

  useEffect(() => {
    loadSuppliersHook();
  }, [loadSuppliersHook]);

  const filteredSuppliers = suppliers.filter(
    s => categoryFilter === 'all' || s.category === categoryFilter
  );

  const handleCreate = async () => {
    const newSupplier = {
      ...formData,
      active: true,
      address: { street: '', number: '', city: '', state: '', zipCode: '' },
    };

    const res = await suppliersApi.create(newSupplier);
    if (res.success) {
      setDialog(false);
      setFormData({ name: '', category: 'food', cnpj: '', phone: '', email: '', contactPerson: '', paymentTerms: '', deliveryTime: '' });
      loadSuppliersHook();
      alert('✅ Fornecedor criado!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirma exclusão?')) return;

    const res = await suppliersApi.delete(id);
    if (res.success) {
      loadSuppliersHook();
      alert('✅ Fornecedor excluído!');
    }
  };

  const getCategoryLabel = (category: SupplierCategory) => {
    const labels = {
      food: 'Alimentos',
      medicine: 'Medicamentos',
      accessories: 'Acessórios',
      services: 'Serviços',
      equipment: 'Equipamentos',
      other: 'Outros',
    };
    return labels[category];
  };

  const getCategoryColor = (category: SupplierCategory) => {
    const colors = {
      food: '#4CAF50',
      medicine: '#F44336',
      accessories: '#2196F3',
      services: '#FF9800',
      equipment: '#9C27B0',
      other: '#757575',
    };
    return colors[category];
  };

  const stats = {
    total: filteredSuppliers.length,
    active: filteredSuppliers.filter(s => s.active).length,
    inactive: filteredSuppliers.filter(s => !s.active).length,
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 0.5, ...typography.h4 }}
          >
            🏭 Fornecedores
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Gerencie seus fornecedores e parceiros
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog(true)}
          sx={{
            bgcolor: '#E47B24',
            color: '#F8F5EE',
            fontWeight: 600,
            '&:hover': { bgcolor: '#C26619' },
          }}
        >
          Novo Fornecedor
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total', value: stats.total, color: '#0E6A6B' },
          { label: 'Ativos', value: stats.active, color: '#4CAF50' },
          { label: 'Inativos', value: stats.inactive, color: '#F44336' },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{
              bgcolor: isDark ? '#1C2128' : '#F8F5EE',
              border: isDark ? `1px solid ${stat.color}` : 'none',
              borderLeft: `4px solid ${stat.color}`,
            }}>
              <CardContent>
                <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color, mb: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filtros */}
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', mb: 3 }}>
        <CardContent>
          <TextField
            select
            fullWidth
            size="small"
            label="Filtrar por Categoria"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
              },
              '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
              '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
            }}
          >
            <MenuItem value="all">Todas as Categorias</MenuItem>
            <MenuItem value="food">Alimentos</MenuItem>
            <MenuItem value="medicine">Medicamentos</MenuItem>
            <MenuItem value="accessories">Acessórios</MenuItem>
            <MenuItem value="services">Serviços</MenuItem>
            <MenuItem value="equipment">Equipamentos</MenuItem>
            <MenuItem value="other">Outros</MenuItem>
          </TextField>
        </CardContent>
      </Card>

      {/* Lista */}
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Lista de Fornecedores
          </Typography>

          {loading ? (
            <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
              Carregando...
            </Typography>
          ) : filteredSuppliers.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Business sx={{ fontSize: 64, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
              <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                Nenhum fornecedor encontrado
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredSuppliers.map((supplier, index) => (
                <ListItem
                  key={supplier.id}
                  sx={{
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    borderRadius: 2,
                    mb: index < filteredSuppliers.length - 1 ? 2 : 0,
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                    '&:hover': { borderColor: '#E47B24', boxShadow: 2 },
                  }}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => handleDelete(supplier.id)} sx={{ color: '#F44336' }}>
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getCategoryColor(supplier.category) }}>
                      <Business />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                          {supplier.name}
                        </Typography>
                        <Chip
                          label={getCategoryLabel(supplier.category)}
                          size="small"
                          sx={{ bgcolor: getCategoryColor(supplier.category), color: '#FFF' }}
                        />
                        {supplier.active ? (
                          <Chip label="Ativo" size="small" sx={{ bgcolor: '#4CAF50', color: '#FFF' }} />
                        ) : (
                          <Chip label="Inativo" size="small" sx={{ bgcolor: '#F44336', color: '#FFF' }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography component="span" variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block' }}>
                          📞 {supplier.phone} {supplier.email && `• ✉️ ${supplier.email}`}
                        </Typography>
                        {supplier.contactPerson && (
                          <Typography component="span" variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block' }}>
                            👤 Contato: {supplier.contactPerson}
                          </Typography>
                        )}
                        {supplier.paymentTerms && (
                          <Typography component="span" variant="caption" sx={{ color: isDark ? '#12888A' : '#0E6A6B', display: 'block' }}>
                            💰 Prazo: {supplier.paymentTerms} {supplier.deliveryTime && `• 🚚 Entrega: ${supplier.deliveryTime} dias`}
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

      {/* Create Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          🏭 Novo Fornecedor
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Nome do Fornecedor"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="Categoria"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as SupplierCategory })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                <MenuItem value="food">Alimentos</MenuItem>
                <MenuItem value="medicine">Medicamentos</MenuItem>
                <MenuItem value="accessories">Acessórios</MenuItem>
                <MenuItem value="services">Serviços</MenuItem>
                <MenuItem value="equipment">Equipamentos</MenuItem>
                <MenuItem value="other">Outros</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CNPJ"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pessoa de Contato"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prazo de Pagamento"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                placeholder="Ex: 30 dias"
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prazo de Entrega (dias)"
                value={formData.deliveryTime}
                onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                placeholder="Ex: 5 dias"
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
          <Button variant="contained" onClick={handleCreate} disabled={!formData.name || !formData.phone} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Criar Fornecedor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SuppliersPage;
