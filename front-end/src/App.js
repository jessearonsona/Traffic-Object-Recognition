import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Tracking from "./pages/Tracking";
import Conditions from "./pages/Conditions";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/conditions" element={<Conditions />} />
      </Routes>
    </Router>
  );
}

export default App;
