import { OpenDialogReturnValue } from 'electron';

export const browseFiles = (): Promise<OpenDialogReturnValue> => {
  const files = window.electron.ipcRenderer.invoke('browse-files');
  return files;
};

export const getThumbnailURI = async (filePath: string): Promise<string> => {
  const uri = await window.electron.ipcRenderer.invoke(
    'get-file-thumbnail-uri',
    filePath
  );
  return uri;
};
