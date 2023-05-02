import Converter from 'renderer/models/Converter';

export const createAddBorderConverter = (meta: {
  thickness: 10;
  color: [0, 255, 0];
}) => new Converter('add-border', meta);

export const createDrawPointConverter = (meta: {
  width: number;
  height: number;
  x: number;
  y: number;
  color: [number, number, number];
  radius: number;
  thickness: number;
}) => new Converter('draw-point', meta);
