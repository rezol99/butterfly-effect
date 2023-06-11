import { css } from '@emotion/react';
import { Content } from '.';
import {
  BORDER_COLOR,
  PRIMARY_BACKGROUND_COLOR,
  SECONDLY_BACKGROUND_COLOR,
} from '../../constants/color';
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import {
  ProjectContext,
  ProjectDispatchContext,
  projectActions,
} from 'renderer/contexts/project';
import Layer from 'renderer/models/layer';
import { createBlurEffect } from 'renderer/effects';

const TIMELINES = 20;
const TIMELINE_ROW_HEIGHT = 80;

export default function Timeline() {
  const project = useContext(ProjectContext);
  const dispatchProject = useContext(ProjectDispatchContext);
  const [timelines, setTimelines] = useState<(Layer | null)[]>([]);

  useEffect(() => {
    const { layers } = project.composition;
    const paddingSize =
      TIMELINES - layers.length > 0 ? TIMELINES - layers.length : 0;
    const _timelines = [...layers, ...Array(paddingSize).fill(null)];
    setTimelines(_timelines);
  }, [project.composition, project.composition.layers]);

  const handleBlurCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const intensity = e.target.checked ? 80 : 0;
    const blurEffect = createBlurEffect(intensity);
    const target = project.composition.layers[idx];
    if (!target) return;
    if (target.effects.length === 0) {
      target.addEffect(blurEffect);
    } else {
      // TODO: 0番目のエフェクトを更新するのは暫定的な実装
      target.updateEffect(0, blurEffect);
    }
    dispatchProject(projectActions.updateLayer(idx, target));
  };

  return (
    <div
      css={Content}
      style={{
        backgroundColor: PRIMARY_BACKGROUND_COLOR,
        gridRow: '2 / 3',
        gridColumn: '1 / 4',
        overflowY: 'scroll',
      }}
    >
      <div css={TimeLinesWrapper}>
        {timelines.map((layer, idx) => {
          return (
            <div
              css={TimeLineRow}
              style={{
                backgroundColor:
                  idx % 2 === 0 ? 'inherit' : SECONDLY_BACKGROUND_COLOR,
              }}
            >
              <div css={TimeLineOperations}>
                {layer && (
                  <form css={TimeLineOperation}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor={`blur-${idx}`} css={TimeLineOperationLabel}>
                      ぼかす
                    </label>
                    <input
                      onChange={(e) => handleBlurCheckboxChange(e, idx)}
                      id={`blur-${idx}`}
                      type="checkbox"
                    />
                  </form>
                )}
              </div>
              <div
                css={TimeLineAsset}
                style={{
                  backgroundImage: `url(${layer?.thumbnail})`,
                  height: '100%',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <p css={TimeLineText}>{layer?.file}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TimeLinesWrapper = css`
  width: 100%;
  height: fit-content;
`;

const TimeLineRow = css`
  display: grid;
  grid-template-columns: 300px 1fr;
  align-items: center;
  width: 300vw;
  height: ${TIMELINE_ROW_HEIGHT}px;
  border: 0.3px ${BORDER_COLOR} solid;
  overflow: hidden;
`;

const TimeLineOperations = css`
  width: 100%;
  height: 100%;
  background-color: black;
  display: flex;
  align-items: center;
  padding-left: 16px;
  box-sizing: border-box;
`;

const TimeLineOperation = css`
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: 1fr 1fr;
  width: 40%;
  height: 100%;
`;

const TimeLineOperationLabel = css`
  text-align: center;
  color: white;
  user-select: none;
`;

const TimeLineAsset = css`
  position: relative;
  display: flex;
  align-items: center;
  opacity: 0.5;

  &:hover {
    opacity: 0.55;
  }
`;

const TimeLineText = css`
  position: absolute;
  z-index: 20;
  color: black;
  font-size: 14px;
  margin-left: 8px;
`;
