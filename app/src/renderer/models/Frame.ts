import { Base64, StdResult } from 'main/util';
import { Converter } from 'renderer/types/converter';

class Frame {
  private base64Data!: Base64;

  constructor(imageData: Base64) {
    this.base64Data = imageData;
  }

  public async convert(converter: Converter): Promise<StdResult> {
    const { output, result } = await converter(this);
    if (!output) return result;
    this.base64Data = output.dumpAsBase64();
    return result;
  }

  public dumpAsBase64(): string {
    return this.base64Data;
  }

  public dumpAsDataUri(): string {
    return `data:image/jpeg;base64,${this.base64Data}`;
  }

  public setImageData(imageData: Base64): void {
    this.base64Data = imageData;
  }
}

export default Frame;
