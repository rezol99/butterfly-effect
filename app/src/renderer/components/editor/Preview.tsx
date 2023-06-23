import { css } from '@emotion/react';
import { useContext, useEffect, useState } from 'react';
import { ProjectContext } from 'renderer/contexts/project';
import { useCompositionWebSocket } from 'renderer/hooks/websocket';
import Renderer from 'renderer/models/renderer';
import { Content } from '.';
import { BLACK_BACKGROUND_COLOR } from '../../constants/color';
import { readSharedMemoryAsBase64 } from 'renderer/util/os';

export default function Preview() {
  const [image, setImage] = useState<string>();
  const project = useContext(ProjectContext);
  const { compositionImageSharedMemoryName, sendCompositionMessage } =
    useCompositionWebSocket();

  useEffect(() => {
    if (!compositionImageSharedMemoryName) return;
    (async () => {
      const base64 = await readSharedMemoryAsBase64(
        compositionImageSharedMemoryName
      );
      const imageAsFileProtocol = `data:image/png;base64,${base64}`;
      setImage(imageAsFileProtocol);
    })();
  }, [compositionImageSharedMemoryName]);

  useEffect(() => {
    if (project.composition.layers.length === 0) return;
    const renderer = new Renderer(
      project.composition.layers,
      sendCompositionMessage
    );
    renderer.render();
  }, [project.composition.layers]);

  return (
    <div
      css={Content}
      style={{
        backgroundColor: BLACK_BACKGROUND_COLOR,
        display: 'grid',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {image && <img src={image} css={PreviewImage} alt="preview" />}
    </div>
  );
}

const PreviewImage = css`
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: contain;
  object-position: center center;
`;
