import { parseStdResult, sendPython } from 'renderer/bridge/python';
import { Base64, PythonSendData, StdResult } from 'main/util';
import Frame from './Frame';
import { convertBase64ToDataUri } from 'renderer/util/converter';

class Layer {
  private frames!: Frame[];

  private output: Base64 | null = null;

  constructor(frames: Frame[]) {
    this.frames = frames;
  }

  addFrame(frame: Frame) {
    this.frames.push(frame);
  }

  public async compose(): Promise<StdResult> {
    const convertedImagesData = this.frames.map(async (frame) => {
      await frame.convert();
      return frame.dumpAsBase64();
    });
    const resolvedConvertedImages = await Promise.all(convertedImagesData);
    const sendData: PythonSendData = {
      command: 'compose',
      images: resolvedConvertedImages,
    };

    const result = await sendPython(sendData);
    const pythonRes = parseStdResult(result);
    if (pythonRes?.image) this.output = pythonRes.image;
    return result;
  }

  public dumpAsBase64(): Base64 | null {
    return this.output;
  }

  public dumpAsDataUrl(): string | null {
    return this.output ? convertBase64ToDataUri(this.output) : null;
  }
}

export default Layer;
