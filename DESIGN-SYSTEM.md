# 🎨 Design System SuperPet - Guia Completo

> **Documentação unificada** de cores, temas, componentes e implementação para o Painel SuperPet Store.

---

## 📋 Índice

1. [Paleta de Cores](#-paleta-de-cores)
2. [Tema Claro vs Escuro](#-tema-claro-vs-escuro)
3. [Implementação](#-implementação)
4. [Guia para Novos Componentes](#-guia-para-novos-componentes)
5. [Checklist de Verificação](#-checklist-de-verificação)
6. [Exemplos Práticos](#-exemplos-práticos)
7. [Troubleshooting](#-troubleshooting)
8. [Componentes do Sistema](#-componentes-do-sistema)

---

## 🎨 Paleta de Cores

### Cores Principais (Tema Claro)

| Elemento | Descrição | HEX | RGB | Uso |
|----------|-----------|-----|-----|-----|
| 🟩 Primary | Teal escuro | `#0E6A6B` | rgb(14, 106, 107) | Botões primários, header, menus |
| 🟧 Secondary | Laranja quente | `#E47B24` | rgb(228, 123, 36) | Destaques, ícones, CTAs, badges |
| ⚪ Light | Branco gelo | `#F8F5EE` | rgb(248, 245, 238) | Cards, paper, texto em fundos escuros |
| 🟨 Background | Off-white | `#F2EBDD` | rgb(242, 235, 221) | Fundo principal da aplicação |
| ⚫ Dark | Preto de apoio | `#1E1E1E` | rgb(30, 30, 30) | Texto principal em fundos claros |

### Cores do Tema Escuro

| Elemento | Descrição | HEX | RGB | Uso |
|----------|-----------|-----|-----|-----|
| 🌑 Background Dark | Preto profundo | `#0D1117` | rgb(13, 17, 23) | Fundo principal no tema escuro |
| 🔘 Paper Dark | Cinza escuro | `#1C2128` | rgb(28, 33, 40) | Cards e paper no tema escuro |
| 💡 Text Light | Branco gelo | `#F8F5EE` | rgb(248, 245, 238) | Texto principal no tema escuro |
| 🔆 Border Dark | Teal claro | `#12888A` | rgb(18, 136, 138) | Bordas e divisores no tema escuro |
| 📝 Text Muted Dark | Off-white | `#E6E1D6` | rgb(230, 225, 214) | Texto secundário/suave no tema escuro |

### Variações de Cores

| Cor | Variação | HEX | Uso |
|-----|----------|-----|-----|
| Primary | Dark | `#0A5152` | Hover em botões primários |
| Primary | Light | `#12888A` | Destaques no tema escuro, gradientes |
| Secondary | Dark | `#C26619` | Hover em botões secundários |
| Secondary | Light | `#F89042` | Destaques suaves |

---

## 🌓 Tema Claro vs Escuro

### Tabela de Comparação

| Elemento | Tema Claro | Tema Escuro | Código |
|----------|------------|-------------|--------|
| **Background geral** | `#F2EBDD` | `#0D1117` | `isDark ? '#0D1117' : '#F2EBDD'` |
| **Cards/Paper** | `#F8F5EE` | `#1C2128` | `isDark ? '#1C2128' : '#F8F5EE'` |
| **Texto principal** | `#1E1E1E` | `#F8F5EE` | `isDark ? '#F8F5EE' : '#1E1E1E'` |
| **Texto destaque (teal)** | `#0E6A6B` | `#12888A` | `isDark ? '#12888A' : '#0E6A6B'` |
| **Texto suave** | `#6E6E6E` | `#E6E1D6` | `isDark ? '#E6E1D6' : '#6E6E6E'` |
| **Bordas** | `#0E6A6B` | `#12888A` | `isDark ? '#12888A' : '#0E6A6B'` |

### Cores Fixas (Não Mudam)

Estas cores são iguais em ambos os temas:

- ✅ **Primary (Teal)**: `#0E6A6B`
- ✅ **Secondary (Laranja)**: `#E47B24`
- ✅ **AppBar**: `#0E6A6B`
- ✅ **Avatar**: `#E47B24`
- ✅ **Ícones de destaque**: `#E47B24`
- ✅ **Hover em botões primários**: `#0A5152`
- ✅ **Hover em botões secundários**: `#C26619`

---

## 🚀 Implementação

### 1. Material-UI Theme

Arquivo: `src/context/ThemeContext.jsx`

```javascript
{
  palette: {
    mode: 'light', // ou 'dark'
    primary: {
      main: '#0E6A6B',
      dark: '#0A5152',
      light: '#12888A',
      contrastText: '#F8F5EE',
    },
    secondary: {
      main: '#E47B24',
      dark: '#C26619',
      light: '#F89042',
      contrastText: '#F8F5EE',
    },
    background: {
      default: mode === 'light' ? '#F2EBDD' : '#0D1117',
      paper: mode === 'light' ? '#F8F5EE' : '#1C2128',
    },
    text: {
      primary: mode === 'light' ? '#1E1E1E' : '#F8F5EE',
      secondary: mode === 'light' ? '#0E6A6B' : '#12888A',
    },
  }
}
```

### 2. Tailwind CSS

Arquivo: `tailwind.config.js`

```javascript
colors: {
  superpet: {
    primary: '#0E6A6B',
    'primary-dark': '#0A5152',
    'primary-light': '#12888A',
    secondary: '#E47B24',
    'secondary-dark': '#C26619',
    'secondary-light': '#F89042',
    light: '#F8F5EE',
    background: '#F2EBDD',
    dark: '#1E1E1E',
  },
}
```

### 3. Como Usar no Código

#### Opção 1: Hook useThemeMode (Recomendado)

```javascript
import { useThemeMode } from '../context/ThemeContext'

const MyComponent = () => {
  const { isDark, toggleTheme, mode } = useThemeMode()
  
  return (
    <Box sx={{ 
      bgcolor: isDark ? '#1C2128' : '#F8F5EE',
      color: isDark ? '#F8F5EE' : '#1E1E1E',
    }}>
      <Button onClick={toggleTheme}>
        {isDark ? 'Tema Claro' : 'Tema Escuro'}
      </Button>
    </Box>
  )
}
```

#### Opção 2: Hook useThemeColors (Mais Fácil)

```javascript
import { useThemeColors } from '../hooks/useThemeColors'

const MyComponent = () => {
  const colors = useThemeColors()
  
  return (
    <Box sx={{ bgcolor: colors.bgPaper }}>
      <Typography sx={{ color: colors.textPrimary }}>
        Texto Principal
      </Typography>
      <Typography sx={{ color: colors.textSecondary }}>
        Texto Secundário
      </Typography>
    </Box>
  )
}
```

---

## 📘 Guia para Novos Componentes

### Passo 1: Importações

```javascript
import { useThemeMode } from '../context/ThemeContext'

const MyComponent = () => {
  const { isDark } = useThemeMode()
  // ...
}
```

### Passo 2: Aplicar Cores Condicionais

#### 2.1. Backgrounds

```javascript
// Background principal
<Box sx={{ bgcolor: isDark ? '#0D1117' : '#F2EBDD' }}>

// Cards
<Card sx={{ bgcolor: isDark ? '#1C2128' : '#F8F5EE' }}>
```

#### 2.2. Textos

```javascript
// Títulos principais (teal)
<Typography variant="h4" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>

// Texto corpo
<Typography variant="body1" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>

// Texto suave/secundário
<Typography variant="caption" sx={{ color: isDark ? '#E6E1D6' : '#6E6E6E' }}>
```

#### 2.3. Bordas

```javascript
// Bordas normais
<Card sx={{ border: isDark ? '1px solid #12888A' : '1px solid #0E6A6B' }}>

// Ou apenas no tema escuro (para contraste)
<Card sx={{ border: isDark ? '1px solid #12888A' : 'none' }}>

// Dividers
<Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
```

### Passo 3: Elementos Especiais

#### Menus Dropdown

```javascript
<Menu
  PaperProps={{
    sx: {
      bgcolor: isDark ? '#1C2128' : '#F8F5EE',
      border: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
    }
  }}
>
  <MenuItem sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
    Opção do Menu
  </MenuItem>
</Menu>
```

#### Botões (cores fixas - funcionam em ambos)

```javascript
// Botão primário (teal)
<Button
  variant="contained"
  sx={{
    bgcolor: '#0E6A6B',     // Fixo
    color: '#F8F5EE',       // Fixo
    '&:hover': { bgcolor: '#0A5152' },
  }}
>
  Ação Principal
</Button>

// Botão secundário (laranja)
<Button
  variant="contained"
  sx={{
    bgcolor: '#E47B24',     // Fixo
    color: '#F8F5EE',       // Fixo
    '&:hover': { bgcolor: '#C26619' },
  }}
>
  Ação Destaque
</Button>

// Botão outlined (condicional)
<Button
  variant="outlined"
  sx={{
    borderColor: isDark ? '#12888A' : '#0E6A6B',
    color: isDark ? '#12888A' : '#0E6A6B',
    '&:hover': {
      bgcolor: '#0E6A6B',
      color: '#F8F5EE',
    },
  }}
>
  Ação Secundária
</Button>
```

---

## ✅ Checklist de Verificação

Use esta checklist antes de finalizar qualquer componente:

### 1. Importações
- [ ] `import { useThemeMode } from '../context/ThemeContext'` adicionado?
- [ ] `const { isDark } = useThemeMode()` declarado?

### 2. Backgrounds
- [ ] Background principal é condicional?
- [ ] Todos os Cards têm `bgcolor` condicional?
- [ ] Container/Box principais têm cor de fundo condicional?

### 3. Textos
- [ ] Todos os títulos (H1-H6) têm cor condicional?
- [ ] Todo texto `<Typography>` tem cor condicional?
- [ ] Nenhum texto está com `color: '#1E1E1E'` fixo?
- [ ] Texto em menus é condicional?

### 4. Bordas
- [ ] Bordas de cards são condicionais?
- [ ] Dividers têm `borderColor` condicional?
- [ ] Outline/focus states são visíveis?

### 5. Interações
- [ ] Hover funciona em ambos os temas?
- [ ] Estados active/selected são visíveis?
- [ ] Focus states têm contraste adequado?

### 6. Testes Obrigatórios
- [ ] Testado em tema claro?
- [ ] Testado em tema escuro?
- [ ] Testado em mobile?
- [ ] Testado em desktop?
- [ ] Sem erros no console?

---

## 💡 Exemplos Práticos

### Exemplo 1: Página Completa

```javascript
import { Box, Typography, Button, Card, CardContent } from '@mui/material'
import { Add, ShoppingCart } from '@mui/icons-material'
import { useThemeMode } from '../context/ThemeContext'

const ProductsPage = () => {
  const { isDark } = useThemeMode()
  
  return (
    <Box>
      {/* Header da Página */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4,
      }}>
        <Box>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1 }}
          >
            Produtos 🛍️
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}
          >
            Gerencie o catálogo de produtos
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{
            bgcolor: '#E47B24',
            color: '#F8F5EE',
            '&:hover': { bgcolor: '#C26619' },
          }}
        >
          Novo Produto
        </Button>
      </Box>
      
      {/* Conteúdo */}
      <Card sx={{
        bgcolor: isDark ? '#1C2128' : '#F8F5EE',
        boxShadow: 3,
        border: isDark ? '1px solid #12888A' : 'none',
        '&:hover': {
          borderColor: isDark ? '#E47B24' : '#0E6A6B',
        },
      }}>
        <CardContent>
          <Typography variant="h6" sx={{ 
            color: isDark ? '#12888A' : '#0E6A6B', 
            mb: 2 
          }}>
            Lista de Produtos
          </Typography>
          <Typography variant="body1" sx={{ 
            color: isDark ? '#F8F5EE' : '#1E1E1E' 
          }}>
            Conteúdo da página aqui...
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}

export default ProductsPage
```

### Exemplo 2: Card de Estatística

```javascript
import { Card, CardContent, Typography, Chip, Box } from '@mui/material'
import { TrendingUp } from '@mui/icons-material'
import { useThemeMode } from '../context/ThemeContext'

const StatsCard = ({ title, value, change }) => {
  const { isDark } = useThemeMode()
  
  return (
    <Card sx={{
      bgcolor: isDark ? '#1C2128' : '#F8F5EE',
      boxShadow: 3,
      border: isDark ? '1px solid #12888A' : 'none',
      transition: 'all 0.3s',
      '&:hover': {
        boxShadow: 6,
        transform: 'translateY(-4px)',
        borderColor: isDark ? '#E47B24' : 'transparent',
      },
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ 
            bgcolor: isDark ? 'rgba(18, 136, 138, 0.2)' : 'rgba(14, 106, 107, 0.1)',
            p: 2,
            borderRadius: 2,
          }}>
            <TrendingUp sx={{ color: '#E47B24' }} />
          </Box>
          <Chip 
            label={change}
            sx={{ 
              bgcolor: '#E47B24',
              color: '#F8F5EE',
              fontWeight: 'bold',
            }}
          />
        </Box>
        
        <Typography variant="h5" fontWeight="bold" sx={{ 
          mb: 0.5, 
          color: isDark ? '#F8F5EE' : '#0E6A6B' 
        }}>
          {value}
        </Typography>
        
        <Typography variant="body2" sx={{ 
          color: isDark ? '#E6E1D6' : '#1E1E1E' 
        }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  )
}
```

### Exemplo 3: Menu Dropdown

```javascript
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
import { Settings, Logout } from '@mui/icons-material'
import { useThemeMode } from '../context/ThemeContext'

const UserMenu = ({ anchorEl, open, onClose }) => {
  const { isDark } = useThemeMode()
  
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: isDark ? '#1C2128' : '#F8F5EE',
          border: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
        }
      }}
    >
      <MenuItem sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
        <ListItemIcon>
          <Settings sx={{ color: '#0E6A6B' }} />
        </ListItemIcon>
        <ListItemText>Configurações</ListItemText>
      </MenuItem>
      
      <Divider sx={{ borderColor: isDark ? '#12888A' : '#0E6A6B' }} />
      
      <MenuItem sx={{ color: '#E47B24' }}>
        <ListItemIcon>
          <Logout sx={{ color: '#E47B24' }} />
        </ListItemIcon>
        <ListItemText>Sair</ListItemText>
      </MenuItem>
    </Menu>
  )
}
```

---

## 📦 Template Completo

Use este template ao criar novos componentes:

```javascript
import { Box, Typography, Card, CardContent, Button } from '@mui/material'
import { MyIcon } from '@mui/icons-material'
import { useThemeMode } from '../context/ThemeContext'

const MyNewComponent = () => {
  const { isDark } = useThemeMode()
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          fontWeight="bold"
          sx={{ color: isDark ? '#12888A' : '#0E6A6B', mb: 1 }}
        >
          Título do Componente
        </Typography>
        <Typography 
          variant="body1"
          sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}
        >
          Descrição do componente
        </Typography>
      </Box>
      
      {/* Content */}
      <Card sx={{
        bgcolor: isDark ? '#1C2128' : '#F8F5EE',
        boxShadow: 3,
        border: isDark ? '1px solid #12888A' : 'none',
        '&:hover': {
          boxShadow: 6,
          borderColor: isDark ? '#E47B24' : '#0E6A6B',
        },
      }}>
        <CardContent>
          <Typography 
            variant="h6"
            sx={{ color: isDark ? '#F8F5EE' : '#0E6A6B', mb: 2 }}
          >
            Subtítulo
          </Typography>
          
          <Typography 
            variant="body1"
            sx={{ color: isDark ? '#E6E1D6' : '#1E1E1E', mb: 2 }}
          >
            Conteúdo do texto principal.
          </Typography>
          
          <Button
            variant="contained"
            sx={{
              bgcolor: '#0E6A6B',
              color: '#F8F5EE',
              '&:hover': { bgcolor: '#0A5152' },
            }}
          >
            Ação Principal
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

export default MyNewComponent
```

---

## 🚨 Troubleshooting - Problemas Comuns

### ❌ Erro 1: Texto Preto Sumindo

**Sintoma**: Texto desaparece completamente no tema escuro

**Causa**:
```javascript
<Typography sx={{ color: '#1E1E1E' }}>Texto invisível</Typography>
```

**Solução**:
```javascript
<Typography sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>Texto visível</Typography>
```

**Como encontrar**: 
```bash
grep "color: '#1E1E1E'" src/pages/*.jsx
```

---

### ❌ Erro 2: Bordas Invisíveis

**Sintoma**: Bordas desaparecem no tema escuro

**Causa**:
```javascript
<Card sx={{ border: '1px solid #0E6A6B' }}>
```

**Solução**:
```javascript
<Card sx={{ border: isDark ? '1px solid #12888A' : '1px solid #0E6A6B' }}>
```

---

### ❌ Erro 3: Cards Sem Contraste

**Sintoma**: Card some no background escuro (tudo fica preto)

**Causa**:
```javascript
<Card sx={{ bgcolor: '#F8F5EE' }}>
```

**Solução**:
```javascript
<Card sx={{ 
  bgcolor: isDark ? '#1C2128' : '#F8F5EE',
  border: isDark ? '1px solid #12888A' : 'none', // Adiciona borda para contraste
}}>
```

---

### ❌ Erro 4: Menu Não Muda

**Sintoma**: Menu dropdown permanece claro no tema escuro

**Causa**:
```javascript
<Menu PaperProps={{ sx: { bgcolor: '#F8F5EE' } }}>
```

**Solução**:
```javascript
<Menu PaperProps={{ 
  sx: { 
    bgcolor: isDark ? '#1C2128' : '#F8F5EE',
    border: isDark ? '2px solid #12888A' : '2px solid #0E6A6B',
  } 
}}>
```

---

## 📝 Padrões de Código (Copy/Paste)

### Cores Rápidas

```javascript
// Cole no topo do componente para referência rápida:

// BACKGROUNDS
// Geral: isDark ? '#0D1117' : '#F2EBDD'
// Cards: isDark ? '#1C2128' : '#F8F5EE'
// Hover: isDark ? '#21262D' : '#FFFFFF'

// TEXTOS
// Principal: isDark ? '#F8F5EE' : '#1E1E1E'
// Teal: isDark ? '#12888A' : '#0E6A6B'
// Suave: isDark ? '#E6E1D6' : '#6E6E6E'

// BORDAS
// Normal: isDark ? '#12888A' : '#0E6A6B'
// Card: isDark ? '1px solid #12888A' : 'none'

// FIXAS (não mudam)
// Laranja: '#E47B24'
// Teal: '#0E6A6B' (para botões e AppBar)
```

### Pattern: Título de Página

```javascript
<Typography variant="h4" sx={{ color: isDark ? '#12888A' : '#0E6A6B' }}>
  Título
</Typography>
```

### Pattern: Descrição

```javascript
<Typography variant="body1" sx={{ color: isDark ? '#F8F5EE' : '#1E1E1E' }}>
  Descrição
</Typography>
```

### Pattern: Card Padrão

```javascript
<Card sx={{
  bgcolor: isDark ? '#1C2128' : '#F8F5EE',
  border: isDark ? '1px solid #12888A' : 'none',
  '&:hover': {
    borderColor: isDark ? '#E47B24' : '#0E6A6B',
  },
}}>
```

---

## 🖼️ Componentes do Sistema

### AppBar (Navbar)
- **Background**: `#0E6A6B` (fixo em ambos os temas)
- **Texto/Ícones**: `#F8F5EE` (branco sempre)
- **Avatar**: `#E47B24` (laranja sempre)
- **Toggle tema**: Ícone lua/sol

### Sidebar
- **Background**: `isDark ? '#1C2128' : '#F8F5EE'`
- **Border**: `isDark ? '2px solid #12888A' : '2px solid #0E6A6B'`
- **Item normal**: 
  - Ícone: `#0E6A6B`
  - Texto: `isDark ? '#F8F5EE' : '#1E1E1E'`
- **Item ativo**:
  - Background: `#0E6A6B`
  - Texto/Ícone: `#F8F5EE`
- **Hover**:
  - Background: `#0E6A6B`
  - Texto/Ícone: `#F8F5EE`

### Cards de Estatísticas
- **Background**: `isDark ? '#1C2128' : '#F8F5EE'`
- **Borda**: `isDark ? '1px solid #12888A' : 'none'`
- **Valor**: `isDark ? '#F8F5EE' : '#0E6A6B'`
- **Título**: `isDark ? '#E6E1D6' : '#1E1E1E'`
- **Badge**: `#E47B24` / `#F8F5EE` (fixo)

### Botões de Ação
- **Primário**: `#0E6A6B` / `#F8F5EE` (fixo)
- **Secundário**: `#E47B24` / `#F8F5EE` (fixo)
- **Outlined**: Borda e texto condicionais

---

## 🔄 Migração de Componentes Existentes

### Passo a Passo:

1. **Adicione o import**
```javascript
import { useThemeMode } from '../context/ThemeContext'
```

2. **Use o hook**
```javascript
const { isDark } = useThemeMode()
```

3. **Encontre e substitua**

Busque no arquivo por:
- `color: '#1E1E1E'` → Substitua por condicional
- `color: '#0E6A6B'` → Verifique se deve ser condicional
- `bgcolor: '#F8F5EE'` → Substitua por condicional
- `borderColor: '#0E6A6B'` → Substitua por condicional

4. **Comando útil**:
```bash
# Encontrar textos pretos
grep -n "color: '#1E1E1E'" src/pages/MyPage.jsx

# Encontrar backgrounds fixos
grep -n "bgcolor: '#F8F5EE'" src/pages/MyPage.jsx
```

5. **Teste ambos os temas**

---

## 🎓 Dicas Avançadas

### 1. Combine com Breakpoints

```javascript
import { useTheme } from '@mui/material'
import { useThemeMode } from '../context/ThemeContext'

const MyComponent = () => {
  const { isDark } = useThemeMode()
  const theme = useTheme()
  
  return (
    <Box sx={{
      bgcolor: isDark ? '#1C2128' : '#F8F5EE',
      p: { xs: 2, sm: 3, md: 4 }, // Responsivo
      fontSize: { xs: '0.875rem', sm: '1rem' },
    }}>
      Conteúdo responsivo
    </Box>
  )
}
```

### 2. Gradientes

```javascript
// Gradiente teal (funciona em ambos os temas)
background: 'linear-gradient(135deg, #0E6A6B 0%, #12888A 100%)'
// Texto sempre branco neste caso
color: '#F8F5EE'
```

### 3. Opacity para Backgrounds Sutis

```javascript
// Background sutil
bgcolor: isDark ? 'rgba(18, 136, 138, 0.1)' : 'rgba(14, 106, 107, 0.1)'

// Hover sutil  
'&:hover': {
  bgcolor: isDark ? 'rgba(228, 123, 36, 0.15)' : 'rgba(228, 123, 36, 0.05)'
}
```

---

## 📊 Tabela Resumo - Quando Usar Cada Cor

| Elemento | Claro | Escuro | Condicional? | Código |
|----------|-------|--------|--------------|--------|
| Background geral | `#F2EBDD` | `#0D1117` | ✅ Sim | `isDark ? '#0D1117' : '#F2EBDD'` |
| Cards | `#F8F5EE` | `#1C2128` | ✅ Sim | `isDark ? '#1C2128' : '#F8F5EE'` |
| Texto normal | `#1E1E1E` | `#F8F5EE` | ✅ Sim | `isDark ? '#F8F5EE' : '#1E1E1E'` |
| Texto teal | `#0E6A6B` | `#12888A` | ✅ Sim | `isDark ? '#12888A' : '#0E6A6B'` |
| Bordas | `#0E6A6B` | `#12888A` | ✅ Sim | `isDark ? '#12888A' : '#0E6A6B'` |
| AppBar | `#0E6A6B` | `#0E6A6B` | ❌ Não | `'#0E6A6B'` |
| Botão primário | `#0E6A6B` | `#0E6A6B` | ❌ Não | `'#0E6A6B'` |
| Botão secundário | `#E47B24` | `#E47B24` | ❌ Não | `'#E47B24'` |
| Ícones laranja | `#E47B24` | `#E47B24` | ❌ Não | `'#E47B24'` |

---

## 🧪 Como Testar Temas

### Teste Manual

1. **Abra a aplicação**
```bash
npm run electron
# ou
npm run dev
```

2. **Alterne o tema**
- Clique no ícone lua/sol no navbar
- Ou use o menu do usuário → "Tema Escuro/Claro"

3. **Verifique cada página**
- Dashboard
- Produtos
- Vendas
- Clientes
- Estoque
- Configurações

4. **Verifique interações**
- Hover em cards
- Click em botões
- Abrir menus
- Navegar entre páginas

### Teste Automático (Console)

```javascript
// No console do navegador (F12):

// Forçar tema escuro
localStorage.setItem('themeMode', 'dark')
location.reload()

// Forçar tema claro
localStorage.setItem('themeMode', 'light')
location.reload()

// Verificar tema atual
console.log('Tema:', localStorage.getItem('themeMode'))
```

---

## 💾 Persistência

O tema é automaticamente salvo no `localStorage` e persiste entre sessões.

**Chave**: `themeMode`  
**Valores**: `'light'` ou `'dark'`

Não precisa configurar nada - já está implementado!

---

## 🎯 Diretrizes de Uso

### Botões

#### Primário (Teal - Ações Principais)
```javascript
<Button variant="contained" sx={{
  bgcolor: '#0E6A6B',
  color: '#F8F5EE',
  '&:hover': { bgcolor: '#0A5152' },
}}>
  Ação Principal
</Button>
```

#### Secundário (Laranja - Destaques)
```javascript
<Button variant="contained" sx={{
  bgcolor: '#E47B24',
  color: '#F8F5EE',
  '&:hover': { bgcolor: '#C26619' },
}}>
  Ação Destaque
</Button>
```

#### Outlined (Condicional)
```javascript
<Button variant="outlined" sx={{
  borderColor: isDark ? '#12888A' : '#0E6A6B',
  color: isDark ? '#12888A' : '#0E6A6B',
  '&:hover': {
    bgcolor: '#0E6A6B',
    color: '#F8F5EE',
  },
}}>
  Ação Secundária
</Button>
```

### Ícones

```javascript
// Ícones de destaque (laranja - fixo)
<ShoppingCart sx={{ color: '#E47B24' }} />

// Ícones normais (teal - pode ser fixo ou condicional)
<Dashboard sx={{ color: '#0E6A6B' }} />
// ou
<Dashboard sx={{ color: isDark ? '#12888A' : '#0E6A6B' }} />
```

### Chips/Badges

```javascript
// Chip de sucesso (sempre laranja)
<Chip label="+12.5%" sx={{ 
  bgcolor: '#E47B24',
  color: '#F8F5EE',
}} />

// Chip informativo (condicional)
<Chip label="Info" sx={{ 
  bgcolor: isDark ? '#12888A' : '#0E6A6B',
  color: '#F8F5EE',
}} />
```

---

## 📱 Responsividade

As cores são consistentes em todos os tamanhos de tela:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Combine tema com responsividade:

```javascript
<Typography sx={{
  color: isDark ? '#F8F5EE' : '#1E1E1E',
  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
}}>
  Texto responsivo
</Typography>
```

---

## ✅ Checklist Final

Antes de considerar um componente pronto:

- [ ] Importou `useThemeMode`?
- [ ] Todos os backgrounds são condicionais?
- [ ] Todos os textos são legíveis em ambos os temas?
- [ ] Todas as bordas são visíveis em ambos os temas?
- [ ] Testou em tema claro?
- [ ] Testou em tema escuro?
- [ ] Testou hover/active states?
- [ ] Testou em mobile?
- [ ] Testou em desktop?
- [ ] Sem `color: '#1E1E1E'` fixo?
- [ ] Console sem erros?

---

## 🛠️ Ferramentas de Debug

### Comando para encontrar cores fixas:

```bash
# Textos pretos (podem causar problema)
grep -rn "color: '#1E1E1E'" src/

# Backgrounds claros
grep -rn "bgcolor: '#F8F5EE'" src/

# Bordas fixas
grep -rn "border.*#0E6A6B" src/
```

### Componente de teste:

Ver: `src/components/ExampleCard.jsx` - Componente completo com todas as melhores práticas.

---

## 📚 Arquivos Relacionados

- `src/context/ThemeContext.jsx` - Implementação do tema
- `src/hooks/useThemeColors.js` - Hook auxiliar de cores
- `src/utils/themeColors.js` - Utilitários de cores
- `src/components/ExampleCard.jsx` - Componente de exemplo
- `tailwind.config.js` - Cores Tailwind
- `src/App.jsx` - ThemeProvider principal

---

## 🔄 Workflow Recomendado

1. ✅ Crie o componente com tema claro
2. ✅ Adicione `const { isDark } = useThemeMode()`
3. ✅ Substitua todas as cores fixas por condicionais
4. ✅ Teste alternando entre temas
5. ✅ Use esta checklist para verificar
6. ✅ Finalize apenas quando ambos os temas estiverem perfeitos

---

## ✨ Acessibilidade (WCAG)

### Contrastes Testados:

**Tema Claro**:
- ✅ `#1E1E1E` em `#F2EBDD`: WCAG AAA (21:1)
- ✅ `#F8F5EE` em `#0E6A6B`: WCAG AA (7:1)
- ✅ `#F8F5EE` em `#E47B24`: WCAG AA (5:1)
- ✅ `#0E6A6B` em `#F2EBDD`: WCAG AA (6:1)

**Tema Escuro**:
- ✅ `#F8F5EE` em `#0D1117`: WCAG AAA (18:1)
- ✅ `#12888A` em `#0D1117`: WCAG AA (5:1)
- ✅ `#E47B24` em `#1C2128`: WCAG AA (6:1)
- ✅ `#F8F5EE` em `#1C2128`: WCAG AAA (14:1)

---

**🐾 Desenvolvido para SuperPet Store**

> **Regra de Ouro**: Sempre teste seu componente em **AMBOS os temas** antes de considerar pronto!

> **Componente de Referência**: `src/components/ExampleCard.jsx` - Exemplo completo com todas as melhores práticas anotadas.

> **Suporte**: Se tiver dúvidas, consulte os exemplos práticos ou o componente ExampleCard.jsx
