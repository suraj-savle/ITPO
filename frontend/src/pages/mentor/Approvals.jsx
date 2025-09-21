import { useState, useEffect } from 'react';
import { Check, X, MessageSquare, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Approvals = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingApplications = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/applications/mentor', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch pending applications');
        }

        const data = await res.json();
        setApplications(data || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load pending applications');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingApplications();
  }, [navigate]);

  const [selectedApp, setSelectedApp] = useState(null);
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleApprove = async (appId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${appId}/mentor`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'approve',
          mentorNote: comment
        })
      });

      if (!res.ok) throw new Error('Failed to approve application');

      setApplications(apps => apps.filter(app => app._id !== appId));
      toast.success('Application approved successfully');
      setShowModal(false);
      setComment('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (appId) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${appId}/mentor`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'reject',
          mentorNote: comment
        })
      });

      if (!res.ok) throw new Error('Failed to reject application');

      setApplications(apps => apps.filter(app => app._id !== appId));
      toast.success('Application rejected with feedback');
      setShowModal(false);
      setComment('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to reject application');
    }
  };

  const openModal = (app, action) => {
    setSelectedApp(app);
    setActionType(action);
    setShowModal(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading pending applications...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Approvals</h1>
        <div className="text-sm text-gray-600">
          {applications.length} applications waiting
        </div>
      </div>

      <div className="space-y-4">
        {applications.map((app) => (
          <div key={app._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{app.student?.name}</h3>
                <p className="text-gray-600">{app.student?.email} • {app.student?.year}</p>
                <p className="text-gray-500 text-sm">Roll No: {app.student?.rollNo} • {app.student?.department}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Applied for <span className="font-medium">{app.job?.title}</span>
                </p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Pending Review
              </span>
            </div>

            {app.coverLetter && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Cover Letter:</p>
                <p className="text-sm bg-gray-50 p-3 rounded italic">
                  "{app.coverLetter}"
                </p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Applied on {new Date(app.createdAt).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => openModal(app, 'reject')}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  <X size={16} />
                  Reject
                </button>
                <button 
                  onClick={() => openModal(app, 'approve')}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                >
                  <Check size={16} />
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">✅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
          <p className="text-gray-600">No pending applications to review.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {actionType === 'approve' ? 'Approve Application' : 'Reject Application'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedApp?.student?.name} - {selectedApp?.job?.title}
            </p>
            
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={actionType === 'approve' ? 'Add approval comments (optional)' : 'Provide feedback for improvement'}
              className="w-full p-3 border rounded-md mb-4"
              rows={4}
            />
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => actionType === 'approve' ? handleApprove(selectedApp._id) : handleReject(selectedApp._id)}
                className={`px-4 py-2 text-white rounded-md ${
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