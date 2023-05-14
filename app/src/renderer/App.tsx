import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import { LayerManagerProvider } from './contexts/LayerManager';
import Editor from './features/editor';
import './normalize.css';
import { AssetsProvider } from './contexts/Assets';

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
      <AssetsProvider>
        <Routers />
      </AssetsProvider>
    </LayerManagerProvider>
  );
}
