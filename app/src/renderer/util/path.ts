export const getPythonScriptDir = () => {
  return window.electron.ipcRenderer.invoke('get-python-dir');
};

export const joinPath = (pathList: string[]) => {
  return pathList.join('/');
};

export const parseFileName = (path: string) => {
  return path.split('/').pop();
};
