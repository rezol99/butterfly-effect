class Keyframe {
  _time: number;
  _value: any;

  get time(): number {
    return this._time;
  }
  get value(): any {
    return this._value;
  }

  constructor(time: number, value: any) {
    this._time = time;
    this._value = value;
  }
}

export default Keyframe;
