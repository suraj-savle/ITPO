import { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [withdrawnApplications, setWithdrawnApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWithdrawn, setShowWithdrawn] = useState(false);

  const token = localStorage.getItem('token');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/applications/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data || []);
    } catch (err) {
      toast.error('Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    
    const handleApplicationCreated = () => fetchApplications();
    const handleStatusUpdate = () => fetchApplications();
    
    window.addEventListener('applicationCreated', handleApplicationCreated);
    window.addEventListener('applicationStatusUpdate', handleStatusUpdate);
    
    return () => {
      window.removeEventListener('applicationCreated', handleApplicationCreated);
      window.removeEventListener('applicationStatusUpdate', handleStatusUpdate);
    };
  }, []);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending mentor approval': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Mentor' },
      'rejected by mentor': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected by Mentor' },
      'pending recruiter review': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pending Recruiter' },
      'rejected by recruiter': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected by Recruiter' },
      'interview scheduled': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interview Scheduled' },
      'hired': { bg: 'bg-green-100', text: 'text-green-800', label: 'Hired' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleWithdraw = async (applicationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/applications/${applicationId}/withdraw`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Move to withdrawn applications
      const withdrawnApp = applications.find(app => app._id === applicationId);
      if (withdrawnApp) {
        setWithdrawnApplications(prev => [...prev, { ...withdrawnApp, withdrawnAt: new Date() }]);
      }
      
      // Remove from active applications
      setApplications(applications.filter(app => app._id !== applicationId));
      toast.success('Application withdrawn successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw application');
    }
  };

  const canWithdraw = (status) => {
    return ['pending mentor approval'].includes(status);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading applications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">
          {showWithdrawn ? 'Withdrawn Applications' : 'My Applications'}
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              console.log('Manual refresh clicked');
              fetchApplications();
            }}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowWithdrawn(!showWithdrawn)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {showWithdrawn ? 'Show Active Applications' : `Show Withdrawn (${withdrawnApplications.length})`}
          </button>
          <div className="text-sm text-gray-600">
            {showWithdrawn ? withdrawnApplications.length : applications.length} applications
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interview
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(showWithdrawn ? withdrawnApplications : applications).map((application) => (
                <tr key={application._id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.job?.title || 'Job Title'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.job?.location || 'Location'}
                      </div>
                      <div className="sm:hidden text-xs text-gray-400 mt-1">
                        {new Date(application.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(application.status)}
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.interviewDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        {new Date(application.interviewDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {!showWithdrawn && canWithdraw(application.status) && (
                      <button
                        onClick={() => handleWithdraw(application._id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <X size={14} className="sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Withdraw</span>
                      </button>
                    )}
                    {showWithdrawn && (
                      <span className="text-gray-500 text-sm">
                        Withdrawn on {new Date(application.withdrawnAt).toLocaleDateString()}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(showWithdrawn ? withdrawnApplications : applications).length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {showWithdrawn ? 'No withdrawn applications' : 'No applications yet'}
          </h3>
          <p className="text-gray-600">
            {showWithdrawn 
              ? 'Applications you withdraw will appear here.' 
              : 'Start applying to job openings to track your progress here!'}
          </p>

        </div>
      )}
    </div>
  );
};

export default Applications;
