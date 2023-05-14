import { css } from '@emotion/react';
import { Content } from '..';
import { browseFiles, getThumbnailURI } from '../../../util/os';
import Item from './Item';
import { useAssets, useAssetDispatch, Asset } from 'renderer/contexts/Assets';
import { assetsActions } from 'renderer/contexts/Assets';
import { getFileName } from 'renderer/util/path';

function Assets() {
  const assets = useAssets();
  const dispatchAssets = useAssetDispatch();

  const handleAddAssets = async () => {
    const files = await browseFiles();

    const { filePaths } = files;
    const thumbnails = filePaths.map(getThumbnailURI);

    const assetsFromBrowseFiles: Asset[] = [];
    try {
      const resolvedThumbnails = await Promise.all(thumbnails);

      resolvedThumbnails.forEach((_, idx) => {
        const uri = filePaths[idx];
        const name = getFileName(uri);
        const thumbnail = resolvedThumbnails[idx];
        assetsFromBrowseFiles.push({ uri, name, thumbnail });
      });
    } catch (e) {
      alert(e);
    }
    dispatchAssets(assetsActions.addAssets(assetsFromBrowseFiles));
  };

  return (
    <div css={Content} style={{ flexDirection: 'column', height: '100%' }}>
      <button onClick={handleAddAssets} type="button" css={ImportButton}>
        アセットを追加
      </button>
      <div css={AssetsContainer}>
        {assets.map(({ thumbnail }, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Item key={idx} imgSrc={thumbnail} />
        ))}
      </div>
    </div>
  );
}

export default Assets;

const ImportButton = css`
  font-size: 14px;
  padding: 4px 16px;
  border-radius: 8px;
  cursor: pointer;
`;

const AssetsContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  overflow-y: scroll;
`;
