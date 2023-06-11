import { AssetType } from 'renderer/types/asset';
import Effect, { EffectSendObject } from './effect';
import { Asset } from 'renderer/contexts/project';

export const createLayerByAsset = (asset: Asset) => {
  const layer = new Layer(asset.path, asset.type, asset.thumbnail);
  return layer;
};

export type LayerSendObject = {
  file: string | null;
  type: AssetType;
  effects: EffectSendObject[];
};

class Layer {
  private _file!: string | null;
  private _thumbnail!: string | null;
  private _type!: AssetType;
  private _visibility!: boolean;
  private _effects!: Effect[];

  constructor(
    file: string | null,
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

  get file(): string | null {
    return this._file;
  }

  get type(): AssetType {
    return this._type;
  }

  get visibility(): boolean {
    return this._visibility;
  }

  set visibility(value: boolean) {
    this._visibility = value;
  }

  get effects(): Effect[] {
    return this._effects;
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

  public toSendObject(): LayerSendObject {
    const file = this._file;
    const type = this._type;
    const effects = this.effects.map((effect) => effect.toSendObject());
    return { file, type, effects };
  }
}

export default Layer;
