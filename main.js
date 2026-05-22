const { app, BrowserWindow } = require('electron');
const path = require('path');

const PORT = 3847;

function startServer() {
  return new Promise((resolve, reject) => {
    try {
      const emitter = require('./server');
      emitter.once('ready', resolve);
      emitter.once('error', reject);
    } catch (err) {
      reject(err);
    }
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 840,
    minWidth: 900,
    minHeight: 650,
    icon: path.join(__dirname, 'icon.ico'),
    title: 'Calculadora de Honorários Contábeis',
    backgroundColor: '#F1F5F9',
    show: false, // Ocultar até estar maximizada
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.setMenuBarVisibility(false);
  win.maximize(); // Abre em tela cheia
  win.show();
  win.loadURL(`http://127.0.0.1:${PORT}/calculadora.html`);
  win.on('page-title-updated', (e) => e.preventDefault());
}

app.whenReady().then(async () => {
  await startServer();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
