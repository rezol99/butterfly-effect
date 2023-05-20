import { Timing } from 'renderer/types/time';
import Parameters from './parameters';

class Effect {
  private _type!: string;
  private _params!: Parameters;
  private _timing!: Timing;

  constructor(
    type: string,
    options?: { parameters?: Parameters; timing?: Timing }
  ) {
    this._type = type;
    this._params = options?.parameters ?? new Parameters({});
    this._timing = options?.timing ?? { start: 0, end: 0 };
  }

  get type(): string {
    return this._type;
  }

  get params(): Parameters {
    return this._params;
  }

  get timing(): Timing {
    return this._timing;
  }

  public setParameter(name: string, value: any): void {
    this._params.addParameter(name, value);
  }

  public setTiming(startTime: number, endTime: number): void {
    this._timing = { start: startTime, end: endTime };
  }
}

export default Effect;
