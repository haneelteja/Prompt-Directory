/**
 * Auth utilities - detect Electron vs web
 */

export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && !!window.electronAPI;
};
