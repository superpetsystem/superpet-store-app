import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
} from '@mui/material';
import {
  Pets as PetsIcon,
  CalendarMonth as CalendarIcon,
  Notifications as NotificationsIcon,
  LocalHospital as MedicalIcon,
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { useThemeMode } from '../../context/ThemeContext';

const CustomerDashboardPage = () => {
  const navigate = useNavigate();
  const { isDark } = useThemeMode();
  const user = useAppSelector((state) => state.auth.user);

  // Dados mockados para demonstração
  const stats = [
    { label: 'Meus Pets', value: '3', icon: <PetsIcon />, color: '#E47B24', path: '/customer/pets' },
    { label: 'Próximos Agendamentos', value: '2', icon: <CalendarIcon />, color: '#0E6A6B', path: '/customer/appointments' },
    { label: 'Vacinas Pendentes', value: '1', icon: <MedicalIcon />, color: '#D32F2F', path: '/customer/vaccinations' },
    { label: 'Pontos de Fidelidade', value: '450', icon: <TrendingUpIcon />, color: '#2E7D32', path: '/customer/loyalty' },
  ];

  const upcomingAppointments = [
    {
      id: '1',
      pet: 'Rex',
      service: 'Banho e Tosa',
      date: '15/11/2025',
      time: '14:00',
      status: 'confirmado',
    },
    {
      id: '2',
      pet: 'Luna',
      service: 'Consulta Veterinária',
      date: '18/11/2025',
      time: '10:30',
      status: 'pendente',
    },
  ];

  const recentNotifications = [
    {
      id: '1',
      title: 'Lembrete de Vacina',
      message: 'Rex precisa tomar a vacina antirrábica em 7 dias',
      time: 'Há 2 horas',
      type: 'warning',
    },
    {
      id: '2',
      title: 'Agendamento Confirmado',
      message: 'Seu agendamento para banho e tosa foi confirmado',
      time: 'Há 5 horas',
      type: 'success',
    },
    {
      id: '3',
      title: 'Promoção Especial',
      message: 'Ganhe 20% de desconto em rações premium esta semana!',
      time: 'Ontem',
      type: 'info',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1 }}>
          Bem-vindo, {user?.name}!
        </Typography>
        <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
          Aqui está um resumo das suas atividades no SuperPet
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card
              onClick={() => navigate(stat.path)}
              sx={{
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                border: isDark ? `1px solid ${stat.color}` : 'none',
                borderLeft: `4px solid ${stat.color}`,
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  borderColor: stat.color,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
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

      <Grid container spacing={3}>
        {/* Próximos Agendamentos */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: isDark ? '#1C2128' : '#F8F5EE', 
            border: isDark ? '1px solid #12888A' : 'none',
            borderRadius: 2 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
                Próximos Agendamentos
              </Typography>
              <Button
                variant="contained"
                size="small"
                onClick={() => navigate('/customer/appointments')}
                sx={{
                  bgcolor: '#E47B24',
                  color: '#F8F5EE',
                  '&:hover': { bgcolor: '#D66B1A' },
                }}
              >
                Ver Todos
              </Button>
            </Box>

            <List>
              {upcomingAppointments.map((appointment, index) => (
                <ListItem
                  key={appointment.id}
                  sx={{
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    borderRadius: 2,
                    mb: index < upcomingAppointments.length - 1 ? 2 : 0,
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#E47B24' }}>
                      <PetsIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography fontWeight="600" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
                          {appointment.pet}
                        </Typography>
                        <Chip
                          label={appointment.status}
                          size="small"
                          sx={{
                            bgcolor: appointment.status === 'confirmado' ? '#4CAF50' : '#FFA726',
                            color: '#FFF',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" component="span" sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 500 }}>
                          {appointment.service}
                        </Typography>
                        <br />
                        <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                          {appointment.date} às {appointment.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>

            {upcomingAppointments.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CalendarIcon sx={{ fontSize: 64, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
                <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>Nenhum agendamento próximo</Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/customer/appointments')}
                  sx={{
                    mt: 2,
                    bgcolor: '#E47B24',
                    color: '#F8F5EE',
                    '&:hover': { bgcolor: '#D66B1A' },
                  }}
                >
                  Agendar Serviço
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Notificações Recentes */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: isDark ? '#1C2128' : '#F8F5EE', 
            border: isDark ? '1px solid #12888A' : 'none',
            borderRadius: 2 
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <NotificationsIcon sx={{ color: '#E47B24', mr: 1 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
                Notificações
              </Typography>
            </Box>

            <List>
              {recentNotifications.map((notification, index) => (
                <ListItem
                  key={notification.id}
                  sx={{
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    borderRadius: 2,
                    mb: index < recentNotifications.length - 1 ? 2 : 0,
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="600" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
                      {notification.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                      {notification.time}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                    {notification.message}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 3, 
            bgcolor: isDark ? '#1C2128' : '#F8F5EE', 
            border: isDark ? '1px solid #12888A' : 'none',
            borderRadius: 2 
          }}>
            <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
              Ações Rápidas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<CalendarIcon />}
                  onClick={() => navigate('/customer/appointments')}
                  sx={{
                    bgcolor: '#0E6A6B',
                    color: '#F8F5EE',
                    py: 2,
                    '&:hover': { bgcolor: '#0A5152' },
                  }}
                >
                  Agendar
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => navigate('/customer/shop')}
                  sx={{
                    bgcolor: '#E47B24',
                    color: '#F8F5EE',
                    py: 2,
                    '&:hover': { bgcolor: '#D66B1A' },
                  }}
                >
                  Loja
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<PetsIcon />}
                  onClick={() => navigate('/customer/pets')}
                  sx={{
                    bgcolor: '#2E7D32',
                    color: '#F8F5EE',
                    py: 2,
                    '&:hover': { bgcolor: '#1B5E20' },
                  }}
                >
                  Meus Pets
                </Button>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<MedicalIcon />}
                  onClick={() => navigate('/customer/vaccinations')}
                  sx={{
                    bgcolor: '#D32F2F',
                    color: '#F8F5EE',
                    py: 2,
                    '&:hover': { bgcolor: '#B71C1C' },
                  }}
                >
                  Vacinas
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDashboardPage;



