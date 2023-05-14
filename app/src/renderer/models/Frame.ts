import { Base64, StdResult } from 'main/util';
import Converter from './Converter';

class Frame {
  private _uri!: string;

  private _seek!: number;

  private convertedData: Base64 | null = null;

  private converters: Converter[] = [];

  constructor(uri: string, seek: number) {
    this._uri = uri;
    this._seek = seek;
  }

  get seek(): number {
    return this._seek;
  }

  get uri(): string {
    return this._uri;
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

  public dumpConvertedDataAsBase64(): Base64 | null {
    return this.convertedData;
  }

  public dumpConvertedDataAsDataUri(): string | null {
    if (!this.convertedData) return null;
    return `data:image/png;base64,${this.convertedData}`;
  }

  public moveSeek(seek: number): void {
    this._seek = seek;
  }
}

export default Frame;
