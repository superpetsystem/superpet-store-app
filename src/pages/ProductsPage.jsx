import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import { Add, ShoppingCart } from '@mui/icons-material'
import { useThemeMode } from '../context/ThemeContext'
import { typography } from '../theme/typography'

const ProductsPage = () => {
  const { isDark } = useThemeMode()
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ 
              color: isDark ? '#12888A' : '#0E6A6B', 
              mb: 1,
              fontSize: typography.pageTitle,
            }}
          >
            Produtos 🛍️
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: isDark ? '#F8F5EE' : '#1E1E1E',
              fontSize: typography.pageSubtitle,
            }}
          >
            Gerencie o catálogo de produtos da SuperPet
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            bgcolor: '#E47B24',
            color: '#F8F5EE',
            '&:hover': { bgcolor: '#C26619' },
            height: 48,
          }}
        >
          Novo Produto
        </Button>
      </Box>

      <Card sx={{ 
        bgcolor: isDark ? '#1C2128' : '#F8F5EE',
        boxShadow: 3, 
        textAlign: 'center', 
        py: 8,
        border: isDark ? '1px solid #12888A' : 'none',
      }}>
        <CardContent>
          <ShoppingCart sx={{ 
            fontSize: { xs: 60, sm: 80, md: 100 }, 
            color: isDark ? '#12888A' : '#0E6A6B', 
            mb: 3 
          }} />
          <Typography 
            variant="h5" 
            sx={{ 
              color: isDark ? '#12888A' : '#0E6A6B', 
              mb: 2,
              fontSize: typography.sectionTitle,
            }}
          >
            Página de Produtos
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: isDark ? '#F8F5EE' : '#1E1E1E',
              fontSize: typography.bodyText,
            }}
          >
            Aqui você poderá gerenciar todo o catálogo de produtos
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProductsPage

