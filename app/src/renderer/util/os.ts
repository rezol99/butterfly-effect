import { OpenDialogReturnValue } from 'electron';

export const browseFiles = (): Promise<OpenDialogReturnValue> => {
  const files = window.electron.ipcRenderer.invoke('browse-files');
  return files;
};
