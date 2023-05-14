export const getPythonScriptDir = () => {
  return window.electron.ipcRenderer.invoke('get-python-dir');
};

export const joinPath = (pathList: string[]) => {
  return pathList.join('/');
};

export const getFileName = (path: string): string => {
  const name = path.split('/').pop();
  return name ?? '';
};
