# 🚀 Como Criar o Executável e Atalho na Área de Trabalho

## 📋 Pré-requisitos

1. Instale as dependências:
```bash
npm install
```

## 🔨 Passo a Passo

### 1. Criar o Build da Aplicação Web
```bash
npm run build
```

### 2. Gerar o Executável do Electron

#### Opção A: Build Completo (Instalador + Portátil)
```bash
npm run build:win
```

Isso criará:
- **Instalador NSIS**: `release/SuperPet Painel-Setup-0.1.0.exe`
  - Instalador completo com opções de instalação
  - Cria atalho na área de trabalho automaticamente
  - Cria atalho no menu iniciar
  
- **Versão Portátil**: `release/SuperPet Painel-Portable-0.1.0.exe`
  - Executável independente (não precisa instalar)
  - Pode ser copiado para qualquer lugar

#### Opção B: Build Rápido (pasta descompactada)
```bash
npm run build:electron
```

Isso criará uma pasta: `release/win-unpacked/`
- Contém todos os arquivos necessários
- Execute `SuperPet Painel.exe` diretamente

### 3. Criar Atalho na Área de Trabalho (Manual)

Se você usou a **Opção B** e quer criar um atalho manualmente:

```bash
npm run create-shortcut
```

Ou use o script PowerShell diretamente:

```powershell
.\scripts\create-shortcut.ps1
```

## 📦 Estrutura de Saída

Após o build, a pasta `release/` conterá:

```
release/
├── win-unpacked/               # Aplicação descompactada
│   ├── SuperPet Painel.exe    # Executável principal
│   ├── resources/
│   └── ...
├── SuperPet Painel-Setup-0.1.0.exe      # Instalador (NSIS)
└── SuperPet Painel-Portable-0.1.0.exe   # Versão portátil
```

## 🎯 Recomendações

### Para Usuários Finais:
Use o **instalador NSIS** (`SuperPet Painel-Setup-0.1.0.exe`):
- ✅ Cria atalhos automaticamente
- ✅ Integração com Windows
- ✅ Desinstalador incluído
- ✅ Atualizações mais fáceis

### Para Desenvolvimento/Testes:
Use a **versão portátil** ou **win-unpacked**:
- ✅ Não precisa instalar
- ✅ Build mais rápido
- ✅ Fácil de testar

## 🔧 Personalizar Ícone

Para usar um ícone personalizado:

1. Crie ou baixe um ícone `.ico` (256x256 ou 512x512)
2. Substitua o arquivo `build/icon.ico`
3. Rode o build novamente

Você pode converter PNG para ICO em sites como:
- https://convertio.co/png-ico/
- https://www.icoconverter.com/

## ⚙️ Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor web (desenvolvimento) |
| `npm run electron` | Inicia Electron (desenvolvimento) |
| `npm run build` | Build da aplicação web |
| `npm run build:win` | Build completo para Windows |
| `npm run build:electron` | Build rápido (win-unpacked) |
| `npm run create-shortcut` | Cria atalho na área de trabalho |

## 🐛 Solução de Problemas

### Erro: "Executável não encontrado"
Execute primeiro: `npm run build:win`

### Erro: "electron-builder not found"
Execute: `npm install`

### Ícone não aparece
1. Certifique-se que `build/icon.ico` existe
2. Rode o build novamente
3. Limpe a pasta `release/` antes

## 📝 Notas

- O primeiro build pode demorar alguns minutos
- Builds subsequentes são mais rápidos
- A pasta `release/` é ignorada pelo Git (veja `.gitignore`)
- O instalador NSIS já cria atalho automaticamente

---

**Desenvolvido com ❤️ para SuperPet**

