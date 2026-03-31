/**
 * Electron Preload Script
 * Secure bridge - exposes only safe APIs to renderer
 * No Node.js or Electron APIs exposed directly
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  onAuthCallback: (callback: (url: string) => void) => {
    const handler = (_: unknown, url: string) => callback(url);
    ipcRenderer.on('auth-callback', handler);
    return () => ipcRenderer.removeListener('auth-callback', handler);
  },
});
