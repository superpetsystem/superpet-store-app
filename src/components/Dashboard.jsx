import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useThemeMode } from '../context/ThemeContext'
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Container,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ShoppingCart,
  Store,
  People,
  Settings,
  Notifications,
  TrendingUp,
  Inventory,
  AttachMoney,
  ChevronLeft,
  ChevronRight,
  AccountCircle,
  Logout,
  Person,
  Help,
  MoreVert,
  Language,
  DarkMode,
  LightMode,
  Receipt,
  LocalShipping,
} from '@mui/icons-material'

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { mode, toggleTheme, isDark } = useThemeMode()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [anchorElUser, setAnchorElUser] = useState(null)
  const [anchorElMenu, setAnchorElMenu] = useState(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const drawerWidth = sidebarExpanded ? 250 : 70

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    navigate('/login')
  }

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleOpenMenu = (event) => {
    setAnchorElMenu(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorElMenu(null)
  }

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Produtos', icon: <ShoppingCart />, path: '/produtos' },
    { text: 'Vendas', icon: <Store />, path: '/vendas' },
    { text: 'Clientes', icon: <People />, path: '/clientes' },
    { text: 'Estoque', icon: <Inventory />, path: '/estoque' },
    { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
  ]

  const drawer = (
    <Box sx={{ 
      width: '100%', 
      pt: 2, 
      bgcolor: isDark ? '#1C2128' : '#F8F5EE',
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <Box sx={{ 
        px: sidebarExpanded ? 2 : 1, 
        mb: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        justifyContent: sidebarExpanded ? 'flex-start' : 'center',
      }}>
        <Store sx={{ color: '#E47B24', fontSize: sidebarExpanded ? 32 : 28 }} />
        {sidebarExpanded && (
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#0E6A6B' }}>
            SuperPet
          </Typography>
        )}
      </Box>
      
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  px: sidebarExpanded ? 2 : 1.5,
                  justifyContent: sidebarExpanded ? 'flex-start' : 'center',
                  bgcolor: isActive ? '#0E6A6B' : 'transparent',
                  '&:hover': {
                    bgcolor: '#0E6A6B',
                    '& .MuiListItemIcon-root': { color: '#F8F5EE' },
                    '& .MuiListItemText-primary': { color: '#F8F5EE' },
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? '#F8F5EE' : '#0E6A6B',
                    minWidth: sidebarExpanded ? 40 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {sidebarExpanded && (
                  <ListItemText 
                    primary={item.text} 
                    sx={{ color: isActive ? '#F8F5EE' : (isDark ? '#F8F5EE' : '#1E1E1E') }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      
      {/* Botão para comprimir/expandir - apenas desktop */}
      {!isMobile && (
        <Box sx={{ p: 1, borderTop: isDark ? '1px solid #12888A' : '1px solid #0E6A6B' }}>
          <IconButton
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            sx={{
              width: '100%',
              color: isDark ? '#12888A' : '#0E6A6B',
              '&:hover': {
                bgcolor: '#0E6A6B',
                color: '#F8F5EE',
              },
            }}
          >
            {sidebarExpanded ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>
      )}
    </Box>
  )

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#0D1117' : '#F2EBDD' }}>
      {/* AppBar */}
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: '#0E6A6B', 
          boxShadow: 3,
          zIndex: (theme) => theme.zIndex.drawer + 1, // Sempre acima da Drawer
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            sx={{ color: '#F8F5EE', mr: 2 }}
            onClick={() => setDrawerOpen(!drawerOpen)}
          >
            <MenuIcon />
          </IconButton>
          
          <Store sx={{ color: '#E47B24', fontSize: 28, mr: 1, display: { xs: 'none', sm: 'block' } }} />
          
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: '#F8F5EE',
              fontSize: { xs: '1rem', sm: '1.25rem' }
            }}
          >
            Painel da Loja SuperPet
          </Typography>

          {/* Menu de Ações Rápidas */}
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

          {/* Menu Dropdown de Opções */}
          <Tooltip title="Mais opções">
            <IconButton 
              sx={{ color: '#F8F5EE', display: { xs: 'flex', md: 'none' } }}
              onClick={handleOpenMenu}
            >
              <MoreVert />
            </IconButton>
          </Tooltip>

          <Menu
            sx={{ mt: '45px' }}
            anchorEl={anchorElMenu}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElMenu)}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: {
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                border: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
              }
            }}
          >
            <MenuItem onClick={handleCloseMenu} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
              <ListItemIcon>
                <Receipt sx={{ color: '#E47B24' }} />
              </ListItemIcon>
              <ListItemText>Novo Pedido</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleCloseMenu} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
              <ListItemIcon>
                <LocalShipping sx={{ color: '#E47B24' }} />
              </ListItemIcon>
              <ListItemText>Entregas</ListItemText>
            </MenuItem>
            <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
            <MenuItem onClick={handleCloseMenu} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
              <ListItemIcon>
                <Language sx={{ color: '#0E6A6B' }} />
              </ListItemIcon>
              <ListItemText>Idioma</ListItemText>
            </MenuItem>
          </Menu>

          {/* Toggle Tema */}
          <Tooltip title={isDark ? 'Tema Claro' : 'Tema Escuro'}>
            <IconButton 
              onClick={toggleTheme}
              sx={{ color: '#F8F5EE' }}
            >
              {isDark ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* Notificações */}
          <Tooltip title="Notificações">
            <IconButton sx={{ color: '#F8F5EE' }}>
              <Notifications />
            </IconButton>
          </Tooltip>

          {/* Menu do Usuário */}
          <Tooltip title="Configurações de conta">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2 }}>
              <Avatar sx={{ bgcolor: '#E47B24', color: '#F8F5EE', fontWeight: 'bold' }}>
                SP
              </Avatar>
            </IconButton>
          </Tooltip>

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
              <ListItemText>Sair</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box className="flex">
        {/* Drawer */}
        {!isMobile && (
          <Drawer
            variant="permanent"
            open
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              transition: 'width 0.3s ease',
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                borderRight: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
                marginTop: '64px', // Altura do AppBar
                height: 'calc(100% - 64px)', // Altura total menos o AppBar
                transition: 'width 0.3s ease',
                overflowX: 'hidden',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}

        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                width: 250,
                borderRight: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
              },
            }}
          >
            <Box sx={{ width: 250, pt: 2, bgcolor: isDark ? '#1C2128' : '#F8F5EE', height: '100%' }}>
              <Box sx={{ 
                px: 2, 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
              }}>
                <Store sx={{ color: '#E47B24', fontSize: 32 }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#0E6A6B' }}>
                  SuperPet
                </Typography>
              </Box>
              
              <List>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <ListItem key={item.text} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(item.path)
                          setDrawerOpen(false)
                        }}
                        sx={{
                          px: 2,
                          bgcolor: isActive ? '#0E6A6B' : 'transparent',
                          '&:hover': {
                            bgcolor: '#0E6A6B',
                            '& .MuiListItemIcon-root': { color: '#F8F5EE' },
                            '& .MuiListItemText-primary': { color: '#F8F5EE' },
                          },
                        }}
                      >
                        <ListItemIcon sx={{ color: isActive ? '#F8F5EE' : '#0E6A6B', minWidth: 40 }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText primary={item.text} sx={{ color: isActive ? '#F8F5EE' : (isDark ? '#F8F5EE' : '#1E1E1E') }} />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
              </List>
            </Box>
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4, lg: 6 },
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            transition: 'width 0.3s ease, margin 0.3s ease',
          }}
        >
          <Container maxWidth="xl">
            {/* Outlet renderiza as páginas filhas */}
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  )
}

export default Dashboard

