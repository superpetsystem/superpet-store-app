import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import { typography } from '../theme/typography';
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
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Button,
  Badge,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  ShoppingCart,
  Store,
  People,
  Pets,
  Settings,
  Inventory,
  ContentCut,
  ChevronLeft,
  ChevronRight,
  ViewSidebar,
  Logout,
  Person,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CalendarMonth,
  Vaccines,
  Assessment,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isDark, toggleTheme } = useThemeMode();
  const { user } = useAppSelector((state) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerWidth = sidebarExpanded ? 250 : 70;

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Agenda', icon: <CalendarMonth />, path: '/agenda' },
    { text: 'Produtos', icon: <ShoppingCart />, path: '/produtos' },
    { text: 'Vendas', icon: <Store />, path: '/vendas' },
    { text: 'Clientes', icon: <People />, path: '/clientes' },
    { text: 'Pets', icon: <Pets />, path: '/pets' },
    { text: 'Estoque', icon: <Inventory />, path: '/estoque' },
    { text: 'Serviços', icon: <ContentCut />, path: '/servicos' },
    { text: 'Vacinação', icon: <Vaccines />, path: '/vacinas' },
    { text: 'Relatórios', icon: <Assessment />, path: '/relatorios' },
    { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  // Notificações mockadas para loja
  const mockNotifications = [
    {
      id: 1,
      title: 'Estoque Baixo!',
      message: 'Ração Golden Adulto tem apenas 5 unidades em estoque',
      time: 'há 30 min',
      type: 'warning',
      icon: <WarningIcon />,
    },
    {
      id: 2,
      title: 'Nova Venda',
      message: 'Pedido #1234 no valor de R$ 250,00 foi confirmado',
      time: 'há 1 hora',
      type: 'success',
      icon: <MoneyIcon />,
    },
    {
      id: 3,
      title: 'Agendamento Confirmado',
      message: 'Banho e tosa para Rex - Hoje às 15h',
      time: 'há 2 horas',
      type: 'info',
      icon: <ContentCut />,
    },
    {
      id: 4,
      title: 'Novo Cliente',
      message: 'Maria Silva se cadastrou na plataforma',
      time: 'há 3 horas',
      type: 'info',
      icon: <People />,
    },
  ];

  const drawer = (
    <Box
      sx={{
        width: '100%',
        pt: 2,
        bgcolor: isDark ? '#1C2128' : '#F8F5EE',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          px: sidebarExpanded ? 2 : 1,
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          justifyContent: sidebarExpanded ? 'flex-start' : 'center',
        }}
      >
        <Store sx={{ color: '#E47B24', fontSize: sidebarExpanded ? 32 : 28 }} />
        {sidebarExpanded && (
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#0E6A6B' }}>
            SuperPet
          </Typography>
        )}
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
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
                    sx={{ color: isActive ? '#F8F5EE' : isDark ? '#F8F5EE' : '#1E1E1E' }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
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
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: isDark ? '#0D1117' : '#F2EBDD' }}>
      {/* AppBar Superior */}
      <AppBar
        position="fixed"
        sx={{
          bgcolor: '#0E6A6B',
          backgroundImage: 'none',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Menu Mobile */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo e Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Store sx={{ fontSize: { xs: 24, md: 32 }, color: '#E47B24' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#F8F5EE',
                fontSize: { xs: '1rem', md: '1.25rem' },
                display: { xs: 'none', sm: 'block' },
              }}
            >
              SuperPet - Gestão
            </Typography>
          </Box>

          {/* Tema Toggle */}
          <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: { xs: 0.5, md: 1 } }}>
            {isDark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {/* Notificações */}
          <IconButton 
            color="inherit" 
            onClick={handleNotificationsOpen}
            sx={{ mr: { xs: 0.5, md: 1 } }}
          >
            <Badge badgeContent={mockNotifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Menu */}
          {isMobile ? (
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#E47B24' }}>
                {user?.name.charAt(0)}
              </Avatar>
            </IconButton>
          ) : (
            <Button
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
              startIcon={
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#E47B24' }}>
                  {user?.name.charAt(0)}
                </Avatar>
              }
            >
              {user?.name}
            </Button>
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                border: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
                mt: 1,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                {user?.email}
              </Typography>
            </Box>
            <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
            <MenuItem 
              onClick={() => { setAnchorEl(null); navigate('/configuracoes'); }}
              sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}
            >
              <ListItemIcon>
                <Settings fontSize="small" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
              </ListItemIcon>
              <ListItemText>Configurações</ListItemText>
            </MenuItem>
            <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
            <MenuItem onClick={handleLogout} sx={{ color: '#F44336' }}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: '#F44336' }} />
              </ListItemIcon>
              <ListItemText>Sair</ListItemText>
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              sx: {
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                border: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
                mt: 1,
                width: { xs: 'calc(100vw - 32px)', sm: 380 },
                maxWidth: { xs: 'calc(100vw - 32px)', sm: 380 },
                maxHeight: { xs: 'calc(100vh - 100px)', sm: 500 },
                mx: { xs: 2, sm: 0 },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: isDark ? '1px solid #12888A' : '1px solid #0E6A6B' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                Notificações da Loja
              </Typography>
            </Box>

            {mockNotifications.length === 0 ? (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <NotificationsIcon sx={{ fontSize: 48, color: isDark ? '#12888A' : '#ccc', mb: 1 }} />
                <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666' }}>
                  Nenhuma notificação
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {mockNotifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <MenuItem
                      onClick={handleNotificationsClose}
                      sx={{
                        py: 2,
                        px: { xs: 1.5, sm: 2 },
                        alignItems: 'flex-start',
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(228, 123, 36, 0.1)' : 'rgba(14, 106, 107, 0.05)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ mt: 0.5, minWidth: { xs: 36, sm: 48 } }}>
                        <Box
                          sx={{
                            bgcolor: notification.type === 'warning' ? '#FF9800' : notification.type === 'success' ? '#4CAF50' : '#2196F3',
                            color: '#FFF',
                            borderRadius: '50%',
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {notification.icon}
                        </Box>
                      </ListItemIcon>
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography 
                          variant="subtitle2" 
                          fontWeight="bold" 
                          sx={{ 
                            color: isDark ? '#F8F5EE' : '#0E6A6B', 
                            mb: 0.5,
                            fontSize: { xs: '0.875rem', sm: '0.95rem' },
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: isDark ? '#E6E1D6' : '#666', 
                            mb: 0.5,
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            wordBreak: 'break-word',
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: isDark ? '#12888A' : '#999',
                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                          }}
                        >
                          {notification.time}
                        </Typography>
                      </Box>
                    </MenuItem>
                    {index < mockNotifications.length - 1 && (
                      <Divider sx={{ borderColor: isDark ? '#12888A' : '#E0E0E0' }} />
                    )}
                  </Box>
                ))}
              </List>
            )}

            <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
            <Box sx={{ p: 1.5, textAlign: 'center' }}>
              <Button
                size="small"
                sx={{
                  color: '#0E6A6B',
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: isDark ? 'rgba(18, 136, 138, 0.1)' : 'rgba(14, 106, 107, 0.05)',
                  },
                }}
              >
                Ver todas as notificações
              </Button>
            </Box>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box className="flex">
        {/* Drawer Desktop */}
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
                marginTop: '64px',
                height: 'calc(100% - 64px)',
                transition: 'width 0.3s ease',
                overflowX: 'hidden',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}

        {/* Drawer Mobile */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{
              '& .MuiDrawer-paper': {
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                width: 260,
                borderRight: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4, lg: 6 },
            pt: { xs: 8, md: 4 },
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            transition: 'width 0.3s ease, margin 0.3s ease',
            position: 'relative',
            mt: '64px',
          }}
        >
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;

