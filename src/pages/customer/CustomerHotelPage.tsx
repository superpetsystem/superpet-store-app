import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, List, ListItem, ListItemText } from '@mui/material';
import { Hotel, Add } from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { useAppSelector } from '../../store/hooks';
import { hotelApi } from '../../features/hotel/api/hotelApi';
import { HotelReservation, HotelActivity } from '../../types';

const CustomerHotelPage = () => {
  const { isDark } = useThemeMode();
  const user = useAppSelector(state => state.auth.user);
  const { pets } = useAppSelector(state => state.pets);
  const [reservations, setReservations] = useState<HotelReservation[]>([]);
  const [activities, setActivities] = useState<Record<string, HotelActivity[]>>({});
  const [dialog, setDialog] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    serviceType: 'hotel' as 'hotel' | 'daycare',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    specialRequests: '',
  });

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    const res = await hotelApi.getReservations(user.id);
    if (res.success && res.data) {
      setReservations(res.data);

      // Carregar atividades de cada reserva check-in
      const activitiesMap: Record<string, HotelActivity[]> = {};
      for (const reservation of res.data.filter(r => r.status === 'checked-in')) {
        const actRes = await hotelApi.getActivities(reservation.id);
        if (actRes.success && actRes.data) {
          activitiesMap[reservation.id] = actRes.data;
        }
      }
      setActivities(activitiesMap);
    }
  };

  const handleCreate = async () => {
    if (!user) return;

    const pet = pets.find(p => p.id === formData.petId);
    if (!pet) return;

    const days = Math.ceil((new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) / (24 * 60 * 60 * 1000));
    const rate = formData.serviceType === 'hotel' ? 80 : 50;

    const newRes = {
      customerId: user.id,
      customerName: user.name,
      petId: pet.id,
      petName: pet.name,
      serviceType: formData.serviceType,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      status: 'pending' as const,
      dailyRate: rate,
      totalDays: days,
      totalAmount: rate * days,
      services: [],
      specialRequests: formData.specialRequests,
      emergencyContact: { name: user.name, phone: '(11) 99999-9999' },
    };

    const res = await hotelApi.createReservation(newRes);
    if (res.success) {
      setDialog(false);
      loadData();
      alert('✅ Reserva solicitada com sucesso!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked-in': return '#4CAF50';
      case 'confirmed': return '#2196F3';
      case 'pending': return '#FF9800';
      default: return '#999';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1 }}>
            🏨 Hotel & Creche
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
            Reserve hospedagem para seu pet
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialog(true)}
          sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
        >
          Nova Reserva
        </Button>
      </Box>

      <Grid container spacing={3}>
        {reservations.map(res => (
          <Grid item xs={12} key={res.id}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '2px solid #12888A' : 'none' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                      {res.serviceType === 'hotel' ? '🏨' : '🎨'} {res.petName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                      {new Date(res.checkInDate).toLocaleDateString()} → {new Date(res.checkOutDate).toLocaleDateString()} • {res.totalDays} dias
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Chip label={res.status} sx={{ bgcolor: getStatusColor(res.status), color: '#FFF', mb: 1 }} />
                    <Typography variant="h6" sx={{ color: '#E47B24' }}>R$ {res.totalAmount.toFixed(2)}</Typography>
                  </Box>
                </Box>

                {/* Atividades */}
                {res.status === 'checked-in' && activities[res.id] && activities[res.id].length > 0 && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: isDark ? '#0D1117' : '#FFFFFF', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1 }}>
                      📋 Atividades de Hoje
                    </Typography>
                    <List dense sx={{ p: 0 }}>
                      {activities[res.id].slice(0, 3).map((act, idx) => (
                        <ListItem key={act.id} sx={{ px: 0 }}>
                          <ListItemText
                            primary={`${act.time} - ${act.description}`}
                            secondary={`Por ${act.performedBy}`}
                            primaryTypographyProps={{ sx: { color: isDark ? '#F8F5EE' : '#0E6A6B', fontSize: '0.9rem' } }}
                            secondaryTypographyProps={{ sx: { color: isDark ? '#E6E1D6' : '#999', fontSize: '0.75rem' } }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Create Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          🏨 Nova Reserva
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Selecione o Pet"
                value={formData.petId}
                onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                {pets.map(p => (
                  <MenuItem key={p.id} value={p.id}>🐾 {p.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Tipo de Serviço"
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as any })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                <MenuItem value="hotel">🏨 Hotel - R$ 80/dia (Hospedagem completa)</MenuItem>
                <MenuItem value="daycare">🎨 Creche - R$ 50/dia (Apenas durante o dia)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Check-in"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
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
                label="Check-out"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
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
                multiline
                rows={3}
                label="Pedidos Especiais"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="Ex: Dieta especial, brinquedo favorito..."
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& textarea': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!formData.petId} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Solicitar Reserva
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerHotelPage;

