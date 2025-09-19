import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'New job posting: Software Intern at TechCorp', time: '2h ago' },
    { id: 2, text: 'Interview scheduled for tomorrow', time: '1d ago' }
  ]);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/student', label: 'Profile', icon: User },
    { path: '/student/jobs', label: 'Job Openings', icon: '💼' },
    { path: '/student/applications', label: 'My Applications', icon: '📋' },
    { path: '/student/certificates', label: 'Certificates', icon: '🏆' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold text-blue-600">Campus Connect</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <img
                src="https://via.placeholder.com/32"
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden sm:block text-sm font-medium whitespace-nowrap">John Doe</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-red-600 rounded-md hover:bg-gray-100 flex-shrink-0"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
          <nav className="mt-8 px-4">
            {menuItems.map((item) => {
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
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