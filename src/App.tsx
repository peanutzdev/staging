import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Swap from "./pages/Swap";
import Home from "./pages/Home";
import StakeToken from "./pages/StakeToken";

export default function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/staketoken" element={<StakeToken />} />
        </Routes>
      </Router>
  );
}
