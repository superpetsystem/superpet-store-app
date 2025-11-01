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
        p: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          bgcolor: '#F8F5EE',
          boxShadow: 6,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo e Título */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Store sx={{ fontSize: 64, color: '#E47B24', mb: 2 }} />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: '#0E6A6B', mb: 1 }}
            >
              SuperPet
            </Typography>
            <Typography variant="body2" sx={{ color: '#1E1E1E' }}>
              Painel de Administração
            </Typography>
          </Box>

          {/* Formulário */}
          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#0E6A6B' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#0E6A6B',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0E6A6B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0E6A6B',
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#0E6A6B' }} />
                    </InputAdornment>
                  ),
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
                    '&:hover fieldset': {
                      borderColor: '#0E6A6B',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#0E6A6B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#0E6A6B',
                  },
                }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
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
                '&:hover': {
                  bgcolor: '#0A5152',
                },
              }}
            >
              Entrar
            </Button>

            <Button
              fullWidth
              variant="text"
              sx={{
                color: '#E47B24',
                '&:hover': {
                  bgcolor: 'transparent',
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
              mt: 4,
              p: 2,
              bgcolor: '#F2EBDD',
              borderRadius: 2,
              border: '1px solid #E47B24',
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: '#1E1E1E', display: 'block', textAlign: 'center' }}
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

