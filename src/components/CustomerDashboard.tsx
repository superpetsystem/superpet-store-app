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
  LocalOffer,
  AccountBalance,
  Home,
  CreditCard,
  Star,
  PhotoLibrary,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useThemeMode } from '../context/ThemeContext';

// Categorias do menu do cliente
const menuCategories = {
  home: {
    label: 'Início',
    icon: <Home />,
    path: '/customer/dashboard',
    items: [], // Início não tem submenu
  },
  pets: {
    label: 'Meus Pets',
    icon: <PetsIcon />,
    items: [
      { text: 'Meus Pets', icon: <PetsIcon />, path: '/customer/pets' },
      { text: 'Carteirinha Digital', icon: <CreditCard />, path: '/customer/pet-card' },
      { text: 'Vacinação', icon: <MedicalIcon />, path: '/customer/vaccinations' },
      { text: 'Galeria de Fotos', icon: <PhotoLibrary />, path: '/customer/gallery' },
    ],
  },
  services: {
    label: 'Serviços',
    icon: <CalendarIcon />,
    items: [
      { text: 'Agendamentos', icon: <CalendarIcon />, path: '/customer/appointments' },
      { text: 'Hotel & Creche', icon: <Home />, path: '/customer/hotel' },
      { text: 'Loja Online', icon: <ShoppingCartIcon />, path: '/customer/shop' },
      { text: 'Assinaturas', icon: <ReceiptIcon />, path: '/customer/subscriptions' },
      { text: 'Promoções', icon: <LocalOffer />, path: '/customer/promotions' },
    ],
  },
  financial: {
    label: 'Financeiro',
    icon: <AccountBalance />,
    items: [
      { text: 'Meus Pedidos', icon: <ReceiptIcon />, path: '/customer/orders' },
      { text: 'Minhas Contas', icon: <AccountBalance />, path: '/customer/accounts' },
      { text: 'Programa Fidelidade', icon: <Star />, path: '/customer/loyalty' },
      { text: 'Avaliar Atendimento', icon: <Star />, path: '/customer/reviews' },
    ],
  },
  settings: {
    label: 'Configurações',
    icon: <SettingsIcon />,
    path: '/customer/settings',
    items: [], // Configurações não tem submenu
  },
};

