import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarMonth,
  Pets,
  CheckCircle,
  Schedule,
  Cancel,
  PersonOff,
  ChevronLeft,
  ChevronRight,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { useAppointments } from '../hooks/useAppointments';
import { Appointment, AppointmentStatus } from '../../../types';

interface AppointmentsPageProps {
  headerAction?: React.ReactNode;
}

const AppointmentsPage: React.FC<AppointmentsPageProps> = ({ headerAction }) => {
  const { isDark } = useThemeMode();
  const { appointments, loading, loadAppointments, changeStatus, deleteAppointment } = useAppointments();
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'day' | 'all'>('day');
  const [deleteDialog, setDeleteDialog] = useState<Appointment | null>(null);
  const [cancelDialog, setCancelDialog] = useState<Appointment | null>(null);

  useEffect(() => {
    console.log('Carregando agendamentos - Modo:', viewMode, 'Data:', selectedDate);
    if (viewMode === 'day') {
      loadAppointments({ date: selectedDate });
    } else {
      // Carregar todos (últimos 30 dias)
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const endDate = new Date().toISOString().split('T')[0];
      loadAppointments({ startDate, endDate });
    }
  }, [selectedDate, viewMode, loadAppointments]);

  useEffect(() => {
    console.log('Agendamentos carregados:', appointments);
  }, [appointments]);

  const filteredAppointments = appointments.filter(
    a => statusFilter === 'all' || a.status === statusFilter
  );

  console.log('Agendamentos filtrados:', filteredAppointments);

  const getStatusColor = (status: AppointmentStatus) => {
    const colors = {
      scheduled: '#2196F3',
      confirmed: '#4CAF50',
      'in-progress': '#FF9800',
      completed: '#9C27B0',
      cancelled: '#F44336',
      'no-show': '#757575',
    };
    return colors[status];
  };

  const getStatusIcon = (status: AppointmentStatus) => {
    const icons = {
      scheduled: <Schedule />,
      confirmed: <CheckCircle />,
      'in-progress': <Schedule />,
      completed: <CheckCircle />,
      cancelled: <Cancel />,
      'no-show': <PersonOff />,
    };
    return icons[status];
  };

  const getStatusLabel = (status: AppointmentStatus) => {
    const labels = {
      scheduled: 'Agendado',
      confirmed: 'Confirmado',
      'in-progress': 'Em Andamento',
      completed: 'Concluído',
      cancelled: 'Cancelado',
      'no-show': 'Não Compareceu',
    };
    return labels[status];
  };

  const stats = {
    total: filteredAppointments.length,
    scheduled: filteredAppointments.filter(a => a.status === 'scheduled').length,
    confirmed: filteredAppointments.filter(a => a.status === 'confirmed').length,
    completed: filteredAppointments.filter(a => a.status === 'completed').length,
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate.toISOString().split('T')[0]);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' });
  };

  const handleCancel = async () => {
    if (!cancelDialog) return;
    
    const response = await changeStatus(cancelDialog.id, 'cancelled');
    if (response.success) {
      setCancelDialog(null);
      alert('✅ Agendamento cancelado!');
      if (viewMode === 'day') {
        loadAppointments({ date: selectedDate });
      } else {
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const endDate = new Date().toISOString().split('T')[0];
        loadAppointments({ startDate, endDate });
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    
    const response = await deleteAppointment(deleteDialog.id);
    if (response.success) {
      setDeleteDialog(null);
      alert('✅ Agendamento excluído!');
      if (viewMode === 'day') {
        loadAppointments({ date: selectedDate });
      } else {
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const endDate = new Date().toISOString().split('T')[0];
        loadAppointments({ startDate, endDate });
      }
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 0.5, ...typography.h4 }}
          >
            📅 Agenda de Serviços
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Gerencie agendamentos e horários
          </Typography>
        </Box>

        {headerAction || (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#E47B24',
              color: '#F8F5EE',
              fontWeight: 600,
              '&:hover': { bgcolor: '#C26619' },
            }}
            onClick={() => alert('Funcionalidade de criar agendamento em desenvolvimento')}
          >
            Novo Agendamento
          </Button>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total do Dia', value: stats.total, color: '#0E6A6B', icon: <CalendarMonth /> },
          { label: 'Agendados', value: stats.scheduled, color: '#2196F3', icon: <Schedule /> },
          { label: 'Confirmados', value: stats.confirmed, color: '#4CAF50', icon: <CheckCircle /> },
          { label: 'Concluídos', value: stats.completed, color: '#9C27B0', icon: <CheckCircle /> },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{
              bgcolor: isDark ? '#1C2128' : '#F8F5EE',
              border: isDark ? `1px solid ${stat.color}` : 'none',
              borderLeft: `4px solid ${stat.color}`,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Filtros e Data Selector */}
      <Card sx={{
        bgcolor: isDark ? '#1C2128' : '#F8F5EE',
        border: isDark ? '1px solid #12888A' : 'none',
        mb: 3,
      }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            {/* Date Selector */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => changeDate(-1)} sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
                  <ChevronLeft />
                </IconButton>
                
                <TextField
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  size="small"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                      '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                      '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                    },
                  }}
                />
                
                <IconButton onClick={() => changeDate(1)} sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
                  <ChevronRight />
                </IconButton>
                
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  sx={{
                    borderColor: isDark ? '#12888A' : '#0E6A6B',
                    color: isDark ? '#12888A' : '#0E6A6B',
                  }}
                >
                  Hoje
                </Button>
                
                <Button
                  variant={viewMode === 'all' ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setViewMode(viewMode === 'day' ? 'all' : 'day')}
                  sx={{
                    bgcolor: viewMode === 'all' ? '#E47B24' : 'transparent',
                    borderColor: viewMode === 'all' ? '#E47B24' : (isDark ? '#12888A' : '#0E6A6B'),
                    color: viewMode === 'all' ? '#F8F5EE' : (isDark ? '#12888A' : '#0E6A6B'),
                    '&:hover': {
                      bgcolor: viewMode === 'all' ? '#C26619' : 'rgba(228, 123, 36, 0.1)',
                    },
                  }}
                >
                  {viewMode === 'day' ? 'Ver Todos' : 'Por Dia'}
                </Button>
              </Box>
            </Grid>

            {/* Status Filter */}
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                  },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                  '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                }}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="scheduled">Agendados</MenuItem>
                <MenuItem value="confirmed">Confirmados</MenuItem>
                <MenuItem value="in-progress">Em Andamento</MenuItem>
                <MenuItem value="completed">Concluídos</MenuItem>
                <MenuItem value="cancelled">Cancelados</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Typography 
            variant="body2" 
            sx={{ color: isDark ? '#E47B24' : '#E47B24', fontWeight: 600, mt: 2, textTransform: 'capitalize' }}
          >
            {formatDate(selectedDate)}
          </Typography>
        </CardContent>
      </Card>

      {/* Lista de Agendamentos */}
      <Card sx={{
        bgcolor: isDark ? '#1C2128' : '#F8F5EE',
        border: isDark ? '1px solid #12888A' : 'none',
      }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            {viewMode === 'day' ? 'Agendamentos do Dia' : 'Todos os Agendamentos (Últimos 30 dias)'}
          </Typography>

          {loading ? (
            <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
              Carregando...
            </Typography>
          ) : filteredAppointments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CalendarMonth sx={{ fontSize: 64, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
              <Typography sx={{ color: isDark ? '#E6E1D6' : '#999', mb: 2 }}>
                Nenhum agendamento encontrado para esta data
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setViewMode('all')}
                sx={{
                  borderColor: '#E47B24',
                  color: '#E47B24',
                  '&:hover': {
                    bgcolor: 'rgba(228, 123, 36, 0.1)',
                  },
                }}
              >
                Ver Todos os Agendamentos
              </Button>
              <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block', mt: 2 }}>
                Total de agendamentos carregados: {appointments.length}
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredAppointments
                .sort((a, b) => a.startTime.localeCompare(b.startTime))
                .map((appointment, index) => (
                  <ListItem
                    key={appointment.id}
                    sx={{
                      bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                      borderRadius: 2,
                      mb: index < filteredAppointments.length - 1 ? 2 : 0,
                      border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                      '&:hover': {
                        borderColor: '#E47B24',
                        boxShadow: 2,
                      },
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {appointment.status === 'scheduled' && (
                          <IconButton size="small" onClick={() => setCancelDialog(appointment)} sx={{ color: '#FF9800' }}>
                            <Cancel />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => setDeleteDialog(appointment)} sx={{ color: '#F44336' }}>
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getStatusColor(appointment.status) }}>
                        <Pets />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                            {appointment.startTime} - {appointment.endTime}
                          </Typography>
                          <Chip
                            icon={getStatusIcon(appointment.status)}
                            label={getStatusLabel(appointment.status)}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(appointment.status),
                              color: '#FFF',
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body1" sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 600, display: 'block' }}>
                            🐾 {appointment.petName} ({appointment.customerName})
                          </Typography>
                          <Typography component="span" variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block' }}>
                            {appointment.serviceName} • {appointment.duration} min
                            {viewMode === 'all' && ` • ${new Date(appointment.date + 'T00:00:00').toLocaleDateString('pt-BR')}`}
                          </Typography>
                          {appointment.employeeName && (
                            <Typography component="span" variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block' }}>
                              👤 {appointment.employeeName}
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

      {/* Cancel Dialog */}
      <Dialog open={!!cancelDialog} onClose={() => setCancelDialog(null)}>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          ⚠️ Cancelar Agendamento
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
            Confirma cancelamento do agendamento de <strong>{cancelDialog?.petName}</strong> para <strong>{cancelDialog?.serviceName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setCancelDialog(null)}>Não</Button>
          <Button variant="contained" onClick={handleCancel} sx={{ bgcolor: '#FF9800', '&:hover': { bgcolor: '#F57C00' } }}>
            Sim, Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onClose={() => setDeleteDialog(null)}>
        <DialogTitle sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
          🗑️ Excluir Agendamento
        </DialogTitle>
        <DialogContent sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', mt: 2 }}>
          <Typography sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
            Confirma exclusão permanente do agendamento de <strong>{deleteDialog?.petName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
          <Button onClick={() => setDeleteDialog(null)}>Não</Button>
          <Button variant="contained" onClick={handleDelete} sx={{ bgcolor: '#F44336', '&:hover': { bgcolor: '#D32F2F' } }}>
            Sim, Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AppointmentsPage;

