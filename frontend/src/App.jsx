import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Landing from "./pages/Landing";
import RegisterPage from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
import DashboardLayout from "./components/shared/DashboardLayout";
import Profile from "./pages/student/Profile";
import JobOpenings from "./pages/student/JobOpenings";
import Applications from "./pages/student/Applications";
import Certificates from "./pages/student/Certificates";
import Mentees from "./pages/mentor/Mentees";
import Approvals from "./pages/mentor/Approvals";
import Progress from "./pages/mentor/Progress";
import AdminJobOpenings from "./pages/admin/JobOpenings";
import AdminApplications from "./pages/admin/Applications";
import AdminCertificates from "./pages/admin/Certificates";
import AdminAnnouncements from "./pages/admin/Announcements";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/student" element={<DashboardLayout userRole="student" />}>
          <Route index element={<Profile />} />
          <Route path="jobs" element={<JobOpenings />} />
          <Route path="applications" element={<Applications />} />
          <Route path="certificates" element={<Certificates />} />
        </Route>
        
        <Route path="/mentor" element={<DashboardLayout userRole="mentor" />}>
          <Route index element={<Mentees />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="progress" element={<Progress />} />
        </Route>
        
        <Route path="/admin" element={<DashboardLayout userRole="admin" />}>
          <Route index element={<AdminJobOpenings />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="certificates" element={<AdminCertificates />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
