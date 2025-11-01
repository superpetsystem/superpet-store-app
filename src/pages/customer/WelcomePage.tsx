import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
} from '@mui/material';
import {
  Pets as PetsIcon,
  Dashboard as DashboardIcon,
  CalendarMonth as CalendarIcon,
  ArrowForward,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { useThemeMode } from '../../context/ThemeContext';
import PetDialog from '../../features/pets/components/PetDialog';

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isDark } = useThemeMode();
  const user = useAppSelector((state) => state.auth.user);
  const [petDialogOpen, setPetDialogOpen] = useState(false);

  const handleAddPet = () => {
    setPetDialogOpen(true);
  };

  const handlePetSaveSuccess = () => {
    // Após cadastrar o pet, vai para o dashboard
    navigate('/customer/dashboard');
  };

  const handleSkip = () => {
    navigate('/customer/dashboard');
  };

  const quickActions = [
    {
      icon: <PetsIcon sx={{ fontSize: 48, color: '#E47B24' }} />,
      title: 'Cadastrar meu Pet',
      description: 'Adicione as informações do seu pet para começar',
      action: handleAddPet,
      primary: true,
    },
    {
      icon: <CalendarIcon sx={{ fontSize: 48, color: '#0E6A6B' }} />,
      title: 'Agendar Serviço',
      description: 'Agende banho, tosa ou consulta veterinária',
      action: () => navigate('/customer/appointments'),
      primary: false,
    },
    {
      icon: <DashboardIcon sx={{ fontSize: 48, color: '#2E7D32' }} />,
      title: 'Ver Dashboard',
      description: 'Explore todas as funcionalidades do sistema',
      action: handleSkip,
      primary: false,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: isDark 
          ? 'linear-gradient(135deg, #0D1117 0%, #1C2128 50%, #0E6A6B 100%)' 
          : 'linear-gradient(135deg, #0E6A6B 0%, #12888A 50%, #E47B24 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="md">
        {/* Welcome Message */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            textAlign: 'center',
            bgcolor: isDark ? '#1C2128' : '#F8F5EE',
            border: isDark ? '2px solid #12888A' : 'none',
            borderRadius: 3,
            boxShadow: 6,
          }}
        >
          <Typography variant="h3" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Bem-vindo ao SuperPet, {user?.name}! 🎉
          </Typography>
          <Typography variant="h6" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 3 }}>
            Estamos felizes em ter você aqui! Vamos começar cadastrando seu pet?
          </Typography>
          <Box
            sx={{
              display: 'inline-block',
              bgcolor: isDark ? 'rgba(228, 123, 36, 0.2)' : '#E8F5E9',
              px: 3,
              py: 1.5,
              borderRadius: 2,
              border: isDark ? '2px solid #E47B24' : '2px solid #2E7D32',
            }}
          >
            <Typography variant="body1" sx={{ color: isDark ? '#E47B24' : '#2E7D32', fontWeight: 600 }}>
              ✓ Conta criada com sucesso!
            </Typography>
          </Box>
        </Paper>

        {/* Quick Actions */}
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: action.primary ? '#E47B24' : (isDark ? '#1C2128' : '#F8F5EE'),
                  color: action.primary ? '#F8F5EE' : (isDark ? '#F8F5EE' : '#1E1E1E'),
                  cursor: 'pointer',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  border: action.primary 
                    ? (isDark ? '3px solid #12888A' : '3px solid #F8F5EE')
                    : (isDark ? '1px solid #12888A' : 'none'),
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                    borderColor: isDark ? '#E47B24' : undefined,
                  },
                }}
                onClick={action.action}
              >
                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                  <Box sx={{ mb: 2 }}>{action.icon}</Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color: action.primary ? '#F8F5EE' : (isDark ? '#12888A' : '#0E6A6B'),
                      mb: 2,
                    }}
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: action.primary ? 'rgba(248,245,238,0.9)' : (isDark ? '#E6E1D6' : '#666'),
                      mb: 2,
                    }}
                  >
                    {action.description}
                  </Typography>
                  <Button
                    variant={action.primary ? 'contained' : 'outlined'}
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: action.primary ? '#F8F5EE' : 'transparent',
                      color: action.primary ? '#E47B24' : (isDark ? '#12888A' : '#0E6A6B'),
                      borderColor: action.primary ? 'transparent' : (isDark ? '#12888A' : '#0E6A6B'),
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: action.primary ? '#FFF' : (isDark ? 'rgba(18, 136, 138, 0.1)' : 'rgba(14, 106, 107, 0.08)'),
                        borderColor: isDark ? '#12888A' : '#0E6A6B',
                      },
                    }}
                  >
                    {action.primary ? 'Começar' : 'Acessar'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Skip Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant="text"
            onClick={handleSkip}
            sx={{
              color: '#F8F5EE',
              fontSize: '1rem',
              fontWeight: 600,
              textDecoration: 'underline',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Pular e ir para o Dashboard
          </Button>
        </Box>
      </Container>

      {/* Pet Dialog */}
      <PetDialog
        open={petDialogOpen}
        onClose={() => setPetDialogOpen(false)}
        preSelectedCustomerId={user?.id}
        onSave={handlePetSaveSuccess}
      />
    </Box>
  );
};

export default WelcomePage;



