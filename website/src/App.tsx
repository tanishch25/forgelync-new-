import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainSite from './pages/MainSite';
import LuminaApp from './pages/Lumina/LuminaApp';
import EclipseApp from './pages/Eclipse/EclipseApp';
import NexusApp from './pages/Nexus/NexusApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/template-1" element={<LuminaApp />} />
        <Route path="/template-2" element={<EclipseApp />} />
        <Route path="/template-3" element={<NexusApp />} />
      </Routes>
    </Router>
  );
}

export default App;
