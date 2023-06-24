import { css } from '@emotion/react';
import { useContext, useEffect, useState } from 'react';
import { ProjectContext } from 'renderer/contexts/project';
import { useCompositionWebSocket } from 'renderer/hooks/websocket';
import Renderer from 'renderer/models/renderer';
import { Content } from '.';
import { BLACK_BACKGROUND_COLOR } from '../../constants/color';

export default function Preview() {
  const [image, setImage] = useState<string>();
  const project = useContext(ProjectContext);
  const { compositionImage, sendCompositionMessage } =
    useCompositionWebSocket();

  useEffect(() => {
    if (!compositionImage) return;
    const imageAsDataUrl = `data:image/png;base64,${compositionImage}`;
    setImage(imageAsDataUrl);
  }, [compositionImage]);

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
