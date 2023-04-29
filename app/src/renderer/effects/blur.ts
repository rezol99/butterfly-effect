import { Base64, PythonSendData } from 'main/util';
import { parseStdResult, sendPython } from 'renderer/bridge/python';
import { Converter } from 'renderer/types/converter';

// eslint-disable-next-line import/prefer-default-export
export const blurFrame: Converter = async (frames) => {
  const data: PythonSendData = {
    command: 'blur',
    images: [frames[0].dumpAsBase64()],
  };
  const result = await sendPython(data);
  const pythonRes = parseStdResult(result);
  const converted: Base64 | undefined = pythonRes?.image;
  if (converted) frames[0].updateImageData(converted);
  return result;
};
