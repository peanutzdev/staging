import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Swap from "./pages/Swap";
import Home from "./pages/Home";

function App() {
  return (
  <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
      </Routes>
  </Router>
  );
}

export default App;
