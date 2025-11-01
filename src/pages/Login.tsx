import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import PublicNavbar from '../components/PublicNavbar';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Store,
  Person,
  Lock,
  Info,
} from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';
import { authApi } from '../api/authApi';
import { useThemeMode } from '../context/ThemeContext';

const Login = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isDark } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    dispatch(loginStart());

    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.data) {
        dispatch(loginSuccess(response.data));
        
        // Salva no localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        
        // Redireciona automaticamente baseado no tipo de usuário detectado
        if (response.data.user.role === 'owner') {
          navigate('/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      } else {
        setError(response.error || 'Email ou senha incorretos');
        dispatch(loginFailure(response.error || 'Credenciais inválidas'));
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
      dispatch(loginFailure('Erro ao conectar com o servidor'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PublicNavbar />
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isDark 
            ? 'linear-gradient(135deg, #0D1117 0%, #1C2128 50%, #0E6A6B 100%)'
            : 'linear-gradient(135deg, #0E6A6B 0%, #12888A 50%, #E47B24 100%)',
          p: { xs: 2, sm: 3 },
        }}
      >
      <Card
        sx={{
          maxWidth: 500,
          width: '100%',
          bgcolor: isDark ? '#1C2128' : '#F8F5EE',
          border: isDark ? '2px solid #12888A' : 'none',
          boxShadow: 6,
          borderRadius: { xs: 2, sm: 3 },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo e Título */}
          <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
            <Store sx={{ 
              fontSize: { xs: 48, sm: 64 }, 
              color: '#E47B24', 
              mb: { xs: 1, sm: 2 } 
            }} />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ 
                color: isDark ? '#12888A' : '#0E6A6B', 
                mb: 0.5,
                fontSize: { xs: '1.75rem', sm: '2.125rem' }
              }}
            >
              SuperPet
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDark ? '#E6E1D6' : '#1E1E1E',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Sistema de Gestão
            </Typography>
          </Box>

          {/* Info de Credenciais de Teste */}
          <Box sx={{ mb: 3, bgcolor: isDark ? 'rgba(228, 123, 36, 0.1)' : 'rgba(14, 106, 107, 0.05)', p: 2, borderRadius: 2, border: `1px dashed ${isDark ? '#E47B24' : '#0E6A6B'}` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Info sx={{ fontSize: 20, color: isDark ? '#E47B24' : '#0E6A6B' }} />
              <Typography variant="subtitle2" fontWeight="600" sx={{ color: isDark ? '#E47B24' : '#0E6A6B' }}>
                Credenciais de Teste
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Chip 
                  label="Loja" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#0E6A6B', 
                    color: '#F8F5EE', 
                    fontWeight: 600,
                    mr: 1,
                  }} 
                />
                <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  owner@superpet.com / 123456
                </Typography>
              </Box>
              <Box>
                <Chip 
                  label="Cliente (Tutor)" 
                  size="small" 
                  sx={{ 
                    bgcolor: '#E47B24', 
                    color: '#F8F5EE', 
                    fontWeight: 600,
                    mr: 1,
                  }} 
                />
                <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  customer@superpet.com / 123456
                </Typography>
              </Box>
            </Box>
            <Typography variant="caption" sx={{ 
              color: isDark ? '#E6E1D6' : '#666', 
              display: 'block', 
              mt: 1.5,
              fontStyle: 'italic',
              textAlign: 'center',
            }}>
              💡 Novos clientes podem se cadastrar abaixo
            </Typography>
          </Box>

          {/* Formulário */}
          <form onSubmit={handleLogin}>
            {/* Campo Email */}
            <Box sx={{ mb: 3 }}>
              {isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Person sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontSize: 20 }} />
                  <Typography 
                    variant="body2" 
                    fontWeight="600" 
                    sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}
                  >
                    Email
                  </Typography>
                </Box>
              )}
              
              <TextField
                fullWidth
                label={!isMobile ? 'Email' : ''}
                placeholder={isMobile ? 'Digite seu email' : ''}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                InputProps={!isMobile ? {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
                    </InputAdornment>
                  ),
                } : {}}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: isMobile ? 'auto' : '56px',
                    backgroundColor: isDark ? '#0D1117' : '#FFFFFF',
                    '& fieldset': {
                      borderColor: isDark ? '#12888A' : '#0E6A6B',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? '#12888A' : '#0E6A6B',
                      borderWidth: '1.5px',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#E47B24',
                      borderWidth: '2px',
                    },
                    '& input': {
                      color: isDark ? '#F8F5EE' : '#1E1E1E',
                      fontWeight: 500,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDark ? '#12888A' : '#0E6A6B',
                    '&.Mui-focused': {
                      color: '#E47B24',
                      fontWeight: 600,
                    },
                  },
                }}
              />
            </Box>

            {/* Campo Senha */}
            <Box sx={{ mb: 3 }}>
              {isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Lock sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontSize: 20 }} />
                  <Typography 
                    variant="body2" 
                    fontWeight="600" 
                    sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}
                  >
                    Senha
                  </Typography>
                </Box>
              )}
              
              <TextField
                fullWidth
                label={!isMobile ? 'Senha' : ''}
                placeholder={isMobile ? 'Digite sua senha' : ''}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                InputProps={{
                  ...(!isMobile && {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
                      </InputAdornment>
                    ),
                  }),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: isMobile ? 'auto' : '56px',
                    backgroundColor: isDark ? '#0D1117' : '#FFFFFF',
                    '& fieldset': {
                      borderColor: isDark ? '#12888A' : '#0E6A6B',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: isDark ? '#12888A' : '#0E6A6B',
                      borderWidth: '1.5px',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#E47B24',
                      borderWidth: '2px',
                    },
                    '& input': {
                      color: isDark ? '#F8F5EE' : '#1E1E1E',
                      fontWeight: 500,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: isDark ? '#12888A' : '#0E6A6B',
                    '&.Mui-focused': {
                      color: '#E47B24',
                      fontWeight: 600,
                    },
                  },
                  '& .MuiIconButton-root': {
                    color: isDark ? '#12888A' : '#0E6A6B',
                  },
                }}
              />
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  bgcolor: isDark ? 'rgba(211, 47, 47, 0.2)' : undefined,
                  color: isDark ? '#F8F5EE' : undefined,
                  '& .MuiAlert-icon': {
                    color: isDark ? '#ff6b6b' : undefined,
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                height: 56,
                fontSize: '1.1rem',
                bgcolor: '#0E6A6B',
                color: '#F8F5EE',
                fontWeight: 'bold',
                mb: 2,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#0A5152',
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
                '&:disabled': {
                  bgcolor: '#0E6A6B',
                  opacity: 0.7,
                },
                transition: 'all 0.3s',
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: '#F8F5EE' }} />
              ) : (
                'Entrar'
              )}
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
              <Button
                variant="text"
                disabled={loading}
                sx={{
                  color: isDark ? '#E47B24' : '#E47B24',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: 'rgba(228, 123, 36, 0.08)',
                    textDecoration: 'underline',
                  },
                }}
              >
                Esqueceu a senha?
              </Button>
              <Button
                variant="text"
                onClick={() => navigate('/register')}
                disabled={loading}
                startIcon={<Person />}
                sx={{
                  color: '#E47B24',
                  fontSize: { xs: '0.85rem', sm: '0.95rem' },
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: 'rgba(228, 123, 36, 0.1)',
                    textDecoration: 'underline',
                  },
                }}
              >
                Sou Cliente - Criar Conta
              </Button>
            </Box>
          </form>

          {/* Footer */}
          <Box sx={{ 
            mt: 3, 
            pt: 2, 
            borderTop: `1px solid ${isDark ? '#12888A' : '#0E6A6B'}`,
            textAlign: 'center',
          }}>
            <Typography variant="caption" sx={{ 
              color: isDark ? '#E6E1D6' : '#666',
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
            }}>
              SuperPet © 2025 - Sistema de Gestão
            </Typography>
          </Box>
        </CardContent>
      </Card>
      </Box>
    </>
  );
};

export default Login;

