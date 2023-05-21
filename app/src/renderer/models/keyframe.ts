import { EasingFunction, linear } from 'renderer/easing';

class Keyframe {
  private _time: number;
  private _value: number;
  private _easing: EasingFunction;

  constructor(time: number, value: number, easing: EasingFunction = linear) {
    this._time = time;
    this._value = value;
    this._easing = easing;
  }

  public get time(): number {
    return this._time;
  }

  public set time(value: number) {
    this._time = value;
  }

  public get value(): number {
    return this._value;
  }

  public set value(value: number) {
    this._value = value;
  }

  public get easing(): EasingFunction {
    return this._easing;
  }

  public set easing(value: EasingFunction) {
    this._easing = value;
  }

  public getInterpolatedValue(
    startTime: number,
    endTime: number,
    currentTime: number
  ): number {
    const t = this._calculateNormalizedTime(startTime, endTime, currentTime);
    const easedT = this.easing(t);
    return this._interpolateValue(easedT, startTime, endTime);
  }

  // eslint-disable-next-line class-methods-use-this
  private _calculateNormalizedTime(
    startTime: number,
    endTime: number,
    currentTime: number
  ): number {
    if (currentTime <= startTime) return 0;
    if (currentTime >= endTime) return 1;
    return (currentTime - startTime) / (endTime - startTime);
  }

  // eslint-disable-next-line class-methods-use-this
  private _interpolateValue(
    t: number,
    startValue: number,
    endValue: number
  ): number {
    return startValue + (endValue - startValue) * t;
  }
}

export default Keyframe;
