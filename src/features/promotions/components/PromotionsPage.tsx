import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Chip,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Add as AddIcon,
  LocalOffer,
  AttachMoney,
  TrendingUp,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { promotionsApi } from '../api/promotionsApi';
import { Promotion, PriceTable } from '../../../types';

const PromotionsPage = () => {
  const { isDark } = useThemeMode();
  const [tabValue, setTabValue] = useState(0);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [prices, setPrices] = useState<PriceTable[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [promosRes, pricesRes] = await Promise.all([
      promotionsApi.promotions.getAll(),
      promotionsApi.prices.getAll(),
    ]);

    if (promosRes.success && promosRes.data) setPromotions(promosRes.data);
    if (pricesRes.success && pricesRes.data) setPrices(pricesRes.data);
    setLoading(false);
  };

  const activePromotions = promotions.filter(p => p.active);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 0.5, ...typography.h4 }}
          >
            💰 Preços e Promoções
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Gerencie tabelas de preços e campanhas promocionais
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#E47B24',
            color: '#F8F5EE',
            fontWeight: 600,
            '&:hover': { bgcolor: '#C26619' },
          }}
        >
          Nova Promoção
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Promoções Ativas', value: activePromotions.length, color: '#4CAF50', icon: <LocalOffer /> },
          { label: 'Total de Promoções', value: promotions.length, color: '#2196F3', icon: <TrendingUp /> },
          { label: 'Produtos com Preço', value: prices.length, color: '#FF9800', icon: <AttachMoney /> },
        ].map((stat, idx) => (
          <Grid item xs={12} sm={4} key={idx}>
            <Card sx={{
              bgcolor: isDark ? '#1C2128' : '#F8F5EE',
              border: isDark ? `1px solid ${stat.color}` : 'none',
              borderLeft: `4px solid ${stat.color}`,
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ bgcolor: stat.color, borderRadius: '50%', p: 1, mr: 2 }}>
                    {React.cloneElement(stat.icon, { sx: { color: '#FFF' } })}
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color }}>
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

      {/* Tabs */}
      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', border: isDark ? '1px solid #12888A' : 'none' }}>
        <Tabs
          value={tabValue}
          onChange={(_, v) => setTabValue(v)}
          sx={{
            borderBottom: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
            '& .MuiTab-root': {
              color: isDark ? '#E6E1D6' : '#666',
              '&.Mui-selected': { color: '#E47B24' },
            },
            '& .MuiTabs-indicator': { bgcolor: '#E47B24' },
          }}
        >
          <Tab label="Promoções Ativas" />
          <Tab label="Tabela de Preços" />
        </Tabs>

        <CardContent>
          {/* Tab 1: Promoções */}
          {tabValue === 0 && (
            <List sx={{ p: 0 }}>
              {activePromotions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LocalOffer sx={{ fontSize: 64, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
                  <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                    Nenhuma promoção ativa
                  </Typography>
                </Box>
              ) : (
                activePromotions.map((promo, index) => (
                  <ListItem
                    key={promo.id}
                    sx={{
                      bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                      borderRadius: 2,
                      mb: index < activePromotions.length - 1 ? 2 : 0,
                      border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                      '&:hover': { borderColor: '#E47B24', boxShadow: 2 },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 600 }}>
                            {promo.name}
                          </Typography>
                          <Chip
                            label={`${promo.discount}${promo.type === 'percentage' ? '%' : ' OFF'}`}
                            sx={{ bgcolor: '#4CAF50', color: '#FFF', fontWeight: 600 }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography component="span" variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', display: 'block' }}>
                            {promo.description}
                          </Typography>
                          <Typography component="span" variant="caption" sx={{ color: isDark ? '#12888A' : '#999', display: 'block' }}>
                            📅 {new Date(promo.startDate).toLocaleDateString('pt-BR')} até {new Date(promo.endDate).toLocaleDateString('pt-BR')}
                            {promo.usedCount > 0 && ` • Usado ${promo.usedCount}x`}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}

          {/* Tab 2: Tabela de Preços */}
          {tabValue === 1 && (
            <List sx={{ p: 0 }}>
              {prices.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <AttachMoney sx={{ fontSize: 64, color: isDark ? '#12888A' : '#CCC', mb: 2 }} />
                  <Typography sx={{ color: isDark ? '#E6E1D6' : '#999' }}>
                    Nenhum preço cadastrado
                  </Typography>
                </Box>
              ) : (
                prices.map((price, index) => (
                  <ListItem
                    key={price.id}
                    sx={{
                      bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                      borderRadius: 2,
                      mb: index < prices.length - 1 ? 2 : 0,
                      border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                    }}
                  >
                    <ListItemText
                      primary={<Typography variant="h6" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>{price.productName}</Typography>}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 2, mt: 1, flexWrap: 'wrap' }}>
                          <Chip label={`Base: R$ ${price.basePrice.toFixed(2)}`} size="small" />
                          {price.salePrice && <Chip label={`Promoção: R$ ${price.salePrice.toFixed(2)}`} size="small" sx={{ bgcolor: '#4CAF50', color: '#FFF' }} />}
                          {price.memberPrice && <Chip label={`VIP: R$ ${price.memberPrice.toFixed(2)}`} size="small" sx={{ bgcolor: '#9C27B0', color: '#FFF' }} />}
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default PromotionsPage;

