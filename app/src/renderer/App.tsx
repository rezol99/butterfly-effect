import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import Frame from './models/Frame';
import { blurFrame } from './effects/blur';
import { fetchAsBase64 } from './util/network';
import Layer from './models/Layer';

function Hello() {
  const [testImage, setTestImage] = useState<string | null>(null);

  const handleClickBlur = async () => {
    const dummyData = await fetchAsBase64(
      'https://i.seadn.io/gae/oOfqndli8Dqq6gL_QdhQV0ljeZGK_gYfh343GHPvt4Mv9W0JBUim_X9G4PS9R3663XTn_VEH8FUOe2JzLDGgDGcUYEUBgazC7pvWWA?auto=format&w=1000'
    );
    const dummyFrame = new Frame(dummyData);
    dummyFrame.addConverter(blurFrame);
    dummyFrame.addConverter(blurFrame);
    dummyFrame.addConverter(blurFrame);
    dummyFrame.addConverter(blurFrame);
    await dummyFrame.convert();
    setTestImage(dummyFrame.dumpAsDataUri());
  };

  const handleClickCompose = async () => {
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
  };

  return (
    <div>
      <div
        className="Hello"
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        <img width="200" alt="icon" src={testImage ?? icon} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            marginTop: 16,
          }}
        >
          <button onClick={handleClickBlur}>Blur</button>
          <button onClick={handleClickCompose}>Compose</button>
        </div>
      </div>
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
