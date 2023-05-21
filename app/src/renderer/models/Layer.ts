import Effect from './effect';

class Layer {
  private _file!: string;
  private _visibility!: boolean;
  private _effects!: Effect[];

  constructor(file: string) {
    this._file = file;
    this._visibility = true;
    this._effects = [];
  }

  get file(): string {
    return this._file;
  }

  get visibility(): boolean {
    return this._visibility;
  }

  get effects(): Effect[] {
    return this._effects;
  }

  public hide(): void {
    this._visibility = false;
  }

  public show(): void {
    this._visibility = true;
  }

  public addEffect(effect: Effect): void {
    this._effects.push(effect);
  }

  public removeEffect(index: number): void {
    this._effects.splice(index, 1);
  }

  public changeEffectOrder(effect: Effect, newIndex: number): void {
    const currentIndex = this._effects.indexOf(effect);
    if (currentIndex !== -1) {
      this._effects.splice(currentIndex, 1);
      this._effects.splice(newIndex, 0, effect);
    }
  }
}

export default Layer;
