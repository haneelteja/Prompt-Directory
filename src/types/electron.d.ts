/**
 * Electron API exposed via preload (contextBridge)
 * Only these methods are available in renderer - no Node/Electron exposure
 */

export interface ElectronAPI {
  openExternal: (url: string) => Promise<void>;
  onAuthCallback: (callback: (url: string) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
