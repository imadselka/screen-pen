const { app, BrowserWindow, globalShortcut } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    fullscreen: true,
    hasShadow: false,
    resizable: false,
    skipTaskbar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile('index.html');
  win.hide(); // Start hidden
}

app.whenReady().then(() => {
  createWindow();

  // Global shortcut to toggle show/hide
  globalShortcut.register('Control+Alt+P', () => {
    if (win.isVisible()) {
      win.hide();
    } else {
      win.show();
    }
  });

  // Optional: ESC to quit
  globalShortcut.register('Control+Alt+Q', () => {
    app.quit();
  });
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
