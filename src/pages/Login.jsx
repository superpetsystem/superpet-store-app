import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Store,
  Person,
  Lock,
} from '@mui/icons-material'

const Login = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')

    // Validação simples
    if (!email || !password) {
      setError('Por favor, preencha todos os campos')
      return
    }

    // Login fake - em produção, isso seria uma chamada de API
    if (email === 'admin@superpet.com' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', email)
      navigate('/dashboard')
    } else {
      setError('Email ou senha inválidos')
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0E6A6B 0%, #12888A 50%, #E47B24 100%)',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          bgcolor: '#F8F5EE',
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
                color: '#0E6A6B', 
                mb: 0.5,
                fontSize: { xs: '1.75rem', sm: '2.125rem' }
              }}
            >
              SuperPet
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#1E1E1E',
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}
            >
              Portal Loja
            </Typography>
          </Box>

          {/* Formulário */}
          <form onSubmit={handleLogin}>
            {/* Campo Email */}
            <Box sx={{ mb: 3 }}>
              {/* Label + Ícone (Apenas Mobile) */}
              {isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Person sx={{ color: '#0E6A6B', fontSize: 20 }} />
                  <Typography 
                    variant="body2" 
                    fontWeight="600" 
                    sx={{ color: '#0E6A6B' }}
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
                InputProps={!isMobile ? {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#0E6A6B' }} />
                    </InputAdornment>
                  ),
                } : {}}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: isMobile ? 'auto' : '56px',
                    backgroundColor: '#FFFFFF',
                    '& fieldset': {
                      borderColor: '#0E6A6B',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#0E6A6B',
                      borderWidth: '1.5px',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#E47B24',
                      borderWidth: '2px',
                    },
                    '& input': {
                      color: '#1E1E1E',
                      fontWeight: 500,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#0E6A6B',
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
              {/* Label + Ícone (Apenas Mobile) */}
              {isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Lock sx={{ color: '#0E6A6B', fontSize: 20 }} />
                  <Typography 
                    variant="body2" 
                    fontWeight="600" 
                    sx={{ color: '#0E6A6B' }}
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
                InputProps={{
                  ...(!isMobile && {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#0E6A6B' }} />
                      </InputAdornment>
                    ),
                  }),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: isMobile ? 'auto' : '56px',
                    backgroundColor: '#FFFFFF',
                    '& fieldset': {
                      borderColor: '#0E6A6B',
                      borderWidth: '1px',
                    },
                    '&:hover fieldset': {
                      borderColor: '#0E6A6B',
                      borderWidth: '1.5px',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#E47B24',
                      borderWidth: '2px',
                    },
                    '& input': {
                      color: '#1E1E1E',
                      fontWeight: 500,
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#0E6A6B',
                    '&.Mui-focused': {
                      color: '#E47B24',
                      fontWeight: 600,
                    },
                  },
                }}
              />
            </Box>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
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
                transition: 'all 0.3s',
              }}
            >
              Entrar
            </Button>

            <Button
              fullWidth
              variant="text"
              sx={{
                color: '#E47B24',
                fontSize: '0.95rem',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(228, 123, 36, 0.08)',
                  textDecoration: 'underline',
                },
              }}
            >
              Esqueceu a senha?
            </Button>
          </form>

          {/* Info de teste */}
          <Box
            sx={{
              mt: { xs: 3, sm: 4 },
              p: { xs: 1.5, sm: 2 },
              bgcolor: '#F2EBDD',
              borderRadius: 2,
              border: '1px solid #E47B24',
            }}
          >
            <Typography
              variant="caption"
              sx={{ 
                color: '#1E1E1E', 
                display: 'block', 
                textAlign: 'center',
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                lineHeight: 1.6,
              }}
            >
              <strong>Credenciais de teste:</strong>
              <br />
              Email: admin@superpet.com
              <br />
              Senha: admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Login

