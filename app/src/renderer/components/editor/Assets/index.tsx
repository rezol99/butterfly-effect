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
    <div
      css={Content}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div css={ImportButtonWrapper}>
        <button onClick={handleAddAssets} type="button" css={ImportButton}>
          アセットを追加
        </button>
      </div>
      <div css={AssetsContainer}>
        {project.assets.map((asset) => (
          <div css={AssetWrapper}>
            <img
              css={AssetThumbnail}
              key={asset.path}
              src={asset.thumbnail}
              alt="asset-thumbnail"
            />
          </div>
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

const ImportButtonWrapper = css`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 0px;
`;

const AssetsContainer = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  padding-top: 16px;
  padding-bottom: 16px;
  row-gap: 24px;
`;

const AssetWrapper = css`
  position: relative;
  width: calc(100% - 48px);
  display: flex;
  flex-direction: column;
`;

const AssetThumbnail = css`
  width: 100%;
  height: auto;
`;
