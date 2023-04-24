import { PythonSendData, StdResult } from 'main/util';

const sendPython = (data: PythonSendData): Promise<StdResult> => {
  return window.electron.ipcRenderer.invoke('send-python', data);
};

export default sendPython;
