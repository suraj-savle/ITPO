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
} from "lucide-react";

const DashboardLayout = ({ userRole = "student" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: "New job posted", time: "1h ago" },
    { id: 2, text: "Profile approved", time: "3h ago" },
  ]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch("http://localhost:5000/api/auth/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUserData(data.user || data.student);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };
    fetchUserData();
  }, []);

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
      ],
    },
    recruiter: {
      title: "Student Connect - recruiter",
      items: [
        { path: "/recruiter", label: "My Mentees", icon: Users },
        { path: "/recruiter/students", label: "Student", icon: Users },
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
        { path: "/admin/post", label: "Post", icon: Users },
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
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition relative">
              <Bell className="w-6 h-6 text-gray-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>
            {/* Notification dropdown */}
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl overflow-hidden opacity-0 pointer-events-none transition-all group-hover:opacity-100">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="px-4 py-2 hover:bg-gray-50 transition"
                >
                  <p className="text-sm text-gray-700">{n.text}</p>
                  <span className="text-xs text-gray-400">{n.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
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
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300`}
        >
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">Menu</h2>
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
                        ? "bg-blue-50 text-blue-600 font-semibold"
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
        <main className="flex-1 p-6 bg-gray-50">
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
