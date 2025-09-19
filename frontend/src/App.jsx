import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Landing from "./pages/Landing";
import RegisterPage from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
import DashboardLayout from "./components/student/DashboardLayout";
import Profile from "./pages/student/Profile";
import JobOpenings from "./pages/student/JobOpenings";
import Applications from "./pages/student/Applications";
import Certificates from "./pages/student/Certificates";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/student" element={<DashboardLayout />}>
          <Route index element={<Profile />} />
          <Route path="jobs" element={<JobOpenings />} />
          <Route path="applications" element={<Applications />} />
          <Route path="certificates" element={<Certificates />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
