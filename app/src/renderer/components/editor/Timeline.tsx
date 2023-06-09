import { css } from '@emotion/react';
import { useContext, useEffect, useState } from 'react';
import IconEQ from 'renderer/assets/images/icon_equalizer.svg';
import { ProjectContext } from 'renderer/contexts/project';
import Layer from 'renderer/models/layer';
import { Content } from '.';
import {
  BORDER_COLOR,
  PRIMARY_BACKGROUND_COLOR,
  SECONDLY_BACKGROUND_COLOR,
  SELECTED_BORDER_COLOR,
} from '../../constants/color';
import {
  SelectedLayerContext,
  SelectedLayerDispatchContext,
} from 'renderer/contexts/selectedLayer';

const TIMELINES = 20;
const TIMELINE_ROW_HEIGHT = 80;

export default function Timeline() {
  const project = useContext(ProjectContext);
  const [timelines, setTimelines] = useState<(Layer | null)[]>([]);
  const selectedLayer = useContext(SelectedLayerContext);
  const setSelectedLayer = useContext(SelectedLayerDispatchContext);

  useEffect(() => {
    const { layers } = project.composition;
    const paddingSize =
      TIMELINES - layers.length > 0 ? TIMELINES - layers.length : 0;
    const _timelines = [...layers, ...Array(paddingSize).fill(null)];
    setTimelines(_timelines);
  }, [project.composition, project.composition.layers]);

  const handleTimeLineClick = (layer: Layer | null, index: number) => {
    setSelectedLayer({ layer, index });
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
            <button
              type="button"
              onClick={() => handleTimeLineClick(layer, idx)}
              css={TimeLineRow}
              style={{
                backgroundColor:
                  idx % 2 === 0 ? 'inherit' : SECONDLY_BACKGROUND_COLOR,
                border:
                  selectedLayer?.index === idx
                    ? `1px solid ${SELECTED_BORDER_COLOR}`
                    : '1px solid transparent',
                boxSizing: 'border-box',
              }}
            >
              <div css={TimeLineOperations}>
                {layer && (
                  <button
                    type="button"
                    css={OpenOperationButton}
                    onClick={() => {}}
                  >
                    <img src={IconEQ} alt="icon_eq" />
                  </button>
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
            </button>
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
  justify-content: flex-start;
  align-items: center;
  padding-left: 24px;
  box-sizing: border-box;
`;

const OpenOperationButton = css`
  height: 25%;
  aspect-ratio: 1;
  background-color: transparent;
  border: none;
  padding: 0px;
  cursor: pointer;
  opacity: 0.7;

  &:hover {
    opacity: 0.85;
  }

  &:active {
    opacity: 1;
  }
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
  color: white;
  -webkit-text-strokes: 1px black;
  font-size: 14px;
  margin-left: 8px;
`;
