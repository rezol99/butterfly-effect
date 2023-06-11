import { css } from '@emotion/react';
import { useContext, useEffect, useState } from 'react';
import { convertBase64ToDataUri } from 'renderer/util/converter';
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
        const result = await renderer.render();
        if (result.stderr) throw new Error(result.stderr);
        if (!result.stdout) throw new Error('No stdout');
        const base64Image: string = JSON.parse(result.stdout).image;
        const dataUriImage = convertBase64ToDataUri(base64Image);
        setImage(dataUriImage);
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
