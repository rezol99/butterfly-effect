import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import Keyframe from 'renderer/models/keyframe';

type Timeline = {
  keyframes: Keyframe[];
};

export const TimelineContext = createContext<Timeline | null>(null);
export const TimelineDispatchContext = createContext<Dispatch<TimelineAction>>(
  () => {}
);

const ADD_KEYFRAME = 'ADD_KEYFRAME' as const;
const RESET_TIMELINE = 'RESET_TIMELINE' as const;

const addKeyframe = (keyframe: Keyframe) => {
  return { type: ADD_KEYFRAME, keyframe };
};

const resetTimeline = () => {
  return { type: RESET_TIMELINE };
};

export const timelineActions = {
  addKeyframe,
  resetTimeline,
};

export type TimelineAction = ReturnType<
  (typeof timelineActions)[keyof typeof timelineActions]
>;

const timelineReducer = (
  state: Timeline | null,
  action: TimelineAction
): Timeline | null => {
  switch (action.type) {
    case RESET_TIMELINE:
      return null;
    case ADD_KEYFRAME:
      return state
        ? { ...state, keyframes: [...state.keyframes, action.keyframe] }
        : state;
    default:
      return state;
  }
};

export default function TimelineProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(timelineReducer, null);

  return (
    <TimelineContext.Provider value={state}>
      <TimelineDispatchContext.Provider value={dispatch}>
        {children}
      </TimelineDispatchContext.Provider>
    </TimelineContext.Provider>
  );
}
