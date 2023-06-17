import { css } from '@emotion/react';
import { useContext, useEffect, useState } from 'react';
import { Content } from '.';
import { BLACK_BACKGROUND_COLOR } from '../../constants/color';
import { ProjectContext } from 'renderer/contexts/project';
import Renderer from 'renderer/models/renderer';

export default function Preview() {
  const [image, setImage] = useState<string>();
  const project = useContext(ProjectContext);

  useEffect(() => {
    if (project.composition.layers.length === 0) return;
    (async () => {
      const renderer = new Renderer(project.composition.layers);
      try {
        const res = await renderer.render();
        const { image } = res;
        const imagePathAsFileProtocol = `file://${image}`;
        setImage(imagePathAsFileProtocol);
      } catch (error) {
        console.error('Preview render error', error);
      }
    })();
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
