import { Base64 } from "main/util";

// eslint-disable-next-line import/prefer-default-export
export const convertDataUriToBase64 = (dataUri: string): Base64 => {
  const base64 = dataUri.split(',')[1];
  return base64;
}
