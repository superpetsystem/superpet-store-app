import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  Receipt,
  ShoppingCart,
  Download,
} from '@mui/icons-material';
import { useThemeMode } from '../../../context/ThemeContext';
import { typography } from '../../../theme/typography';
import { useAppSelector } from '../../../store/hooks';
import { calculateSalesReport, formatCurrency, exportToCSV } from '../helpers/salesCalculations';

const SalesReportsPage = () => {
  const { isDark } = useThemeMode();
  const { sales } = useAppSelector((state) => state.sales);
  
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    const data = calculateSalesReport(sales, startDate, endDate);
    setReportData(data);
  }, [sales, startDate, endDate]);

  const handleExport = () => {
    if (!reportData) return;
    exportToCSV(reportData.salesByPeriod, `relatorio-vendas-${startDate}-${endDate}`);
  };

  if (!reportData) return <Typography>Carregando...</Typography>;

  const stats = [
    {
      label: 'Receita Total',
      value: formatCurrency(reportData.totalRevenue),
      color: '#0E6A6B',
      icon: <AttachMoney />,
    },
    {
      label: 'Total de Vendas',
      value: reportData.totalSales,
      color: '#4CAF50',
      icon: <Receipt />,
    },
    {
      label: 'Ticket Médio',
      value: formatCurrency(reportData.averageTicket),
      color: '#2196F3',
      icon: <ShoppingCart />,
    },
    {
      label: 'Média Diária',
      value: formatCurrency(reportData.dailyAverage),
      color: '#FF9800',
      icon: <TrendingUp />,
    },
  ];

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
            📊 Relatórios de Vendas
          </Typography>
          <Typography variant="body1" sx={{ color: isDark ? '#E6E1D6' : '#666', ...typography.body1 }}>
            Análise completa de vendas e desempenho
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleExport}
          sx={{
            borderColor: isDark ? '#12888A' : '#0E6A6B',
            color: isDark ? '#12888A' : '#0E6A6B',
            '&:hover': {
              bgcolor: isDark ? 'rgba(18, 136, 138, 0.1)' : 'rgba(14, 106, 107, 0.08)',
            },
          }}
        >
          Exportar CSV
        </Button>
      </Box>

      {/* Filtros de Período */}
      <Card
        sx={{
          bgcolor: isDark ? '#1C2128' : '#F8F5EE',
          border: isDark ? '1px solid #12888A' : 'none',
          mb: 4,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Período de Análise
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="date"
                label="Data Inicial"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                    '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                  },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                type="date"
                label="Data Final"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    '& fieldset': { borderColor: isDark ? '#12888A' : '#0E6A6B' },
                    '& input': { color: isDark ? '#F8F5EE' : '#1E1E1E' },
                  },
                  '& .MuiInputLabel-root': { color: isDark ? '#12888A' : '#0E6A6B' },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  height: '56px',
                  bgcolor: '#E47B24',
                  color: '#F8F5EE',
                  '&:hover': { bgcolor: '#C26619' },
                }}
              >
                Filtrar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Cards de Estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
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
                  <Avatar sx={{ bgcolor: stat.color, mr: 2, width: 48, height: 48 }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: stat.color }}>
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

      {/* Top Produtos */}
      <Card
        sx={{
          bgcolor: isDark ? '#1C2128' : '#F8F5EE',
          border: isDark ? '1px solid #12888A' : 'none',
          mb: 4,
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Top 10 Produtos Mais Vendidos
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 600 }}>#</TableCell>
                  <TableCell sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 600 }}>Produto</TableCell>
                  <TableCell align="right" sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 600 }}>Qtd</TableCell>
                  <TableCell align="right" sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 600 }}>Receita</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.topProducts.slice(0, 10).map((product: any, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:hover': { bgcolor: isDark ? 'rgba(228, 123, 36, 0.05)' : 'rgba(14, 106, 107, 0.05)' },
                    }}
                  >
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 500 }}>
                      {product.name}
                    </TableCell>
                    <TableCell align="right" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                      {product.quantity}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#4CAF50', fontWeight: 600 }}>
                      {formatCurrency(product.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Vendas por Forma de Pagamento */}
      <Card
        sx={{
          bgcolor: isDark ? '#1C2128' : '#F8F5EE',
          border: isDark ? '1px solid #12888A' : 'none',
        }}
      >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 2 }}>
            Vendas por Forma de Pagamento
          </Typography>
          <Grid container spacing={2}>
            {reportData.salesByPaymentMethod.map((payment: any, index: number) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: isDark ? '#0D1117' : '#FFFFFF',
                    borderRadius: 2,
                    border: isDark ? '1px solid #12888A' : '1px solid #E0E0E0',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="600" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 1 }}>
                    {payment.method}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip
                      label={`${payment.count} vendas`}
                      size="small"
                      sx={{ bgcolor: '#2196F3', color: '#FFF', fontWeight: 600 }}
                    />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#4CAF50' }}>
                      {formatCurrency(payment.total)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SalesReportsPage;

