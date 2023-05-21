import { css } from '@emotion/react';
import { Content } from '.';
import {
  BORDER_COLOR,
  PRIMARY_BACKGROUND_COLOR,
  SECONDLY_BACKGROUND_COLOR,
} from '../../constants/color';

const TIMELINES = 20;
const TIMELINE_ROW_HEIGHT = 80;

export default function Timeline() {
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
        {Array(TIMELINES)
          .fill(null)
          .map((_, idx) => {
            return (
              <div
                key={idx}
                css={TimeLineRow}
                style={{
                  backgroundColor:
                    idx % 2 === 0 ? 'inherit' : SECONDLY_BACKGROUND_COLOR,
                }}
              />
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
  width: 300vw;
  height: ${TIMELINE_ROW_HEIGHT}px;
  border: 0.3px ${BORDER_COLOR} solid;

  &:hover {
    opacity: 0.7;
  }
`;
