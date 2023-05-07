import React, { useContext } from 'react';
import Frame from 'renderer/models/Frame';
import Layer from 'renderer/models/Layer';

const defaultValue: Layer = new Layer([]);

const LayerManagerContext = React.createContext<Layer>(defaultValue);
const LayerManagerUpdateContext = React.createContext<
  React.Dispatch<React.SetStateAction<Layer>>
>(() => {});

export function LayerManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [layer, setLayer] = React.useState<Layer>(defaultValue);

  return (
    <LayerManagerContext.Provider value={layer}>
      <LayerManagerUpdateContext.Provider value={setLayer}>
        {children}
      </LayerManagerUpdateContext.Provider>
    </LayerManagerContext.Provider>
  );
}

const useLayerManager = () => {
  const layer = useContext(LayerManagerContext);
  const setLayer = useContext(LayerManagerUpdateContext);

  const resetFrames = () => {
    setLayer(defaultValue);
  };

  const addFrame = (frame: Frame) => {
    layer.addFrame(frame);
    const layerCopy = new Layer(layer.frames);
    setLayer(layerCopy);
  };

  const setFrames = (frames: Frame[]) => {
    const layerCopy = new Layer(frames);
    setLayer(layerCopy);
  };

  return { layer, addFrame, setFrames, resetFrames };
};

export default useLayerManager;
