import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Alert, Tabs, Tab } from '@mui/material';
import { Add, Warning, TrendingDown, Inventory } from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { useStock } from '../hooks/useStock';
import { useProducts } from '../../products/hooks/useProducts';
import StockMovementDialog from './StockMovementDialog';
import { formatMovementType, formatQuantityWithSign, getMovementTypeColor } from '../helpers/formatters';

const StockPage = () => {
  const { isDark } = useThemeMode();
  const { movements, loading, fetchMovements, fetchMovementStats } = useStock();
  const { products, fetchProducts } = useProducts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await fetchMovements({ page: 1, limit: 1000 });
    await fetchProducts({ page: 1, limit: 1000 });
    const statsData = await fetchMovementStats();
    setStats(statsData);
  };

  // Alertas de estoque
  const lowStock = products.filter(p => p.stock <= p.minStock && p.stock > 0);
  const outOfStock = products.filter(p => p.stock === 0);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', ...typography.h4 }}>
          📦 Controle de Estoque
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ bgcolor: '#E47B24', '&:hover': { bgcolor: '#C26619' } }}
        >
          Nova Movimentação
        </Button>
      </Box>

      {/* Alertas */}
      {outOfStock.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          ⚠️ <strong>{outOfStock.length} produtos</strong> estão sem estoque!
        </Alert>
      )}
      {lowStock.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          ⚠️ <strong>{lowStock.length} produtos</strong> estão com estoque baixo!
        </Alert>
      )}

      {/* Stats */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {[
            { label: 'Entradas', value: stats.entries, color: '#4CAF50', icon: <TrendingDown sx={{ transform: 'rotate(180deg)' }} /> },
            { label: 'Saídas', value: stats.exits, color: '#F44336', icon: <TrendingDown /> },
            { label: 'Produtos Ativos', value: products.filter(p => p.active).length, color: '#2196F3', icon: <Inventory /> },
            { label: 'Estoque Baixo', value: lowStock.length, color: '#FF9800', icon: <Warning /> },
          ].map((stat, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE', borderLeft: `4px solid ${stat.color}` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ bgcolor: stat.color, borderRadius: '50%', p: 1, mr: 2 }}>
                      {React.cloneElement(stat.icon, { sx: { color: '#FFF' } })}
                    </Box>
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
      )}

      <Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: isDark ? '#12888A' : '#E0E0E0' }}>
          <Tab label="Movimentações" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }} />
          <Tab label={`Estoque Baixo (${lowStock.length})`} sx={{ color: '#FF9800' }} />
          <Tab label={`Sem Estoque (${outOfStock.length})`} sx={{ color: '#F44336' }} />
        </Tabs>

        <CardContent>
          {tab === 0 && (
            <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Data/Hora</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Produto</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Tipo</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Qtd</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Usuário</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {movements.slice(0, 50).map(mov => (
                    <TableRow key={mov.id} hover>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{new Date(mov.timestamp).toLocaleString()}</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{mov.productName}</TableCell>
                      <TableCell>
                        <Chip label={formatMovementType(mov.type)} size="small" sx={{ bgcolor: getMovementTypeColor(mov.type), color: '#FFF' }} />
                      </TableCell>
                      <TableCell sx={{ color: mov.type === 'entry' ? '#4CAF50' : '#F44336', fontWeight: 600 }}>
                        {formatQuantityWithSign(mov.quantity, mov.type)}
                      </TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{mov.userId}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tab === 1 && (
            <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Produto</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Estoque Atual</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Estoque Mínimo</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Diferença</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStock.map(p => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{p.name}</TableCell>
                      <TableCell sx={{ color: '#FF9800', fontWeight: 600 }}>{p.stock}</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{p.minStock}</TableCell>
                      <TableCell sx={{ color: '#F44336', fontWeight: 600 }}>-{p.minStock - p.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {tab === 2 && (
            <TableContainer component={Paper} sx={{ bgcolor: isDark ? '#0D1117' : '#FFFFFF' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Produto</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Categoria</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', fontWeight: 600 }}>Ação Necessária</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {outOfStock.map(p => (
                    <TableRow key={p.id} hover>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{p.name}</TableCell>
                      <TableCell sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>{p.category}</TableCell>
                      <TableCell>
                        <Chip label="REABASTECER URGENTE" size="small" sx={{ bgcolor: '#F44336', color: '#FFF', fontWeight: 600 }} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <StockMovementDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={loadData}
      />
    </Box>
  );
};

export default StockPage;

