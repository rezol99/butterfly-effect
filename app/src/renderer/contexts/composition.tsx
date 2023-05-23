import { Dispatch, createContext, useReducer, ReactNode } from 'react';
import Layer from '../models/layer';

export type Composition = {
  layers: (Layer | null)[];
};

const DEFAULT_LAYER_COUNT = 20;

const defaultValue: Composition = {
  layers: new Array(DEFAULT_LAYER_COUNT).fill(null),
};

export const CompositionContext = createContext<Composition>(defaultValue);

export const CompositionDispatchContext = createContext<
  Dispatch<CompositionAction>
>(() => {});

const ADD_LAYER = 'ADD_LAYER' as const;
const REMOVE_LAYER = 'REMOVE_LAYER' as const;
const SWAP_LAYER_ORDER = 'SWAP_LAYER_ORDER' as const;

const addLayer = (layer: Layer) => {
  return { type: ADD_LAYER, payload: { layer } };
};

const removeLayer = (index: number) => ({
  type: REMOVE_LAYER,
  payload: { index },
});

const swapLayerOrder = (oldIndex: number, newIndex: number) => ({
  type: SWAP_LAYER_ORDER,
  payload: { oldIndex, newIndex },
});

export const compositionActions = {
  addLayer,
  removeLayer,
  swapLayerOrder,
};

export type CompositionAction = ReturnType<
  (typeof compositionActions)[keyof typeof compositionActions]
>;

const compositionReducer = (
  state: Composition,
  action: CompositionAction
): Composition => {
  switch (action.type) {
    case ADD_LAYER:
      return { ...state, layers: [...state.layers, action.payload.layer] };
    case REMOVE_LAYER: {
      const removed = state.layers.filter((_, i) => i !== action.payload.index);
      return { ...state, layers: removed };
    }
    case SWAP_LAYER_ORDER: {
      const oldLayer = state.layers[action.payload.oldIndex];
      const newLayer = state.layers[action.payload.newIndex];
      state.layers[action.payload.oldIndex] = newLayer;
      state.layers[action.payload.newIndex] = oldLayer;
      return { ...state, layers: [...state.layers] };
    }
    default:
      return state;
  }
};

export default function CompositionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(compositionReducer, defaultValue);
  return (
    <CompositionContext.Provider value={state}>
      <CompositionDispatchContext.Provider value={dispatch}>
        {children}
      </CompositionDispatchContext.Provider>
    </CompositionContext.Provider>
  );
}
