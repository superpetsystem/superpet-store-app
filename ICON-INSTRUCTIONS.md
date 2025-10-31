# 🎨 Como Adicionar Ícone Personalizado

## Formatos Necessários

Para o build funcionar corretamente com ícones personalizados, você precisa:

### Windows (.ico)
- **Tamanho recomendado**: 256x256 pixels ou maior
- **Formato**: `.ico` (múltiplas resoluções em um arquivo)
- **Localização**: `build/icon.ico`

### Outras plataformas
- **macOS**: `build/icon.icns` (512x512@2x)
- **Linux**: `build/icon.png` (512x512)

## 🛠️ Como Criar o Ícone

### Opção 1: Usar Ferramenta Online
1. Acesse: https://www.icoconverter.com/
2. Faça upload de uma imagem PNG de alta qualidade (512x512 ou maior)
3. Baixe o arquivo `.ico` gerado
4. Coloque em `build/icon.ico`

### Opção 2: Usar ImageMagick (Linha de Comando)
```bash
# Converter PNG para ICO
magick convert icon.png -define icon:auto-resize=256,128,64,48,32,16 build/icon.ico
```

### Opção 3: Usar GIMP
1. Abra sua imagem no GIMP
2. Redimensione para 256x256 (Image → Scale Image)
3. Export As → Salve como `.ico`
4. Escolha múltiplas resoluções na exportação

## 📝 Configuração no package.json

Depois de adicionar os ícones, atualize o `package.json`:

```json
"build": {
  "win": {
    "icon": "build/icon.ico"
  },
  "mac": {
    "icon": "build/icon.icns"
  },
  "linux": {
    "icon": "build/icon.png"
  }
}
```

## ⚡ Build sem Ícone (Temporário)

O projeto está configurado para fazer build **sem ícone personalizado** por padrão.
O Electron usará o ícone padrão.

Para build rápido sem ícone:
```bash
npm run build:win
```

## 🎯 Recomendações de Design

Para o ícone da SuperPet:
- Use as cores do design system: `#0E6A6B` (teal) e `#E47B24` (laranja)
- Inclua o logo/símbolo da loja
- Mantenha simples e reconhecível em tamanhos pequenos
- Fundo transparente ou sólido

## 📦 Arquivos de Ícone

Estrutura recomendada:
```
build/
├── icon.ico       # Windows (256x256)
├── icon.icns      # macOS (512x512@2x)
└── icon.png       # Linux (512x512)
```

## 🚀 Testando

Depois de adicionar os ícones:

1. Faça o build:
```bash
npm run build:win
```

2. Verifique o executável em:
```
release/win-unpacked/SuperPet Painel.exe
```

3. O ícone deve aparecer no executável e na barra de tarefas

---

**Nota**: O build funciona normalmente sem ícones personalizados. Eles são opcionais mas recomendados para distribuição final.

