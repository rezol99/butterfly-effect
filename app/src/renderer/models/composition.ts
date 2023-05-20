import Layer from './layer';

class Composition {
  private _layers: Layer[];

  constructor() {
    this._layers = [];
  }

  get layers(): Layer[] {
    return this._layers;
  }

  public addLayer(layer: Layer): void {
    this._layers.push(layer);
  }

  public removeLayer(targetIndex: number): void {
    this._layers.splice(targetIndex, 1);
  }

  public changeLayerOrder(currentIndex: number, newIndex: number) {
    const currentLayer = this._layers[currentIndex];
    this._layers.splice(currentIndex, 1);
    this._layers.splice(newIndex, 0, currentLayer);
  }
}

export default Composition;
