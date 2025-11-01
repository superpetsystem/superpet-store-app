import { useState } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useThemeMode } from '../context/ThemeContext'
import Navbar from './Navbar'
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Container,
  useMediaQuery,
  useTheme,
  IconButton,
  Typography,
  Tooltip,
  Fab as FabButton,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  ShoppingCart,
  Store,
  People,
  Settings,
  Inventory,
  ChevronLeft,
  ChevronRight,
  ViewSidebar,
} from '@mui/icons-material'

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isDark } = useThemeMode()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  
  const drawerWidth = sidebarExpanded ? 250 : 70

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
      {/* Navbar Component */}
      <Navbar />

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
            position: 'relative',
          }}
        >
          <Container maxWidth="xl">
            {/* Outlet renderiza as páginas filhas */}
            <Outlet />
          </Container>
        </Box>
      </Box>

      {/* Botão Flutuante Sidebar - APENAS MOBILE */}
      {isMobile && (
        <FabButton
          color="primary"
          onClick={() => setDrawerOpen(!drawerOpen)}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: '#E47B24',
            color: '#F8F5EE',
            zIndex: (theme) => theme.zIndex.drawer - 1,
            '&:hover': {
              bgcolor: '#C26619',
            },
            boxShadow: 4,
          }}
        >
          <ViewSidebar />
        </FabButton>
      )}
    </Box>
  )
}

export default Dashboard

