const { app, BrowserWindow, session } = require('electron');
const path = require('path');

// Silencia warnings de segurança em desenvolvimento
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: true,
      sandbox: false, // Desabilita sandbox para evitar warnings de CSP
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
    },
  });

  // Configurar Content-Security-Policy (mais permissiva para React funcionar)
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' http://localhost:* ws://localhost:* wss://localhost:*"
        ]
      }
    });
  });

  if (isDev) {
    // Modo desenvolvimento - conecta ao servidor Vite
    win.loadURL('http://localhost:5173');
    // Abre DevTools automaticamente em desenvolvimento
    win.webContents.openDevTools();
  } else {
    // Modo produção - carrega arquivos buildados
    win.loadFile(path.join(__dirname, '../dist/index.html'));
    
    // Abre DevTools para debug (remova em produção final)
    win.webContents.openDevTools();
  }
  
  // Log de erros para debug
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
  
  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Console [${level}]:`, message, 'at', sourceId, line);
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Trata erros de segurança e outros
app.on('web-contents-created', (event, contents) => {
  // Bloqueia navegação externa
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    // Permite apenas localhost em dev e file:// em produção
    if (isDev) {
      if (!parsedUrl.host.includes('localhost')) {
        event.preventDefault();
      }
    } else {
      if (parsedUrl.origin !== 'file://') {
        event.preventDefault();
      }
    }
  });

  // Bloqueia abertura de novas janelas
  contents.setWindowOpenHandler(({ url }) => {
    // Pode adicionar lógica para abrir URLs externas no navegador padrão
    return { action: 'deny' };
  });
});
