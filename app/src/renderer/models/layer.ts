import { AssetType } from 'renderer/types/asset';
import Effect from './effect';
import { Asset } from 'renderer/contexts/project';

export const createLayerByAsset = (asset: Asset) => {
  const layer = new Layer(asset.path, asset.type, asset.thumbnail);
  return layer;
};

class Layer {
  private _file!: string;
  private _thumbnail!: string | null;
  private _type!: AssetType;
  private _visibility!: boolean;
  private _effects!: Effect[];

  constructor(
    file: string,
    type: AssetType,
    thumbnail: string | null = null,
    visibility: boolean = true,
    effects: Effect[] = []
  ) {
    this._file = file;
    this._type = type;
    this._thumbnail = thumbnail;
    this._visibility = visibility;
    this._effects = effects;
  }

  get thumbnail(): string | null {
    return this._thumbnail;
  }

  get file(): string {
    return this._file;
  }

  get type(): AssetType {
    return this._type;
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
