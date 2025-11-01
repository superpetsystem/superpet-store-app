import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Pets as PetsIcon,
  CalendarMonth as CalendarIcon,
  LocalHospital as MedicalIcon,
  Store as StoreIcon,
  Hotel as HotelIcon,
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <PetsIcon sx={{ fontSize: 48, color: '#E47B24' }} />,
      title: 'Cadastro de Pets',
      description: 'Mantenha todas as informações dos seus pets em um só lugar',
    },
    {
      icon: <CalendarIcon sx={{ fontSize: 48, color: '#0E6A6B' }} />,
      title: 'Agendamento Online',
      description: 'Agende banho, tosa e consultas de forma fácil e rápida',
    },
    {
      icon: <MedicalIcon sx={{ fontSize: 48, color: '#D32F2F' }} />,
      title: 'Carteira de Vacinação',
      description: 'Acompanhe as vacinas e medicações do seu pet',
    },
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 48, color: '#2E7D32' }} />,
      title: 'Loja Online',
      description: 'Compre produtos para seu pet com entrega em casa',
    },
    {
      icon: <HotelIcon sx={{ fontSize: 48, color: '#1976D2' }} />,
      title: 'Hotel & Creche',
      description: 'Hospedagem segura e confortável para seu pet',
    },
    {
      icon: <StarIcon sx={{ fontSize: 48, color: '#FF9800' }} />,
      title: 'Programa de Fidelidade',
      description: 'Ganhe pontos e descontos especiais',
    },
  ];

  const testimonials = [
    {
      name: 'Maria Santos',
      text: 'Excelente atendimento! Meu Rex adora o banho aqui.',
      rating: 5,
    },
    {
      name: 'João Silva',
      text: 'O sistema de agendamento online é muito prático.',
      rating: 5,
    },
    {
      name: 'Ana Costa',
      text: 'Equipe muito atenciosa e carinhosa com os pets!',
      rating: 5,
    },
  ];

  return (
    <Box sx={{ bgcolor: '#F8F5EE', minHeight: '100vh' }}>
      {/* Public Navbar */}
      <PublicNavbar />

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0E6A6B 0%, #12888A 50%, #E47B24 100%)',
          color: '#F8F5EE',
          py: { xs: 8, md: 12 },
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant={isMobile ? 'h3' : 'h2'}
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Bem-vindo ao SuperPet! 🐾
          </Typography>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            sx={{ mb: 4, opacity: 0.95 }}
          >
            Tudo o que seu pet precisa em um único lugar
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonAddIcon />}
              onClick={() => navigate('/register')}
              sx={{
                bgcolor: '#E47B24',
                color: '#F8F5EE',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#D66B1A',
                  transform: 'translateY(-2px)',
                  boxShadow: 6,
                },
                transition: 'all 0.3s',
              }}
            >
              Cadastre-se Grátis
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<CalendarIcon />}
              onClick={() => navigate('/register')}
              sx={{
                borderColor: '#F8F5EE',
                color: '#F8F5EE',
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                '&:hover': {
                  borderColor: '#F8F5EE',
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Agendar Serviço
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{ color: '#0E6A6B', mb: 2 }}
        >
          Nossos Serviços
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          sx={{ color: '#666', mb: 6 }}
        >
          Oferecemos tudo o que seu pet precisa com qualidade e carinho
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  bgcolor: '#FFFFFF',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#0E6A6B', mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials */}
      <Box sx={{ bgcolor: '#FFFFFF', py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight="bold"
            textAlign="center"
            sx={{ color: '#0E6A6B', mb: 2 }}
          >
            O que nossos clientes dizem
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ color: '#666', mb: 6 }}
          >
            Depoimentos de quem confia em nosso trabalho
          </Typography>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    bgcolor: '#F8F5EE',
                    border: '2px solid #E47B24',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', mb: 2 }}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#FFB300', fontSize: 24 }} />
                      ))}
                    </Box>
                    <Typography variant="body1" sx={{ color: '#1E1E1E', mb: 2, fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#E47B24' }}>
                        {testimonial.name.charAt(0)}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#0E6A6B' }}>
                        {testimonial.name}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: '#0E6A6B',
          color: '#F8F5EE',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
            Pronto para começar?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Cadastre-se agora e ganhe 10% de desconto no primeiro serviço!
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/register')}
            sx={{
              bgcolor: '#E47B24',
              color: '#F8F5EE',
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#D66B1A',
                transform: 'translateY(-2px)',
                boxShadow: 6,
              },
              transition: 'all 0.3s',
            }}
          >
            Cadastrar Agora
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: '#1E1E1E', color: '#F8F5EE', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <StoreIcon sx={{ fontSize: 32, color: '#E47B24' }} />
                <Typography variant="h6" fontWeight="bold">
                  SuperPet
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Cuidando do seu pet com amor e profissionalismo desde 2020.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Contato
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                📞 (11) 1234-5678
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                📧 contato@superpet.com
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                📍 São Paulo, SP
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Horário de Funcionamento
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Segunda a Sexta: 8h às 18h
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Sábado: 9h às 15h
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Domingo: Fechado
              </Typography>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4, pt: 4, borderTop: '1px solid rgba(248,245,238,0.2)' }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2025 SuperPet. Todos os direitos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;

