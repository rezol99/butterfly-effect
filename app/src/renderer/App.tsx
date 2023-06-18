import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import { IoProvider } from 'socket.io-react-hook';
import './App.css';
import Editor from './components/editor';
import './normalize.css';
import ProjectProvider from './contexts/project';

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
    <IoProvider>
      <ProjectProvider>
        <Routers />
      </ProjectProvider>
    </IoProvider>
  );
}
