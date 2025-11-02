import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Rating,
  Chip,
  Avatar,
  LinearProgress,
} from '@mui/material';
import {
  Star,
  TrendingUp,
  SentimentSatisfied,
  SentimentNeutral,
  SentimentDissatisfied,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { reviewsApi } from '../api/reviewsApi';
import { Review } from '../../../types';

const NPSPage = () => {
  const { isDark } = useThemeMode();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [reviewsRes, statsRes] = await Promise.all([
      reviewsApi.getAll(),
      reviewsApi.getStatistics(),
    ]);

    if (reviewsRes.success && reviewsRes.data) setReviews(reviewsRes.data);
    if (statsRes.success && statsRes.data) setStats(statsRes.data);
    setLoading(false);
  };

  if (!stats) {
    return <Typography>Carregando...</Typography>;
  };

  const npsColor = stats.npsScore >= 75 ? '#4CAF50' : stats.npsScore >= 50 ? '#FF9800' : '#F44336';

  return (
    <Box>
      {/* Header */}
      <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1, ...typography.h4 }}>
        ⭐ Avaliações e NPS
      </Typography>
      <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 4, ...typography.body1 }}>
        Acompanhe a satisfação dos clientes
      </Typography>

      {/* Main Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none', textAlign: 'center' }}>
            <CardContent>
              <Typography variant="h2" fontWeight="bold" sx={{ color: npsColor, mb: 1 }}>
                {stats.npsScore}
              </Typography>
              <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 1 }}>
                NPS Score
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(stats.npsScore, 100)}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: isDark ? '#0D1117' : '#E0E0E0',
                  '& .MuiLinearProgress-bar': { bgcolor: npsColor },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {[
          { label: 'Avaliação Média', value: stats.avgRating.toFixed(1), icon: <Star />, color: '#E47B24' },
          { label: 'Total de Avaliações', value: stats.totalReviews, icon: <Star />, color: '#2196F3' },
          { label: 'NPS Médio', value: stats.avgNPS.toFixed(1), icon: <TrendingUp />, color: '#4CAF50' },
        ].map((stat, idx) => (
          <Grid item xs={12} md={3} key={idx}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>{stat.icon}</Avatar>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* NPS Categories */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Promotores (9-10)', value: stats.npsCategories.promoters, color: '#4CAF50', icon: <SentimentSatisfied /> },
          { label: 'Neutros (7-8)', value: stats.npsCategories.passives, color: '#FF9800', icon: <SentimentNeutral /> },
          { label: 'Detratores (0-6)', value: stats.npsCategories.detractors, color: '#F44336', icon: <SentimentDissatisfied /> },
        ].map((cat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? `1px solid ${cat.color}` : 'none', borderLeft: `4px solid ${cat.color}` }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ bgcolor: cat.color, mr: 2 }}>{cat.icon}</Avatar>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: cat.color }}>
                    {cat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  {cat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Últimas Avaliações */}
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            📝 Últimas Avaliações
          </Typography>
          <List sx={{ p: 0 }}>
            {reviews.slice(0, 5).map((review, index) => (
              <ListItem
                key={review.id}
                sx={{
                  bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                  borderRadius: 2,
                  mb: index < Math.min(reviews.length, 5) - 1 ? 2 : 0,
                  border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                      {review.customerName}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#E47B24' } }} />
                  </Box>
                  <Chip
                    label={`NPS: ${review.npsScore}`}
                    size="small"
                    sx={{
                      bgcolor: (review.npsScore || 0) >= 9 ? '#4CAF50' : (review.npsScore || 0) >= 7 ? '#FF9800' : '#F44336',
                      color: '#FFF',
                    }}
                  />
                </Box>
                {review.comment && (
                  <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 1 }}>
                    "{review.comment}"
                  </Typography>
                )}
                <Typography variant="caption" sx={{ color: isDark ? '#12888A' : '#999' }}>
                  {new Date(review.createdAt).toLocaleDateString('pt-BR')} • {review.relatedName || 'Avaliação Geral'}
                </Typography>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NPSPage;

