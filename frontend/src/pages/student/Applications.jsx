import { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Applications = () => {
  const [applications, setApplications] = useState([
    {
      id: 1,
      jobTitle: 'Software Development Intern',
      company: 'TechCorp',
      appliedDate: '2024-01-15',
      status: 'under_review',
      interviewDate: null
    },
    {
      id: 2,
      jobTitle: 'Data Science Intern',
      company: 'DataSoft',
      appliedDate: '2024-01-12',
      status: 'interview_scheduled',
      interviewDate: '2024-01-25'
    },
    {
      id: 3,
      jobTitle: 'DevOps Trainee',
      company: 'CloudTech',
      appliedDate: '2024-01-10',
      status: 'shortlisted',
      interviewDate: null
    },
    {
      id: 4,
      jobTitle: 'Frontend Developer',
      company: 'WebSolutions',
      appliedDate: '2024-01-08',
      status: 'rejected',
      interviewDate: null
    }
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Applied' },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Under Review' },
      shortlisted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Shortlisted' },
      interview_scheduled: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interview Scheduled' },
      offer_made: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Offer Made' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.applied;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleWithdraw = (applicationId) => {
    setApplications(applications.filter(app => app.id !== applicationId));
    toast.success('Application withdrawn successfully');
  };

  const canWithdraw = (status) => {
    return ['applied', 'under_review'].includes(status);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <div className="text-sm text-gray-600">
          {applications.length} applications
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interview
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.jobTitle}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.company}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(application.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(application.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.interviewDate ? (
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        {new Date(application.interviewDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-400">Not scheduled</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {canWithdraw(application.status) && (
                      <button
                        onClick={() => handleWithdraw(application.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <X size={16} />
                        Withdraw
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {applications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
          <p className="text-gray-600">Start applying to job openings to track your progress here!</p>
        </div>
      )}
    </div>
  );
};

export default Applications;