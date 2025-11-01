# 🔐 Sistema de Autenticação - SuperPet Store

## 📋 Resumo

Sistema de autenticação refatorado com guards claros e navegação intuitiva.

---

## 🎯 Princípios

1. **Visitantes NÃO logados** → Veem HomePage (landing page) com PublicNavbar
2. **Usuários logados** → Nunca veem HomePage, vão direto para seus dashboards
3. **Tentativa de acesso sem permissão** → Redireciona para home (não para login)
4. **Layouts separados** → PublicNavbar para públicas, Dashboard para owner, CustomerDashboard para customer

---

## 🗺️ Estrutura de Rotas

### **Páginas Públicas** (acessíveis por qualquer visitante)

| Rota | Componente | Layout | Descrição |
|------|-----------|--------|-----------|
| `/` | HomePage | PublicNavbar | Landing page com info do pet shop |
| `/login` | Login | PublicNavbar | Página de login (owner/customer) |
| `/register` | RegisterPage | PublicNavbar | Cadastro de novos customers |

### **Páginas do Owner** (apenas donos de pet shop)

| Rota | Componente | Layout | Descrição |
|------|-----------|--------|-----------|
| `/dashboard` | DashboardPage | Dashboard | Visão geral do negócio |
| `/produtos` | ProductsPage | Dashboard | Catálogo de produtos |
| `/vendas` | POSPage | Dashboard | PDV/Caixa |
| `/clientes` | CustomersPage | Dashboard | Gestão de clientes |
| `/pets` | PetsPage | Dashboard | Gestão de pets |
| `/estoque` | StockPage | Dashboard | Controle de estoque |
| `/servicos` | ServiceOrdersPage | Dashboard | Ordens de serviço |
| `/configuracoes` | SettingsPage | Dashboard | Configurações |

### **Páginas do Customer** (apenas tutores/clientes)

| Rota | Componente | Layout | Descrição |
|------|-----------|--------|-----------|
| `/customer/welcome` | WelcomePage | Nenhum | Onboarding pós-cadastro |
| `/customer/dashboard` | CustomerDashboardPage | CustomerDashboard | Dashboard do tutor |
| `/customer/pets` | CustomerPetsPage | CustomerDashboard | Meus pets |
| `/customer/appointments` | CustomerAppointmentsPage | CustomerDashboard | Meus agendamentos |
| `/customer/vaccinations` | CustomerVaccinationsPage | CustomerDashboard | Vacinação |
| `/customer/shop` | CustomerShopPage | CustomerDashboard | Loja online |
| `/customer/orders` | CustomerOrdersPage | CustomerDashboard | Meus pedidos |
| `/customer/settings` | CustomerSettingsPage | CustomerDashboard | Configurações |

---

## 🔒 Guards de Autenticação

### **ProtectedHome** (`src/components/ProtectedHome.tsx`)

Gerencia a rota raiz `/`:

```typescript
// NÃO logado → Mostra HomePage (landing page)
if (!isAuthenticated) return <HomePage />;

// Owner logado → Redireciona para /dashboard
if (user.role === 'owner') return <Navigate to="/dashboard" />;

// Customer logado → Redireciona para /customer/dashboard
if (user.role === 'customer') return <Navigate to="/customer/dashboard" />;
```

### **PrivateRoute** (`src/components/PrivateRoute.tsx`)

Protege rotas que exigem autenticação:

```typescript
// NÃO logado → Redireciona para "/" (home)
if (!isAuthenticated) return <Navigate to="/" />;

// Logado mas SEM permissão → Redireciona para dashboard correto
if (!allowedRoles.includes(user.role)) {
  if (user.role === 'owner') return <Navigate to="/dashboard" />;
  if (user.role === 'customer') return <Navigate to="/customer/dashboard" />;
}

// Logado e COM permissão → Permite acesso
return <>{children}</>;
```

---

## 🔄 Fluxos de Navegação

### **Fluxo 1: Visitante (não logado)**

```
Acessa "/" 
  → HomePage (landing page)
  → Clica "Entrar" ou "Cadastrar"
  → Vai para /login ou /register
```

### **Fluxo 2: Owner fazendo login**

```
Login bem-sucedido
  → Redireciona para /dashboard
  → Sidebar com 8 opções
  → Pode acessar /produtos, /vendas, /estoque, etc
```

### **Fluxo 3: Customer fazendo cadastro**

```
Cadastro bem-sucedido
  → Redireciona para /customer/welcome (onboarding)
  → Cadastra primeiro pet (opcional)
  → Vai para /customer/dashboard
  → Navbar colorido com 6 seções
```

### **Fluxo 4: Owner tenta acessar rota customer**

```
Owner logado acessa /customer/shop
  → PrivateRoute detecta: owner não tem permissão
  → Redireciona para /dashboard
```

### **Fluxo 5: Customer tenta acessar rota owner**

```
Customer logado acessa /produtos
  → PrivateRoute detecta: customer não tem permissão
  → Redireciona para /customer/dashboard
```

### **Fluxo 6: Visitante tenta acessar rota protegida**

```
Visitante acessa /dashboard
  → PrivateRoute detecta: não autenticado
  → Redireciona para "/" (HomePage)
  → HomePage mostra botão "Entrar"
```

### **Fluxo 7: Usuário logado acessa "/"**

