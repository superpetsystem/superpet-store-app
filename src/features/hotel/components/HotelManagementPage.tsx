import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Hotel, Add, CheckCircle, ExitToApp, NoteAdd } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { hotelApi } from '../api/hotelApi';
import { HotelReservation, HotelActivity, Pet } from '../../../types';
import { petsApi } from '../../pets/api/petsApi';

const HotelManagementPage = () => {
  const { isDark } = useThemeMode();
  const [reservations, setReservations] = useState<HotelReservation[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialog, setCreateDialog] = useState(false);
  const [activityDialog, setActivityDialog] = useState<HotelReservation | null>(null);
  const [checkOutDialog, setCheckOutDialog] = useState<HotelReservation | null>(null);
  const [formData, setFormData] = useState({
    petId: '',
    serviceType: 'hotel' as 'hotel' | 'daycare',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });
  const [activityData, setActivityData] = useState({
    type: 'meal' as const,
    description: '',
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [resRes, petsRes] = await Promise.all([
        hotelApi.getReservations(),
        petsApi.getPets({ page: 1, limit: 1000 }),
      ]);
      if (resRes.success && resRes.data) setReservations(resRes.data);
      if (petsRes.success && petsRes.data) setPets(petsRes.data.items || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const pet = pets.find(p => p.id === formData.petId);
    if (!pet) return;

    const customer = { id: pet.customerId, name: 'Cliente Mock' };
    const days = Math.ceil((new Date(formData.checkOutDate).getTime() - new Date(formData.checkInDate).getTime()) / (24 * 60 * 60 * 1000));
    const rate = formData.serviceType === 'hotel' ? 80 : 50;

    const newRes = {
      customerId: pet.customerId,
      customerName: customer.name,
      petId: pet.id,
      petName: pet.name,
      serviceType: formData.serviceType,
      checkInDate: formData.checkInDate,
      checkOutDate: formData.checkOutDate,
      status: 'confirmed' as const,
      dailyRate: rate,
      totalDays: days,
      totalAmount: rate * days,
      services: [],
      emergencyContact: { name: customer.name, phone: '(11) 99999-9999' },
    };

    const res = await hotelApi.createReservation(newRes);
    if (res.success) {
      setCreateDialog(false);
      loadData();
      alert('✅ Reserva criada!');
    }
  };

  const handleCheckIn = async (id: string) => {
    const res = await hotelApi.updateReservationStatus(id, 'checked-in');
    if (res.success) {
      loadData();
      alert('✅ Check-in realizado!');
    }
  };

  const handleCheckOut = async () => {
    if (!checkOutDialog) return;

    const res = await hotelApi.updateReservationStatus(checkOutDialog.id, 'checked-out');
    if (res.success) {
      setCheckOutDialog(null);
      loadData();
      alert('✅ Check-out realizado!');
    }
  };

  const handleAddActivity = async () => {
    if (!activityDialog) return;

    const activity = {
      reservationId: activityDialog.id,
      petName: activityDialog.petName,
      activityType: activityData.type,
      description: activityData.description,
      time: activityData.time,
      performedBy: 'Admin',
    };

    const res = await hotelApi.addActivity(activity);
    if (res.success) {
      setActivityDialog(null);
      setActivityData({ type: 'meal', description: '', time: new Date().toTimeString().split(' ')[0].substring(0, 5) });
      alert('✅ Atividade registrada!');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
          🏨 Hotel & Creche
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialog(true)}
          sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
        >
          Nova Reserva
        </Button>
      </Box>

      {loading ? (
        <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
          Carregando...
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {reservations.map(res => (
          <Grid item xs={12} md={6} key={res.id}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '2px solid #12888A' : 'none' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#E47B24' }}><Hotel /></Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{res.petName}</Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>{res.customerName}</Typography>
                    </Box>
                  </Box>
                  <Chip label={res.status} sx={{ bgcolor: res.status === 'checked-in' ? '#4CAF50' : '#FF9800', color: '#FFF' }} />
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 2 }}>
                  📅 {new Date(res.checkInDate).toLocaleDateString()} → {new Date(res.checkOutDate).toLocaleDateString()} ({res.totalDays} dias)
                </Typography>
                <Typography variant="h6" sx={{ color: '#E47B24', mb: 2 }}>R$ {res.totalAmount.toFixed(2)}</Typography>
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {res.status === 'confirmed' && (
                    <Button size="small" startIcon={<CheckCircle />} onClick={() => handleCheckIn(res.id)} sx={{ bgcolor: '#4CAF50', color: '#FFF', '&:hover': { bgcolor: '#388E3C' } }}>
                      Check-in
                    </Button>
                  )}
                  {res.status === 'checked-in' && (
                    <>
                      <Button size="small" startIcon={<NoteAdd />} onClick={() => setActivityDialog(res)} sx={{ bgcolor: '#2196F3', color: '#FFF', '&:hover': { bgcolor: '#1976D2' } }}>
                        Atividade
                      </Button>
                      <Button size="small" startIcon={<ExitToApp />} onClick={() => setCheckOutDialog(res)} sx={{ bgcolor: '#FF9800', color: '#FFF', '&:hover': { bgcolor: '#F57C00' } }}>
                        Check-out
                      </Button>
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          ))}
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          🏨 Nova Reserva
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Pet"
                value={formData.petId}
                onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                {(pets || []).map(p => (
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
                <MenuItem value="hotel">🏨 Hotel (R$ 80/dia)</MenuItem>
                <MenuItem value="daycare">🎨 Creche (R$ 50/dia)</MenuItem>
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
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setCreateDialog(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!formData.petId} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Criar Reserva
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={!!activityDialog} onClose={() => setActivityDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          📝 Registrar Atividade - {activityDialog?.petName}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Tipo de Atividade"
                value={activityData.type}
                onChange={(e) => setActivityData({ ...activityData, type: e.target.value as any })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                <MenuItem value="meal">🍖 Alimentação</MenuItem>
                <MenuItem value="medication">💊 Medicação</MenuItem>
                <MenuItem value="walk">🚶 Passeio</MenuItem>
                <MenuItem value="play">🎾 Brincadeira</MenuItem>
                <MenuItem value="grooming">✂️ Tosa/Banho</MenuItem>
                <MenuItem value="vet-visit">🏥 Visita Veterinária</MenuItem>
                <MenuItem value="note">📝 Observação</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="time"
                label="Horário"
                value={activityData.time}
                onChange={(e) => setActivityData({ ...activityData, time: e.target.value })}
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
                label="Descrição"
                value={activityData.description}
                onChange={(e) => setActivityData({ ...activityData, description: e.target.value })}
                placeholder="Descreva a atividade..."
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& textarea': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setActivityDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleAddActivity} disabled={!activityData.description} sx={{ bgcolor: '#2196F3', '&:hover': { bgcolor: '#1976D2' } }}>
            Registrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Check-out Dialog */}
      <Dialog open={!!checkOutDialog} onClose={() => setCheckOutDialog(null)}>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          👋 Check-out
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
            Confirmar check-out de <strong>{checkOutDialog?.petName}</strong>?
          </Typography>
          <Typography variant="body2" sx={{ color: '#E47B24', mt: 1, fontWeight: 600 }}>
            Total: R$ {checkOutDialog?.totalAmount.toFixed(2)}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setCheckOutDialog(null)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCheckOut} sx={{ bgcolor: '#FF9800', '&:hover': { bgcolor: '#F57C00' } }}>
            Confirmar Check-out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HotelManagementPage;
