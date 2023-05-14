import React, { Dispatch, useReducer } from 'react';

export type Asset = {
  thumbnail: string;
  name: string;
  uri: string;
};

const defaultValue: Asset[] = [];

const AssetsContext = React.createContext<Asset[]>(defaultValue);
const AssetsDispatchContext = React.createContext<Dispatch<ActionTypes>>(
  () => {}
);

const RESET_ASSETS = 'RESET_ASSETS' as const;
const ADD_ASSET = 'ADD_ASSET' as const;
const ADD_ASSETS = 'ADD_ASSETS' as const;
const REMOVE_ASSET = 'REMOVE_ASSET' as const;

const resetAssets = () => {
  return { type: RESET_ASSETS };
};

const addAsset = (asset: Asset) => {
  return { type: ADD_ASSET, asset };
};

const addAssets = (assets: Asset[]) => {
  return { type: ADD_ASSETS, assets };
};

const removeAsset = (asset: Asset) => {
  return { type: REMOVE_ASSET, asset };
};

export const assetsActions = {
  resetAssets,
  addAsset,
  addAssets,
  removeAsset,
};

export type ActionTypes =
  | ReturnType<typeof resetAssets>
  | ReturnType<typeof addAsset>
  | ReturnType<typeof addAssets>
  | ReturnType<typeof removeAsset>;

const reducer = (state: Asset[], action: ActionTypes) => {
  switch (action.type) {
    case RESET_ASSETS:
      return defaultValue;
    case ADD_ASSET:
      return [...state, action.asset];
    case ADD_ASSETS:
      return [...state, ...action.assets];
    case REMOVE_ASSET:
      return state.filter((asset) => asset.uri !== action.asset.uri);
    default:
      return state;
  }
};

export function AssetsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaultValue);

  return (
    <AssetsContext.Provider value={state}>
      <AssetsDispatchContext.Provider value={dispatch}>
        {children}
      </AssetsDispatchContext.Provider>
    </AssetsContext.Provider>
  );
}

export const useAssets = () => {
  const assets = React.useContext(AssetsContext);
  return assets;
};

export const useAssetDispatch = () => {
  const dispatch = React.useContext(AssetsDispatchContext);
  return dispatch;
};
