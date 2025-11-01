# 📐 Guia de Tipografia Responsiva SuperPet

Sistema completo de tamanhos de fonte otimizados para **Mobile**, **Tablet** e **Desktop**.

---

## 📋 Índice

1. [Mapa de Tamanhos](#-mapa-de-tamanhos)
2. [Como Usar](#-como-usar)
3. [Exemplos Práticos](#-exemplos-práticos)
4. [Atalhos Rápidos](#-atalhos-rápidos)
5. [Comparação Visual](#-comparação-visual)

---

## 📏 Mapa de Tamanhos

### **Headings (Títulos)**

| Variante | Mobile (xs) | Tablet (sm) | Desktop (md) | Uso Recomendado |
|----------|-------------|-------------|--------------|-----------------|
| **h1** | 28px | 32px | 40px | Títulos principais de seção |
| **h2** | 24px | 28px | 32px | Subtítulos de seção |
| **h3** | 20px | 24px | 28px | Títulos de cards grandes |
| **h4** | 18px | 20px | 24px | **Títulos de página** |
| **h5** | 16px | 18px | 20px | Valores destacados, títulos de seção |
| **h6** | 14px | 16px | 18px | Títulos de cards pequenos |

### **Body (Corpo de Texto)**

| Variante | Mobile (xs) | Tablet (sm) | Desktop (md) | Uso Recomendado |
|----------|-------------|-------------|--------------|-----------------|
| **body1** | 14px | 15px | 16px | Texto principal |
| **body2** | 13px | 14px | 15px | Texto secundário |
| **caption** | 11px | 12px | 13px | Labels de cards, legendas |
| **small** | 12px | 13px | 14px | Texto pequeno |

### **Botões**

| Variante | Mobile (xs) | Tablet (sm) | Desktop (md) | Uso Recomendado |
|----------|-------------|-------------|--------------|-----------------|
| **button** | 14px | 15px | 16px | Botões padrão |
| **buttonLarge** | 16px | 17px | 18px | Botões grandes (CTA) |

---

## 🚀 Como Usar

### **Método 1: Importar `typography`**

```javascript
import { typography } from '../theme/typography'

<Typography 
  variant="h4" 
  sx={{ 
    fontSize: typography.pageTitle,
    color: '#0E6A6B',
  }}
>
  Meu Título
</Typography>
```

### **Método 2: Usar Atalhos Pré-configurados**

```javascript
import { typography } from '../theme/typography'

// Título de página
<Typography sx={{ fontSize: typography.pageTitle }}>
  Dashboard 🐾
</Typography>

// Subtítulo de página
<Typography sx={{ fontSize: typography.pageSubtitle }}>
  Visão geral do desempenho da sua loja
</Typography>

// Valor de card
<Typography sx={{ fontSize: typography.cardValue }}>
  R$ 12.450
</Typography>

// Label de card
<Typography sx={{ fontSize: typography.cardLabel }}>
  Vendas Hoje
</Typography>
```

### **Método 3: Usar `responsiveFontSize()`**

```javascript
import { responsiveFontSize } from '../theme/typography'

<Typography sx={{ fontSize: responsiveFontSize('h4') }}>
  Título Responsivo
</Typography>
```

---

## 📚 Exemplos Práticos

### **Exemplo 1: Título de Página**

```javascript
import { typography } from '../theme/typography'

<Typography
  variant="h4"
  fontWeight="bold"
  sx={{
    fontSize: typography.pageTitle, // 18px mobile → 20px tablet → 24px desktop
    color: '#0E6A6B',
    mb: 2,
  }}
>
  Produtos 🛍️
</Typography>
```

### **Exemplo 2: Card com Valores**

```javascript
import { typography } from '../theme/typography'

<Card>
  <CardContent>
    {/* Valor principal */}
    <Typography 
      variant="h5" 
      fontWeight="bold"
      sx={{ 
        fontSize: typography.cardValue, // 16px mobile → 18px tablet → 20px desktop
        color: '#0E6A6B',
      }}
    >
      R$ 12.450
    </Typography>

    {/* Label */}
    <Typography 
      variant="body2"
      sx={{ 
        fontSize: typography.cardLabel, // 11px mobile → 12px tablet → 13px desktop
        color: '#1E1E1E',
      }}
    >
      Vendas Hoje
    </Typography>
  </CardContent>
</Card>
```

### **Exemplo 3: Texto de Parágrafo**

```javascript
import { typography } from '../theme/typography'

<Typography 
  variant="body1"
  sx={{ 
    fontSize: typography.bodyText, // 14px mobile → 15px tablet → 16px desktop
    color: '#1E1E1E',
    mb: 2,
  }}
>
  Aqui você pode gerenciar todos os produtos da sua loja.
</Typography>
```

### **Exemplo 4: Botão Responsivo**

```javascript
import { typography } from '../theme/typography'

<Button
  variant="contained"
  sx={{
    fontSize: typography.buttonText, // 14px mobile → 15px tablet → 16px desktop
    bgcolor: '#E47B24',
    color: '#F8F5EE',
  }}
>
  Adicionar Produto
</Button>
```

---

## 🎯 Atalhos Rápidos

```javascript
typography.pageTitle        // Título de página (h4)
typography.pageSubtitle     // Subtítulo de página (body1)
typography.sectionTitle     // Título de seção (h5)
typography.sectionSubtitle  // Subtítulo de seção (body2)
typography.cardTitle        // Título de card (h6)
typography.cardValue        // Valor de card (h5)
typography.cardLabel        // Label de card (caption)
typography.buttonText       // Texto de botão padrão
typography.buttonLargeText  // Texto de botão grande
typography.bodyText         // Texto de corpo (body1)
typography.smallText        // Texto pequeno (body2)
typography.caption          // Legenda (caption)
```

---

## 📊 Comparação Visual

### **Mobile (< 600px)**
```
h4 (Título de Página)  → 18px
body1 (Subtítulo)      → 14px
h5 (Valor de Card)     → 16px
caption (Label)        → 11px
```

### **Tablet (600px - 900px)**
```
h4 (Título de Página)  → 20px
body1 (Subtítulo)      → 15px
h5 (Valor de Card)     → 18px
caption (Label)        → 12px
```

### **Desktop (> 900px)**
```
h4 (Título de Página)  → 24px
body1 (Subtítulo)      → 16px
h5 (Valor de Card)     → 20px
caption (Label)        → 13px
```

---

## ✅ Checklist de Implementação

Ao criar um novo componente, sempre use tipografia responsiva:

- [ ] Importar `typography` de `../theme/typography`
- [ ] Aplicar `fontSize: typography.XXX` nos componentes `Typography`
- [ ] Testar em mobile (< 600px), tablet (600-900px) e desktop (> 900px)
- [ ] Verificar contraste de cores
- [ ] Garantir legibilidade em todas as resoluções

---

## 🔧 Personalização

Para adicionar novos tamanhos ou modificar existentes, edite `src/theme/typography.js`:

```javascript
export const fontSizes = {
  // Adicione novos tamanhos aqui
  myCustomSize: {
    xs: '1rem',    // Mobile
    sm: '1.125rem', // Tablet
    md: '1.25rem',  // Desktop
  },
}

// Adicione atalhos
export const typography = {
  myCustomText: fontSizes.myCustomSize,
}
```

---

## 🎨 Integração com Design System SuperPet

Este sistema de tipografia funciona perfeitamente com o **Design System SuperPet** e o **Dark Mode**:

```javascript
import { useThemeMode } from '../context/ThemeContext'
import { typography } from '../theme/typography'

const MyComponent = () => {
  const { isDark } = useThemeMode()
  
  return (
    <Typography
      sx={{
        fontSize: typography.pageTitle, // Tipografia responsiva
        color: isDark ? '#F8F5EE' : '#1E1E1E', // Cores theme-aware
      }}
    >
      Texto Responsivo e com Tema
    </Typography>
  )
}
```

---

## 📱 Breakpoints Material-UI

O sistema usa os breakpoints padrão do Material-UI:

| Breakpoint | Tamanho | Uso |
|------------|---------|-----|
| **xs** | 0px - 599px | Mobile |
| **sm** | 600px - 899px | Tablet |
| **md** | 900px - 1199px | Desktop pequeno |
| **lg** | 1200px+ | Desktop grande |

---

## 🚨 Erros Comuns

### ❌ **Não fazer assim:**
```javascript
// Tamanho fixo (não responsivo)
<Typography sx={{ fontSize: '24px' }}>
  Título
</Typography>
```

### ✅ **Fazer assim:**
```javascript
// Tamanho responsivo
<Typography sx={{ fontSize: typography.pageTitle }}>
  Título
</Typography>
```

---

## 📞 Suporte

Se tiver dúvidas ou precisar adicionar novos tamanhos, consulte:
- `src/theme/typography.js` - Arquivo principal
- `DESIGN-SYSTEM.md` - Design System completo
- `THEME-CHECKLIST.md` - Checklist de temas

---

**Feito com 🐾 para SuperPet Store**

