import { css } from '@emotion/react';
import { Content } from '.';
import {
  BORDER_COLOR,
  PRIMARY_BACKGROUND_COLOR,
  SECONDLY_BACKGROUND_COLOR,
} from '../../constants/color';
import { useContext, useEffect, useState } from 'react';
import { ProjectContext } from 'renderer/contexts/project';
import Layer from 'renderer/models/layer';

const TIMELINES = 20;
const TIMELINE_ROW_HEIGHT = 80;

export default function Timeline() {
  const project = useContext(ProjectContext);
  const [timelines, setTimelines] = useState<(Layer | null)[]>([]);

  useEffect(() => {
    const { layers } = project.composition;
    const paddingSize =
      TIMELINES - layers.length > 0 ? TIMELINES - layers.length : 0;
    const _timelines = [...layers, ...Array(paddingSize).fill(null)];
    setTimelines(_timelines);
  }, [project.composition, project.composition.layers]);

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
              {layer?.thumbnail ? (
                <img
                  css={TimeLineThumbnail}
                  alt={`layer-${idx}`}
                  src={layer?.thumbnail}
                />
              ) : null}
              <p css={TimeLineText}>{layer?.file}</p>
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
  position: relative;
  display: flex;
  align-items: center;
  width: 300vw;
  height: ${TIMELINE_ROW_HEIGHT}px;
  border: 0.3px ${BORDER_COLOR} solid;
  overflow: hidden;

  &:hover {
    opacity: 0.7;
  }
`;

const TimeLineThumbnail = css`
  position: absolute;
  width: 100%;
  object-fit: cover;
  z-index: 10;
  opacity: 0.5;
`;

const TimeLineText = css`
  position: absolute;
  z-index: 20;
  color: white;
  font-size: 14px;
  margin-left: 8px;
`;
