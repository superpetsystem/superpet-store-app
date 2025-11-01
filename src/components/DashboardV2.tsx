import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useThemeMode } from '../context/ThemeContext';
import { typography } from '../theme/typography';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
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
  Logout,
  Brightness4,
  Brightness7,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CalendarMonth,
  Vaccines,
  Assessment,
  Business,
  Group,
  AccountBalance,
  LocalOffer,
  Announcement,
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logout } from '../store/slices/authSlice';

// Definição das categorias e seus submenus
const menuCategories = {
  dashboard: {
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    items: [], // Dashboard não tem submenu
  },
  sales: {
    label: 'Vendas',
    icon: <Store />,
    items: [
      { text: 'PDV / Caixa', icon: <Store />, path: '/vendas' },
      { text: 'Produtos', icon: <ShoppingCart />, path: '/produtos' },
      { text: 'Preços e Promoções', icon: <LocalOffer />, path: '/promocoes' },
    ],
  },
  clients: {
    label: 'Clientes',
    icon: <People />,
    items: [
      { text: 'Clientes', icon: <People />, path: '/clientes' },
      { text: 'Pets', icon: <Pets />, path: '/pets' },
      { text: 'Agendamentos', icon: <CalendarMonth />, path: '/agenda' },
      { text: 'Vacinação', icon: <Vaccines />, path: '/vacinas' },
    ],
  },
  operations: {
    label: 'Operações',
    icon: <ContentCut />,
    items: [
      { text: 'Agenda do Dia', icon: <CalendarMonth />, path: '/agenda' },
      { text: 'Serviços (Banho/Tosa)', icon: <ContentCut />, path: '/servicos' },
      { text: 'Estoque', icon: <Inventory />, path: '/estoque' },
    ],
  },
  financial: {
    label: 'Financeiro',
    icon: <MoneyIcon />,
    items: [
      { text: 'Contas a Receber', icon: <AccountBalance />, path: '/financeiro' },
      { text: 'Relatórios', icon: <Assessment />, path: '/relatorios' },
    ],
  },
  admin: {
    label: 'Admin',
    icon: <Settings />,
    items: [
      { text: 'Fornecedores', icon: <Business />, path: '/fornecedores' },
      { text: 'Lembretes', icon: <Announcement />, path: '/lembretes' },
      { text: 'Usuários', icon: <Group />, path: '/usuarios' },
      { text: 'Configurações', icon: <Settings />, path: '/configuracoes' },
    ],
  },
};

const DashboardV2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isDark, toggleTheme } = useThemeMode();
  const { user } = useAppSelector((state) => state.auth);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof menuCategories>('dashboard');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Detectar categoria atual baseado na rota
  React.useEffect(() => {
    const path = location.pathname;
    
    if (path === '/dashboard') {
      setSelectedCategory('dashboard');
    } else if (['/vendas', '/produtos', '/promocoes'].some(p => path.startsWith(p))) {
      setSelectedCategory('sales');
    } else if (['/clientes', '/pets', '/agenda', '/vacinas'].some(p => path.startsWith(p))) {
      setSelectedCategory('clients');
    } else if (['/servicos', '/estoque'].some(p => path.startsWith(p))) {
      setSelectedCategory('operations');
    } else if (['/financeiro', '/relatorios'].some(p => path.startsWith(p))) {
      setSelectedCategory('financial');
    } else if (['/fornecedores', '/lembretes', '/usuarios', '/configuracoes'].some(p => path.startsWith(p))) {
      setSelectedCategory('admin');
    }
  }, [location.pathname]);

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

  const currentItems = selectedCategory === 'dashboard' 
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
      {selectedCategory !== 'dashboard' && (
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
                if (isMobile) setMobileDrawerOpen(false);
              }}
              sx={{
                mb: 0.5,
                borderRadius: 2,
                cursor: 'pointer',
                bgcolor: isActive ? '#0E6A6B' : 'transparent',
                color: isActive ? '#F8F5EE' : (isDark ? '#F8F5EE' : '#1E1E1E'),
                '&:hover': {
                  bgcolor: isActive ? '#0A5152' : (isDark ? 'rgba(18, 136, 138, 0.15)' : 'rgba(14, 106, 107, 0.1)'),
                },
                transition: 'all 0.2s',
              }}
            >
              <ListItemIcon sx={{ color: isActive ? '#F8F5EE' : (isDark ? '#12888A' : '#0E6A6B'), minWidth: 40 }}>
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
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 3 }}>
            <Store sx={{ fontSize: { xs: 24, md: 28 }, color: '#E47B24' }} />
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#F8F5EE',
                fontSize: { xs: '1rem', md: '1.1rem' },
                display: { xs: 'none', sm: 'block' },
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
                    if (key === 'dashboard') {
                      navigate('/dashboard');
                    } else if (category.items.length > 0) {
                      navigate(category.items[0].path);
                    }
                  }}
                  sx={{
                    color: selectedCategory === key ? '#E47B24' : '#F8F5EE',
                    bgcolor: selectedCategory === key ? 'rgba(228, 123, 36, 0.2)' : 'transparent',
                    fontWeight: selectedCategory === key ? 700 : 500,
                    fontSize: '0.85rem',
                    px: 2,
                    '&:hover': {
                      bgcolor: 'rgba(248, 245, 238, 0.1)',
                    },
                  }}
                >
                  {category.label}
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
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
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
              sx={{ textTransform: 'none' }}
            >
              {user?.name}
            </Button>
          )}

          {/* User Menu Dropdown */}
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
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 0.5, fontSize: { xs: '0.875rem', sm: '0.95rem' } }}>
                        {notification.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: isDark ? '#E6E1D6' : '#666', mb: 0.5, fontSize: { xs: '0.8rem', sm: '0.875rem' }, wordBreak: 'break-word' }}>
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? '#12888A' : '#999', fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
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

      <Box sx={{ display: 'flex', mt: '64px' }}>
        {/* Sidebar Desktop */}
        {!isMobile && selectedCategory !== 'dashboard' && (
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
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
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
              <Typography variant="overline" sx={{ color: isDark ? '#12888A' : '#0E6A6B', fontWeight: 700 }}>
                Categorias
              </Typography>
              <List sx={{ p: 0, mt: 1 }}>
                {Object.entries(menuCategories).map(([key, category]) => (
                  <ListItem
                    key={key}
                    onClick={() => {
                      setSelectedCategory(key as any);
                      if (key === 'dashboard') {
                        navigate('/dashboard');
                        setMobileDrawerOpen(false);
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
                    <ListItemIcon sx={{ color: selectedCategory === key ? '#F8F5EE' : (isDark ? '#12888A' : '#0E6A6B'), minWidth: 36 }}>
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
              md: selectedCategory === 'dashboard' ? '100%' : 'calc(100% - 240px)' 
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardV2;

