import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  useTheme,
  Badge,
  Button,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Pets as PetsIcon,
  CalendarMonth as CalendarIcon,
  LocalHospital as MedicalIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ShoppingCart as ShoppingCartIcon,
  Receipt as ReceiptIcon,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useThemeMode } from '../context/ThemeContext';
import { typography } from '../theme/typography';

const CustomerDashboard = () => {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const user = useAppSelector((state) => state.auth.user);

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);

  const menuItems = [
    { text: 'Início', icon: <DashboardIcon />, path: '/customer/dashboard' },
    { text: 'Meus Pets', icon: <PetsIcon />, path: '/customer/pets' },
    { text: 'Agendamentos', icon: <CalendarIcon />, path: '/customer/appointments' },
    { text: 'Vacinação', icon: <MedicalIcon />, path: '/customer/vaccinations' },
    { text: 'Loja', icon: <ShoppingCartIcon />, path: '/customer/shop' },
    { text: 'Pedidos', icon: <ReceiptIcon />, path: '/customer/orders' },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setDrawerOpen(false);
    }
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  // Notificações mockadas
  const mockNotifications = [
    {
      id: 1,
      title: 'Vacina em dia!',
      message: 'A vacina antirrábica do Rex está próxima do vencimento',
      time: 'há 2 horas',
      type: 'warning',
      icon: <MedicalIcon />,
    },
    {
      id: 2,
      title: 'Agendamento confirmado',
      message: 'Banho e tosa para amanhã às 14h',
      time: 'há 5 horas',
      type: 'success',
      icon: <CalendarIcon />,
    },
    {
      id: 3,
      title: 'Novo produto disponível',
      message: 'Ração Premium Golden está em promoção',
      time: 'há 1 dia',
      type: 'info',
      icon: <ShoppingCartIcon />,
    },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
      {/* User Info */}
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: '2px solid #E47B24',
          bgcolor: isDark ? '#0E6A6B' : 'linear-gradient(135deg, #0E6A6B 0%, #12888A 100%)',
        }}
      >
        <Avatar
          sx={{ 
            bgcolor: '#E47B24', 
            width: 60, 
            height: 60, 
            fontSize: '1.5rem',
            mx: 'auto',
            mb: 1,
          }}
        >
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#F8F5EE', mb: 0.5 }}>
          {user?.name || 'Cliente'}
        </Typography>
        <Typography variant="caption" sx={{ color: '#E47B24', fontWeight: 600 }}>
          Portal do Cliente
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ flex: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              onClick={() => handleNavigate(item.path)}
              sx={{
                mx: 1.5,
                mb: 0.5,
                borderRadius: 2,
                bgcolor: isActive ? '#E47B24' : 'transparent',
                color: isActive ? '#F8F5EE' : (isDark ? '#F8F5EE' : '#1E1E1E'),
                '&:hover': {
                  bgcolor: isActive ? '#D66B1A' : (isDark ? 'rgba(228, 123, 36, 0.15)' : 'rgba(228, 123, 36, 0.1)'),
                },
                transition: 'all 0.2s',
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#F8F5EE' : '#E47B24', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.95rem',
                  color: isActive ? '#F8F5EE' : (isDark ? '#F8F5EE' : '#1E1E1E'),
                }}
              />
            </ListItem>
          );
        })}
      </List>

      {/* Settings */}
      <Divider sx={{ borderColor: isDark ? '#12888A' : '#E47B24' }} />
      <ListItem
        button
        onClick={() => handleNavigate('/customer/settings')}
        sx={{
          mx: 1.5,
          my: 1,
          borderRadius: 2,
          color: isDark ? '#F8F5EE' : '#1E1E1E',
          '&:hover': {
            bgcolor: isDark ? 'rgba(228, 123, 36, 0.15)' : 'rgba(228, 123, 36, 0.1)',
          },
        }}
      >
        <ListItemIcon sx={{ color: '#E47B24', minWidth: 40 }}>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText
          primary="Configurações"
          primaryTypographyProps={{
            fontWeight: 500,
            fontSize: '0.95rem',
            color: isDark ? '#F8F5EE' : '#1E1E1E',
          }}
        />
      </ListItem>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: isDark ? '#0D1117' : '#F2EBDD' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: '#0E6A6B',
          backgroundImage: 'none',
          boxShadow: 2,
        }}
      >
        <Toolbar>
          {/* Menu Toggle */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <PetsIcon sx={{ fontSize: { xs: 28, md: 32 }, color: '#E47B24' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#F8F5EE',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
              }}
            >
              SuperPet
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
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar
              sx={{ bgcolor: '#E47B24', width: { xs: 32, md: 36 }, height: { xs: 32, md: 36 } }}
              alt={user?.name}
              src={user?.avatar}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
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
              onClick={() => { handleMenuClose(); handleNavigate('/customer/settings'); }}
              sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
              </ListItemIcon>
              <ListItemText>Configurações</ListItemText>
            </MenuItem>
            <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
            <MenuItem onClick={handleLogout} sx={{ color: '#F44336' }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#F44336' }} />
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
                width: { xs: 'calc(100vw - 32px)', sm: 360 },
                maxWidth: { xs: 'calc(100vw - 32px)', sm: 360 },
                maxHeight: { xs: 'calc(100vh - 100px)', sm: 500 },
                mx: { xs: 2, sm: 0 },
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: isDark ? '1px solid #12888A' : '1px solid #0E6A6B' }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                Notificações
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

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: 260,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            borderRight: '2px solid #E47B24',
            bgcolor: isDark ? '#1C2128' : '#F8F5EE',
            mt: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          mt: 8,
          width: { xs: '100%', md: `calc(100% - 260px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default CustomerDashboard;