```
Owner acessa "/"
  → ProtectedHome detecta: já está logado
  → Redireciona para /dashboard

Customer acessa "/"
  → ProtectedHome detecta: já está logado
  → Redireciona para /customer/dashboard
```

---

## 💾 Persistência

### **authSlice.ts**

Estado de autenticação persiste no localStorage:

```typescript
// Ao fazer LOGIN
loginSuccess: (state, action) => {
  // Salva no Redux
  state.user = action.payload.user;
  state.token = action.payload.token;
  state.isAuthenticated = true;
  
  // Persiste no localStorage
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

// Ao fazer LOGOUT
logout: (state) => {
  // Limpa Redux
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  
  // Remove do localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}

// Ao INICIAR app
const initialState = loadAuthFromStorage(); // Carrega do localStorage
```

**Resultado:**
- ✅ Usuário faz login → Fecha navegador → Abre novamente → Ainda está logado
- ✅ Recarrega página (F5) → Mantém autenticação
- ✅ Abre nova aba → Está logado automaticamente

---

## 🎨 Layouts

### **PublicNavbar** (páginas públicas)

```
┌─────────────────────────────────────┐
│ 🐾 SuperPet    Entrar | Cadastrar  │
└─────────────────────────────────────┘
```

Aparece em:
- HomePage (/)
- Login (/login)
- Register (/register)

### **Dashboard** (owner sidebar)

```
┌──────┬──────────────────────────────┐
│ 🏪   │  Conteúdo da página          │
│ Menu │                              │
│      │                              │
│ • Dashboard                         │
│ • Produtos                          │
│ • Vendas                            │
│ • Clientes                          │
│ • Pets                              │
│ • Estoque                           │
│ • Serviços                          │
│ • Config                            │
└──────┴──────────────────────────────┘
```

### **CustomerDashboard** (customer navbar)

```
┌─────────────────────────────────────┐
│ 🐾 Olá, [Nome]  🏠 Dashboard | ...  │
└─────────────────────────────────────┘
          Conteúdo da página
```

---

## 🧪 Testes de Cenários

### ✅ Teste 1: Visitante na home
- Acesse `http://localhost:5173/`
- **Esperado:** HomePage com PublicNavbar
- **Botões visíveis:** "Entrar", "Cadastrar"

### ✅ Teste 2: Login como owner
- Faça login: `owner@superpet.com` / `owner123`
- **Esperado:** Redireciona para `/dashboard`
- **Layout:** Sidebar com 8 itens

### ✅ Teste 3: Owner acessa "/"
- Estando logado como owner, digite `/` na URL
- **Esperado:** Redireciona automaticamente para `/dashboard`

### ✅ Teste 4: Owner tenta acessar rota customer
- Estando logado como owner, acesse `/customer/shop`
- **Esperado:** Redireciona para `/dashboard`

### ✅ Teste 5: Logout e reload
- Faça logout
- **Esperado:** Vai para `/` (HomePage)
- Recarregue a página (F5)
- **Esperado:** Continua na HomePage, NÃO está mais logado

### ✅ Teste 6: Login e reload
- Faça login como owner
- Recarregue a página (F5)
- **Esperado:** Continua logado em `/dashboard`

### ✅ Teste 7: Visitante tenta acessar protegida
- Sem estar logado, acesse `/produtos`
- **Esperado:** Redireciona para `/` (HomePage)

### ✅ Teste 8: Customer na welcome page
- Faça cadastro como customer
- **Esperado:** Vai para `/customer/welcome` (onboarding)
- **Layout:** Sem navbar (tela cheia)

---

## 📝 Credenciais de Teste

### Owner (Dono da Loja)
```
Email: owner@superpet.com
Senha: owner123
Acesso: Todas as rotas /dashboard, /produtos, etc
```

### Customer (Tutor/Cliente)
```
Email: customer@example.com
Senha: customer123
Acesso: Todas as rotas /customer/*
```

---

## 🔧 Arquivos Principais

```
src/
├── App.tsx                      # Definição de todas as rotas
├── components/
│   ├── ProtectedHome.tsx        # Guard da rota raiz "/"
│   ├── PrivateRoute.tsx         # Guard de rotas protegidas
│   ├── PublicNavbar.tsx         # Navbar para páginas públicas
│   ├── Dashboard.jsx            # Layout owner (sidebar)
│   └── CustomerDashboard.tsx    # Layout customer (navbar)
├── pages/
│   ├── HomePage.tsx             # Landing page (pública)
│   ├── Login.tsx                # Login (pública)
│   └── RegisterPage.tsx         # Cadastro (pública)
├── store/slices/
│   └── authSlice.ts             # Estado de autenticação + localStorage
└── api/
    └── authApi.ts               # API de autenticação (mockada)
```

---

## ✨ Melhorias Implementadas

### Antes:
- ❌ Lógica de redirecionamento duplicada em várias páginas
- ❌ HomePage e Login com useEffect para redirecionar
- ❌ Estado de auth não persistia ao recarregar
- ❌ Comentários genéricos ou ausentes

### Depois:
- ✅ Lógica centralizada em `ProtectedHome` e `PrivateRoute`
- ✅ Páginas limpas, sem lógica de autenticação
- ✅ Persistência automática no localStorage
- ✅ Documentação completa com comentários detalhados
- ✅ Fluxos claros e bem definidos

---

**Desenvolvido em**: Novembro 2025  
**Status**: ✅ **Refatorado e Documentado**

