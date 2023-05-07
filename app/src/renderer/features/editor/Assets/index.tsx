import { css } from '@emotion/react';
import { browseFiles } from '../../../util/os';
import { Content } from '..';

function Assets() {
  const handleAddAssets = async () => {
    const files = await browseFiles();
    console.log(files);
  };

  return (
    <div css={Content}>
      <button onClick={handleAddAssets} type="button" css={ImportButton}>
        アセットを追加
      </button>
    </div>
  );
};

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

