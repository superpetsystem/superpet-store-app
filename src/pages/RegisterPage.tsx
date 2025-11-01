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
  Stepper,
  Step,
  StepLabel,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Store,
  Person,
  Lock,
  Email,
  Phone as PhoneIcon,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import { useAppDispatch } from '../store/hooks';
import { loginSuccess } from '../store/slices/authSlice';
import { authApi } from '../api/authApi';
import { formatPhone, formatCPF } from '../features/customers/helpers/formatters';
import { validateEmail, validatePhone, validateCPF, validateRequired } from '../features/customers/helpers/validators';

const RegisterPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redireciona se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/customer/welcome');
    }
  }, [isAuthenticated, navigate]);

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const steps = ['Dados Pessoais', 'Contato', 'Senha'];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpa erro do campo
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    setError('');
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 0) {
      // Validar nome e CPF
      if (!validateRequired(formData.name)) {
        errors.name = 'Nome é obrigatório';
      }
      if (formData.cpf && !validateCPF(formData.cpf)) {
        errors.cpf = 'CPF inválido';
      }
    }

    if (step === 1) {
      // Validar email e telefone
      if (!validateRequired(formData.email)) {
        errors.email = 'Email é obrigatório';
      } else if (!validateEmail(formData.email)) {
        errors.email = 'Email inválido';
      }

      if (!validateRequired(formData.phone)) {
        errors.phone = 'Telefone é obrigatório';
      } else if (!validatePhone(formData.phone)) {
        errors.phone = 'Telefone inválido';
      }
    }

    if (step === 2) {
      // Validar senha
      if (!validateRequired(formData.password)) {
        errors.password = 'Senha é obrigatória';
      } else if (formData.password.length < 6) {
        errors.password = 'Senha deve ter no mínimo 6 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'As senhas não conferem';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateStep(2)) {
      return;
    }

    setLoading(true);

    try {
      // Registrar usuário
      const registerResponse = await authApi.register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        cpf: formData.cpf || undefined,
        password: formData.password,
      });

      if (registerResponse.success && registerResponse.data) {
        // Login automático após registro
        dispatch(loginSuccess(registerResponse.data));
        
        // Salva no localStorage
        localStorage.setItem('token', registerResponse.data.token);
        localStorage.setItem('userRole', registerResponse.data.user.role);
        
        // Redireciona para página de boas-vindas
        navigate('/customer/welcome');
      } else {
        setError(registerResponse.error || 'Erro ao cadastrar');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome Completo *"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                error={!!fieldErrors.name}
                helperText={fieldErrors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: '#0E6A6B' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CPF (opcional)"
                value={formData.cpf}
                onChange={(e) => handleChange('cpf', formatCPF(e.target.value))}
                error={!!fieldErrors.cpf}
                helperText={fieldErrors.cpf || '123.456.789-00'}
                placeholder="123.456.789-00"
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#0E6A6B' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Telefone *"
                value={formData.phone}
                onChange={(e) => handleChange('phone', formatPhone(e.target.value))}
                error={!!fieldErrors.phone}
                helperText={fieldErrors.phone || '(11) 91234-5678'}
                placeholder="(11) 91234-5678"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: '#0E6A6B' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Senha *"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password || 'Mínimo 6 caracteres'}
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirmar Senha *"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#0E6A6B' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
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
          background: 'linear-gradient(135deg, #0E6A6B 0%, #12888A 50%, #E47B24 100%)',
          p: { xs: 2, sm: 3 },
        }}
      >
      <Card
        sx={{
          maxWidth: 600,
          width: '100%',
          bgcolor: '#F8F5EE',
          boxShadow: 6,
          borderRadius: { xs: 2, sm: 3 },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          {/* Logo e Título */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Store sx={{ fontSize: 48, color: '#E47B24', mb: 1 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ color: '#0E6A6B', mb: 0.5 }}>
              SuperPet
            </Typography>
            <Typography variant="body1" sx={{ color: '#1E1E1E' }}>
              Cadastro de Tutor
            </Typography>
          </Box>

          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{!isMobile && label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            {renderStepContent(activeStep)}

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            {/* Botões de Navegação */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
              {activeStep === 0 ? (
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/login')}
                  sx={{
                    borderColor: '#0E6A6B',
                    color: '#0E6A6B',
                  }}
                >
                  Voltar
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={handleBack}
                  disabled={loading}
                  sx={{
                    borderColor: '#0E6A6B',
                    color: '#0E6A6B',
                  }}
                >
                  Voltar
                </Button>
              )}

              {activeStep === steps.length - 1 ? (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    bgcolor: '#E47B24',
                    '&:hover': { bgcolor: '#D66B1A' },
                    px: 4,
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Cadastrar'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  onClick={handleNext}
                  sx={{
                    bgcolor: '#E47B24',
                    '&:hover': { bgcolor: '#D66B1A' },
                  }}
                >
                  Próximo
                </Button>
              )}
            </Box>
          </form>

          {/* Link para Login */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Já tem uma conta?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{
                  color: '#E47B24',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  p: 0,
                  minWidth: 'auto',
                  '&:hover': {
                    bgcolor: 'transparent',
                    textDecoration: 'underline',
                  },
                }}
              >
                Fazer Login
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
      </Box>
    </>
  );
};

export default RegisterPage;

