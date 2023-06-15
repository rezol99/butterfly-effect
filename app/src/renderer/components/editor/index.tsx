import { css } from '@emotion/react';
import { BORDER_COLOR } from '../../constants/color';
import Assets from './Assets';
import Preview from './Preview';
import Timeline from './Timeline';
import { useState } from 'react';
import EditEffectsModal from '../modal/EditEffectsModal';

const SIDE_WIDTH = 300;

export default function Index() {
  const [isOpenEditModal, setIsOpenEditModal] = useState(true);

  return (
    <>
      <div css={Layout}>
        <Assets />
        <Preview />
        <div css={Content} />
        <Timeline />
      </div>
      <EditEffectsModal isOpen={isOpenEditModal} />
    </>
  );
}

const Layout = css`
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: ${SIDE_WIDTH}px 1fr ${SIDE_WIDTH}px;
  grid-template-rows: 2.5fr 250px;
  overflow: hidden;
`;

export const Content = css`
  display: flex;
  position: relative;
  border: 0.3px ${BORDER_COLOR} solid;
  height: 100%;
  overflow: hidden;
`;
