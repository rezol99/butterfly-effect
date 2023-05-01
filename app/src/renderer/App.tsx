import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Frame from './models/Frame';
import { blurFrame } from './effects';
import { fetchAsBase64 } from './util/network';
import Layer from './models/Layer';
import './normalize.css';
import './App.css';

function Hello() {
  const [testImage, setTestImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const dummyData1 = await fetchAsBase64(
        'https://i.seadn.io/gae/oOfqndli8Dqq6gL_QdhQV0ljeZGK_gYfh343GHPvt4Mv9W0JBUim_X9G4PS9R3663XTn_VEH8FUOe2JzLDGgDGcUYEUBgazC7pvWWA?auto=format&w=1000'
      );
      const dummyData2 = await fetchAsBase64(
        'https://pbs.twimg.com/profile_banners/1466674869484277766/1676096798/1500x500'
      );

      const dummyFrame1 = new Frame(dummyData1);
      dummyFrame1.addConverter(blurFrame);
      dummyFrame1.addConverter(blurFrame);
      const dummyFrame2 = new Frame(dummyData2);
      const dummyLayer = new Layer([dummyFrame1, dummyFrame2]);
      await dummyLayer.compose();
      setTestImage(dummyLayer.dumpAsDataUrl());
    })();
  }, []);

  return (
    <div
      css={{
        position: 'fixed',
        top: 8 * 16,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1920 / 2,
        minWidth: 200,
        height: 1080 / 2,
        minHeight: 200 / 2,
        backgroundColor: 'black',
      }}
    >
      {testImage && (
        <img
          css={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          src={testImage ?? undefined}
          alt="preview"
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
