import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { UserRole } from '../types';
import { Box, CircularProgress } from '@mui/material';

/**
 * Guard de Autenticação
 * 
 * COMPORTAMENTO:
 * 1. Usuário NÃO logado → Redireciona para "/" (HomePage com PublicNavbar)
 * 2. Usuário logado SEM permissão → Redireciona para seu dashboard correto
 * 3. Usuário logado COM permissão → Permite acesso
 * 
 * EXEMPLO:
 * - Customer tenta acessar /produtos (owner only) → Vai para /customer/dashboard
 * - Owner tenta acessar /customer/shop → Vai para /dashboard
 * - Visitante tenta acessar /dashboard → Vai para "/" (home)
 */

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { isAuthenticated, user, loading } = useAppSelector((state) => state.auth);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          bgcolor: '#F2EBDD',
        }}
      >
        <CircularProgress sx={{ color: '#0E6A6B' }} />
      </Box>
    );
  }

  // NÃO AUTENTICADO → Vai para home (landing page)
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // AUTENTICADO mas SEM PERMISSÃO → Vai para dashboard correto
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'owner') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  // AUTENTICADO e COM PERMISSÃO → Permite acesso
  return <>{children}</>;
};

export default PrivateRoute;

