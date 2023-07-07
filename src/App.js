import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Swap from "./pages/Swap";
import Home from "./pages/Home";

function App() {
  return (
  <Router>
      <Routes>
          <Route path="/staging/" element={<Home />} />
          <Route path="/staging/swap" element={<Swap />} />
      </Routes>
  </Router>
  );
}

export default App;
