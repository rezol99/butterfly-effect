import { createContext, ReactNode, Dispatch, useReducer } from 'react';
import { Composition } from './composition';

export type ImageResource = {
  type: 'image';
  path: string;
  thumbnail: string;
  width: number;
  height: number;
};

export type VideoResource = {
  type: 'video';
  path: string;
  thumbnail: string;
  width: number;
  height: number;
  duration: number;
};

export type AudioResource = {
  type: 'audio';
  path: string;
  thumbnail: string;
  duration: number;
};

export type Resource = ImageResource | VideoResource | AudioResource;

export type Project = {
  compositions: Composition[];
  resources: Resource[];
};

const defaultValue: Project = {
  compositions: [],
  resources: [],
};

export const ProjectContext = createContext<Project>(defaultValue);
export const ProjectDispatchContext = createContext<Dispatch<ProjectAction>>(
  () => {}
);

const ADD_COMPOSITION = 'ADD_COMPOSITION' as const;
const REMOVE_COMPOSITION = 'REMOVE_COMPOSITION' as const;
const RESET_COMPOSITIONS = 'RESET_COMPOSITIONS' as const;

const ADD_RESOURCE = 'ADD_RESOURCE' as const;
const REMOVE_RESOURCE = 'REMOVE_RESOURCE' as const;
const RESET_RESOURCES = 'RESET_RESOURCES' as const;

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

const addResource = (resource: Resource) => {
  return { type: ADD_RESOURCE, resource };
};

const removeResource = (index: number) => {
  return { type: REMOVE_RESOURCE, index };
};

const resetResources = () => {
  return { type: RESET_RESOURCES };
};

const resetProject = () => {
  return { type: RESET_PROJECT };
};

export const projectActions = {
  addComposition,
  removeComposition,
  resetCompositions,
  addResource,
  removeResource,
  resetResources,
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

    case ADD_RESOURCE:
      return { ...state, resources: [...state.resources, action.resource] };

    case REMOVE_RESOURCE: {
      const removed = state.resources.filter((_, i) => i !== action.index);
      return { ...state, resources: removed };
    }

    case RESET_RESOURCES:
      return { ...state, resources: [] };

    case RESET_PROJECT:
      return { compositions: [], resources: [] };

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
