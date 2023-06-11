import Effect from 'renderer/models/effect';
import Parameters from 'renderer/models/parameters';

export const createBlurEffect = (intensity = 80) => {
  const parameters: Parameters = new Parameters({ intensity });
  return new Effect('blur', { parameters });
};
