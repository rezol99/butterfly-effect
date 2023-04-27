import { Base64, PythonSendData, StdResult } from 'main/util';
import { parseStdResult, sendPython } from 'renderer/bridge/python';
import Frame from 'renderer/models/Frame';

// eslint-disable-next-line import/prefer-default-export
export const blurFrame = async (
  frame: Frame
): Promise<{ output: Frame | null; result: StdResult }> => {
  const data: PythonSendData = { command: 'blur', image: frame.dumpAsBase64() };
  const result = await sendPython(data);
  const pythonRes = parseStdResult(result);
  const converted: Base64 | undefined = pythonRes?.image;
  const output = converted ? new Frame(converted) : null;
  return { output, result };
};
