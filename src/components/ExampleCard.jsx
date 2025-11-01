/**
 * 📘 Componente de Exemplo - Template com Tema Escuro
 * 
 * Este é um exemplo completo de como criar componentes que suportam tema escuro.
 * Use como referência ao criar novos componentes.
 */

import { Box, Typography, Card, CardContent, Button, Chip } from '@mui/material'
import { Star, TrendingUp } from '@mui/icons-material'
import { useThemeMode } from '../context/ThemeContext'

const ExampleCard = ({ title, description, value, trend }) => {
  const { isDark } = useThemeMode()
  
  return (
    <Card 
      sx={{
        // ✅ Background condicional
        bgcolor: isDark ? '#1C2128' : '#F8F5EE',
        boxShadow: 3,
        // ✅ Borda apenas no tema escuro para melhor contraste
        border: isDark ? '1px solid #12888A' : 'none',
        transition: 'all 0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'translateY(-4px)',
          // ✅ Borda laranja no hover (tema escuro)
          borderColor: isDark ? '#E47B24' : 'transparent',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Header com ícone */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box 
            sx={{ 
              bgcolor: isDark ? 'rgba(18, 136, 138, 0.2)' : 'rgba(14, 106, 107, 0.1)',
              p: 2,
              borderRadius: 2,
            }}
          >
            <Star sx={{ color: '#E47B24', fontSize: 32 }} />
          </Box>
          
          {trend && (
            <Chip 
              label={trend}
              icon={<TrendingUp sx={{ color: '#F8F5EE' }} />}
              sx={{ 
                bgcolor: '#E47B24',  // ✅ Laranja fixo (funciona em ambos)
                color: '#F8F5EE',    // ✅ Branco fixo (funciona em ambos)
                fontWeight: 'bold',
              }}
            />
          )}
        </Box>
        
        {/* Título - usa teal (escuro no claro, claro no escuro) */}
        <Typography 
          variant="h5" 
          fontWeight="bold"
          sx={{ 
            mb: 1,
            // ✅ Teal claro (#12888A) no escuro, teal escuro (#0E6A6B) no claro
            color: isDark ? '#12888A' : '#0E6A6B',
          }}
        >
          {title}
        </Typography>
        
        {/* Valor - branco no escuro, teal no claro */}
        <Typography 
          variant="h6"
          sx={{ 
            mb: 2,
            // ✅ Branco no escuro para destaque, teal no claro
            color: isDark ? '#F8F5EE' : '#0E6A6B',
            fontWeight: 600,
          }}
        >
          {value}
        </Typography>
        
        {/* Descrição - texto principal */}
        <Typography 
          variant="body2"
          sx={{ 
            mb: 3,
            // ✅ Branco no escuro, preto no claro
            color: isDark ? '#F8F5EE' : '#1E1E1E',
          }}
        >
          {description}
        </Typography>
        
        {/* Texto secundário/suave */}
        <Typography 
          variant="caption"
          sx={{ 
            // ✅ Off-white no escuro (#E6E1D6), cinza no claro
            color: isDark ? '#E6E1D6' : '#6E6E6E',
            display: 'block',
            mb: 2,
          }}
        >
          Última atualização: há 2 horas
        </Typography>
        
        {/* Botões */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Botão primário (teal) - funciona em ambos os temas */}
          <Button
            variant="contained"
            size="small"
            sx={{
              bgcolor: '#0E6A6B',     // ✅ Fixo
              color: '#F8F5EE',       // ✅ Fixo
              '&:hover': {
                bgcolor: '#0A5152',   // ✅ Fixo
              },
            }}
          >
            Ver Detalhes
          </Button>
          
          {/* Botão outlined - muda de acordo com o tema */}
          <Button
            variant="outlined"
            size="small"
            sx={{
              // ✅ Borda e texto condicionais
              borderColor: isDark ? '#12888A' : '#0E6A6B',
              color: isDark ? '#12888A' : '#0E6A6B',
              '&:hover': {
                bgcolor: isDark ? '#0E6A6B' : '#0E6A6B',
                color: '#F8F5EE',
                borderColor: '#0E6A6B',
              },
            }}
          >
            Editar
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default ExampleCard

/**
 * 📝 NOTAS DE USO:
 * 
 * 1. Sempre importe: import { useThemeMode } from '../context/ThemeContext'
 * 2. Use o hook: const { isDark } = useThemeMode()
 * 3. Aplique cores condicionais em TODOS os elementos visíveis
 * 4. Teste em ambos os temas antes de finalizar
 * 
 * 🎨 CORES PRINCIPAIS:
 * - Background cards: isDark ? '#1C2128' : '#F8F5EE'
 * - Texto principal: isDark ? '#F8F5EE' : '#1E1E1E'
 * - Texto destaque: isDark ? '#12888A' : '#0E6A6B'
 * - Bordas: isDark ? '#12888A' : '#0E6A6B'
 * 
 * ✅ CORES FIXAS (não mudam):
 * - Laranja: #E47B24 (botões secundários, badges, ícones)
 * - Teal primário: #0E6A6B (botões principais, AppBar)
 */

