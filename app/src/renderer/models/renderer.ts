import { sendPythonViaMain } from 'renderer/bridge/python';
import { PythonSendData, StdResult } from 'main/util';
import { Project } from 'renderer/contexts/project';

class Renderer {
  _project!: Project;

  get project(): Project {
    return this._project;
  }

  constructor(project: Project) {
    this._project = project;
  }

  public async render(compositionTargetIndex: number): Promise<StdResult[]> {
    const composition = this._project.compositions[compositionTargetIndex];
    const { layers } = composition;
    const results: StdResult[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const layer of layers) {
      const file = layer?.file;
      const effects = layer?.effects;

      if (file === undefined) continue;
      if (effects === undefined) continue;

      // eslint-disable-next-line no-restricted-syntax
      for (const effect of effects) {
        const { type, params } = effect;
        const files = [file];
        const sendData: PythonSendData = { type, files, params };
        // eslint-disable-next-line no-await-in-loop
        const res = await sendPythonViaMain(sendData);
        results.push(res);
      }
    }

    return results;
  }
}

export default Renderer;
