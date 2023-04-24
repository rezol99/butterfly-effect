import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import icon from '../../assets/icon.svg';
import './App.css';
import sendPython from './bridge/python';

function Hello() {
  const [testImage, setTestImage] = useState<string | null>(null);

  const testOpenCVConvert = async () => {
    const res = await fetch(
      'https://i.seadn.io/gae/oOfqndli8Dqq6gL_QdhQV0ljeZGK_gYfh343GHPvt4Mv9W0JBUim_X9G4PS9R3663XTn_VEH8FUOe2JzLDGgDGcUYEUBgazC7pvWWA?auto=format&w=1000'
    );
    const reader = new FileReader();
    reader.readAsDataURL(await res.blob());
    reader.onload = async () => {
      const base64Data = reader.result?.toString().split(',')[1];
      const sendData = { command: 'blur', image: base64Data };
      const { stdout, stderr } = await sendPython(sendData);
      if (stderr) return;
      if (!stdout) return;
      const json = JSON.parse(stdout);
      const dataURI = `data:image/jpeg;base64,${json.image}`;
      setTestImage(dataURI);
    };
  };

  const handlePythonTest = async () => {
    testOpenCVConvert();
  };

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={testImage ?? icon} />
      </div>
      <button type="button" onClick={handlePythonTest}>
        Python Test
      </button>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚
            </span>
            Read our docs
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
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
