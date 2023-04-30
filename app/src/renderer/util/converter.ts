import { Base64 } from 'main/util';

// eslint-disable-next-line import/prefer-default-export
export const convertDataUriToBase64 = (dataUri: string): Base64 => {
  const base64 = dataUri.split(',')[1];
  return base64;
};

export const convertBase64ToDataUri = (base64: string): string => {
  const mimeType = 'image/png';
  return `data:${mimeType};base64,${base64}`;
};
