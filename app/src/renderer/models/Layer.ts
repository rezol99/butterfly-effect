import { Base64, PythonSendData, StdResult } from 'main/util';
import { parseStdResult, sendPythonViaMain } from 'renderer/bridge/python';
import { convertBase64ToDataUri } from 'renderer/util/converter';
import Frame from './Frame';

class Layer {
  private _frames!: Frame[];

  private output: Base64 | null = null;

  constructor(frames: Frame[]) {
    this._frames = frames;
  }

  get frames(): Frame[] {
    return this._frames;
  }

  public addFrame(frame: Frame) {
    this._frames.push(frame);
  }

  public async compose(): Promise<StdResult> {
    const convertedImagesData = this._frames.map(async (frame) => {
      await frame.convert();
      return frame.dumpAsBase64();
    });
    const resolvedConvertedImages = await Promise.all(convertedImagesData);
    const sendData: PythonSendData = {
      command: 'compose',
      images: resolvedConvertedImages,
    };

    const result = await sendPythonViaMain(sendData);
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
