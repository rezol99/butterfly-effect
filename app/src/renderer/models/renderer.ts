import { sendPythonViaMain } from 'renderer/bridge/python';
import Project from './project';
import { PythonSendData, StdResult } from 'main/util';

class Renderer {
  _project!: Project;

  get project(): Project {
    return this._project;
  }

  constructor(project: Project) {
    this._project = project;
  }

  public render(compositionTargetIndex: number): Promise<StdResult>[] {
    const composition = this._project.compositions[compositionTargetIndex];
    const { layers } = composition;
    const results: Promise<StdResult>[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const layer of layers) {
      const { file } = layer;
      const { effects } = layer;
      // eslint-disable-next-line no-restricted-syntax
      for (const effect of effects) {
        const { type, params } = effect;
        const files = [file];
        const sendData: PythonSendData = { type, files, params };
        const res = sendPythonViaMain(sendData);
        results.push(res);
      }
    }

    return results;
  }
}

export default Renderer;
