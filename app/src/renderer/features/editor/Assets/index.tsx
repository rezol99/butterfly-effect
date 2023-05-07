import { css } from '@emotion/react';
import { browseFiles, getThumbnailURI } from '../../../util/os';
import { Content } from '..';
import { useState } from 'react';

function Assets() {
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const handleAddAssets = async () => {
    const files = await browseFiles();

    const { filePaths } = files;
    const uris = filePaths.map(getThumbnailURI);
    const resolvedUris = await Promise.all(uris)
      .then((resolved) => resolved)
      .catch(() => []);
    setThumbnails((prev) => [...prev, ...resolvedUris]);
  };

  return (
    <div css={Content}>
      <button onClick={handleAddAssets} type="button" css={ImportButton}>
        アセットを追加
      </button>
      <div
        css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {thumbnails.map((uri, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <img key={idx} src={uri} width={300} alt="asset-thumbnail" />
        ))}
      </div>
    </div>
  );
}

export default Assets;

const ImportButton = css`
  position: absolute;
  top: 32px;
  transform: translateX(-50%);
  left: 50%;

  font-size: 14px;
  padding: 4px 16px;
  border-radius: 8px;
  cursor: pointer;
`;
