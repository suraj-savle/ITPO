import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import  RegisterPage  from "./pages/auth/Register";
import  LoginPage  from "./pages/auth/Login";




function App() {
  return (
    <Routes>
      {/* Define your routes here */}
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* <Route path="/student" element={<DashboardLayout />}> */}
        {/* <Route index element={<StudentDashboardHome />} /> */}
        {/* <Route path="apply" element={<Apply />} /> */}
        {/* <Route path="upload" element={<UploadDocs />} /> */}
        {/* <Route path="status" element={<Status />} /> */}
        {/* <Route path="transactions" element={<Transactions />} /> */}
        {/* <Route path="profile" element={<Profile />} /> */}
      {/* </Route> */}

     
    </Routes>
  );
}

export default App;
