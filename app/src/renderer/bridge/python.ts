import { PythonSendData } from 'main/util';

const sendPython = (data: PythonSendData) => {
  return window.electron.ipcRenderer.invoke('send-python', data);
};

export default sendPython;
