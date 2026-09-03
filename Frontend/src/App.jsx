import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Report from "./pages/Report";
import MyReports from "./pages/MyReports";
import { AuthProvider } from "./components/AuthContext";
import { ThemeProvider } from "./components/ThemeContext";
import AdminHome from "./pages/AdminHome";
import Complaints from "./pages/Complaints";
import SolvesComplaints from "./pages/SolvesComplaints";
import CityOverview from "./pages/CityOverview";
import About from "./pages/About";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/report" element={<Report />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/city-overview" element={<CityOverview />} />
            <Route path="/aboutus" element={<About />} />

            {/* Admin routes */}
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/solves-complaints" element={<SolvesComplaints />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

