# 🔐 Usuários Mockados - SuperPet Store

## 👥 Usuários de Teste

### 🏪 **OWNER (Dono da Loja)**

**Acesso:** Painel administrativo completo

```
Email:    owner@superpet.com
Senha:    123456
Nome:     João Silva - Dono
Telefone: (11) 98765-4321
Role:     owner
```

**Funcionalidades:**
- ✅ Dashboard administrativo
- ✅ Gerenciar clientes (tutores)
- ✅ Gerenciar pets
- ✅ Gerenciar serviços
- ✅ Controle de estoque
- ✅ PDV/Vendas
- ✅ Relatórios
- ✅ Configurações do sistema

**Rota após login:** `/dashboard`

---

### 🐾 **CUSTOMER (Cliente/Tutor)**

**Acesso:** Portal do cliente

```
Email:    customer@superpet.com
Senha:    123456
Nome:     Maria Santos - Tutora
Telefone: (11) 91234-5678
Role:     customer
```

**Funcionalidades:**
- ✅ Dashboard pessoal
- ✅ Cadastrar e gerenciar seus pets
- ✅ Agendar serviços (banho, tosa, consulta)
- ✅ Visualizar carteira de vacinação
- ✅ Comprar produtos na loja online
- ✅ Visualizar histórico de pedidos
- ✅ Gerenciar perfil e configurações

**Rota após login:** `/customer/dashboard`

---

## 🚀 Como Usar

### Método 1: Auto-preenchimento
1. Acesse a página de login
2. Clique no tipo de usuário desejado (Loja ou Cliente)
3. Os campos serão preenchidos automaticamente
4. Clique em "Entrar"

### Método 2: Manual
1. Acesse a página de login
2. Selecione o tipo de usuário
3. Digite o email e senha conforme a tabela acima
4. Clique em "Entrar"

---

## 📱 Diferenças entre Interfaces

### Interface OWNER (Loja)
- **Layout:** Sidebar expansível/colapsável
- **Cor primária:** Verde petróleo (#0E6A6B)
- **Menu:**
  - Dashboard
  - Produtos
  - Vendas
  - Clientes
  - Pets
  - Estoque
  - Configurações

### Interface CUSTOMER (Cliente)
- **Layout:** Sidebar fixa colorida
- **Cor primária:** Laranja (#E47B24)
- **Menu:**
  - Início
  - Meus Pets
  - Agendamentos
  - Vacinação
  - Loja
  - Pedidos

---

## 🔄 Fluxo de Registro

Novos customers podem se registrar:

1. Acesse `/register`
2. Preencha os dados em 3 etapas:
   - Dados pessoais (Nome, CPF)
   - Contato (Email, Telefone)
   - Senha (Criar senha)
3. Após registro, será redirecionado para `/customer/welcome`
4. Opção de cadastrar o primeiro pet
5. Acesso ao dashboard

---

## 🛡️ Segurança

### Em Desenvolvimento (Atual)
- ✅ Senhas armazenadas em texto simples (mock)
- ✅ Validação básica de email/senha
- ✅ Token mockado para sessão
- ✅ Persistência em localStorage

### Em Produção (Futuro)
- 🔒 Senhas com hash bcrypt
- 🔒 JWT tokens reais
- 🔒 Refresh tokens
- 🔒 Autenticação 2FA (opcional)
- 🔒 Rate limiting
- 🔒 HTTPS obrigatório
- 🔒 Cookies httpOnly

---

## 📊 Dados Mockados Relacionados

### Clientes
- 3 clientes mockados no sistema
- IDs: 1, 2, 3

### Pets
- 4 pets mockados
- Distribuídos entre os clientes
- Espécies: Cachorro, Gato

### Serviços
- 7 serviços mockados:
  - Banho
  - Tosa Completa
  - Banho e Tosa
  - Consulta Veterinária
  - Vacinação
  - Hotel (diária)
  - Creche (day care)

### Agendamentos
- 3 agendamentos mockados
- Status: scheduled, in-progress

---

## 🔧 Desenvolvimento

### Adicionar novo usuário mockado

Edite `src/api/authApi.ts`:

```typescript
const mockUsers: User[] = [
  // ... usuários existentes
  {
    id: '3',
    email: 'novo@email.com',
    name: 'Nome do Usuário',
    role: 'owner', // ou 'customer'
    phone: '(11) 99999-9999',
    avatar: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Adicionar senha
const validPasswords: Record<string, string> = {
  // ... senhas existentes
  'novo@email.com': 'senha123',
};
```

---

## 🎯 Testes Recomendados

### Como OWNER
1. ✅ Login
2. ✅ Visualizar dashboard
3. ✅ Criar novo cliente
4. ✅ Cadastrar pet para cliente
5. ✅ Criar agendamento
6. ✅ Logout

### Como CUSTOMER
1. ✅ Login
2. ✅ Visualizar dashboard
3. ✅ Cadastrar novo pet
4. ✅ Agendar serviço
5. ✅ Visualizar histórico
6. ✅ Logout

### Registro Novo Customer
1. ✅ Acessar página de registro
2. ✅ Preencher formulário (3 etapas)
3. ✅ Verificar redirecionamento para welcome
4. ✅ Cadastrar primeiro pet (opcional)
5. ✅ Acessar dashboard

---

## 💡 Dicas

- **Auto-preenchimento:** Clique no tipo de usuário na tela de login
- **Trocar de conta:** Faça logout e selecione outro tipo
- **Testar registro:** Use email diferente dos mockados
- **Navegação:** Use o menu lateral para explorar

---

## 📞 Suporte

Se tiver problemas:

1. Verifique se está usando o email correto
2. Confirme que selecionou o tipo de usuário correto
3. Senha para ambos é: `123456`
4. Limpe o cache do navegador se necessário
5. Verifique o console do navegador para erros

---

**Última atualização:** Novembro 2025  
**Versão:** 1.0.0




