import { css } from '@emotion/react';
import { Content } from '..';
import { browseFiles, getThumbnailURI } from '../../../util/os';
import { useContext } from 'react';
import {
  Asset,
  ImageAsset,
  ProjectContext,
  ProjectDispatchContext,
  VideoAsset,
} from 'renderer/contexts/project';
import { parseFileName } from 'renderer/util/path';
import { parseFileType } from 'renderer/util/asset';

function Assets() {
  const project = useContext(ProjectContext);
  const dispatchProject = useContext(ProjectDispatchContext);

  const handleAddAssets = async () => {
    const files = await browseFiles();

    const { filePaths } = files;
    const thumbnails = filePaths.map(getThumbnailURI);
    const resolvedThumbnails = await Promise.all(thumbnails);

    // eslint-disable-next-line no-restricted-syntax
    for (let i = 0; i < filePaths.length; i += 1) {
      const filePath = filePaths[i];
      const fileName = parseFileName(filePath);
      if (!fileName) continue;
      const fileType = parseFileType(filePath);
      if (!fileType) continue;

      let asset: Asset | null = null;

      if (fileType === 'image') {
        const imageAsset: ImageAsset = {
          type: 'image',
          path: filePath,
          thumbnail: resolvedThumbnails[i],
          width: 0, // TODO: get width
          height: 0, // TODO: get height
        };
        asset = imageAsset;
      } else if (fileType === 'video') {
        const videoAsset: VideoAsset = {
          type: 'video',
          path: filePath,
          thumbnail: resolvedThumbnails[i],
          width: 0, // TODO: get width
          height: 0, // TODO: get height
          duration: 0, // TODO: get duration
        };
        asset = videoAsset;
      } else if (fileType === 'audio') {
        // TODO: audio
      } else {
        continue;
      }
      if (asset) dispatchProject({ type: 'ADD_ASSET', asset });
    }
  };

  const { assets } = project;

  return (
    <div css={Content}>
      <button onClick={handleAddAssets} type="button" css={ImportButton}>
        アセットを追加
      </button>
      <div
        css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {assets.map((asset) => (
          <img
            key={asset.path}
            src={asset.thumbnail}
            width={300}
            alt="asset-thumbnail"
          />
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
