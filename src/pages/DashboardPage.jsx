import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import {
  TrendingUp,
  People,
  ShoppingCart,
  AttachMoney,
} from '@mui/icons-material'
import { useThemeMode } from '../context/ThemeContext'

const DashboardPage = () => {
  const { isDark } = useThemeMode()
  const statsCards = [
    {
      title: 'Vendas Hoje',
      value: 'R$ 12.450',
      change: '+12.5%',
      icon: <TrendingUp sx={{ color: '#E47B24' }} />,
      iconBg: 'bg-superpet-secondary/20',
    },
    {
      title: 'Novos Clientes',
      value: '234',
      change: '+8.2%',
      icon: <People sx={{ color: '#0E6A6B' }} />,
      iconBg: 'bg-superpet-primary/20',
    },
    {
      title: 'Produtos Vendidos',
      value: '1.234',
      change: '+5.1%',
      icon: <ShoppingCart sx={{ color: '#E47B24' }} />,
      iconBg: 'bg-superpet-secondary/20',
    },
    {
      title: 'Receita Total',
      value: 'R$ 89.234',
      change: '+15.3%',
      icon: <AttachMoney sx={{ color: '#0E6A6B' }} />,
      iconBg: 'bg-superpet-primary/20',
    },
  ]

  return (
    <Box>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{
          mb: 1,
          color: isDark ? '#12888A' : '#0E6A6B',
          fontSize: { xs: '1.75rem', sm: '2rem', md: '2.125rem' },
        }}
      >
        Dashboard 🐾
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: isDark ? '#F8F5EE' : '#1E1E1E',
          mb: 4,
          fontSize: { xs: '0.875rem', sm: '1rem' },
        }}
      >
        Visão geral do desempenho da sua loja SuperPet
      </Typography>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card
              sx={{
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                boxShadow: 3,
                transition: 'all 0.3s',
                height: '100%',
                border: isDark ? '1px solid #12888A' : 'none',
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-4px)',
                  borderColor: isDark ? '#E47B24' : 'transparent',
                },
              }}
            >
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 2,
                  }}
                >
                  <Box className={`${stat.iconBg} p-3 rounded-lg`}>
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    sx={{
                      bgcolor: '#E47B24',
                      color: '#F8F5EE',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ mb: 0.5, color: isDark ? '#F8F5EE' : '#0E6A6B' }}
                >
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E' }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default DashboardPage

