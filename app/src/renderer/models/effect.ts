import { Timing } from 'renderer/types/time';
import Parameters from './parameters';

export type EffectSendObject = {
  type: string;
  params: {
    [key: string]: any;
  };
  timing: {
    start: number;
    end: number;
  };
};

export type EffectType = 'blur';

class Effect {
  private _type!: EffectType;
  private _params!: Parameters;
  private _timing!: Timing;

  constructor(
    type: EffectType,
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

  public toSendObject(): EffectSendObject {
    return {
      type: this._type,
      params: this._params.get(),
      timing: { start: this._timing.start, end: this._timing.end },
    };
  }
}

export default Effect;
