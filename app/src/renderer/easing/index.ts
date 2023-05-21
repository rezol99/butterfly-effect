// eslint-disable-next-line no-unused-vars
export type EasingFunction = (t: number) => number;

export const linear: EasingFunction = (t: number) => t;
export const easeInQuad: EasingFunction = (t: number) => t * t;
export const easeOutQuad: EasingFunction = (t: number) => t * (2 - t);
export const easeInOutQuad: EasingFunction = (t: number) =>
  t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
