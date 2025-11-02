import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Grid, TextField, Button, Avatar, Switch, FormControlLabel, Divider } from '@mui/material';
import { Person, Email, Phone, Lock, Notifications, DarkMode } from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';

const CustomerSettingsPage = () => {
  const { isDark, toggleTheme } = useThemeMode();
  const user = useAppSelector(state => state.auth.user);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '(11) 99999-9999',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    whatsapp: true,
    push: true,
  });

  const handleSave = () => {
    alert('✅ Configurações salvas com sucesso!');
  };

  const handleChangePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('❌ As senhas não coincidem!');
      return;
    }
    alert('✅ Senha alterada com sucesso!');
    setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        ⚙️ Configurações
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Gerencie suas preferências e dados pessoais
      </Typography>

      <Grid container spacing={3}>
        {/* Dados Pessoais */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 3 }}>
                👤 Dados Pessoais
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nome Completo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    InputProps={{ startAdornment: <Person sx={{ color: isDark ? '#12888A' : '#0E6A6B', mr: 1 }} /> }}
                    sx={{
                      '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                      '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    InputProps={{ startAdornment: <Email sx={{ color: isDark ? '#12888A' : '#0E6A6B', mr: 1 }} /> }}
                    sx={{
                      '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                      '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    InputProps={{ startAdornment: <Phone sx={{ color: isDark ? '#12888A' : '#0E6A6B', mr: 1 }} /> }}
                    sx={{
                      '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                      '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSave}
                    sx={{ bgcolor: '#E47B24', color: '#FFF', '&:hover': { bgcolor: '#C26619' }, py: 1.5 }}
                  >
                    Salvar Dados
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Alterar Senha */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 3 }}>
                🔒 Alterar Senha
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Senha Atual"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                      '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Nova Senha"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                      '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="password"
                    label="Confirmar Nova Senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    sx={{
                      '& .MuiOutlinedInput-root': { bgcolor: isDark ? '#0D1117' : '#FFFFFF', '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' }, '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' } },
                      '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleChangePassword}
                    disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
                    sx={{ bgcolor: '#2196F3', color: '#FFF', '&:hover': { bgcolor: '#1976D2' }, py: 1.5 }}
                  >
                    Alterar Senha
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Preferências */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 3 }}>
                🔔 Preferências de Notificações
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.email}
                        onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#E47B24' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#E47B24' },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
                        <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>Email</Typography>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.sms}
                        onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#E47B24' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#E47B24' },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
                        <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>SMS</Typography>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.whatsapp}
                        onChange={(e) => setNotifications({ ...notifications, whatsapp: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#E47B24' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#E47B24' },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Notifications sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
                        <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>WhatsApp</Typography>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={notifications.push}
                        onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': { color: '#E47B24' },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#E47B24' },
                        }}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Notifications sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
                        <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>Push</Typography>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3, borderColor: isDark ? '#12888A' : '#E0E0E0' }} />

              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                🎨 Aparência
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={isDark}
                    onChange={toggleTheme}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: '#E47B24' },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#E47B24' },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DarkMode sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
                    <Typography sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>Modo Escuro</Typography>
                  </Box>
                }
              />

              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => alert('✅ Preferências salvas!')}
                  sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' }, py: 1.5 }}
                >
                  Salvar Preferências
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Avatar */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 3 }}>
                🖼️ Foto de Perfil
              </Typography>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#E47B24',
                  fontSize: '3rem',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Button
                variant="outlined"
                component="label"
                sx={{ borderColor: '#E47B24', color: '#E47B24', '&:hover': { borderColor: '#C26619', bgcolor: 'rgba(228, 123, 36, 0.1)' } }}
              >
                Alterar Foto
                <input type="file" hidden accept="image/*" />
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerSettingsPage;
