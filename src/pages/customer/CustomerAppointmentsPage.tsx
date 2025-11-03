import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton } from '@mui/material';
import { Add, CalendarMonth, Pets, CheckCircle, Schedule, Edit, Delete, Cancel } from '@mui/icons-material';
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
  const [editDialog, setEditDialog] = useState<Appointment | null>(null);
  const [cancelDialog, setCancelDialog] = useState<Appointment | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<Appointment | null>(null);
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
    
    // Carregar agendamentos do tutor
    const res = await appointmentsApi.getAll({ customerId: user.id });
    if (res.success && res.data) {
      // Filtrar apenas agendamentos dos pets deste tutor
      const petAppointments = res.data.filter(apt => pets.some(p => p.id === apt.petId));
      setAppointments(petAppointments);
    }

    setLoading(false);
  };

  const loadServices = async () => {
    const res = await servicesApi.getServices({ page: 1, limit: 1000 });
    if (res.success && res.data) {
      setServices(res.data.data || []);
      console.log('Serviços carregados:', res.data.data);
    }
  };

  const handleCreate = async () => {
    if (!user) return;

    const pet = pets.find(p => p.id === formData.petId);
    const service = services.find(s => s.id === formData.serviceId);
    if (!pet || !service) return;

    // Calculate end time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + service.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    const newAppt = {
      customerId: user.id,
      customerName: user.name,
      petId: pet.id,
      petName: pet.name,
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.type,
      date: formData.date,
      startTime: formData.time,
      endTime: endTime,
      duration: service.duration,
      price: service.price,
      status: 'scheduled' as const,
      notes: formData.notes,
      createdBy: user.email || user.id,
    };

    const res = await appointmentsApi.create(newAppt);
    if (res.success) {
      setDialog(false);
      setFormData({ petId: '', serviceId: '', date: new Date().toISOString().split('T')[0], time: '09:00', notes: '' });
      alert('✅ Agendamento criado! Aguarde confirmação.');
      loadData();
    }
  };

  const openEdit = (appointment: Appointment) => {
    setFormData({
      petId: appointment.petId,
      serviceId: appointment.serviceId,
      date: appointment.date,
      time: appointment.startTime,
      notes: appointment.notes || '',
    });
    setEditDialog(appointment);
  };

  const handleEdit = async () => {
    if (!editDialog || !user) return;

    const pet = pets.find(p => p.id === formData.petId);
    const service = services.find(s => s.id === formData.serviceId);
    if (!pet || !service) return;

    // Calculate end time
    const [hours, minutes] = formData.time.split(':').map(Number);
    const endMinutes = hours * 60 + minutes + service.duration;
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

    const updatedAppt = {
      petId: pet.id,
      petName: pet.name,
      serviceId: service.id,
      serviceName: service.name,
      serviceType: service.type,
      date: formData.date,
      startTime: formData.time,
      endTime: endTime,
      duration: service.duration,
      price: service.price,
      notes: formData.notes,
    };

    const res = await appointmentsApi.update(editDialog.id, updatedAppt);
    if (res.success) {
      setEditDialog(null);
      setFormData({ petId: '', serviceId: '', date: new Date().toISOString().split('T')[0], time: '09:00', notes: '' });
      alert('✅ Agendamento atualizado!');
      loadData();
    }
  };

  const handleCancel = async () => {
    if (!cancelDialog) return;

    const res = await appointmentsApi.updateStatus(cancelDialog.id, 'cancelled');
    if (res.success) {
      setCancelDialog(null);
      alert('✅ Agendamento cancelado!');
      loadData();
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;

    const res = await appointmentsApi.delete(deleteDialog.id);
    if (res.success) {
      setDeleteDialog(null);
      alert('✅ Agendamento excluído!');
      loadData();
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2, alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
            📅 Meus Agendamentos
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E', ...typography.body1 }}>
            Veja e gerencie seus agendamentos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialog(true)}
          sx={{ 
            bgcolor: '#E47B24',
            color: '#F8F5EE',
            fontSize: typography.buttonText,
            '&:hover': { bgcolor: '#C26619' },
          }}
        >
          Novo Agendamento
        </Button>
      </Box>

      {loading ? (
        <Typography sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E', fontSize: typography.body1, textAlign: 'center', py: 4 }}>
          Carregando...
        </Typography>
      ) : appointments.length === 0 ? (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', textAlign: 'center', py: { xs: 4, sm: 6 } }}>
          <CalendarMonth sx={{ fontSize: { xs: 60, sm: 80 }, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
          <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 2, fontSize: typography.h6 }}>
            Você ainda não tem agendamentos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialog(true)}
            sx={{ 
              bgcolor: '#E47B24',
              color: '#F8F5EE',
              fontSize: typography.buttonText,
              '&:hover': { bgcolor: '#C26619' },
            }}
          >
            Fazer Primeiro Agendamento
          </Button>
        </Card>
      ) : (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
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
                    p: { xs: 1, sm: 2 },
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getStatusColor(apt.status) }}>
                      <Pets />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600, fontSize: typography.h6 }}>
                            {apt.startTime} - {apt.petName}
                          </Typography>
                          <Chip
                            label={getStatusLabel(apt.status)}
                            size="small"
                            sx={{ bgcolor: getStatusColor(apt.status), color: '#FFF', fontWeight: 600, fontSize: typography.caption }}
                          />
                        </Box>
                        {/* Ações - apenas para agendamentos futuros */}
                        {(apt.status === 'scheduled' || apt.status === 'confirmed') && (
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => openEdit(apt)} 
                              sx={{ 
                                color: '#2196F3',
                                '&:hover': { bgcolor: 'rgba(33, 150, 243, 0.1)' },
                              }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => setCancelDialog(apt)} 
                              sx={{ 
                                color: '#FF9800',
                                '&:hover': { bgcolor: 'rgba(255, 152, 0, 0.1)' },
                              }}
                            >
                              <Cancel fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              onClick={() => setDeleteDialog(apt)} 
                              sx={{ 
                                color: '#F44336',
                                '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.1)' },
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Box component="span" sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E', fontSize: typography.body2, display: 'block' }}>
                          {apt.serviceName} • {new Date(apt.date + 'T00:00:00').toLocaleDateString('pt-BR')} • {apt.duration} min
                        </Box>
                        <Box component="span" sx={{ color: '#E47B24', fontWeight: 600, fontSize: typography.h5, display: 'block', mt: 0.5 }}>
                          R$ {apt.price?.toFixed(2) || '0.00'}
                        </Box>
                        {apt.notes && (
                          <Box component="span" sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E', fontSize: typography.caption, display: 'block', fontStyle: 'italic', mt: 0.5 }}>
                            📝 {apt.notes}
                          </Box>
                        )}
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
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B', fontSize: typography.h5 }}>
          📅 Novo Agendamento
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2, pt: { xs: 2, sm: 3 } }}>
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
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', p: { xs: 2, sm: 3 } }}>
          <Button onClick={() => setDialog(false)} sx={{ fontSize: typography.buttonText, color: isDark ? '#E6E1D6' : '#1E1E1E' }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreate} 
            disabled={!formData.petId || !formData.serviceId} 
            sx={{ 
              bgcolor: '#E47B24',
              color: '#F8F5EE',
              fontSize: typography.buttonText,
              '&:hover': { bgcolor: '#C26619' },
            }}
          >
            Agendar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editDialog} onClose={() => setEditDialog(null)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B', fontSize: typography.h5 }}>
          ✏️ Editar Agendamento
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2, pt: { xs: 2, sm: 3 } }}>
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
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', p: { xs: 2, sm: 3 } }}>
          <Button onClick={() => setEditDialog(null)} sx={{ fontSize: typography.buttonText, color: isDark ? '#E6E1D6' : '#1E1E1E' }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleEdit} 
            disabled={!formData.petId || !formData.serviceId} 
            sx={{ 
              bgcolor: '#2196F3',
              color: '#F8F5EE',
              fontSize: typography.buttonText,
              '&:hover': { bgcolor: '#1976D2' },
            }}
          >
            Salvar Alterações
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={!!cancelDialog} onClose={() => setCancelDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B', fontSize: typography.h5 }}>
          ⚠️ Desmarcar Agendamento
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2, pt: { xs: 2, sm: 3 } }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E', fontSize: typography.body1 }}>
            Tem certeza que deseja desmarcar este agendamento?
          </Typography>
          {cancelDialog && (
            <Box sx={{ mt: 2, p: 2, bgcolor: isDark ? '#0D1117' : '#FFFFFF', borderRadius: 2, border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0' }}>
              <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600, fontSize: typography.body2 }}>
                {cancelDialog.serviceName}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E', fontSize: typography.caption }}>
                {new Date(cancelDialog.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {cancelDialog.startTime}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', p: { xs: 2, sm: 3 } }}>
          <Button onClick={() => setCancelDialog(null)} sx={{ fontSize: typography.buttonText, color: isDark ? '#E6E1D6' : '#1E1E1E' }}>
            Não
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCancel} 
            sx={{ 
              bgcolor: '#FF9800',
              color: '#F8F5EE',
              fontSize: typography.buttonText,
              '&:hover': { bgcolor: '#F57C00' },
            }}
          >
            Sim, Desmarcar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B', fontSize: typography.h5 }}>
          🗑️ Excluir Agendamento
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2, pt: { xs: 2, sm: 3 } }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E', fontSize: typography.body1 }}>
            Tem certeza que deseja excluir permanentemente este agendamento?
          </Typography>
          {deleteDialog && (
            <Box sx={{ mt: 2, p: 2, bgcolor: isDark ? '#0D1117' : '#FFFFFF', borderRadius: 2, border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0' }}>
              <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600, fontSize: typography.body2 }}>
                {deleteDialog.serviceName}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E', fontSize: typography.caption }}>
                {new Date(deleteDialog.date + 'T00:00:00').toLocaleDateString('pt-BR')} às {deleteDialog.startTime}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', p: { xs: 2, sm: 3 } }}>
          <Button onClick={() => setDeleteDialog(null)} sx={{ fontSize: typography.buttonText, color: isDark ? '#E6E1D6' : '#1E1E1E' }}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleDelete} 
            sx={{ 
              bgcolor: '#F44336',
              color: '#F8F5EE',
              fontSize: typography.buttonText,
              '&:hover': { bgcolor: '#D32F2F' },
            }}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomerAppointmentsPage;
