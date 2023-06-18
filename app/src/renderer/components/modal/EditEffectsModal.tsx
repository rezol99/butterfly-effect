import { css } from '@emotion/react';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Rnd } from 'react-rnd';
import { useDebounce } from 'react-use';
import {
  ProjectContext,
  ProjectDispatchContext,
  projectActions,
} from 'renderer/contexts/project';
import { createRotateEffect } from 'renderer/effects';

type Props = {
  isOpen: boolean;
};

const WIDTH = 380;
const HEIGHT = WIDTH * 1.5;

type EditEffectParams = {
  rotate: {
    x: number;
    y: number;
    z: number;
  };
};

const editParamsDefault: EditEffectParams = {
  rotate: {
    x: 0,
    y: 0,
    z: 0,
  },
};

export default function EditEffectsModal({ isOpen: _isOpen }: Props) {
  const [isShow, setIsShow] = useState(_isOpen);
  const [editEffectParams, setEditEffectParams] =
    useState<EditEffectParams>(editParamsDefault);

  const project = useContext(ProjectContext);
  const dispatchProject = useContext(ProjectDispatchContext);

  useDebounce(
    () => {
      const { rotate } = editEffectParams;
      const rotateEffect = createRotateEffect(rotate.x, rotate.y, rotate.z);
      const target = project.composition.layers[0];
      if (!target) return;
      if (target.effects.length === 0) {
        target.addEffect(rotateEffect);
      } else {
        // TODO: 0番目のエフェクトを更新するのは暫定的な実装
        target.updateEffect(0, rotateEffect);
      }
      dispatchProject(projectActions.updateLayer(0, target));
    },
    500,
    [editEffectParams.rotate]
  );

  useEffect(() => {
    setIsShow(_isOpen);
  }, [_isOpen]);

  const rndStyle = {
    zIndex: 1000,
    left: 'auto',
    right: 32,
    bottom: 32,
    top: 'auto',
  } as const;

  if (!isShow) return null;

  const handleRotateX = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (Number.isNaN(value)) return;
    setEditEffectParams((prev) => ({
      ...prev,
      rotate: {
        ...prev.rotate,
        x: value,
      },
    }));
  };

  const handleRotateY = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (Number.isNaN(value)) return;
    setEditEffectParams((prev) => ({
      ...prev,
      rotate: {
        ...prev.rotate,
        y: value,
      },
    }));
  };

  const handleRotateZ = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (Number.isNaN(value)) return;
    setEditEffectParams((prev) => ({
      ...prev,
      rotate: {
        ...prev.rotate,
        z: value,
      },
    }));
  };

  return (
    <Rnd
      default={{
        width: WIDTH,
        height: HEIGHT,
        x: window.innerWidth - WIDTH - 32,
        y: window.innerHeight - HEIGHT - 32,
      }}
      style={rndStyle}
      css={Modal}
      cancel=".react-resizable-handle"
    >
      <div css={Effects}>
        <div css={EffectRow}>
          <p css={EffectName}>ローテーション</p>
          <div css={EffectItem}>
            <label htmlFor="affine-x" css={EffectLabel}>
              X
            </label>
            <input
              className="react-resizable-handle"
              defaultValue={editEffectParams.rotate.x}
              id="affine-x"
              css={EffectRange}
              type="range"
              onChange={handleRotateX}
              step={0.1}
              min={-180}
              max={180}
            />
            <p css={EffectValue}>{editEffectParams.rotate.x}°</p>
          </div>
          <div css={EffectItem}>
            <label htmlFor="affine-y" css={EffectLabel}>
              Y
            </label>
            <input
              className="react-resizable-handle"
              defaultValue={editEffectParams.rotate.y}
              id="affine-y"
              css={EffectRange}
              type="range"
              onChange={handleRotateY}
              step={0.1}
              min={-180}
              max={180}
            />
            <p css={EffectValue}>{editEffectParams.rotate.y}°</p>
          </div>
          <div css={EffectItem}>
            <label htmlFor="affine-z" css={EffectLabel}>
              Z
            </label>
            <input
              className="react-resizable-handle"
              defaultValue={editEffectParams.rotate.z}
              id="affine-z"
              css={EffectRange}
              type="range"
              onChange={handleRotateZ}
              step={0.1}
              min={-180}
              max={180}
            />
            <p css={EffectValue}>{editEffectParams.rotate.z}°</p>
          </div>
        </div>
      </div>
    </Rnd>
  );
}

const Modal = css`
  background-color: #22262e;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  width: ${WIDTH}px;
  height: ${HEIGHT}px;
  position: relative;
`;

const Effects = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  height: 75%;
  background-color: #22262e;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  row-gap: 16px;
`;

const EffectRow = css`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  row-gap: 8px;
`;

const EffectName = css`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  color: white;
`;

const EffectItem = css`
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 16px;
`;

const EffectLabel = css`
  color: white;
`;

const EffectRange = css`
  align-self: flex-start;
`;

const EffectValue = css`
  color: white;
  margin: 0px;
`;
