import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FilePlus,
  CheckCircle,
  Calendar,
  Award,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudent = async () => {
      if (!token) {
        setError("Authentication required. Please login again.");
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error(`Failed to fetch student details: ${res.status}`);
        }

        const data = await res.json();
        setStudent(data);
      } catch (error) {
        console.error("Error fetching student details:", error);
        setError("Failed to load student information. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [token, navigate, retryCount]);

  const navItems = [
    { title: "Dashboard", icon: <Home size={20} />, path: "/student" },
    { title: "Internship Opportunities", icon: <FilePlus size={20} />, path: "/student/opportunities" },
    { title: "My Applications", icon: <CheckCircle size={20} />, path: "/student/applications" },
    { title: "Interview Schedule", icon: <Calendar size={20} />, path: "/student/interviews" },
    { title: "Certificates", icon: <Award size={20} />, path: "/student/certificates" },
    { title: "Profile", icon: <User size={20} />, path: "/student/profile" },
    { title: "Settings", icon: <Settings size={20} />, path: "/student/settings" },
  ];

  const notifications = [
    { id: 1, text: "Your application for Web Developer Internship was shortlisted", time: "2 hours ago", read: false, type: "success" },
    { id: 2, text: "New internship posted: Data Analyst - IT Department", time: "1 day ago", read: true, type: "announcement" },
    { id: 3, text: "Interview scheduled with XYZ Company tomorrow at 10 AM", time: "3 days ago", read: true, type: "info" },
    { id: 4, text: "Completion certificate available for Summer Training 2025", time: "5 days ago", read: true, type: "success" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setError("");
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setUserDropdownOpen(false);
      setNotificationsOpen(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-white/20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col gap-3">
            <button onClick={handleRetry} className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl">
              <RefreshCw size={18} /> Try Again
            </button>
            <button onClick={handleLogout} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white/90 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col p-6 border-r border-white/20`}>
        {/* Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-xl">
              <Award size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Internship Portal
              </h1>
              <p className="text-xs text-gray-500">Student Dashboard</p>
            </div>
          </div>
          <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100/50 transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Student Info */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 mb-8 border border-indigo-100/50">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg">
              {student?.username?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-gray-800 truncate">{student?.username || "User"}</p>
              <p className="text-sm text-gray-600">Student</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 truncate" title={student?.email}>
            {student?.email || "No email available"}
          </p>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
              ${location.pathname === item.path
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "text-gray-700 hover:bg-white/80 hover:shadow-md"}`}>
              <div className={`${location.pathname === item.path ? "text-white" : "text-gray-500 group-hover:text-indigo-600"}`}>
                {item.icon}
              </div>
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>

        {/* Support + Logout */}
        <div className="pt-6 mt-auto space-y-3 border-t border-gray-200/50">
          <Link to="/student/support" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100/50 rounded-xl transition-colors">
            <HelpCircle size={20} />
            <span className="font-medium">Help & Support</span>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50/50 rounded-xl transition-colors">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:ml-0 min-h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-sm z-10 sticky top-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100/50" onClick={() => setSidebarOpen(true)}>
                <Menu size={24} className="text-gray-600" />
              </button>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Student Dashboard</h2>
                <p className="text-sm text-gray-600">Track internships & placements</p>
              </div>
            </div>

            {/* Notifications + User */}
            <div className="flex items-center gap-5">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2.5 rounded-xl hover:bg-gray-100/50 relative" onClick={(e) => { e.stopPropagation(); setNotificationsOpen(!notificationsOpen); setUserDropdownOpen(false); }}>
                  <Bell size={22} className="text-gray-600" />
                  {notifications.filter((n) => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter((n) => !n.read).length}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-200/50 flex justify-between">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Mark all as read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-4 border-b border-gray-100/50 last:border-0 hover:bg-gray-50/50 cursor-pointer ${!n.read ? "bg-blue-50/50" : ""}`}>
                            <p className="text-sm font-medium text-gray-800">{n.text}</p>
                            <p className="text-xs text-gray-500">{n.time}</p>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User */}
              <div className="relative">
                <button className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-100/50" onClick={(e) => { e.stopPropagation(); setUserDropdownOpen(!userDropdownOpen); setNotificationsOpen(false); }}>
                  <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {student?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-800">{student?.username || "User"}</p>
                    <p className="text-xs text-gray-500">Student</p>
                  </div>
                  <ChevronDown size={16} className="text-gray-500" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-200/50">
                      <p className="font-semibold text-gray-800">{student?.username || "User"}</p>
                      <p className="text-sm text-gray-600 truncate">{student?.email || "user@example.com"}</p>
                    </div>
                    <div className="p-2">
                      <Link to="/student/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/50 text-sm" onClick={() => setUserDropdownOpen(false)}>
                        <User size={18} className="text-gray-500" /> Your Profile
                      </Link>
                      <Link to="/student/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100/50 text-sm" onClick={() => setUserDropdownOpen(false)}>
                        <Settings size={18} className="text-gray-500" /> Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-200/50">
                      <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50/50 text-sm text-red-600">
                        <LogOut size={18} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 min-h-[calc(100vh-12rem)]">
            <Outlet />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-lg border-t border-white/20 py-4 px-6 text-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Internship & Placement Portal. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
