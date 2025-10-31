const { contextBridge } = require('electron');

// Silencia warnings de desenvolvimento ANTES de qualquer outra coisa
if (process.env.NODE_ENV === 'development') {
  // Silencia warning do React DevTools
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true,
    inject: function() {},
    onCommitFiberRoot: function() {},
    onCommitFiberUnmount: function() {}
  };
}

// Expor APIs seguras para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
});

// Log para debug (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('✅ SuperPet Painel - Preload completo');
}

