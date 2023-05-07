import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { convertBase64ToDataUri } from 'renderer/util/converter';
import { fetchAsBase64 } from 'renderer/util/network';
import { Content } from '.';
import { BLACK_BACKGROUND_COLOR } from '../../constants/color';

export default function Preview() {
  const [image, setImage] = useState<string>();

  useEffect(() => {
    (async () => {
      const imageUrl =
        'https://i.seadn.io/gcs/files/3bbc9b5e32a2f897db248da912e06a51.jpg?auto=format&w=1000';
      const base64Image = await fetchAsBase64(imageUrl);
      const dataUri = convertBase64ToDataUri(base64Image);
      setImage(dataUri);
    })();
  }, []);

  return (
    <div
      css={Content}
      style={{
        backgroundColor: BLACK_BACKGROUND_COLOR,
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {image && <img src={image} css={PreviewImage} alt="preview" />}
    </div>
  );
}

const PreviewImage = css`
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: contain;
  object-position: center center;
`;
