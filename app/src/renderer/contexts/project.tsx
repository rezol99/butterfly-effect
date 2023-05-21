import { createContext, ReactNode, Dispatch, useReducer } from 'react';
import { Composition } from './composition';

export type ImageAsset = {
  type: 'image';
  path: string;
  thumbnail: string;
  width: number;
  height: number;
};

export type VideoAsset = {
  type: 'video';
  path: string;
  thumbnail: string;
  width: number;
  height: number;
  duration: number;
};

export type AudioAsset = {
  type: 'audio';
  path: string;
  thumbnail: string;
  duration: number;
};

export type Asset = ImageAsset | VideoAsset | AudioAsset;

export type Project = {
  compositions: Composition[];
  assets: Asset[];
};

const defaultValue: Project = {
  compositions: [],
  assets: [],
};

export const ProjectContext = createContext<Project>(defaultValue);
export const ProjectDispatchContext = createContext<Dispatch<ProjectAction>>(
  () => {}
);

const ADD_COMPOSITION = 'ADD_COMPOSITION' as const;
const REMOVE_COMPOSITION = 'REMOVE_COMPOSITION' as const;
const RESET_COMPOSITIONS = 'RESET_COMPOSITIONS' as const;

const ADD_ASSET = 'ADD_ASSET' as const;
const REMOVE_ASSET = 'REMOVE_ASSET' as const;
const RESET_ASSETS = 'RESET_ASSETS' as const;

const RESET_PROJECT = 'RESET_PROJECT' as const;

const addComposition = (composition: Composition) => {
  return { type: ADD_COMPOSITION, composition };
};

const removeComposition = (index: number) => {
  return { type: REMOVE_COMPOSITION, index };
};

const resetCompositions = () => {
  return { type: RESET_COMPOSITIONS };
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
  addComposition,
  removeComposition,
  resetCompositions,
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
    case ADD_COMPOSITION:
      return {
        ...state,
        compositions: [...state.compositions, action.composition],
      };
    case REMOVE_COMPOSITION: {
      const removed = state.compositions.filter((_, i) => i !== action.index);
      return { ...state, compositions: removed };
    }

    case RESET_COMPOSITIONS:
      return { ...state, compositions: [] };

    case ADD_ASSET:
      return { ...state, assets: [...state.assets, action.asset] };

    case REMOVE_ASSET: {
      const removed = state.assets.filter((_, i) => i !== action.index);
      return { ...state, assets: removed };
    }

    case RESET_ASSETS:
      return { ...state, assets: [] };

    case RESET_PROJECT:
      return { compositions: [], assets: [] };

    default:
      return state;
  }
};

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, defaultValue);
  return (
    <ProjectContext.Provider value={state}>
      <ProjectDispatchContext.Provider value={dispatch}>
        {children}
      </ProjectDispatchContext.Provider>
    </ProjectContext.Provider>
  );
}
