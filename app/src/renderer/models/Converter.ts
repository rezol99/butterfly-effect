import { Base64, PythonSendData, StdResult } from 'main/util';
import { parseStdResult, sendPythonViaMain } from 'renderer/bridge/python';
import Frame from './Frame';

class Converter {
  private command!: string;

  private meta?: any;

  constructor(command: string, meta?: any) {
    this.command = command;
    this.meta = meta;
  }

  public async run(frame: Frame): Promise<StdResult> {
    const data: PythonSendData = {
      command: this.command,
      images: [frame.dumpAsBase64()],
      meta: this.meta,
    };
    const result = await sendPythonViaMain(data);
    const pythonRes = parseStdResult(result);
    const converted: Base64 | undefined = pythonRes?.image;
    if (converted) frame.updateImageData(converted);
    return result;
  }
}

export default Converter;
