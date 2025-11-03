import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Rating,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Star,
  Send,
  ThumbUp,
  Reviews as ReviewsIcon,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { useAppSelector } from '../../store/hooks';
import { reviewsApi } from '../../features/reviews/api/reviewsApi';

const CustomerReviewsPage = () => {
  const { isDark } = useThemeMode();
  const user = useAppSelector(state => state.auth.user);
  
  const [rating, setRating] = useState<number | null>(5);
  const [npsScore, setNpsScore] = useState<number | null>(10);
  const [comment, setComment] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!rating || !npsScore || !user) return;

    const reviewData = {
      customerId: user.id,
      customerName: user.name,
      type: 'general' as const,
      rating,
      npsScore,
      comment,
      wouldRecommend,
      tags: [],
    };

    const response = await reviewsApi.create(reviewData);
    
    if (response.success) {
      setSubmitted(true);
      setRating(5);
      setNpsScore(10);
      setComment('');
      setWouldRecommend(true);
    }
  };

  const npsLabels = [
    '0 - Muito Insatisfeito',
    '1',
    '2',
    '3',
    '4',
    '5 - Neutro',
    '6',
    '7',
    '8',
    '9',
    '10 - Muito Satisfeito',
  ];

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        ⭐ Avaliar Atendimento
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Sua opinião é muito importante para nós!
      </Typography>

      {submitted && (
        <Alert
          severity="success"
          onClose={() => setSubmitted(false)}
          sx={{
            mb: 3,
            bgcolor: isDark ? 'rgba(76, 175, 80, 0.1)' : undefined,
            color: isDark ? '#F8F5EE' : undefined,
          }}
        >
          <Typography variant="body2" fontWeight="600">
            ✅ Avaliação enviada com sucesso! Obrigado pelo feedback!
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Formulário de Avaliação */}
        <Grid item xs={12} md={8}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
            <CardContent>
              {/* Avaliação por Estrelas */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                  Como você avalia nosso atendimento?
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Rating
                    value={rating}
                    onChange={(_, value) => setRating(value)}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': { color: '#E47B24' },
                      '& .MuiRating-iconHover': { color: '#F89042' },
                    }}
                  />
                  {rating && (
                    <Chip
                      label={`${rating} estrela${rating > 1 ? 's' : ''}`}
                      sx={{ bgcolor: '#E47B24', color: '#FFF', fontWeight: 600 }}
                    />
                  )}
                </Box>
              </Box>

              {/* NPS Score */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                  De 0 a 10, quanto você recomendaria a SuperPet?
                </Typography>
                <Grid container spacing={1}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                    <Grid item key={score}>
                      <Button
                        variant={npsScore === score ? 'contained' : 'outlined'}
                        onClick={() => setNpsScore(score)}
                        sx={{
                          minWidth: 40,
                          height: 40,
                          bgcolor: npsScore === score ? (score >= 9 ? '#4CAF50' : score >= 7 ? '#FF9800' : '#F44336') : 'transparent',
                          borderColor: score >= 9 ? '#4CAF50' : score >= 7 ? '#FF9800' : '#F44336',
                          color: npsScore === score ? '#FFF' : (isDark ? '#F8F5EE' : '#1E1E1E'),
                          '&:hover': {
                            bgcolor: score >= 9 ? '#4CAF50' : score >= 7 ? '#FF9800' : '#F44336',
                            color: '#FFF',
                          },
                        }}
                      >
                        {score}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
                {npsScore !== null && (
                  <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block', mt: 1 }}>
                    {npsLabels[npsScore]}
                  </Typography>
                )}
              </Box>

              {/* Comentário */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
                  Conte-nos mais sobre sua experiência
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Compartilhe sua opinião conosco..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                      '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                      '& textarea': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                    },
                  }}
                />
              </Box>

              {/* Recomendaria */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={wouldRecommend}
                    onChange={(e) => setWouldRecommend(e.target.checked)}
                    sx={{
                      color: isDark ? '#12888A' : '#0E6A6B',
                      '&.Mui-checked': { color: '#E47B24' },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
                    Eu recomendaria a SuperPet para amigos e familiares
                  </Typography>
                }
                sx={{ mb: 3 }}
              />

              {/* Botão Enviar */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Send />}
                onClick={handleSubmit}
                disabled={!rating || npsScore === null}
                sx={{
                  bgcolor: '#E47B24',
                  color: '#F8F5EE',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': { bgcolor: '#C26619' },
                  '&:disabled': { bgcolor: '#CCC', color: '#666' },
                }}
              >
                Enviar Avaliação
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Info Lateral */}
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', mb: 3 }}>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Star sx={{ fontSize: 60, color: '#E47B24' }} />
              </Box>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', textAlign: 'center', mb: 2 }}>
                Por que sua opinião importa?
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="🎯 Melhoria Contínua"
                    secondary="Ajudamos a melhorar nossos serviços"
                    secondaryTypographyProps={{ sx: { color: isDark ? '#E6E1D6' : '#666' } }}
                    primaryTypographyProps={{ sx: { color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="❤️ Transparência"
                    secondary="Mostramos que valorizamos você"
                    secondaryTypographyProps={{ sx: { color: isDark ? '#E6E1D6' : '#666' } }}
                    primaryTypographyProps={{ sx: { color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 } }}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="🏆 Qualidade"
                    secondary="Buscamos excelência sempre"
                    secondaryTypographyProps={{ sx: { color: isDark ? '#E6E1D6' : '#666' } }}
                    primaryTypographyProps={{ sx: { color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 } }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerReviewsPage;

