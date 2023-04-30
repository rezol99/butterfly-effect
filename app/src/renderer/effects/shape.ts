import { Base64, PythonSendData } from 'main/util';
import { parseStdResult, sendPython } from 'renderer/bridge/python';
import { Converter } from 'renderer/types/converter';

export const addBorder: Converter = async (frames) => {
  const data: PythonSendData = {
    command: 'add-border',
    images: [frames[0].dumpAsBase64()],
    meta: {
      thickness: 10,
      color: [0, 255, 0],
    },
  };
  const result = await sendPython(data);
  const pythonRes = parseStdResult(result);
  const converted: Base64 | undefined = pythonRes?.image;
  if (converted) frames[0].updateImageData(converted);
  return result;
};
