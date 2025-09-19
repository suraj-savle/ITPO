import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, LogOut, Menu, X, User, Briefcase, Users, BarChart3, CheckCircle, Award, Megaphone } from 'lucide-react';

const DashboardLayout = ({ userRole = 'student' }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'New notification', time: '1h ago' }
  ]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUserData(data.student || data.user);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const menuConfig = {
    student: {
      title: 'ITPO Portal',
      userName: userData?.name || userData?.username || 'Student',
      items: [
        { path: '/student', label: 'Dashboard', icon: BarChart3 },
        { path: '/student/profile', label: 'Profile', icon: User },
        { path: '/student/jobs', label: 'Job Openings', icon: '💼' },
        { path: '/student/applications', label: 'My Applications', icon: '📋' },
        { path: '/student/certificates', label: 'Certificates', icon: '🏆' }
      ]
    },
    mentor: {
      title: 'Campus Connect - Mentor',
      userName: 'Dr. Jane Smith',
      items: [
        { path: '/mentor', label: 'My Mentees', icon: Users },
        { path: '/mentor/approvals', label: 'Pending Approvals', icon: CheckCircle },
        { path: '/mentor/progress', label: 'Progress Tracking', icon: BarChart3 }
      ]
    },
    admin: {
      title: 'ITPO Portal - Admin',
      userName: userData?.name || 'Admin User',
      items: [
        { path: '/admin', label: 'Dashboard', icon: BarChart3 },
        { path: '/admin/approvals', label: 'Student Approvals', icon: CheckCircle },
        { path: '/admin/users', label: 'User Management', icon: Users }
      ]
    }
  };

  const config = menuConfig[userRole];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
              <p className="text-sm text-gray-500">Welcome back, {config.userName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="p-2 rounded-xl hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {config.userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-900">{config.userName}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
          <nav className="mt-8 px-4">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {typeof Icon === 'string' ? (
                    <span className="text-lg">{Icon}</span>
                  ) : (
                    <Icon size={20} />
                  )}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;