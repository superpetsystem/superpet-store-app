import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import { Add, People } from '@mui/icons-material'
import { useThemeMode } from '../context/ThemeContext'
import { typography } from '../theme/typography'

const CustomersPage = () => {
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
            Clientes 👥
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: isDark ? '#F8F5EE' : '#1E1E1E',
              fontSize: typography.pageSubtitle,
            }}
          >
            Gerencie a base de clientes da SuperPet
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
          Novo Cliente
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
          <People sx={{ 
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
            Página de Clientes
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: isDark ? '#F8F5EE' : '#1E1E1E',
              fontSize: typography.bodyText,
            }}
          >
            Aqui você poderá gerenciar todos os clientes cadastrados
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CustomersPage

