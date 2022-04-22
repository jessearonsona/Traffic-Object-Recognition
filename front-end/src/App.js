import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core";
import Layout from "./components/Layout";
import RequireAuth from "./components/RequireAuth";
import Login from "./pages/Login";
import Tracking from "./pages/Tracking";
import Conditions from "./pages/Conditions";
import Admin from "./pages/Admin";

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
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes*/}
          <Route path="/" element={<Login />} />
          {/* Protected Routes*/}
          <Route element={<RequireAuth />}>
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/conditions" element={<Conditions />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
