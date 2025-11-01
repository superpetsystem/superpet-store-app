import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip } from '@mui/material';
import { Add as AddIcon, Person, AdminPanelSettings } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { usersApi } from '../api/usersApi';
import { SystemUser } from '../../../types';

const UsersPage = () => {
  const { isDark } = useThemeMode();
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const response = await usersApi.getAll();
    if (response.success && response.data) {
      setUsers(response.data);
    }
    setLoading(false);
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
        <Button variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: '#E47B24', color: '#F8F5EE', '&:hover': { bgcolor: '#C26619' } }}>
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
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? `1px solid ${stat.color}` : 'none', borderLeft: `4px solid ${stat.color}` }}>
              <CardContent>
                <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color, mb: 1 }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Lista de Usuários
          </Typography>
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
    </Box>
  );
};

export default UsersPage;

