import Keyframe from './keyframe';

class Timeline {
  private _keyframes: Keyframe[];

  constructor() {
    this._keyframes = [];
  }

  get keyframes(): Keyframe[] {
    return this._keyframes;
  }

  public addKeyframe(keyframe: Keyframe) {
    this._keyframes.push(keyframe);
  }

  public removeKeyframe(keyframe: Keyframe) {
    const index = this._keyframes.indexOf(keyframe);
    if (index !== -1) {
      this._keyframes.splice(index, 1);
    }
  }
}

export default Timeline;
