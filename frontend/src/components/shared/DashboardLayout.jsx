// src/pages/dashboard/DashboardLayout.jsx
import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  LogOut,
  Menu,
  X,
  User,
  Briefcase,
  Users,
  BarChart3,
  CheckCircle,
  Award,
  Megaphone,
  History,
  Activity,
} from "lucide-react";

const DashboardLayout = ({ userRole = "student" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          const data = await res.json();
          const user = data.user || data.student;
          
          // Validate user role matches expected role
          if (user.role !== userRole) {
            console.error(`Role mismatch: expected ${userRole}, got ${user.role}`);
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          
          setUserData(user);
        } else {
          console.error("Failed to fetch profile");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };
    fetchUserData();
  }, [userRole, navigate]);

  const menuConfig = {
    student: {
      title: "ITPO Portal",
      items: [
        { path: "/student", label: "Dashboard", icon: BarChart3 },
        { path: "/student/profile", label: "Profile", icon: User },
        { path: "/student/jobs", label: "Job Openings", icon: Briefcase },
        {
          path: "/student/applications",
          label: "My Applications",
          icon: Users,
        },
        { path: "/student/certificates", label: "Certificates", icon: Award },
      ],
    },
    mentor: {
      title: "Campus Connect - Mentor",
      items: [
        { path: "/mentor", label: "My Mentees", icon: Users },
        {
          path: "/mentor/approvals",
          label: "Pending Approvals",
          icon: CheckCircle,
        },
        {
          path: "/mentor/progress",
          label: "Progress Tracking",
          icon: BarChart3,
        },
        {
          path: "/mentor/history",
          label: "Application History",
          icon: History,
        },
      ],
    },
    recruiter: {
      title: "Recruiter Portal",
      items: [
        { path: "/recruiter", label: "Dashboard", icon: BarChart3 },
        { path: "/recruiter/students", label: "Students", icon: Users },
        { path: "/recruiter/post", label: "Job Posts", icon: Briefcase },
        {
          path: "/recruiter/history",
          label: "Application History",
          icon: History,
        },
      ],
    },
    admin: {
      title: "ITPO Portal - Placement Cell",
      items: [
        { path: "/admin", label: "Dashboard", icon: BarChart3 },
        {
          path: "/admin/approvals",
          label: "Student Approvals",
          icon: CheckCircle,
        },
        { path: "/admin/users", label: "User Management", icon: Users },
        { path: "/admin/activities", label: "Activity Monitor", icon: Activity },
        { path: "/admin/post", label: "Post", icon: Megaphone },
      ],
    },
  };

  const config = menuConfig[userRole];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* HEADER */}
      <header className="flex justify-between items-center bg-white/90 backdrop-blur-md shadow-md px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
            <p className="text-gray-500 text-sm">
              Welcome back, {userData?.name || "User"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          

          {/* User Info */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {userData?.name?.charAt(0) || "U"}
            </div>
            <span className="hidden sm:block font-medium text-gray-900">
              {userData?.name || "User"}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 transition"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0 translate-y-20 w-full" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300`}
        >
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold text-indigo-800 mb-6">Menu</h2>
            <nav className="flex flex-col gap-2">
              {config.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {typeof Icon === "string" ? (
                      <span>{Icon}</span>
                    ) : (
                      <Icon size={20} />
                    )}
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="flex-1 bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
