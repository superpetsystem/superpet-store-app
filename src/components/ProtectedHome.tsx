import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import HomePage from '../pages/HomePage';

/**
 * Protected Home - Gerencia a rota raiz "/"
 * 
 * COMPORTAMENTO:
 * 1. Visitante (NÃO logado) → Mostra HomePage (landing page com PublicNavbar)
 * 2. Owner logado → Redireciona para /dashboard
 * 3. Customer logado → Redireciona para /customer/dashboard
 * 
 * NAVEGAÇÃO:
 * - HomePage tem botões "Entrar" e "Cadastrar" no PublicNavbar
 * - HomePage tem CTAs que levam para /login e /register
 * - Usuários logados nunca veem a HomePage (vão direto pro dashboard)
 */
const ProtectedHome = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // LOGADO → Redireciona para dashboard apropriado
  if (isAuthenticated && user) {
    if (user.role === 'owner') {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/customer/dashboard" replace />;
    }
  }

  // NÃO LOGADO → Mostra HomePage (landing page)
  return <HomePage />;
};

export default ProtectedHome;



