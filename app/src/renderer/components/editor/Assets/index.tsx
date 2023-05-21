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
  projectActions,
} from 'renderer/contexts/project';
import { parseFileName } from 'renderer/util/path';
import { parseFileType } from 'renderer/util/asset';

const makeAsset = async (filePath: string): Promise<Asset | null> => {
  const fileType = parseFileType(filePath);
  const fileName = parseFileName(filePath);
  const thumbnail = await getThumbnailURI(filePath);
  if (!fileType || !fileName || !thumbnail) return null;

  switch (fileType) {
    case 'image': {
      const imageAsset: ImageAsset = {
        type: 'image',
        path: filePath,
        fileName,
        thumbnail,
        width: 0, // TODO: get width
        height: 0, // TODO: get height
      };
      return imageAsset as ImageAsset;
    }
    case 'video': {
      const videoAsset: VideoAsset = {
        type: 'video',
        path: filePath,
        fileName,
        thumbnail,
        width: 0, // TODO: get width
        height: 0, // TODO: get height
        duration: 0, // TODO: get duration
      };
      return videoAsset as VideoAsset;
    }
    case 'audio':
      // TODO: implement audio asset
      return null;
    default:
      return null;
  }
};

function Assets() {
  const project = useContext(ProjectContext);
  const dispatchProject = useContext(ProjectDispatchContext);

  const handleAddAssets = async () => {
    const files = await browseFiles();
    const { filePaths } = files;

    const _assets: Promise<Asset | null>[] = [];

    filePaths.forEach((filePath) => {
      const asset = makeAsset(filePath);
      _assets.push(asset);
    });

    Promise.all(_assets)
      .then((assets) => {
        const filteredAssets: Asset[] = assets.filter(
          (asset) => asset !== null
        ) as Asset[];
        filteredAssets.forEach((asset) => {
          dispatchProject(projectActions.addAsset(asset));
        });
      })
      .catch(() => {});
  };

  return (
    <div css={Content}>
      <button onClick={handleAddAssets} type="button" css={ImportButton}>
        アセットを追加
      </button>
      <div
        css={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        {project.assets.map((asset) => (
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
