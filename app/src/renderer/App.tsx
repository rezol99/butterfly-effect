import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import { getPythonScriptDir, joinPath } from './util/path';

const testPython = async () => {
  const scriptsDir = await getPythonScriptDir();
  const fileName = 'hello.py';
  const helloScriptPath = joinPath([scriptsDir, fileName]);
  const stdio: string = await window.electron.ipcRenderer.invoke(
    'python-hello-world',
    helloScriptPath
  );
  return stdio;
};

function Hello() {
  const handlePythonTest = async () => {
    const res = await testPython();
    alert(res);
  };

  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
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
