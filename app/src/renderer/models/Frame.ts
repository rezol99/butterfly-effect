import { Base64, StdResult } from 'main/util';
import Converter from './Converter';

class Frame {
  private base64Data!: Base64;

  private converters: Converter[] = [];

  constructor(imageData: Base64) {
    this.base64Data = imageData;
  }

  public addConverter(converter: Converter): void {
    this.converters.push(converter);
  }

  public async convert(): Promise<StdResult[]> {
    const results: StdResult[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const converter of this.converters) {
      // eslint-disable-next-line no-await-in-loop
      const result = await converter.run(this);
      results.push(result);
    }
    return results;
  }

  public dumpAsBase64(): string {
    return this.base64Data;
  }

  public dumpAsDataUri(): string {
    return `data:image/jpeg;base64,${this.base64Data}`;
  }

  public updateImageData(imageData: Base64): void {
    this.base64Data = imageData;
  }
}

export default Frame;