const CustomerDashboard = () => {
  const theme = useTheme();
  const { isDark, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const user = useAppSelector((state) => state.auth.user);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof menuCategories>('home');

  // Detectar categoria atual baseado na rota
  React.useEffect(() => {
    const path = location.pathname;
    
    if (path === '/customer/dashboard') {
      setSelectedCategory('home');
    } else if (['/customer/pets', '/customer/vaccinations'].some(p => path.startsWith(p))) {
      setSelectedCategory('pets');
    } else if (['/customer/appointments', '/customer/hotel', '/customer/shop', '/customer/subscriptions', '/customer/promotions'].some(p => path.startsWith(p))) {
      setSelectedCategory('services');
    } else if (['/customer/orders', '/customer/accounts', '/customer/loyalty', '/customer/reviews'].some(p => path.startsWith(p))) {
      setSelectedCategory('financial');
    } else if (path.startsWith('/customer/settings')) {
      setSelectedCategory('settings');
    }
  }, [location.pathname]);

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

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

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

  const currentItems = ['home', 'settings'].includes(selectedCategory)
    ? []
    : menuCategories[selectedCategory].items;

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
      {/* Categoria Selecionada */}
      {!['home', 'settings'].includes(selectedCategory) && (
        <Box sx={{ px: 2, mb: 3 }}>
          <Typography variant="overline" sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 700, display: 'block', mb: 1 }}>
            {menuCategories[selectedCategory].label}
          </Typography>
          <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B', borderWidth: 2 }} />
        </Box>
      )}

      {/* Menu Items */}
      <List sx={{ flex: 1, px: 1.5 }}>
        {currentItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem
              key={item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setDrawerOpen(false);
              }}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                cursor: 'pointer',
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
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
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

          {/* Menu de Categorias (Desktop) */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1, flexGrow: 1 }}>
              {Object.entries(menuCategories).map(([key, category]) => (
                <Button
                  key={key}
                  startIcon={category.icon}
                  onClick={() => {
                    setSelectedCategory(key as any);
                    if (['home', 'settings'].includes(key)) {
                      navigate((category as any).path);
                    } else if (category.items.length > 0) {
                      navigate(category.items[0].path);
                    }
                  }}
                  sx={{
                    color: selectedCategory === key ? '#E47B24' : '#F8F5EE',
                    bgcolor: selectedCategory === key ? 'rgba(228, 123, 36, 0.2)' : 'transparent',
                    fontWeight: selectedCategory === key ? 700 : 500,
                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                    px: { xs: 1, md: 2 },
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: 'rgba(248, 245, 238, 0.1)',
                    },
                  }}
                >
                  {!isMobile && category.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Menu Mobile Toggle */}
          {isMobile && (
            <>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                onClick={() => setDrawerOpen(!drawerOpen)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}

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
          
          {/* User Menu Dropdown */}
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
              onClick={() => { handleMenuClose(); navigate('/customer/settings'); }}
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

      <Box sx={{ display: 'flex', mt: '64px', width: '100%' }}>
        {/* Sidebar Desktop */}
        {!isMobile && !['home', 'settings'].includes(selectedCategory) && (
          <Drawer
            variant="permanent"
            sx={{
              width: 240,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: 240,
                boxSizing: 'border-box',
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                borderRight: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
                top: '64px',
                height: 'calc(100% - 64px)',
              },
            }}
          >
            {drawer}
          </Drawer>
        )}

        {/* Sidebar Mobile */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': {
                width: 260,
                bgcolor: isDark ? '#1C2128' : '#F8F5EE',
                borderRight: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
                top: '64px',
                height: 'calc(100% - 64px)',
              },
            }}
          >
            {/* Menu Categorias Mobile */}
            <Box sx={{ p: 2 }}>
              <Box
                sx={{
                  textAlign: 'center',
                  mb: 2,
                  pb: 2,
                  borderBottom: `2px solid ${isDark ? '#12888A' : '#E47B24'}`,
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
                <Typography variant="h6" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B' }}>
                  {user?.name || 'Cliente'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#E47B24', fontWeight: 600 }}>
                  Portal do Cliente
                </Typography>
              </Box>

              <Typography variant="overline" sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 700 }}>
                Categorias
              </Typography>
              <List sx={{ p: 0, mt: 1 }}>
                {Object.entries(menuCategories).map(([key, category]) => (
                  <ListItem
                    key={key}
                    onClick={() => {
                      setSelectedCategory(key as any);
                      if (['home', 'settings'].includes(key)) {
                        navigate((category as any).path);
                        setDrawerOpen(false);
                      }
                    }}
                    sx={{
                      mb: 0.5,
                      borderRadius: 2,
                      cursor: 'pointer',
                      bgcolor: selectedCategory === key ? '#E47B24' : 'transparent',
                      color: selectedCategory === key ? '#F8F5EE' : (isDark ? '#F8F5EE' : '#1E1E1E'),
                      '&:hover': {
                        bgcolor: selectedCategory === key ? '#C26619' : 'rgba(228, 123, 36, 0.1)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: selectedCategory === key ? '#F8F5EE' : '#E47B24', minWidth: 36 }}>
                      {category.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={category.label}
                      primaryTypographyProps={{
                        fontWeight: selectedCategory === key ? 600 : 500,
                        fontSize: '0.9rem',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Divider sx={{ borderColor: isDark ? '#12888A' : '#E47B24', borderWidth: 2, mx: 2 }} />

            {/* Submenu Mobile */}
            {drawer}
          </Drawer>
        )}

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: { 
              xs: '100%', 
              md: ['home', 'settings'].includes(selectedCategory) ? '100%' : 'calc(100% - 240px)' 
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default CustomerDashboard;

