import { createContext, Dispatch, ReactNode, useReducer } from 'react';
import Layer from 'renderer/models/layer';

type SelectedLayer = {
  index: number | null;
  layer: Layer | null;
};

export const SelectedLayerContext = createContext<SelectedLayer | null>(null);
export const SelectedLayerDispatchContext = createContext<
  Dispatch<SelectedLayer | null>
>(() => {});

export function SelectedLayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    (_: SelectedLayer | null, action: SelectedLayer | null) => {
      return action;
    },
    null
  );

  return (
    <SelectedLayerContext.Provider value={state}>
      <SelectedLayerDispatchContext.Provider value={dispatch}>
        {children}
      </SelectedLayerDispatchContext.Provider>
    </SelectedLayerContext.Provider>
  );
}
