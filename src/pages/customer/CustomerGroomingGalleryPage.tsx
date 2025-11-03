import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CardMedia,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  PhotoLibrary,
  Pets,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';
import { groomingPhotosApi } from '../../features/grooming/api/groomingPhotosApi';
import { GroomingPhoto } from '../../types';

const CustomerGroomingGalleryPage = () => {
  const { isDark } = useThemeMode();
  const { pets } = useAppSelector(state => state.pets);
  const [photos, setPhotos] = useState<GroomingPhoto[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPhotos();
  }, [selectedPetId]);

  const loadPhotos = async () => {
    setLoading(true);
    if (selectedPetId === 'all') {
      const response = await groomingPhotosApi.getGallery();
      if (response.success && response.data) {
        setPhotos(response.data.photos);
      }
    } else {
      const response = await groomingPhotosApi.getByPet(selectedPetId);
      if (response.success && response.data) {
        setPhotos(response.data);
      }
    }
    setLoading(false);
  };

  // Agrupar fotos antes/depois
  const grouped = photos.reduce((acc, photo) => {
    if (!acc[photo.serviceOrderId]) {
      acc[photo.serviceOrderId] = { before: null, after: null, petName: photo.petName };
    }
    if (photo.type === 'before') {
      acc[photo.serviceOrderId].before = photo;
    } else {
      acc[photo.serviceOrderId].after = photo;
    }
    return acc;
  }, {} as Record<string, { before: GroomingPhoto | null; after: GroomingPhoto | null; petName: string }>);

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        📸 Galeria de Fotos
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Veja as transformações dos seus pets!
      </Typography>

      {/* Filtro */}
      {pets.length > 1 && (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', mb: 3 }}>
          <CardContent>
            <TextField
              select
              fullWidth
              label="Filtrar por Pet"
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
              <MenuItem value="all">Todos os Pets</MenuItem>
              {pets.map(pet => (
                <MenuItem key={pet.id} value={pet.id}>
                  🐾 {pet.name}
                </MenuItem>
              ))}
            </TextField>
          </CardContent>
        </Card>
      )}

      {/* Galeria */}
      {loading ? (
        <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
          Carregando fotos...
        </Typography>
      ) : Object.keys(grouped).length === 0 ? (
        <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <PhotoLibrary sx={{ fontSize: 80, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
            <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
              Nenhuma foto disponível ainda
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(grouped).map(([orderId, data]) => (
            <Grid item xs={12} key={orderId}>
              <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Pets sx={{ color: '#E47B24' }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                      {data.petName}
                    </Typography>
                    <Chip label="Antes & Depois" size="small" sx={{ bgcolor: '#E47B24', color: '#FFF', fontWeight: 600 }} />
                  </Box>

                  <Grid container spacing={2}>
                    {/* Antes */}
                    {data.before && (
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Chip 
                            label="ANTES" 
                            size="small" 
                            sx={{ bgcolor: '#FF9800', color: '#FFF', fontWeight: 600, mb: 1 }}
                          />
                          <CardMedia
                            component="img"
                            height="300"
                            image={data.before.url}
                            alt="Antes"
                            sx={{
                              borderRadius: 2,
                              border: isDark ? '2px solid #12888A' : '2px solid #E0E0E0',
                              objectFit: 'cover',
                            }}
                          />
                          {data.before.notes && (
                            <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block', mt: 1 }}>
                              📝 {data.before.notes}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    )}

                    {/* Depois */}
                    {data.after && (
                      <Grid item xs={12} sm={6}>
                        <Box>
                          <Chip 
                            label="DEPOIS" 
                            size="small" 
                            sx={{ bgcolor: '#4CAF50', color: '#FFF', fontWeight: 600, mb: 1 }}
                          />
                          <CardMedia
                            component="img"
                            height="300"
                            image={data.after.url}
                            alt="Depois"
                            sx={{
                              borderRadius: 2,
                              border: isDark ? '2px solid #12888A' : '2px solid #E0E0E0',
                              objectFit: 'cover',
                            }}
                          />
                          {data.after.notes && (
                            <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block', mt: 1 }}>
                              📝 {data.after.notes}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default CustomerGroomingGalleryPage;

