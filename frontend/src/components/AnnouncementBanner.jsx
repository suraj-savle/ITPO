import { useState, useEffect } from 'react';
import { AlertCircle, Info, CheckCircle, Clock } from 'lucide-react';
import axios from 'axios';

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AnnouncementBanner component mounted');
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('No token found');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching announcements...');
      const response = await axios.get('http://localhost:5000/api/posts/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Announcements response:', response.data);
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type, priority) => {
    if (priority === 'high') return <AlertCircle className="w-5 h-5" />;
    if (type === 'urgent') return <AlertCircle className="w-5 h-5" />;
    if (type === 'success') return <CheckCircle className="w-5 h-5" />;
    if (type === 'deadline') return <Clock className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  };

  const getStyles = (type, priority) => {
    if (priority === 'high' || type === 'urgent') {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    if (type === 'success') {
      return 'bg-green-50 border-green-200 text-green-800';
    }
    if (type === 'deadline') {
      return 'bg-orange-50 border-orange-200 text-orange-800';
    }
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  if (loading || announcements.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      {announcements.map((announcement) => (
        <div
          key={announcement._id}
          className={`border rounded-lg p-4 ${getStyles(announcement.type, announcement.priority)}`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(announcement.type, announcement.priority)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{announcement.title}</h3>
              <p className="text-sm opacity-90">{announcement.content}</p>
              {announcement.expiresAt && (
                <p className="text-xs opacity-75 mt-2">
                  Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnouncementBanner;