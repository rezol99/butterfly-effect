class Parameters {
  private _data: { [key: string]: any };

  constructor(data: { [key: string]: any }) {
    this._data = data;
  }

  public get(): { [key: string]: any } {
    return this._data;
  }

  public toJSONString(): string {
    return JSON.stringify(this._data);
  }

  public addParameter(name: string, value: any): void {
    this._data[name] = value;
  }
}

export default Parameters;
