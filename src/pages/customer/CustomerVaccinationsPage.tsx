import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, Chip, Avatar, ListItemAvatar, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Vaccines, Add, Warning, CheckCircle } from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';
import { vaccinationsApi } from '../../features/vaccinations/api/vaccinationsApi';
import { Vaccination } from '../../types';

const CustomerVaccinationsPage = () => {
  const { isDark } = useThemeMode();
  const user = useAppSelector(state => state.auth.user);
  const { pets } = useAppSelector(state => state.pets);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<string>('all');

  useEffect(() => {
    if (user) loadData();
  }, [user, selectedPet]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    
    // Carregar vacinas de todos os pets do tutor
    const allVaccinations: Vaccination[] = [];
    
    for (const pet of pets) {
      const res = await vaccinationsApi.getByPet(pet.id);
      if (res.success && res.data) {
        allVaccinations.push(...res.data);
      }
    }

    setVaccinations(allVaccinations);
    setLoading(false);
  };

  const filteredVaccinations = selectedPet === 'all'
    ? vaccinations
    : vaccinations.filter(v => v.petId === selectedPet);

  const getStatusColor = (status: string) => {
    const colors = {
      applied: '#4CAF50',
      pending: '#FF9800',
      overdue: '#F44336',
    };
    return colors[status as keyof typeof colors] || '#999';
  };

  const stats = {
    total: filteredVaccinations.length,
    applied: filteredVaccinations.filter(v => v.status === 'applied').length,
    pending: filteredVaccinations.filter(v => v.status === 'pending').length,
    overdue: filteredVaccinations.filter(v => v.status === 'overdue').length,
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        💉 Histórico de Vacinação
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Acompanhe as vacinas dos seus pets
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { label: 'Total', value: stats.total, color: '#2196F3', icon: <Vaccines /> },
          { label: 'Aplicadas', value: stats.applied, color: '#4CAF50', icon: <CheckCircle /> },
          { label: 'Pendentes', value: stats.pending, color: '#FF9800', icon: <Warning /> },
          { label: 'Vencidas', value: stats.overdue, color: '#F44336', icon: <Warning /> },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', borderLeft: `4px solid ${stat.color}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2, width: 40, height: 40 }}>{stat.icon}</Avatar>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>{stat.value}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filtro */}
      {pets.length > 1 && (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', mb: 3 }}>
          <CardContent>
            <TextField
              select
              fullWidth
              label="Filtrar por Pet"
              value={selectedPet}
              onChange={(e) => setSelectedPet(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
              }}
            >
              <MenuItem value="all">Todos os Pets</MenuItem>
              {pets.map(pet => (
                <MenuItem key={pet.id} value={pet.id}>🐾 {pet.name}</MenuItem>
              ))}
            </TextField>
          </CardContent>
        </Card>
      )}

      {/* Lista */}
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Histórico de Vacinas
          </Typography>

          {loading ? (
            <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
              Carregando...
            </Typography>
          ) : filteredVaccinations.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Vaccines sx={{ fontSize: 64, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
              <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                Nenhuma vacina registrada
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredVaccinations.map((vac, index) => (
                <ListItem
                  key={vac.id}
                  sx={{
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    borderRadius: 2,
                    mb: index < filteredVaccinations.length - 1 ? 2 : 0,
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(vac.status) }}>
                      <Vaccines />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>
                          🐾 {vac.petName}
                        </Typography>
                        <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                          • {vac.vaccineName}
                        </Typography>
                        <Chip
                          label={vac.status === 'applied' ? 'Aplicada' : vac.status === 'pending' ? 'Pendente' : 'Vencida'}
                          size="small"
                          sx={{ bgcolor: getStatusColor(vac.status), color: '#FFF' }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                          📅 Aplicação: {new Date(vac.applicationDate).toLocaleDateString('pt-BR')}
                          {vac.nextDose && ` • Próxima: ${new Date(vac.nextDose).toLocaleDateString('pt-BR')}`}
                        </Typography>
                        {vac.veterinarian && (
                          <Typography variant="caption" sx={{ color: isDark ? '#12888A' : '#999' }}>
                            👨‍⚕️ {vac.veterinarian}
                          </Typography>
                        )}
                        {vac.notes && (
                          <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block' }}>
                            📝 {vac.notes}
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

export default CustomerVaccinationsPage;
