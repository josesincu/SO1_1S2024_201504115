import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UseResources from './pages/UseResources'
import NavBar from './components/navbar';
import UseOverTime from './pages/UseOverTime';
import About from './pages/About';
import ProcessTree from './pages/ProcessTree';
import States from './pages/States';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<About />} />
        <Route path="/real" element={<UseResources />} />
        <Route path="/history" element={<UseOverTime />} />
        <Route path="/processtree" element={<ProcessTree />} />
        <Route path="/diagram" element={<States />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App