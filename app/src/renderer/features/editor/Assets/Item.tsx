import { css } from '@emotion/react';
import useLayerManager from 'renderer/contexts/LayerManager';
import Frame from 'renderer/models/Frame';

type Props = {
  imgSrc: string;
  uri: string;
  key: any;
};

function Asset({ imgSrc, uri, key }: Props) {
  const { addFrame } = useLayerManager();
  const handleClick = () => {
    const frame = new Frame(imgSrc)
    addFrame(imgSrc);
  };

  return (
    <img key={key} onClick={handleClick} src={imgSrc} css={AssetThumbnail} alt="asset-thumbnail" />
  );
}

export default Asset;

const AssetThumbnail = css`
  width: 80%;
  aspect-ratio: 16 / 9;
  object-fit: contain;
  object-position: center center;
`;
