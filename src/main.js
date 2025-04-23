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
  mainWindow.setIgnoreMouseEvents(false);
}

app.whenReady().then(() => {
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
