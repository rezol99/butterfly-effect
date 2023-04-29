import { StdResult } from 'main/util';
import Frame from 'renderer/models/Frame';

export type Converter = (frames: Frame[]) => Promise<StdResult>;
