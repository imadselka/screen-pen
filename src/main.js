const { app, BrowserWindow, globalShortcut, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    transparent: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setAlwaysOnTop(true);
  mainWindow.loadFile("./src/index.html");

  // This allows clicks to pass through areas without UI elements
  mainWindow.setIgnoreMouseEvents(true, { forward: true });

  // We'll toggle this with keyboard shortcuts and based on toolbar visibility
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.executeJavaScript(`
      document.addEventListener('mouseover', (e) => {
        if (e.target.closest('#toolbar') || e.target.closest('#show-ui') || e.target.closest('#keyboard-info')) {
          window.electronAPI.setIgnoreMouseEvents(false);
        }
      });
      
      document.addEventListener('mouseout', (e) => {
        if (e.target.closest('#toolbar') || e.target.closest('#show-ui') || e.target.closest('#keyboard-info')) {
          if (!isDrawing) {
            window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
          }
        }
      });

      // Add this to the global scope to track drawing state
      window.isDrawing = false;
      document.addEventListener('mousedown', () => { 
        window.isDrawing = true;
        window.electronAPI.setIgnoreMouseEvents(false);
      });
      document.addEventListener('mouseup', () => { 
        window.isDrawing = false;
        if (!document.querySelector('#toolbar:hover') && !document.querySelector('#show-ui:hover')) {
          window.electronAPI.setIgnoreMouseEvents(true, { forward: true });
        }
      });
    `);
  });
}

app.whenReady().then(() => {
  // Set up IPC for mouse event control
  ipcMain.handle("set-ignore-mouse-events", (event, ...args) => {
    mainWindow.setIgnoreMouseEvents(...args);
  });

  // Expose electronAPI to renderer
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow.webContents.executeJavaScript(`
      window.electronAPI = {
        setIgnoreMouseEvents: (...args) => window.ipcRenderer.invoke('set-ignore-mouse-events', ...args)
      };
    `);
  });

  // Create window first, then register shortcuts
  createWindow();

  // Register shortcuts after app is ready and window is created
  setTimeout(() => {
    registerShortcuts();
  }, 500);
});

function registerShortcuts() {
  // Unregister any existing shortcuts first to avoid conflicts
  globalShortcut.unregisterAll();

  // Register toggle shortcut (Ctrl+Alt+P)
  globalShortcut.register("CommandOrControl+Alt+P", () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
      }
    } else {
      createWindow();
    }
  });

  // Escape key to quit
  globalShortcut.register("Escape", () => {
    app.quit();
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});
