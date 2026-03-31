/**
 * Electron Main Process
 * Cloud-based OAuth: desktop opens cloud URL, receives callback via prompt-directory:// protocol
 */

import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';

const PROTOCOL = 'prompt-directory';

let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    show: false,
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => mainWindow?.show());
  mainWindow.on('closed', () => { mainWindow = null; });
}

function sendAuthUrlToRenderer(url: string) {
  if (mainWindow?.webContents && !mainWindow.webContents.isDestroyed()) {
    mainWindow.webContents.send('auth-callback', url);
  }
}

function handleProtocolUrl(url: string) {
  sendAuthUrlToRenderer(url);
}

// Single instance lock - second instance gets the protocol URL
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (_event, commandLine) => {
    const url = commandLine.find((arg) => arg.startsWith(`${PROTOCOL}://`));
    if (url) handleProtocolUrl(url);
    mainWindow?.focus();
  });
}

app.whenReady().then(() => {
  app.setAsDefaultProtocolClient(PROTOCOL);

  ipcMain.handle('open-external', (_e, url: string) => shell.openExternal(url));

  createWindow();

  // Handle protocol URL when app is launched with it (Windows)
  const argv = process.argv;
  const protocolUrl = argv.find((arg) => arg.startsWith(`${PROTOCOL}://`));
  if (protocolUrl) {
    setTimeout(() => handleProtocolUrl(protocolUrl), 1000);
  }
});

app.on('open-url', (event, url) => {
  event.preventDefault();
  if (url.startsWith(`${PROTOCOL}://`)) handleProtocolUrl(url);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
