# Arquitetura Redux - SuperPet Store

## 📋 Visão Geral

O sistema utiliza **Redux Toolkit** para gerenciamento de estado global com TypeScript para type safety completo.

## 🗂️ Estrutura de Pastas

```
src/
├── store/
│   ├── index.ts              # Configuração do store
│   ├── hooks.ts              # Hooks tipados (useAppDispatch, useAppSelector)
│   └── slices/               # Redux slices
│       ├── authSlice.ts
│       ├── customersSlice.ts
│       ├── petsSlice.ts
│       ├── servicesSlice.ts
│       ├── serviceOrdersSlice.ts
│       ├── productsSlice.ts
│       ├── salesSlice.ts
│       └── stockSlice.ts
├── types/
│   └── index.ts              # Tipos TypeScript centralizados
└── utils/
    └── typeValidation.ts     # Validação de alinhamento de tipos
```

## 📊 Estados Gerenciados

### 1. **AuthState** - Autenticação
```typescript
{
  user: User | null;           // Usuário logado (owner ou customer)
  isAuthenticated: boolean;    // Status de autenticação
  token: string | null;        // Token JWT
  loading: boolean;            // Loading de operações
  error: string | null;        // Mensagens de erro
}
```

**Actions:**
- `loginStart()` - Inicia processo de login
- `loginSuccess(user, token)` - Login bem-sucedido
- `loginFailure(error)` - Erro no login
- `logout()` - Logout do usuário
- `updateUser(data)` - Atualiza dados do usuário
- `clearError()` - Limpa mensagens de erro

---

