import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import PrivateRoute from './components/PrivateRoute';
import ProtectedHome from './components/ProtectedHome';
import DashboardV2 from './components/DashboardV2';
import CustomerDashboardV2 from './components/CustomerDashboardV2';
import Login from './pages/Login';
import RegisterPage from './pages/RegisterPage';

// Owner Pages
import DashboardPage from './pages/DashboardPage';
import { ProductsPage } from './features/products/components';
import { POSPage as SalesPage } from './features/sales/components';
import CustomersPage from './features/customers/components/CustomersPage';
import PetsPage from './features/pets/components/PetsPage';
import { StockPage } from './features/stock/components';
import { ServiceOrdersPage } from './features/serviceOrders/components';
import { AppointmentsPage } from './features/appointments/components';
import { VaccinationsPage } from './features/vaccinations/components';
import { SalesReportsPage } from './features/reports/components';
import { SuppliersPage } from './features/suppliers/components';
import { PromotionsPage } from './features/promotions/components';
import { RemindersPage } from './features/reminders/components';
import { AccountsPage } from './features/accounts/components';
import { UsersPage } from './features/users/components';
import SettingsPage from './pages/SettingsPage';

// Customer Pages
import WelcomePage from './pages/customer/WelcomePage';
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage';
import CustomerPetsPage from './pages/customer/CustomerPetsPage';
import CustomerAppointmentsPage from './pages/customer/CustomerAppointmentsPage';
import CustomerVaccinationsPage from './pages/customer/CustomerVaccinationsPage';
import CustomerShopPage from './pages/customer/CustomerShopPage';
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage';
import CustomerSettingsPage from './pages/customer/CustomerSettingsPage';
import CustomerPromotionsPage from './pages/customer/CustomerPromotionsPage';
import CustomerAccountsPage from './pages/customer/CustomerAccountsPage';

/**
 * SISTEMA DE ROTAS E AUTENTICAÇÃO
 * 
 * PÁGINAS PÚBLICAS (com PublicNavbar):
 * - "/" → HomePage (landing page) OU redireciona se logado
 * - "/login" → Login page
 * - "/register" → Register page
 * 
 * PÁGINAS PROTEGIDAS OWNER (com Dashboard sidebar):
 * - "/dashboard" → Dashboard principal
 * - "/produtos" → Catálogo de produtos
 * - "/vendas" → PDV/Caixa
 * - "/clientes" → Gestão de clientes
 * - "/pets" → Gestão de pets
 * - "/estoque" → Controle de estoque
 * - "/servicos" → Ordens de serviço (banho/tosa)
 * - "/agenda" → Agenda de serviços
 * - "/vacinas" → Ficha de vacinação
 * - "/relatorios" → Relatórios de vendas
 * - "/configuracoes" → Configurações
 * 
 * PÁGINAS PROTEGIDAS CUSTOMER (com CustomerDashboard navbar):
 * - "/customer/welcome" → Onboarding pós-cadastro
 * - "/customer/dashboard" → Dashboard do tutor
 * - "/customer/pets" → Meus pets
 * - "/customer/appointments" → Meus agendamentos
 * - "/customer/vaccinations" → Vacinação
 * - "/customer/shop" → Loja online
 * - "/customer/orders" → Meus pedidos
 * - "/customer/promotions" → Promoções
 * - "/customer/accounts" → Minhas contas
 * - "/customer/settings" → Configurações
 * 
 * FLUXO DE AUTENTICAÇÃO:
 * - Não logado tenta acessar rota protegida → Redireciona para "/"
 * - Owner logado acessa "/" → Redireciona para "/dashboard"
 * - Customer logado acessa "/" → Redireciona para "/customer/dashboard"
 * - Owner tenta acessar rota customer → Redireciona para "/dashboard"
 * - Customer tenta acessar rota owner → Redireciona para "/customer/dashboard"
 */

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* ROTA RAIZ - HomePage (landing page) ou dashboard se logado */}
          <Route path="/" element={<ProtectedHome />} />
          
          {/* ROTAS PÚBLICAS - Acessíveis por qualquer visitante */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* ROTAS DO OWNER - Apenas para donos de pet shop */}
          <Route
            path="/"
            element={
              <PrivateRoute allowedRoles={['owner']}>
                <DashboardV2 />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="produtos" element={<ProductsPage />} />
            <Route path="vendas" element={<SalesPage />} />
            <Route path="clientes" element={<CustomersPage />} />
            <Route path="pets" element={<PetsPage />} />
            <Route path="estoque" element={<StockPage />} />
            <Route path="servicos" element={<ServiceOrdersPage />} />
            <Route path="agenda" element={<AppointmentsPage />} />
            <Route path="vacinas" element={<VaccinationsPage />} />
            <Route path="relatorios" element={<SalesReportsPage />} />
            <Route path="fornecedores" element={<SuppliersPage />} />
            <Route path="promocoes" element={<PromotionsPage />} />
            <Route path="lembretes" element={<RemindersPage />} />
            <Route path="financeiro" element={<AccountsPage />} />
            <Route path="usuarios" element={<UsersPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
          </Route>

          {/* WELCOME PAGE - Onboarding pós-cadastro (sem layout) */}
          <Route
            path="/customer/welcome"
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <WelcomePage />
              </PrivateRoute>
            }
          />

          {/* ROTAS DO CUSTOMER - Apenas para tutores/clientes */}
          <Route
            path="/customer"
            element={
              <PrivateRoute allowedRoles={['customer']}>
                <CustomerDashboardV2 />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<CustomerDashboardPage />} />
            <Route path="pets" element={<CustomerPetsPage />} />
            <Route path="appointments" element={<CustomerAppointmentsPage />} />
            <Route path="vaccinations" element={<CustomerVaccinationsPage />} />
            <Route path="shop" element={<CustomerShopPage />} />
            <Route path="orders" element={<CustomerOrdersPage />} />
            <Route path="promotions" element={<CustomerPromotionsPage />} />
            <Route path="accounts" element={<CustomerAccountsPage />} />
            <Route path="settings" element={<CustomerSettingsPage />} />
          </Route>
          
          {/* 404 - Qualquer rota não encontrada volta para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

