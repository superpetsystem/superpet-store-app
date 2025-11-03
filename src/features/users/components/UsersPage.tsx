import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import { Add as AddIcon, Person, AdminPanelSettings, Delete, ToggleOff, ToggleOn } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { usersApi } from '../api/usersApi';
import { SystemUser } from '../../../types';

const UsersPage = () => {
  const { isDark } = useThemeMode();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [dialog, setDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    roleId: '',
    roleName: 'Vendedor',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const response = await usersApi.getAll();
    if (response.success && response.data) {
      setUsers(response.data);
    }
  };

  const handleCreate = async () => {
    const res = await usersApi.create({ ...formData, active: true });
    if (res.success) {
      setDialog(false);
      setFormData({ name: '', email: '', phone: '', password: '', roleId: '', roleName: 'Vendedor' });
      loadUsers();
      alert('✅ Usuário criado!');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const res = await usersApi.update(id, { active: !currentActive });
    if (res.success) {
      loadUsers();
      alert(currentActive ? '❌ Usuário desativado!' : '✅ Usuário ativado!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Confirma exclusão?')) return;
    const res = await usersApi.delete(id);
    if (res.success) {
      loadUsers();
      alert('✅ Usuário excluído!');
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.active).length,
    inactive: users.filter(u => !u.active).length,
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', ...typography.h4 }}>
            👥 Usuários do Sistema
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Gerencie usuários e permissões
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog(true)} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
          Novo Usuário
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total', value: stats.total, color: '#0E6A6B' },
          { label: 'Ativos', value: stats.active, color: '#4CAF50' },
          { label: 'Inativos', value: stats.inactive, color: '#F44336' },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
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
            {users.map((user, index) => (
              <ListItem
                key={user.id}
                sx={{
                  bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                  borderRadius: 2,
                  mb: index < users.length - 1 ? 2 : 0,
                  border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => handleToggleActive(user.id, user.active)} sx={{ color: user.active ? '#FF9800' : '#4CAF50' }}>
                      {user.active ? <ToggleOn /> : <ToggleOff />}
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.id)} sx={{ color: '#F44336' }}>
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#E47B24' }}>
                    <Person />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Chip label={user.roleName} size="small" sx={{ bgcolor: '#0E6A6B', color: '#FFF' }} />
                      <Chip label={user.active ? 'Ativo' : 'Inativo'} size="small" sx={{ bgcolor: user.active ? '#4CAF50' : '#F44336', color: '#FFF' }} />
                    </Box>
                  }
                  secondary={
                    <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                      ✉️ {user.email} {user.phone && `• 📞 ${user.phone}`}
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
          👤 Novo Usuário
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="email"
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
                type="password"
                label="Senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Perfil"
                value={formData.roleName}
                onChange={(e) => setFormData({ ...formData, roleName: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Vendedor">Vendedor</MenuItem>
                <MenuItem value="Tosador">Tosador</MenuItem>
                <MenuItem value="Veterinário">Veterinário</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!formData.name || !formData.email || !formData.password} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Criar Usuário
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
