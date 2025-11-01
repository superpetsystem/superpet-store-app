import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeMode } from '../context/ThemeContext'
import { typography } from '../theme/typography'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Store,
  Settings,
  Notifications,
  DarkMode,
  LightMode,
  Receipt,
  LocalShipping,
  Person,
  Logout,
  Help,
} from '@mui/icons-material'

const Navbar = () => {
  const navigate = useNavigate()
  const { toggleTheme, isDark } = useThemeMode()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [anchorElNavbar, setAnchorElNavbar] = useState(null)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleOpenNavbar = (event) => {
    setAnchorElNavbar(event.currentTarget)
  }

  const handleCloseNavbar = () => {
    setAnchorElNavbar(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: '#0E6A6B', 
        boxShadow: 3,
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {/* Logo - APENAS DESKTOP */}
        <Store sx={{ 
          color: '#E47B24', 
          fontSize: 28, 
          mr: 1, 
          display: { xs: 'none', md: 'block' } 
        }} />
        
        {/* Título */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            color: '#F8F5EE',
            fontSize: typography.h6,
          }}
        >
          Portal da Loja SuperPet
        </Typography>

        {/* Ações Rápidas - APENAS DESKTOP */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
          <Tooltip title="Novo Pedido">
            <IconButton sx={{ color: '#F8F5EE' }}>
              <Receipt />
            </IconButton>
          </Tooltip>
          <Tooltip title="Entregas">
            <IconButton sx={{ color: '#F8F5EE' }}>
              <LocalShipping />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Toggle Tema - APENAS DESKTOP */}
        <Tooltip title={isDark ? 'Tema Claro' : 'Tema Escuro'}>
          <IconButton 
            onClick={toggleTheme}
            sx={{ color: '#F8F5EE', display: { xs: 'none', md: 'flex' } }}
          >
            {isDark ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Tooltip>

        {/* Notificações - APENAS DESKTOP */}
        <Tooltip title="Notificações">
          <IconButton sx={{ color: '#F8F5EE', display: { xs: 'none', md: 'flex' } }}>
            <Notifications />
          </IconButton>
        </Tooltip>

        {/* Menu Hamburger - APENAS MOBILE (direita) */}
        <Tooltip title="Menu">
          <IconButton
            edge="end"
            sx={{ 
              color: '#F8F5EE',
              display: { xs: 'flex', md: 'none' }
            }}
            onClick={handleOpenNavbar}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        {/* Menu Dropdown do Navbar (Mobile) */}
        {isMobile && (
          <Menu
            sx={{ mt: '45px' }}
            anchorEl={anchorElNavbar}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElNavbar)}
            onClose={handleCloseNavbar}
          PaperProps={{
            sx: {
              bgcolor: isDark ? '#1C2128' : '#F8F5EE',
              border: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
              minWidth: 250,
            }
          }}
        >
          <MenuItem onClick={handleCloseNavbar} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
            <ListItemIcon>
              <Receipt sx={{ color: '#E47B24' }} />
            </ListItemIcon>
            <ListItemText>Novo Pedido</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleCloseNavbar} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
            <ListItemIcon>
              <LocalShipping sx={{ color: '#E47B24' }} />
            </ListItemIcon>
            <ListItemText>Entregas</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleCloseNavbar} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
            <ListItemIcon>
              <Notifications sx={{ color: '#0E6A6B' }} />
            </ListItemIcon>
            <ListItemText>Notificações</ListItemText>
          </MenuItem>
          
          <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
          
          <MenuItem 
            onClick={() => {
              toggleTheme()
              handleCloseNavbar()
            }} 
            sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}
          >
            <ListItemIcon>
              {isDark ? (
                <LightMode sx={{ color: '#E47B24' }} />
              ) : (
                <DarkMode sx={{ color: '#0E6A6B' }} />
              )}
            </ListItemIcon>
            <ListItemText>{isDark ? 'Tema Claro' : 'Tema Escuro'}</ListItemText>
          </MenuItem>
          
          <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
          
          <MenuItem 
            onClick={() => {
              handleCloseNavbar()
              navigate('/configuracoes')
            }} 
            sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}
          >
            <ListItemIcon>
              <Settings sx={{ color: '#0E6A6B' }} />
            </ListItemIcon>
            <ListItemText>Configurações</ListItemText>
          </MenuItem>
          
          <MenuItem 
            onClick={() => {
              handleCloseNavbar()
              handleLogout()
            }} 
            sx={{ color: '#E47B24' }}
          >
            <ListItemIcon>
              <Logout sx={{ color: '#E47B24' }} />
            </ListItemIcon>
            <ListItemText>Sair            </ListItemText>
          </MenuItem>
          </Menu>
        )}

        {/* Menu do Usuário - APENAS DESKTOP */}
        <Tooltip title="Configurações de conta">
          <IconButton 
            onClick={handleOpenUserMenu} 
            sx={{ p: 0, ml: 2, display: { xs: 'none', md: 'flex' } }}
          >
            <Avatar sx={{ bgcolor: '#E47B24', color: '#F8F5EE', fontWeight: 'bold' }}>
              SP
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Menu do Usuário (Desktop) */}
        {!isMobile && (
          <Menu
            sx={{ mt: '45px' }}
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          PaperProps={{
            sx: {
              bgcolor: isDark ? '#1C2128' : '#F8F5EE',
              border: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
              minWidth: 200,
            }
          }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: isDark ? '1px solid #12888A' : '1px solid #0E6A6B' }}>
            <Typography variant="body2" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E', fontWeight: 'bold' }}>
              Admin SuperPet
            </Typography>
            <Typography variant="caption" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
              admin@superpet.com
            </Typography>
          </Box>
          
          <MenuItem onClick={handleCloseUserMenu} sx={{ mt: 1, color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
            <ListItemIcon>
              <Person sx={{ color: '#0E6A6B' }} />
            </ListItemIcon>
            <ListItemText>Meu Perfil</ListItemText>
          </MenuItem>
          
          <MenuItem onClick={handleCloseUserMenu} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
            <ListItemIcon>
              <Settings sx={{ color: '#0E6A6B' }} />
            </ListItemIcon>
            <ListItemText>Configurações</ListItemText>
          </MenuItem>

          <MenuItem 
            onClick={() => {
              toggleTheme()
              handleCloseUserMenu()
            }} 
            sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}
          >
            <ListItemIcon>
              {isDark ? (
                <LightMode sx={{ color: '#E47B24' }} />
              ) : (
                <DarkMode sx={{ color: '#0E6A6B' }} />
              )}
            </ListItemIcon>
            <ListItemText>{isDark ? 'Tema Claro' : 'Tema Escuro'}</ListItemText>
          </MenuItem>
          
          <Divider sx={{ my: 1, borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
          
          <MenuItem onClick={handleCloseUserMenu} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
            <ListItemIcon>
              <Help sx={{ color: '#E47B24' }} />
            </ListItemIcon>
            <ListItemText>Ajuda</ListItemText>
          </MenuItem>
          
          <MenuItem 
            onClick={() => {
              handleCloseUserMenu()
              handleLogout()
            }} 
            sx={{ color: '#E47B24' }}
          >
            <ListItemIcon>
              <Logout sx={{ color: '#E47B24' }} />
            </ListItemIcon>
            <ListItemText>Sair            </ListItemText>
          </MenuItem>
          </Menu>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar

