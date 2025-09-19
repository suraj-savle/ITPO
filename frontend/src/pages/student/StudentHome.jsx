import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  Award, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function StudentHome() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    activeApplications: 0,
    interviews: 0,
    certificates: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Mock data for now since backend endpoints may not exist
        setStats({
          totalApplications: 5,
          activeApplications: 3,
          interviews: 2,
          certificates: 1
        });

        setRecentApplications([
          {
            id: 1,
            jobTitle: 'Software Developer Intern',
            company: 'TechCorp',
            status: 'pending'
          },
          {
            id: 2,
            jobTitle: 'Data Science Intern',
            company: 'DataSoft',
            status: 'accepted'
          }
        ]);

        setUpcomingInterviews([
          {
            id: 1,
            jobTitle: 'Frontend Developer',
            company: 'WebSolutions',
            scheduledAt: new Date(Date.now() + 86400000).toISOString(),
            type: 'Technical'
          }
        ]);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Here's your internship progress overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Total Applications</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalApplications}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Active Applications</p>
              <p className="text-2xl font-bold text-green-700">{stats.activeApplications}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Interviews</p>
              <p className="text-2xl font-bold text-orange-700">{stats.interviews}</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Certificates</p>
              <p className="text-2xl font-bold text-purple-700">{stats.certificates}</p>
            </div>
            <Award className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-gray-600" />
            Recent Applications
          </h2>
          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                  <div>
                    <p className="font-medium text-gray-800">{app.jobTitle}</p>
                    <p className="text-sm text-gray-600">{app.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.status === 'pending' && <Clock className="h-4 w-4 text-orange-500" />}
                    {app.status === 'accepted' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {app.status === 'rejected' && <AlertCircle className="h-4 w-4 text-red-500" />}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      app.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No applications yet</p>
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-600" />
            Upcoming Interviews
          </h2>
          <div className="space-y-3">
            {upcomingInterviews.length > 0 ? (
              upcomingInterviews.map((interview) => (
                <div key={interview.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                    <div>
                      <p className="font-medium text-gray-800">{interview.jobTitle}</p>
                      <p className="text-sm text-gray-600">{interview.company}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {new Date(interview.scheduledAt).toLocaleDateString()} at {new Date(interview.scheduledAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {interview.type}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming interviews</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}