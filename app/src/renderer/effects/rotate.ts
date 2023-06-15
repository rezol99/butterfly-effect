import Effect from 'renderer/models/effect';
import Parameters from 'renderer/models/parameters';

export const createRotateEffect = (x: number, y: number, z: number) => {
  const parameters: Parameters = new Parameters({ x, y, z });
  return new Effect('rotate', { parameters });
};
