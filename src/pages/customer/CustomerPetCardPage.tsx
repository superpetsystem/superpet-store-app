import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Pets,
  Cake,
  MonitorWeight,
  Favorite,
  Warning,
  QrCode2,
  Phone,
  LocalHospital,
  Shield,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';

const CustomerPetCardPage = () => {
  const { isDark } = useThemeMode();
  const { pets } = useAppSelector(state => state.pets);
  const [selectedPetId, setSelectedPetId] = useState(pets[0]?.id || '');

  const selectedPet = pets.find(p => p.id === selectedPetId);

  if (!selectedPet) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Pets sx={{ fontSize: 80, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
        <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
          Nenhum pet cadastrado
        </Typography>
      </Box>
    );
  }

  const petInfo = [
    { label: 'Espécie', value: selectedPet.species === 'dog' ? 'Cachorro' : 'Gato', icon: <Pets /> },
    { label: 'Raça', value: selectedPet.breed || 'SRD', icon: <Pets /> },
    { label: 'Idade', value: `${selectedPet.age || 0} anos`, icon: <Cake /> },
    { label: 'Peso', value: `${selectedPet.weight || 0} kg`, icon: <MonitorWeight /> },
    { label: 'Sexo', value: selectedPet.gender === 'male' ? 'Macho' : 'Fêmea', icon: <Favorite /> },
    { label: 'Castrado', value: selectedPet.neutered ? 'Sim' : 'Não', icon: <LocalHospital /> },
  ];

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        🐾 Carteirinha Digital
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Informações completas do seu pet sempre à mão
      </Typography>

      {/* Seletor de Pet */}
      {pets.length > 1 && (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', mb: 3 }}>
          <CardContent>
            <TextField
              select
              fullWidth
              label="Selecione o Pet"
              value={selectedPetId}
              onChange={(e) => setSelectedPetId(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                  '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                },
                '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                '& .MuiSelect-select': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
              }}
            >
              {pets.map(pet => (
                <MenuItem key={pet.id} value={pet.id}>
                  🐾 {pet.name}
                </MenuItem>
              ))}
            </TextField>
          </CardContent>
        </Card>
      )}

      {/* Carteirinha */}
      <Grid container spacing={3}>
        {/* Card Principal */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              bgcolor: isDark ? '#1C2128' : '#F8F5EE',
              border: isDark ? '2px solid #E47B24' : '2px solid #E47B24',
              borderRadius: 3,
            }}
          >
            {/* Header do Card */}
            <Box
              sx={{
                background: 'linear-gradient(135deg, #0E6A6B 0%, #12888A 100%)',
                p: 3,
                color: '#F8F5EE',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: '#E47B24',
                    fontSize: '2rem',
                    border: '4px solid #F8F5EE',
                  }}
                >
                  {selectedPet.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {selectedPet.name}
                  </Typography>
                  <Chip
                    label={selectedPet.microchip ? `Microchip: ${selectedPet.microchip}` : 'Sem Microchip'}
                    size="small"
                    sx={{ bgcolor: '#F8F5EE', color: '#0E6A6B', fontWeight: 600, mt: 1 }}
                  />
                </Box>
              </Box>
            </Box>

            {/* Informações Básicas */}
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                Informações Básicas
              </Typography>
              <Grid container spacing={2}>
                {petInfo.map((info, idx) => (
                  <Grid item xs={6} key={idx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ color: '#E47B24' }}>{info.icon}</Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                          {info.label}
                        </Typography>
                        <Typography variant="body1" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                          {info.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Alergias e Medicamentos */}
              {(selectedPet.allergies && selectedPet.allergies.length > 0) && (
                <>
                  <Divider sx={{ my: 3, borderColor: isDark ? '#12888A' : '#E0E0E0' }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Warning sx={{ color: '#F44336' }} />
                      <Typography variant="h6" fontWeight="bold" sx={{ color: '#F44336' }}>
                        Alergias
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedPet.allergies.map((allergy, idx) => (
                        <Chip
                          key={idx}
                          label={allergy}
                          sx={{ bgcolor: '#F44336', color: '#FFF', fontWeight: 600 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              {(selectedPet.medications && selectedPet.medications.length > 0) && (
                <>
                  <Divider sx={{ my: 3, borderColor: isDark ? '#12888A' : '#E0E0E0' }} />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <LocalHospital sx={{ color: '#2196F3' }} />
                      <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
                        Medicamentos
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedPet.medications.map((med, idx) => (
                        <Chip
                          key={idx}
                          label={med}
                          sx={{ bgcolor: '#2196F3', color: '#FFF', fontWeight: 600 }}
                        />
                      ))}
                    </Box>
                  </Box>
                </>
              )}

              {/* Observações */}
              {selectedPet.specialCare && (
                <>
                  <Divider sx={{ my: 3, borderColor: isDark ? '#12888A' : '#E0E0E0' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1 }}>
                      Cuidados Especiais
                    </Typography>
                    <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                      {selectedPet.specialCare}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* QR Code e Ações Rápidas */}
        <Grid item xs={12} md={4}>
          {/* QR Code */}
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', mb: 3 }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                QR Code de Identificação
              </Typography>
              <Box
                sx={{
                  bgcolor: '#FFFFFF',
                  p: 3,
                  borderRadius: 2,
                  border: '2px dashed #E47B24',
                  mx: 'auto',
                  maxWidth: 200,
                }}
              >
                <QrCode2 sx={{ fontSize: 150, color: '#0E6A6B' }} />
              </Box>
              <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block', mt: 2 }}>
                Use este QR Code para identificação rápida
              </Typography>
            </CardContent>
          </Card>

          {/* Contato de Emergência */}
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Phone sx={{ color: '#F44336' }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#F44336' }}>
                  Emergência
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600, mb: 1 }}>
                SuperPet Clínica 24h
              </Typography>
              <Typography variant="body1" sx={{ color: '#0E6A6B', fontWeight: 'bold', fontSize: '1.2rem' }}>
                (11) 98765-4321
              </Typography>
              <Button
                variant="contained"
                fullWidth
                startIcon={<Phone />}
                sx={{
                  mt: 2,
                  bgcolor: '#F44336',
                  color: '#FFF',
                  '&:hover': { bgcolor: '#D32F2F' },
                }}
              >
                Ligar Agora
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerPetCardPage;

