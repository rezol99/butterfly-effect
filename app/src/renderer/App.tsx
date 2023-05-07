import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './normalize.css';
import './App.css';
import { LayerManagerProvider } from './contexts/LayerManager';
import Editor from './features/editor';

function Routers() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Editor />} />
      </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <LayerManagerProvider>
      <Routers />
    </LayerManagerProvider>
  );
}
