import { OpenDialogReturnValue } from 'electron';
import { Base64 } from 'main/util';

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

export const readSharedMemoryAsBase64 = async (
  sharedMemoryName: string
): Promise<Base64> => {
  const base64 = await window.electron.ipcRenderer.invoke(
    'read-shared-memory',
    sharedMemoryName
  );
  return base64;
};
