import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Landing from "./pages/Landing";
import RegisterPage from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
import DashboardLayout from "./components/shared/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentHome from "./pages/student/StudentHome";
import Profile from "./pages/student/Profile";
import JobOpenings from "./pages/student/JobOpenings";
import JobRecommendations from "./pages/student/JobRecommendations";
import Applications from "./pages/student/Applications";
import Certificates from "./pages/student/Certificates";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import Mentees from "./pages/mentor/Mentees";
import Approvals from "./pages/mentor/Approvals";
import Progress from "./pages/mentor/Progress";
import MentorHistory from "./pages/mentor/History";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PlacementDashboard from "./pages/admin/PlacementDashboard";
import UserApprovals from "./pages/admin/UserApprovals";
import JobVerification from "./pages/admin/JobVerification";
import StudentApprovals from "./pages/admin/StudentApprovals";
import UserManagement from "./pages/admin/UserManagement";
import ActivityMonitor from "./pages/admin/ActivityMonitor";
import RecruiterStudentProfile from "./pages/recruiter/RecruiterStudentProfile";
import StudentsList from "./pages/recruiter/StudentsList";
import AdminPostSection from "./pages/admin/AdminPostSection";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import EnhancedRecruiterJobs from "./pages/recruiter/EnhancedRecruiterJobs";
import JobPostingForm from "./pages/recruiter/JobPostingForm";
import ApplicationManagement from "./pages/recruiter/ApplicationManagement";
import RecruiterRegistration from "./pages/recruiter/RecruiterRegistration";
import RecruiterApplications from "./pages/recruiter/RecruiterApplications";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterHistory from "./pages/recruiter/History";
import JobApplications from "./pages/recruiter/JobApplications";
import UnderDevelopment from "./pages/UnderDevelopment";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recruiter/register" element={<RecruiterRegistration />} />
        <Route path="*" element={<UnderDevelopment />} />
        
        <Route path="/student" element={<ProtectedRoute><DashboardLayout userRole="student" /></ProtectedRoute>}>
          <Route index element={<StudentHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:studentId" element={<Profile />} />
          <Route path="jobs" element={<JobOpenings />} />
          <Route path="recommendations" element={<JobRecommendations />} />
          <Route path="applications" element={<Applications />} />
          <Route path="certificates" element={<Certificates />} />
        </Route>
        
        <Route path="/mentor" element={<ProtectedRoute><DashboardLayout userRole="mentor" /></ProtectedRoute>}>
          <Route index element={<MentorDashboard />} />
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="mentees" element={<Mentees />} />
          <Route path="approvals" element={<Approvals />} />
          <Route path="progress" element={<Progress />} />
          <Route path="history" element={<MentorHistory />} />
          <Route path="student/:studentId" element={<Profile />} />
        </Route>
        
        <Route path="/recruiter" element={<ProtectedRoute><DashboardLayout userRole="recruiter" /></ProtectedRoute>}>
          <Route index element={<RecruiterDashboard />} />
          <Route path="dashboard" element={<RecruiterDashboard />} />
          <Route path="jobs" element={<EnhancedRecruiterJobs />} />
          <Route path="create-job" element={<JobPostingForm />} />
          <Route path="jobs/:jobId/edit" element={<JobPostingForm />} />
          <Route path="jobs/:jobId/applications" element={<ApplicationManagement />} />
          <Route path="applications" element={<RecruiterApplications />} />
          <Route path="students" element={<StudentsList />} />
          <Route path="student/:id" element={<RecruiterStudentProfile />} />
          <Route path="post" element={<RecruiterJobs /> } />
          <Route path="job/:jobId/applications" element={<JobApplications />} />
          <Route path="history" element={<RecruiterHistory />} />
        </Route>
        
        <Route path="/admin" element={<ProtectedRoute><DashboardLayout userRole="admin" /></ProtectedRoute>}>
          <Route index element={<PlacementDashboard />} />
          <Route path="dashboard" element={<PlacementDashboard />} />
          <Route path="user-approvals" element={<UserApprovals />} />
          <Route path="job-verification" element={<JobVerification />} />
          <Route path="approvals" element={<StudentApprovals />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="activities" element={<ActivityMonitor />} />
          <Route path="post" element={<AdminPostSection />} />
        </Route>

      </Routes>
      <Toaster 
        position="top-center" 
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      />
    </>
  );
}

export default App;
