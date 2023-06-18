import { Dispatch, ReactNode, createContext, useReducer } from 'react';
import Layer from 'renderer/models/layer';
import { Composition } from './composition';

export type ImageAsset = {
  type: 'image';
  path: string;
  fileName: string;
  thumbnail: string;
  width: number;
  height: number;
};

export type VideoAsset = {
  type: 'video';
  path: string;
  fileName: string;
  thumbnail: string;
  width: number;
  height: number;
  duration: number;
};

export type AudioAsset = {
  type: 'audio';
  path: string;
  fileName: string;
  thumbnail: string;
  duration: number;
};

export type Asset = ImageAsset | VideoAsset | AudioAsset;

export type Project = {
  composition: Composition;
  assets: Asset[];
};

const defaultValue: Project = {
  composition: { layers: [] },
  assets: [],
};

export const ProjectContext = createContext<Project>(defaultValue);
export const ProjectDispatchContext = createContext<Dispatch<ProjectAction>>(
  () => {}
);

const ADD_LAYER = 'ADD_LAYER' as const;
const REMOVE_LAYER = 'REMOVE_LAYER' as const;
const UPDATE_LAYER = 'UPDATE_LAYER' as const;
const RESET_LAYERS = 'RESET_LAYERS' as const;

const ADD_ASSET = 'ADD_ASSET' as const;
const REMOVE_ASSET = 'REMOVE_ASSET' as const;
const RESET_ASSETS = 'RESET_ASSETS' as const;

const RESET_PROJECT = 'RESET_PROJECT' as const;

const addLayer = (layer: Layer) => {
  return { type: ADD_LAYER, layer };
};

const updateLayer = (index: number, layer: Layer) => {
  return { type: UPDATE_LAYER, index, layer };
};

const removeLayer = (index: number) => {
  return { type: REMOVE_LAYER, index };
};

const resetLayers = () => {
  return { type: RESET_LAYERS };
};

const addAsset = (asset: Asset) => {
  return { type: ADD_ASSET, asset };
};

const removeAsset = (index: number) => {
  return { type: REMOVE_ASSET, index };
};

const resetAssets = () => {
  return { type: RESET_ASSETS };
};

const resetProject = () => {
  return { type: RESET_PROJECT };
};

export const projectActions = {
  addLayer,
  removeLayer,
  updateLayer,
  resetLayers,
  addAsset,
  removeAsset,
  resetAssets,
  resetProject,
};

export type ProjectAction = ReturnType<
  (typeof projectActions)[keyof typeof projectActions]
>;

const projectReducer = (state: Project, action: ProjectAction): Project => {
  switch (action.type) {
    case ADD_LAYER:
      return {
        ...state,
        composition: {
          ...state.composition,
          layers: [...state.composition.layers, action.layer],
        },
      };
    case REMOVE_LAYER: {
      const removed = state.composition.layers.filter(
        (_, i) => i !== action.index
      );
      return {
        ...state,
        composition: { ...state.composition, layers: removed },
      };
    }
    case UPDATE_LAYER: {
      const updated = state.composition.layers.map((layer, i) => {
        if (i === action.index) return action.layer;
        return layer;
      });
      return {
        ...state,
        composition: { ...state.composition, layers: updated },
      };
    }
    case RESET_LAYERS:
      return { ...state, composition: { ...state.composition, layers: [] } };
    case ADD_ASSET: {
      const isAlreadyAdded = state.assets.some(
        (asset) => asset.path === action.asset.path
      );
      if (isAlreadyAdded) return state;
      return { ...state, assets: [...state.assets, action.asset] };
    }
    case REMOVE_ASSET: {
      const removed = state.assets.filter((_, i) => i !== action.index);
      return { ...state, assets: removed };
    }
    case RESET_ASSETS:
      return { ...state, assets: [] };
    case RESET_PROJECT:
      return { composition: { layers: [] }, assets: [] };
    default:
      return state;
  }
};

export default function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, defaultValue);
  return (
    <ProjectContext.Provider value={state}>
      <ProjectDispatchContext.Provider value={dispatch}>
        {children}
      </ProjectDispatchContext.Provider>
    </ProjectContext.Provider>
  );
}