### 2. **CustomersState** - Clientes/Tutores
```typescript
{
  customers: Customer[];          // Lista de clientes
  selectedCustomer: Customer | null;
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `setCustomers(customers)` - Define lista de clientes
- `addCustomer(customer)` - Adiciona novo cliente
- `updateCustomer(customer)` - Atualiza cliente existente
- `deleteCustomer(id)` - Remove cliente
- `setSelectedCustomer(customer)` - Seleciona cliente
- `clearCustomers()` - Limpa todos os clientes

---

### 3. **PetsState** - Pets
```typescript
{
  pets: Pet[];                 // Lista de pets
  selectedPet: Pet | null;     // Pet selecionado
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `setPets(pets)` - Define lista de pets
- `addPet(pet)` - Adiciona novo pet
- `updatePet(pet)` - Atualiza pet existente
- `deletePet(id)` - Remove pet
- `setSelectedPet(pet)` - Seleciona pet
- `clearPets()` - Limpa todos os pets

---

### 4. **ServicesState** - Serviços e Agendamentos
```typescript
{
  services: Service[];                        // Catálogo de serviços
  appointments: ServiceAppointment[];         // Agendamentos
  selectedAppointment: ServiceAppointment | null;
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `setServices(services)` - Define catálogo de serviços
- `addService(service)` - Adiciona serviço
- `updateService(service)` - Atualiza serviço
- `deleteService(id)` - Remove serviço
- `setAppointments(appointments)` - Define agendamentos
- `addAppointment(appointment)` - Adiciona agendamento
- `updateAppointment(appointment)` - Atualiza agendamento
- `deleteAppointment(id)` - Remove agendamento
- `setSelectedAppointment(appointment)` - Seleciona agendamento

---

### 5. **ServiceOrdersState** - Ordens de Serviço
```typescript
{
  orders: ServiceOrder[];             // Ordens de serviço (banho/tosa)
  selectedOrder: ServiceOrder | null;
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `setOrders(orders)` - Define ordens
- `addOrder(order)` - Adiciona ordem
- `updateOrder(order)` - Atualiza ordem
- `deleteOrder(id)` - Remove ordem
- `setSelectedOrder(order)` - Seleciona ordem

---

### 6. **ProductsState** - Produtos
```typescript
{
  products: Product[];              // Catálogo de produtos
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `setProducts(products)` - Define produtos
- `addProduct(product)` - Adiciona produto
- `updateProduct(product)` - Atualiza produto
- `deleteProduct(id)` - Remove produto
- `setSelectedProduct(product)` - Seleciona produto
- `updateProductStock(id, quantity)` - Atualiza estoque

---

### 7. **SalesState** - Vendas/PDV
```typescript
{
  sales: Sale[];                // Histórico de vendas
  currentSale: Sale | null;     // Venda atual no PDV
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `setSales(sales)` - Define histórico
- `addSale(sale)` - Adiciona venda
- `setCurrentSale(sale)` - Define venda atual
- `addItemToCurrentSale(item)` - Adiciona item
- `removeItemFromCurrentSale(itemId)` - Remove item
- `updateItemQuantity(itemId, quantity)` - Atualiza quantidade
- `applyDiscount(amount)` - Aplica desconto
- `clearCurrentSale()` - Limpa venda atual

---

### 8. **StockState** - Controle de Estoque
```typescript
{
  movements: StockMovement[];    // Movimentações de estoque
  loading: boolean;
  error: string | null;
}
```

**Actions:**
- `setMovements(movements)` - Define movimentações
- `addMovement(movement)` - Adiciona movimentação
- `clearMovements()` - Limpa movimentações

---

## 🔧 Uso dos Hooks

### Hook `useAppDispatch`
```typescript
const dispatch = useAppDispatch();

// Disparar actions
dispatch(loginSuccess({ user, token }));
dispatch(addCustomer(newCustomer));
```

### Hook `useAppSelector`
```typescript
const { user, isAuthenticated } = useAppSelector((state) => state.auth);
const { customers, loading } = useAppSelector((state) => state.customers);
```

---

## ✅ Validação de Tipos

O arquivo `src/utils/typeValidation.ts` garante que:

1. **Todos os slices usam os tipos corretos** de `src/types/index.ts`
2. **Não há divergência** entre tipos e implementação
3. **Mudanças em tipos causam erro** de compilação se não refletidas no Redux

Se houver erro de compilação neste arquivo, significa que há desalinhamento entre tipos e Redux.

---

## 🎯 Padrões e Boas Práticas

### 1. Sempre use os hooks tipados
❌ **Errado:**
```typescript
import { useDispatch, useSelector } from 'react-redux';
```

✅ **Correto:**
```typescript
import { useAppDispatch, useAppSelector } from '../store/hooks';
```

### 2. Use custom hooks para lógica complexa
```typescript
// features/customers/hooks/useCustomers.ts
export const useCustomers = () => {
  const dispatch = useAppDispatch();
  const { customers, loading } = useAppSelector((state) => state.customers);
  
  const fetchCustomers = async () => {
    // lógica de busca
  };
  
  return { customers, loading, fetchCustomers };
};
```

### 3. Mantenha slices simples
- **Apenas atualizações de estado**
- **Sem lógica de negócio**
- **Sem chamadas de API**

### 4. Lógica assíncrona em hooks ou APIs
```typescript
// ❌ NÃO faça no slice
// ✅ Faça em hooks customizados ou APIs
```

---

## 📦 Fluxo de Dados

```
Componente
    ↓
Custom Hook (useCustomers, usePets, etc.)
    ↓
API Mock (customersApi, petsApi, etc.)
    ↓
Dispatch Actions → Redux Slice
    ↓
State atualizado
    ↓
Componente re-renderiza
```

---

## 🔄 Sincronização com LocalStorage

### AuthState
```typescript
// Login
localStorage.setItem('token', token);
localStorage.setItem('userRole', user.role);

// Logout
localStorage.removeItem('token');
localStorage.removeItem('userRole');
```

---

## 📝 Checklist de Nova Feature

Ao adicionar nova feature:

- [ ] Definir tipos em `src/types/index.ts`
- [ ] Criar slice em `src/store/slices/`
- [ ] Adicionar ao `store/index.ts`
- [ ] Criar API mock em `src/features/[feature]/api/`
- [ ] Criar hook customizado em `src/features/[feature]/hooks/`
- [ ] Validar tipos em `typeValidation.ts`
- [ ] Compilar sem erros TypeScript

---

## 🚀 Performance

- Redux Toolkit usa **Immer** internamente (mutações "seguras")
- **Memoização** com `useAppSelector` evita re-renders desnecessários
- Slices são **code-splittable** se necessário

---

## 📚 Referências

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [TypeScript com Redux](https://redux.js.org/usage/usage-with-typescript)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)



