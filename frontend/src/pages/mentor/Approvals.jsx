import { useState, useEffect } from 'react';
import { Check, X, Eye, Clock, User, Briefcase, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { makeAuthenticatedRequest, isTokenValid, handleAuthError } from '../../utils/auth';

const Approvals = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(fetchApplications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchApplications = async () => {
    if (!isTokenValid()) {
      handleAuthError(navigate);
      return;
    }

    try {
      const res = await makeAuthenticatedRequest(
        'http://localhost:5000/api/mentor/pending-applications',
        {},
        navigate
      );
      const data = await res.json();
      setApplications(data || []);
    } catch (err) {
      if (!err.message.includes('Authentication')) {
        console.error(err);
        toast.error('Failed to load applications');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (appId, action) => {
    try {
      const res = await makeAuthenticatedRequest(
        `http://localhost:5000/api/applications/${appId}/mentor`,
        {
          method: 'PUT',
          body: JSON.stringify({ action, mentorNote: comment })
        },
        navigate
      );

      setApplications(apps => apps.filter(app => app._id !== appId));
      toast.success(`Application ${action}d successfully`);
      setShowModal(false);
      setComment('');
    } catch (err) {
      if (!err.message.includes('Authentication')) {
        toast.error(`Failed to ${action} application`);
      }
    }
  };

  const openModal = (app, action) => {
    setSelectedApp(app);
    setActionType(action);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-5 h-5 animate-pulse" />
          Loading applications...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Pending Approvals</h1>
          <p className="text-sm text-gray-500 mt-1">
            {applications.length} applications awaiting review
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
          {applications.length} pending
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">All caught up!</h3>
          <p className="text-gray-500">No pending applications to review</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <img
                    src={app.student?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.student?.name}`}
                    alt={app.student?.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-100"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{app.student?.name}</h3>
                    <p className="text-sm text-gray-500">{app.student?.rollNo} • {app.student?.department}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        <span>{app.job?.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  Pending Review
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button 
                  onClick={() => navigate(`/mentor/student/${app.student._id}`)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                >
                  <Eye className="w-4 h-4" />
                  View Profile
                </button>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => openModal(app, 'reject')}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button 
                    onClick={() => openModal(app, 'approve')}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {selectedApp?.student?.name} • {selectedApp?.job?.title}
            </p>
            
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={actionType === 'approve' ? 'Add approval note (optional)' : 'Provide feedback for improvement'}
              className="w-full p-3 border border-gray-200 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDecision(selectedApp._id, actionType)}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approvals;
