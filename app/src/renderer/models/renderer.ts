import { sendPythonViaMain } from 'renderer/bridge/python';
import { PythonCompositionSendData, StdResult } from 'main/util';
import Layer, { LayerSendObject } from './layer';
import WebSocketClient from 'renderer/bridge/ws';

class Renderer {
  private _layers: (Layer | null)[] = [];

  constructor(layers: (Layer | null)[]) {
    this._layers = layers;
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
    const type = 'composition' as const;
    const sendData: PythonCompositionSendData = {
      type,
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

  public async render(): Promise<{ image: string }> {
    const nonNullLayers = this.layers.filter(
      (layer) => layer !== null
    ) as Layer[];
    const sendData = this.createCompositionSendData(nonNullLayers);
    const client = new WebSocketClient();
    try {
      await client.connect();
      client.send('composition', sendData);
    } catch (error) {
      console.error(error);
    }

    return new Promise((resolve, reject) => {
      client.on('composition', (message: string) => {
        const { image } = JSON.parse(message);
        resolve({ image });
      });
    });
  }
}

export default Renderer;
