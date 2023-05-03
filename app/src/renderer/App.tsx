import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './normalize.css';
import './App.css';
import { LayerManagerProvider } from './contexts/LayerManager';

function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<h1>Hello</h1>} />
      </Routes>
    </Router>
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
