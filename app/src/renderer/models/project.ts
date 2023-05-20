import Composition from './composition';

class Project {
  private _compositions: Composition[];
  private _resources: string[];

  constructor() {
    this._compositions = [];
    this._resources = [];
  }

  get compositions(): Composition[] {
    return this._compositions;
  }

  get resources(): string[] {
    return this._resources;
  }

  public addComposition(composition: Composition): void {
    this._compositions.push(composition);
  }

  public removeComposition(composition: Composition): void {
    const index = this._compositions.indexOf(composition);
    if (index !== -1) {
      this._compositions.splice(index, 1);
    }
  }

  public addResource(resource: string): void {
    this._resources.push(resource);
  }

  public removeResource(resource: string): void {
    const index = this._resources.indexOf(resource);
    if (index !== -1) {
      this._resources.splice(index, 1);
    }
  }
}

export default Project;
