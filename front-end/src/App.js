import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core";
import Login from "./pages/Login";
import Tracking from "./pages/Tracking";
import Conditions from "./pages/Conditions";
import ResetPW from "./pages/ResetPW";
import Account from "./pages/Account";

const theme = createTheme({
  palette: {
    primary: {
      main: "#18563e",
    },
    secondary: {
      main: "#ffd033",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="/ResetPW" element={<ResetPW />} />
          <Route path="/Account" element={<Account />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
