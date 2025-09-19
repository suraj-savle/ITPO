import { Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Landing from "./pages/Landing";
import  RegisterPage  from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
// import Apply from "./pages/student/Apply";
// import UploadDocs from "./pages/student/UploadDocs";
// import Status from "./pages/student/Status";
// import Transactions from "./pages/student/Transactions";
import Profile from "./pages/student/profile";
import DashboardLayout from "./pages/student/Dashboard";





function App() {
  return (
    <Routes>
      {/* Define your routes here */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      <Route path="/student" element={<DashboardLayout />}>
        {/* <Route index element={<StudentDashboardHome />} /> */}
        {/* <Route path="apply" element={<Apply />} /> */}
        {/* <Route path="upload" element={<UploadDocs />} /> */}
        {/* <Route path="status" element={<Status />} /> */}
        {/* <Route path="transactions" element={<Transactions />} /> */}
        <Route path="profile" element={<Profile />} />
      </Route>

     
    </Routes>
  );
}

export default App;
