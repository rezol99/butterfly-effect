import { css } from '@emotion/react';

type Props = {
  path: string;
  thumbnail: string;
  onClick?: () => void;
};

export default function AssetContent({ path, thumbnail, onClick }: Props) {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div onClick={handleClick} css={AssetWrapper}>
      <img
        css={AssetThumbnail}
        key={path}
        src={thumbnail}
        alt="asset-thumbnail"
      />
    </div>
  );
}

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

const ContextMenu = css`
  position: absolute;
  top: 0;
  left: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: gray;
`;

const ContextMenuItem = css``;
