import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import { convertDataUriToBase64 } from './util/converter';
import Frame from './models/Frame';
import { blurFrame } from './effects/blur';
import { Base64 } from 'main/util';

function Hello() {
  const [testImage, setTestImage] = useState<string | null>(null);

  const fetchDummyImageAsBase64 = async (): Promise<Base64> => {
    const res = await fetch(
      'https://i.seadn.io/gae/oOfqndli8Dqq6gL_QdhQV0ljeZGK_gYfh343GHPvt4Mv9W0JBUim_X9G4PS9R3663XTn_VEH8FUOe2JzLDGgDGcUYEUBgazC7pvWWA?auto=format&w=1000'
    );

    return new Promise<string>(async (resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(await res.blob());

      reader.addEventListener('load', async () => {
        const dataUri = reader.result?.toString();
        if (!dataUri) return;
        const base64Data = convertDataUriToBase64(dataUri);
        const frame = new Frame(base64Data);
        await frame.convert(blurFrame);
        const outputData = frame.dumpAsBase64();
        resolve(outputData);
      });
    });
  };

  const handleClickBlur = async () => {
    const dummyData = await fetchDummyImageAsBase64();
    const dummyFrame = new Frame(dummyData);
    await blurFrame(dummyFrame);
    setTestImage(dummyFrame.dumpAsDataUri());
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
