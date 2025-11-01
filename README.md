# Painel da Loja - SuperPet 🐾

Projeto para o Painel da Loja desenvolvido com React, Vite e Electron, proporcionando uma experiência performática em **Web**, **Mobile (WebView)** e **Desktop**.

## 🚀 Stack Tecnológica

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool e dev server extremamente rápido
- **Electron** - Framework para aplicações desktop multiplataforma
- **Material-UI (MUI)** - Componentes React com design moderno
- **Tailwind CSS** - Framework CSS utilitário

## 📦 Estrutura do Projeto

```
superpet-store-app/
├── electron/          # Configuração do Electron (desktop)
│   ├── main.cjs      # Processo principal do Electron
│   └── preload.cjs   # Script de preload seguro
├── src/              # Código fonte React
│   ├── components/   # Componentes React
│   │   └── Dashboard.jsx  # Painel principal
│   ├── App.jsx       # Componente principal
│   ├── App.css       # Estilos do App
│   ├── main.jsx      # Ponto de entrada React
│   └── index.css     # Estilos globais + Tailwind
├── scripts/          # Scripts auxiliares
│   ├── create-shortcut.js   # Cria atalho desktop (Node)
│   └── create-shortcut.ps1  # Cria atalho desktop (PowerShell)
├── build/            # Assets para build
│   └── icon.png      # Ícone da aplicação
├── public/           # Assets estáticos
├── package.json      # Dependências e scripts
├── vite.config.js    # Configuração do Vite
├── tailwind.config.js # Configuração Tailwind
└── index.html        # HTML base
```

## 🛠️ Instalação

1. Clone o repositório (se aplicável)
2. Instale as dependências:

```bash
npm install
```

## 🎯 Scripts Disponíveis

### Desenvolvimento

```bash
# Inicia o servidor Vite (web/mobile webview)
npm run dev

# Inicia o Electron em modo desenvolvimento
npm run electron

# Inicia Vite e Electron simultaneamente (recomendado para desktop)
npm run electron:start
```

### Produção

```bash
# Build para web
npm run build

# Preview do build
npm run preview

# Build e executa desktop (Electron)
npm run desktop

# Gera executável Windows (.exe) com instalador
npm run build:win

# Gera executável rápido (pasta descompactada)
npm run build:electron
```

### Utilitários

```bash
# Cria atalho na área de trabalho (após build)
npm run create-shortcut
```

## 🌐 Modos de Execução

### 🌍 Web
1. Execute `npm run dev`
2. Acesse `http://localhost:5173` no navegador

### 📱 Mobile (WebView)
A aplicação pode ser embarcada em um WebView mobile nativo apontando para:
- **Desenvolvimento**: `http://[seu-ip]:5173` (o Vite permite acesso externo)
- **Produção**: URL do build deployado

### 💻 Desktop (Electron)

#### Modo Desenvolvimento:
```bash
npm run electron
```

#### Modo Produção (Executável):
1. Gere o executável:
```bash
npm run build:win
```

2. Encontre os arquivos em `release/`:
   - **Instalador**: `SuperPet Painel-Setup-0.1.0.exe` (recomendado)
   - **Portátil**: `SuperPet Painel-Portable-0.1.0.exe`
   - **Descompactado**: `win-unpacked/SuperPet Painel.exe`

3. Execute o instalador que criará automaticamente:
   - Atalho na área de trabalho
   - Atalho no menu iniciar
   - Integração com Windows

📖 Para mais detalhes sobre build, veja [README-BUILD.md](./README-BUILD.md)

## 🎨 Funcionalidades do Dashboard

- ✅ Layout responsivo (mobile, tablet, desktop)
- ✅ Menu lateral adaptável
- ✅ Cards de estatísticas em tempo real
- ✅ Botões de ações rápidas
- ✅ Detecção automática de plataforma (Web/Electron)
- ✅ Integração Material-UI + Tailwind CSS
- ✅ Suporte a tema claro/escuro
- ✅ Ícones do Material Design

## 🔧 Configuração

### Personalizar Ícone
1. Substitua `build/icon.png` com seu ícone (256x256 ou maior)
2. Para Windows `.ico`, use conversores online ou ferramentas como ImageMagick
3. Rode o build novamente

### Personalizar Tema
Edite `src/App.jsx` para modificar o tema do Material-UI:
```jsx
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
})
```

### Personalizar Tailwind
Edite `tailwind.config.js` para adicionar cores, espaçamentos, etc.

## 📝 Notas Técnicas

- O projeto usa `type: "module"` no `package.json`
- Arquivos Electron usam `.cjs` (CommonJS) para compatibilidade
- O Electron está configurado com `contextIsolation` e `preload` para segurança
- Build otimizado com code splitting automático
- Vite configurado para servir em todas as interfaces de rede (mobile webview)

## 🐛 Solução de Problemas

### Erro ao iniciar Electron
```bash
# Certifique-se que as dependências estão instaladas
npm install

# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Build falha no Windows
```bash
# Instale as dependências de build do Windows
npm install --save-dev electron-builder
```

### Porta 5173 já está em uso
```bash
# Mate o processo ou mude a porta em vite.config.js
```

## 🤝 Contribuindo

1. Faça suas alterações
2. Teste em todos os ambientes (web, mobile webview, desktop)
3. Commit seguindo as convenções
4. Push

## 📄 Licença

Este projeto é privado e pertence à SuperPet.

---

**Desenvolvido com ❤️ para SuperPet**
