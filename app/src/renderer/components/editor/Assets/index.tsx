import { css } from '@emotion/react';
import { useContext } from 'react';
import {
  Asset,
  ImageAsset,
  ProjectContext,
  ProjectDispatchContext,
  VideoAsset,
  projectActions,
} from 'renderer/contexts/project';
import { createLayerByAsset } from 'renderer/models/layer';
import { parseFileType } from 'renderer/util/asset';
import { parseFileName } from 'renderer/util/path';
import { Content } from '..';
import { browseFiles, getThumbnailURI } from '../../../util/os';
import AssetContent from './AssetContent';
import { SelectedLayerContext, SelectedLayerDispatchContext } from 'renderer/contexts/selectedLayer';

const createAssetByFilePath = async (
  filePath: string
): Promise<Asset | null> => {
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
  const setSelectedLayer = useContext(SelectedLayerDispatchContext)

  const handleAddAssets = async () => {
    const files = await browseFiles();

    const { filePaths } = files;
    const promiseAssets: Promise<Asset | null>[] = filePaths.map((filePath) =>
      createAssetByFilePath(filePath)
    );
    Promise.all(promiseAssets)
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

  const handleAssetClick = (asset: Asset) => {
    const layer = createLayerByAsset(asset);
    dispatchProject(projectActions.addLayer(layer));
    setSelectedLayer({ layer, index: project.composition.layers.length });
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
          <AssetContent
            path={asset.path}
            thumbnail={asset.thumbnail}
            onClick={() => handleAssetClick(asset)}
          />
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
