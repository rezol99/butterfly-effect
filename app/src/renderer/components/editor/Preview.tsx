import { css } from '@emotion/react';
import { useContext, useEffect, useState } from 'react';
import { Content } from '.';
import { BLACK_BACKGROUND_COLOR } from '../../constants/color';
import { ProjectContext } from 'renderer/contexts/project';
import Renderer from 'renderer/models/renderer';
import { useDebounce } from 'react-use';
import { useCompositionWebSocket } from 'renderer/hooks/websocket';

export default function Preview() {
  const [image, setImage] = useState<string>();
  const project = useContext(ProjectContext);
  const { compositionImage, sendMessage } = useCompositionWebSocket();

  useEffect(() => {
    if (!compositionImage) return;
    const imageAsFileProtocol = `file://${compositionImage}`;
    setImage(imageAsFileProtocol);
  }, [compositionImage]);

  // TODO: Refactor
  useDebounce(
    async () => {
      if (project.composition.layers.length === 0) return;
      const renderer = new Renderer(project.composition.layers);
      const sendData = renderer.createCompositionSendData(
        project.composition.layers
      );
      await sendMessage(sendData);
    },
    100,
    [project.composition.layers]
  );

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
