import { Base64, PythonSendData } from 'main/util';
import { parseStdResult, sendPython } from 'renderer/bridge/python';
import { Converter } from 'renderer/types/converter';

// eslint-disable-next-line import/prefer-default-export
export const blurFrame: Converter = async (frame) => {
  const data: PythonSendData = { command: 'blur', image: frame.dumpAsBase64() };
  const result = await sendPython(data);
  const pythonRes = parseStdResult(result);
  const converted: Base64 | undefined = pythonRes?.image;
  if (converted) frame.updateImageData(converted);
  return result;
};
