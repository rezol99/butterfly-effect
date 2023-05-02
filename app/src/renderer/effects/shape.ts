import Converter from 'renderer/models/Converter';

export const createAddBorderConverter = (meta: {
  thickness: 10;
  color: [0, 255, 0];
}) => new Converter('add-border', meta);
