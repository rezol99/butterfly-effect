import { Base64 } from 'main/util';
import { convertDataUriToBase64 } from './converter';

// eslint-disable-next-line import/prefer-default-export
export const fetchAsBase64 = async (url: string): Promise<Base64> => {
  const res = await fetch(url);
  const blob = await res.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);

    reader.addEventListener('load', async () => {
      const dataUri = reader.result?.toString();
      if (!dataUri) return;
      const base64Data = convertDataUriToBase64(dataUri);
      resolve(base64Data);
    });
  });
};
