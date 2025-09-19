import { useState } from 'react';
import { Check, X, MessageSquare, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Approvals = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      studentEmail: 'john.doe@university.edu',
      jobTitle: 'Software Development Intern',
      company: 'TechCorp',
      appliedDate: '2024-01-20',
      status: 'pending',
      studentYear: '3rd Year',
      resumeUrl: '#',
      coverLetter: 'I am passionate about software development...'
    },
    {
      id: 2,
      studentName: 'Sarah Smith',
      studentEmail: 'sarah.smith@university.edu',
      jobTitle: 'Data Science Intern',
      company: 'DataSoft',
      appliedDate: '2024-01-19',
      status: 'pending',
      studentYear: '4th Year',
      resumeUrl: '#',
      coverLetter: 'My experience with machine learning...'
    }
  ]);

  const [selectedApp, setSelectedApp] = useState(null);
  const [comment, setComment] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  const handleApprove = (appId) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === appId 
          ? { ...app, status: 'approved', mentorComment: comment }
          : app
      )
    );
    toast.success('Application approved successfully');
    setShowModal(false);
    setComment('');
  };

  const handleReject = (appId) => {
    setApplications(apps => 
      apps.map(app => 
        app.id === appId 
          ? { ...app, status: 'rejected', mentorComment: comment }
          : app
      )
    );
    toast.success('Application rejected with feedback');
    setShowModal(false);
    setComment('');
  };

  const openModal = (app, action) => {
    setSelectedApp(app);
    setActionType(action);
    setShowModal(true);
  };

  const pendingApps = applications.filter(app => app.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Approvals</h1>
        <div className="text-sm text-gray-600">
          {pendingApps.length} applications waiting
        </div>
      </div>

      <div className="space-y-4">
        {pendingApps.map((app) => (
          <div key={app.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg">{app.studentName}</h3>
                <p className="text-gray-600">{app.studentEmail} • {app.studentYear}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Applied for <span className="font-medium">{app.jobTitle}</span> at <span className="font-medium">{app.company}</span>
                </p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                Pending Review
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Cover Letter:</p>
              <p className="text-sm bg-gray-50 p-3 rounded italic">
                "{app.coverLetter}"
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Applied on {new Date(app.appliedDate).toLocaleDateString()}
              </div>
              
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                  <Eye size={16} />
                  View Resume
                </button>
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

      {pendingApps.length === 0 && (
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
              {selectedApp?.studentName} - {selectedApp?.jobTitle}
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
                onClick={() => actionType === 'approve' ? handleApprove(selectedApp.id) : handleReject(selectedApp.id)}
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