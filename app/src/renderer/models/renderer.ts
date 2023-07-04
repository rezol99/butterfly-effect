import { PythonCompositionSendData } from 'main/util';
import Layer, { LayerSendObject } from './layer';

class Renderer {
  private _layers: (Layer | null)[] = [];
  private _sendMessage: (message: Object) => void;

  constructor(
    layers: (Layer | null)[],
    sendMessage: (message: Object) => void
  ) {
    this._layers = layers;
    this._sendMessage = sendMessage;
  }

  get layers(): (Layer | null)[] {
    return this._layers;
  }

  set layers(layers: (Layer | null)[]) {
    this._layers = layers;
  }

  // eslint-disable-next-line class-methods-use-this
  private createCompositionSendData(
    layers: Layer[]
  ): PythonCompositionSendData {
    const sendData: PythonCompositionSendData = {
      params: { layers: [] },
    };
    layers.forEach((layer) => {
      if (layer === null) return;
      const { file, effects } = layer;
      const effectsSendParams = effects.map((effect) => effect.toSendObject());
      const layerSendObject: LayerSendObject = {
        file,
        type: layer.type,
        effects: effectsSendParams,
      };
      sendData.params.layers.push(layerSendObject);
    });
    return sendData;
  }

  public async render(): Promise<void> {
    const nonNullLayers = this.layers.filter(
      (layer) => layer !== null
    ) as Layer[];
    const sendData = this.createCompositionSendData(nonNullLayers);
    this._sendMessage(sendData);
  }
}

export default Renderer;
