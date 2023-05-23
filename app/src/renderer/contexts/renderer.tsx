import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import Renderer from 'renderer/models/renderer';

export const RendererContext = createContext<Renderer | null>(null);
export const RendererDispatchContext = createContext<Dispatch<RendererAction>>(
  () => {}
);

const SET_RENDERER = 'SET_RENDERER' as const;
const RESET_RENDERER = 'RESET_RENDERER' as const;

const setRenderer = (renderer: Renderer) => {
  return { type: SET_RENDERER, renderer };
};

const resetRenderer = () => {
  return { type: RESET_RENDERER };
};

export const rendererActions = {
  setRenderer,
  resetRenderer,
};
export type RendererAction = ReturnType<
  (typeof rendererActions)[keyof typeof rendererActions]
>;

const rendererReducer = (state: Renderer | null, action: RendererAction) => {
  switch (action.type) {
    case RESET_RENDERER:
      return null;
    case SET_RENDERER:
      return action.renderer;
    default:
      return state;
  }
};

export default function RendererProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(rendererReducer, null);

  return (
    <RendererContext.Provider value={state}>
      <RendererDispatchContext.Provider value={dispatch}>
        {children}
      </RendererDispatchContext.Provider>
    </RendererContext.Provider>
  );
}
