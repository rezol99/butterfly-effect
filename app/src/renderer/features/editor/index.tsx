import { css } from '@emotion/react';
import Preview from './Preview';
import Timeline from './Timeline';
import { BORDER_COLOR } from '../../constants/color';

const SIDE_WIDTH = 300;

export default function Index() {
  return (
    <div css={Layout}>
      <div css={Content} />
      <Preview />
      <div css={Content} />
      <Timeline />
    </div>
  );
}

const Layout = css`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: ${SIDE_WIDTH}px 1fr ${SIDE_WIDTH}px;
  grid-template-rows: 2.5fr 1fr;
`;

export const Content = css`
  border: 0.3px ${BORDER_COLOR} solid;
`;
