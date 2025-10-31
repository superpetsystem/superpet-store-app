import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from './components/Dashboard'
import Login from './pages/Login'
import DashboardPage from './pages/DashboardPage'
import ProductsPage from './pages/ProductsPage'
import SalesPage from './pages/SalesPage'
import CustomersPage from './pages/CustomersPage'
import StockPage from './pages/StockPage'
import SettingsPage from './pages/SettingsPage'

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
          {/* Rota de Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Redireciona raiz para login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rotas protegidas */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          >
            {/* Rotas filhas que renderizam dentro do Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="produtos" element={<ProductsPage />} />
            <Route path="vendas" element={<SalesPage />} />
            <Route path="clientes" element={<CustomersPage />} />
            <Route path="estoque" element={<StockPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />
          </Route>
          
          {/* Rota 404 - redireciona para dashboard se autenticado, senão para login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
