import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Swap from "./pages/Swap";
import Home from "./pages/Home";
import StakeToken from "./pages/StakeToken";
import StakeLP from "./pages/StakeLP";

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="/staging/" element={<Home />} />
          <Route path="/staging/swap" element={<Swap />} />
          <Route path="/staging/staketoken" element={<StakeToken />} />
          <Route path="/staging/stakelp" element={<StakeLP />} />
        </Routes>
      </Router>
  );
}
