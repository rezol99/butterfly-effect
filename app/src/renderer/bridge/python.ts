import PythonSendData, { StdResult } from 'main/util';
import { PythonResult } from 'renderer/types/bridge';

export const parseStdResult = (result: StdResult): PythonResult | null => {
  const { stdout, stderr } = result;
  try {
    if (stderr) throw new Error('Failed to parse python result');
    if (!stdout) throw new Error('Failed to parse python result');
    const res = JSON.parse(stdout) as PythonResult;
    return res;
  } catch {
    return null;
  }
};

export const sendPythonViaMain = (data: PythonSendData): Promise<StdResult> => {
  return window.electron.ipcRenderer.invoke('send-python', data);
};
