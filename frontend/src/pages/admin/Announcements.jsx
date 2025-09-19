import { useState } from 'react';
import { Send, Users, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

const Announcements = () => {
  const [announcement, setAnnouncement] = useState({
    title: '',
    message: '',
    target: 'all',
    department: '',
    year: '',
    priority: 'normal'
  });

  const [recentAnnouncements] = useState([
    {
      id: 1,
      title: 'New Job Openings Available',
      message: 'Check out the latest internship opportunities...',
      target: 'All Students',
      sentDate: '2024-01-20',
      sentBy: 'Admin'
    },
    {
      id: 2,
      title: 'Interview Schedule Update',
      message: 'Please check your interview schedules...',
      target: 'Computer Science - 4th Year',
      sentDate: '2024-01-19',
      sentBy: 'Admin'
    }
  ]);

  const handleSend = () => {
    if (!announcement.title || !announcement.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success('Announcement sent successfully!');
    setAnnouncement({
      title: '',
      message: '',
      target: 'all',
      department: '',
      year: '',
      priority: 'normal'
    });
  };

  const getTargetText = () => {
    if (announcement.target === 'all') return 'All Students';
    if (announcement.target === 'department') return `${announcement.department} Department`;
    if (announcement.target === 'year') return `${announcement.year} Students`;
    if (announcement.target === 'custom') return `${announcement.department} - ${announcement.year}`;
    return 'All Students';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Announcements</h1>

      {/* Send Announcement Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Megaphone className="text-blue-600" size={20} />
          Send New Announcement
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={announcement.title}
              onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
              placeholder="Enter announcement title"
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message *</label>
            <textarea
              value={announcement.message}
              onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
              placeholder="Enter your announcement message"
              rows={6}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Audience</label>
              <select
                value={announcement.target}
                onChange={(e) => setAnnouncement({...announcement, target: e.target.value})}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Students</option>
                <option value="department">Specific Department</option>
                <option value="year">Specific Year</option>
                <option value="custom">Department + Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={announcement.priority}
                onChange={(e) => setAnnouncement({...announcement, priority: e.target.value})}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {(announcement.target === 'department' || announcement.target === 'custom') && (
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <select
                value={announcement.department}
                onChange={(e) => setAnnouncement({...announcement, department: e.target.value})}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics">Electronics</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Chemical">Chemical</option>
              </select>
            </div>
          )}

          {(announcement.target === 'year' || announcement.target === 'custom') && (
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <select
                value={announcement.year}
                onChange={(e) => setAnnouncement({...announcement, year: e.target.value})}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-blue-800">Target Audience:</span>
            </div>
            <p className="text-sm text-blue-700">{getTargetText()}</p>
          </div>

          <button
            onClick={handleSend}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            <Send size={18} />
            Send Announcement
          </button>
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Announcements</h3>
        
        <div className="space-y-4">
          {recentAnnouncements.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <span className="text-xs text-gray-500">
                  {new Date(item.sentDate).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.message}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Target: {item.target}</span>
                <span>Sent by: {item.sentBy}</span>
              </div>
            </div>
          ))}
        </div>

        {recentAnnouncements.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📢</div>
            <p className="text-gray-600">No announcements sent yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;