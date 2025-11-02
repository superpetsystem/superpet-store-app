import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { Add, CalendarMonth, Pets, CheckCircle, Schedule } from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';
import { appointmentsApi } from '../../features/appointments/api/appointmentsApi';
import { servicesApi } from '../../features/services/api/servicesApi';
import { Appointment } from '../../types';

const CustomerAppointmentsPage = () => {
  const { isDark } = useThemeMode();
  const user = useAppSelector(state => state.auth.user);
  const { pets } = useAppSelector(state => state.pets);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    petId: '',
    serviceId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    notes: '',
  });

  useEffect(() => {
    if (user) loadData();
    loadServices();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    
    // Carregar agendamentos de todos os pets do tutor
    const allAppointments: Appointment[] = [];
    
    for (const pet of pets) {
      const res = await appointmentsApi.getByCustomer(user.id);
      if (res.success && res.data) {
        // Filtrar apenas agendamentos dos pets deste tutor
        const petAppointments = res.data.filter(apt => pets.some(p => p.id === apt.petId));
        allAppointments.push(...petAppointments);
      }
    }

    // Remover duplicados
    const unique = allAppointments.filter((apt, index, self) => 
      index === self.findIndex(a => a.id === apt.id)
    );

    setAppointments(unique);
    setLoading(false);
  };

  const loadServices = async () => {
    const res = await servicesApi.getServices({ page: 1, limit: 1000 });
    if (res.success && res.data) setServices(res.data.items || []);
  };

  const handleCreate = async () => {
    if (!user) return;

    const pet = pets.find(p => p.id === formData.petId);
    const service = services.find(s => s.id === formData.serviceId);
    if (!pet || !service) return;

    const newAppt = {
      customerId: user.id,
      customerName: user.name,
      petId: pet.id,
      petName: pet.name,
      serviceId: service.id,
      serviceName: service.name,
      date: formData.date,
      time: formData.time,
      duration: service.duration,
      price: service.price,
      status: 'scheduled' as const,
      notes: formData.notes,
    };

    const res = await appointmentsApi.create(newAppt);
    if (res.success) {
      setDialog(false);
      setFormData({ petId: '', serviceId: '', date: new Date().toISOString().split('T')[0], time: '09:00', notes: '' });
      alert('✅ Agendamento criado! Aguarde confirmação.');
      loadData(); // Recarregar
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      scheduled: '#2196F3',
      confirmed: '#4CAF50',
      'in-progress': '#FF9800',
      completed: '#9C27B0',
      cancelled: '#F44336',
      'no-show': '#757575',
    };
    return colors[status as keyof typeof colors] || '#999';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      scheduled: 'Agendado',
      confirmed: 'Confirmado',
      'in-progress': 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      'no-show': 'Não Compareceu',
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
            📅 Meus Agendamentos
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Veja e gerencie seus agendamentos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialog(true)}
          sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
        >
          Novo Agendamento
        </Button>
      </Box>

      {loading ? (
        <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
          Carregando...
        </Typography>
      ) : appointments.length === 0 ? (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', textAlign: 'center', py: 6 }}>
          <CalendarMonth sx={{ fontSize: 80, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 2 }}>
            Você ainda não tem agendamentos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialog(true)}
            sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
          >
            Fazer Primeiro Agendamento
          </Button>
        </Card>
      ) : (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <CardContent>
            <List sx={{ p: 0 }}>
              {appointments.sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`)).map((apt, index) => (
                <ListItem
                  key={apt.id}
                  sx={{
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    borderRadius: 2,
                    mb: index < appointments.length - 1 ? 2 : 0,
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(apt.status) }}>
                      <Pets />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                        <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>
                          {apt.startTime} - {apt.petName}
                        </Typography>
                        <Chip
                          label={getStatusLabel(apt.status)}
                          size="small"
                          sx={{ bgcolor: getStatusColor(apt.status), color: '#FFF', fontWeight: 600 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                          {apt.serviceName} • {new Date(apt.date + 'T00:00:00').toLocaleDateString('pt-BR')} • {apt.duration} min
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#E47B24', fontWeight: 600, mt: 0.5 }}>
                          R$ {apt.price.toFixed(2)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          📅 Novo Agendamento
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
                {(pets || []).map(p => (
                  <MenuItem key={p.id} value={p.id}>🐾 {p.name}</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Serviço"
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' } },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
              {(services || []).map(s => (
                <MenuItem key={s.id} value={s.id}>{s.name} - R$ {s.price.toFixed(2)}</MenuItem>
              ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="date"
                label="Data"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                type="time"
                label="Horário"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
                label="Observações"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Alguma observação especial?"
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
          <Button variant="contained" onClick={handleCreate} disabled={!formData.petId || !formData.serviceId} sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}>
            Agendar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerAppointmentsPage;
