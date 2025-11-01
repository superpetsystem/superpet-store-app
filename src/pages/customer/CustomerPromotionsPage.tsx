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
  Chip,
  Alert,
} from '@mui/material';
import {
  LocalOffer,
  TrendingUp,
  CalendarMonth,
} from '@mui/icons-material';
import { useThemeMode } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { promotionsApi } from '../../features/promotions/api/promotionsApi';
import { Promotion } from '../../types';

const CustomerPromotionsPage = () => {
  const { isDark } = useThemeMode();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    const response = await promotionsApi.promotions.getAll({ active: true });
    if (response.success && response.data) {
      setPromotions(response.data);
    }
    setLoading(false);
  };

  const getPromotionTypeLabel = (type: string) => {
    const labels = {
      percentage: 'Desconto %',
      fixed: 'Valor Fixo',
      combo: 'Combo',
      'buy-x-get-y': 'Compre X Leve Y',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 0.5, ...typography.h4 }}
        >
          🏷️ Promoções Ativas
        </Typography>
        <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
          Aproveite nossas ofertas especiais!
        </Typography>
      </Box>

      {/* Alerta de Promoções */}
      {promotions.length > 0 && (
        <Alert
          severity="success"
          icon={<TrendingUp />}
          sx={{
            mb: 3,
            bgcolor: isDark ? 'rgba(76, 175, 80, 0.1)' : undefined,
            color: isDark ? '#F8F5EE' : undefined,
            '& .MuiAlert-icon': { color: '#4CAF50' },
          }}
        >
          <Typography variant="body2" fontWeight="600">
            {promotions.length} promoção{promotions.length > 1 ? 'ões' : ''} ativa{promotions.length > 1 ? 's' : ''} agora!
          </Typography>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Promoções Ativas', value: promotions.length, color: '#4CAF50', icon: <LocalOffer /> },
          { label: 'Descontos Disponíveis', value: promotions.filter(p => p.type === 'percentage').length, color: '#FF9800', icon: <TrendingUp /> },
          { label: 'Combos Especiais', value: promotions.filter(p => p.type === 'combo').length, color: '#2196F3', icon: <LocalOffer /> },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card
              sx={{
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                border: isDark ? `1px solid ${stat.color}` : 'none',
                borderLeft: `4px solid ${stat.color}`,
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ bgcolor: stat.color, borderRadius: '50%', p: 1.5, mr: 2 }}>
                    {React.cloneElement(stat.icon, { sx: { color: '#FFF', fontSize: 28 } })}
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Lista de Promoções */}
      <Grid container spacing={3}>
        {loading ? (
          <Grid item xs={12}>
            <Typography sx={{ color: isDark ? '#E6E1D6' : '#666', textAlign: 'center', py: 4 }}>
              Carregando promoções...
            </Typography>
          </Grid>
        ) : promotions.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <LocalOffer sx={{ fontSize: 80, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
                <Typography variant="h6" sx={{ color: isDark ? '#E6E1D6' : '#999', mb: 1 }}>
                  Nenhuma promoção ativa no momento
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  Fique de olho! Novas ofertas em breve 🎉
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          promotions.map((promo) => (
            <Grid item xs={12} md={6} key={promo.id}>
              <Card
                sx={{
                  bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                  border: isDark ? '2px solid #E47B24' : '2px solid #E47B24',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent>
                  {/* Badge de Desconto */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      label={getPromotionTypeLabel(promo.type)}
                      size="small"
                      sx={{ bgcolor: '#2196F3', color: '#FFF', fontWeight: 600 }}
                    />
                    <Box
                      sx={{
                        bgcolor: '#E47B24',
                        color: '#F8F5EE',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                      }}
                    >
                      {promo.type === 'percentage' ? `${promo.discount}%` : `R$ ${promo.discount}`}
                    </Box>
                  </Box>

                  {/* Título e Descrição */}
                  <Typography variant="h5" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 1 }}>
                    {promo.name}
                  </Typography>
                  <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 2 }}>
                    {promo.description}
                  </Typography>

                  {/* Condições */}
                  {promo.conditions && (
                    <Typography variant="body2" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2, fontStyle: 'italic' }}>
                      📝 {promo.conditions}
                    </Typography>
                  )}

                  {/* Período de Validade */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CalendarMonth sx={{ color: '#E47B24', fontSize: 20 }} />
                    <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                      Válido de {new Date(promo.startDate).toLocaleDateString('pt-BR')} até {new Date(promo.endDate).toLocaleDateString('pt-BR')}
                    </Typography>
                  </Box>

                  {/* Compra Mínima */}
                  {promo.minimumPurchase && (
                    <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#999', display: 'block' }}>
                      💰 Compra mínima: R$ {promo.minimumPurchase.toFixed(2)}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default CustomerPromotionsPage;

