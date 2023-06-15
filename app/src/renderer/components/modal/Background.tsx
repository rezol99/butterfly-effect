import { css } from '@emotion/react';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function Background({ children }: Props) {
  return <div css={Container}>{children}</div>;
}

const Container = css`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 100;
`;
