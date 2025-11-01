import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  ListItemIcon,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Store as StoreIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Pets as PetsIcon,
  CalendarMonth as CalendarIcon,
  ShoppingCart as ShoppingCartIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logout } from '../store/slices/authSlice';
import { useThemeMode } from '../context/ThemeContext';

const PublicNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isDark } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useAppDispatch();

  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    handleMenuClose();
    navigate('/');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    handleMenuClose();
  };

  // Menu items públicos
  const publicMenuItems = [
    { label: 'Início', path: '/', show: true },
    { label: 'Serviços', path: '/#services', show: true },
    { label: 'Sobre', path: '/#about', show: true },
    { label: 'Contato', path: '/#contact', show: true },
  ];

  // Menu items do customer logado
  const customerMenuItems = [
    { label: 'Dashboard', path: '/customer/dashboard', icon: <DashboardIcon /> },
    { label: 'Meus Pets', path: '/customer/pets', icon: <PetsIcon /> },
    { label: 'Agendamentos', path: '/customer/appointments', icon: <CalendarIcon /> },
    { label: 'Loja', path: '/customer/shop', icon: <ShoppingCartIcon /> },
  ];

  const isHomePage = location.pathname === '/';

  // Mobile Drawer
  const renderMobileDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          bgcolor: isDark ? '#1C2128' : '#F8F5EE',
          border: isDark ? '1px solid #12888A' : 'none',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StoreIcon sx={{ color: '#E47B24', fontSize: 28 }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#0E6A6B' }}>
            SuperPet
          </Typography>
        </Box>
        <IconButton onClick={() => setMobileMenuOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <List sx={{ px: 1 }}>
        {!isAuthenticated ? (
          <>
            {/* Menu público mobile */}
            {publicMenuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => handleNavigate(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate('/login')}>
                <ListItemIcon>
                  <LoginIcon sx={{ color: '#0E6A6B' }} />
                </ListItemIcon>
                <ListItemText primary="Entrar" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigate('/register')}
                sx={{
                  bgcolor: '#E47B24',
                  color: '#FFF',
                  '&:hover': { bgcolor: '#D66B1A' },
                  borderRadius: 1,
                  mx: 1,
                }}
              >
                <ListItemIcon>
                  <PersonAddIcon sx={{ color: '#FFF' }} />
                </ListItemIcon>
                <ListItemText primary="Cadastrar" />
              </ListItemButton>
            </ListItem>
          </>
        ) : user?.role === 'customer' ? (
          <>
            {/* Menu customer mobile */}
            {customerMenuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  selected={location.pathname === item.path}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: '#E47B24',
                      color: '#FFF',
                      '& .MuiListItemIcon-root': { color: '#FFF' },
                    },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleNavigate('/customer/settings')}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Configurações" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: '#D32F2F' }} />
                </ListItemIcon>
                <ListItemText primary="Sair" sx={{ color: '#D32F2F' }} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            {/* Owner logado - vai para dashboard interno */}
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigate('/dashboard')}
                sx={{
                  bgcolor: '#0E6A6B',
                  color: '#FFF',
                  '&:hover': { bgcolor: '#0A5152' },
                  borderRadius: 1,
                  mx: 1,
                }}
              >
                <ListItemIcon>
                  <DashboardIcon sx={{ color: '#FFF' }} />
                </ListItemIcon>
                <ListItemText primary="Painel de Controle" />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={2}
        sx={{
          bgcolor: '#0E6A6B',
          backgroundImage: 'none',
          transition: 'all 0.3s',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            onClick={() => handleNavigate('/')}
          >
            <StoreIcon sx={{ fontSize: 32, color: '#E47B24' }} />
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#F8F5EE' }}>
              SuperPet
            </Typography>
          </Box>

          {/* Desktop Menu */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {!isAuthenticated ? (
                <>
                  {/* Menu público desktop */}
                  {publicMenuItems.map((item) => (
                    <Button
                      key={item.path}
                      onClick={() => handleNavigate(item.path)}
                      sx={{
                        color: '#F8F5EE',
                        fontWeight: 500,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                  <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                  <Button
                    startIcon={<LoginIcon />}
                    onClick={() => handleNavigate('/login')}
                    sx={{
                      color: '#F8F5EE',
                      fontWeight: 600,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                    }}
                  >
                    Entrar
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    onClick={() => handleNavigate('/register')}
                    sx={{
                      bgcolor: '#E47B24',
                      color: '#F8F5EE',
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: '#D66B1A' },
                    }}
                  >
                    Cadastrar
                  </Button>
                </>
              ) : user?.role === 'customer' ? (
                <>
                  {/* Customer logado desktop */}
                  {customerMenuItems.slice(0, 3).map((item) => (
                    <Button
                      key={item.path}
                      startIcon={item.icon}
                      onClick={() => handleNavigate(item.path)}
                      sx={{
                        color: location.pathname === item.path ? '#E47B24' : '#F8F5EE',
                        fontWeight: location.pathname === item.path ? 700 : 500,
                        bgcolor: location.pathname === item.path ? 'rgba(228, 123, 36, 0.15)' : 'transparent',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                  
                  {/* Avatar Menu */}
                  <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
                    <Avatar
                      sx={{ bgcolor: '#E47B24', width: 36, height: 36 }}
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
                    <MenuItem onClick={() => handleNavigate('/customer/dashboard')} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
                      </ListItemIcon>
                      Dashboard
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/customer/settings')} sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
                      <ListItemIcon>
                        <SettingsIcon fontSize="small" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
                      </ListItemIcon>
                      Configurações
                    </MenuItem>
                    <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
                    <MenuItem onClick={handleLogout} sx={{ color: '#F44336' }}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" sx={{ color: '#F44336' }} />
                      </ListItemIcon>
                      <Typography color="#F44336">Sair</Typography>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {/* Owner logado - botão para dashboard interno */}
                  <Button
                    variant="contained"
                    startIcon={<DashboardIcon />}
                    onClick={() => handleNavigate('/dashboard')}
                    sx={{
                      bgcolor: '#E47B24',
                      color: '#F8F5EE',
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: '#D66B1A' },
                    }}
                  >
                    Painel de Controle
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileMenuOpen(true)}
              sx={{ color: '#F8F5EE' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      {renderMobileDrawer()}
    </>
  );
};

export default PublicNavbar;



