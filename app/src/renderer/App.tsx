import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Editor from './components/editor';
import './normalize.css';
import CompositionProvider from './contexts/composition';
import ProjectProvider from './contexts/project';
import RendererProvider from './contexts/renderer';
import TimelineProvider from './contexts/timeline';

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
    <RendererProvider>
      <ProjectProvider>
        <TimelineProvider>
          <CompositionProvider>
            <Routers />
          </CompositionProvider>
        </TimelineProvider>
      </ProjectProvider>
    </RendererProvider>
  );
}
