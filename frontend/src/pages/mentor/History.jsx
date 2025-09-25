import { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, User, Briefcase, Calendar, MessageSquare, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest, isTokenValid, handleAuthError } from '../../utils/auth';

const History = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredApps(applications);
    } else {
      setFilteredApps(applications.filter(app => app.status === filter));
    }
  }, [applications, filter]);

  const fetchHistory = async () => {
    if (!isTokenValid()) {
      handleAuthError(navigate);
      return;
    }

    try {
      const res = await makeAuthenticatedRequest(
        'http://localhost:5000/api/mentor/application-history',
        {},
        navigate
      );
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      if (!err.message.includes('Authentication')) {
        console.error(err);
        toast.error('Failed to load history');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'rejected by mentor':
        return <XCircle className="w-4 h-4" />;
      case 'pending recruiter review':
        return <Clock className="w-4 h-4" />;
      case 'interview scheduled':
        return <Calendar className="w-4 h-4" />;
      case 'hired':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'rejected by mentor':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'pending recruiter review':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'interview scheduled':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'hired':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getFilterCount = (status) => {
    if (status === 'all') return applications.length;
    return applications.filter(app => app.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-5 h-5 animate-pulse" />
          Loading history...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Application History</h1>
          <p className="text-sm text-gray-500 mt-1">
            {applications.length} applications reviewed
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All', icon: Filter },
          { key: 'rejected by mentor', label: 'Rejected', icon: XCircle },
          { key: 'pending recruiter review', label: 'Approved', icon: CheckCircle },
          { key: 'interview scheduled', label: 'Interview', icon: Calendar },
          { key: 'hired', label: 'Hired', icon: CheckCircle }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === key
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
              {getFilterCount(key)}
            </span>
          </button>
        ))}
      </div>

      {filteredApps.length === 0 ? (
        <div className="text-center py-16">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            {filter === 'all' ? 'No history found' : `No ${filter} applications`}
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Applications you review will appear here'
              : 'Try selecting a different filter'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredApps.map((app) => (
            <div key={app._id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-medium ${getStatusColor(app.status)}`}>
                    {getStatusIcon(app.status)}
                    {app.status}
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(app.updatedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div className="flex items-start gap-3">
                  <img
                    src={app.student?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.student?.name}`}
                    alt={app.student?.name}
                    className="w-10 h-10 rounded-full border-2 border-gray-100"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.student?.name}</h3>
                    <p className="text-sm text-gray-500">{app.student?.email}</p>
                    <p className="text-sm text-gray-500">{app.student?.department} • {app.student?.year}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Briefcase className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.job?.title}</h3>
                    <p className="text-sm text-gray-500">{app.job?.company}</p>
                  </div>
                </div>
              </div>

              {app.mentorNote && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Your Note</span>
                  </div>
                  <p className="text-sm text-gray-600">{app.mentorNote}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;