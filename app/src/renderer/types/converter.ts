import { StdResult } from 'main/util';
import Frame from 'renderer/models/Frame';

export type Converter = (frame: Frame) => Promise<{
  output: Frame | null;
  result: StdResult;
}>;
