import { useState } from 'react';
import { Check, X, Download, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const Certificates = () => {
  const [certificates, setCertificates] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      email: 'john.doe@university.edu',
      company: 'TechCorp',
      internshipTitle: 'Software Development Intern',
      startDate: '2023-06-01',
      endDate: '2023-08-31',
      duration: '3 months',
      mentorFeedback: 'Excellent performance in React development',
      rating: 4.8,
      status: 'pending',
      completionDate: '2023-08-31'
    },
    {
      id: 2,
      studentName: 'Sarah Smith',
      email: 'sarah.smith@university.edu',
      company: 'DataSoft',
      internshipTitle: 'Data Science Intern',
      startDate: '2023-05-01',
      endDate: '2023-10-31',
      duration: '6 months',
      mentorFeedback: 'Outstanding work on machine learning projects',
      rating: 4.9,
      status: 'approved',
      completionDate: '2023-10-31'
    },
    {
      id: 3,
      studentName: 'Mike Johnson',
      email: 'mike.johnson@university.edu',
      company: 'CloudTech',
      internshipTitle: 'DevOps Trainee',
      startDate: '2023-07-01',
      endDate: '2023-11-30',
      duration: '5 months',
      mentorFeedback: 'Good understanding of cloud infrastructure',
      rating: 4.2,
      status: 'pending',
      completionDate: '2023-11-30'
    }
  ]);

  const handleApprove = (certId) => {
    setCertificates(certificates.map(cert => 
      cert.id === certId ? { ...cert, status: 'approved' } : cert
    ));
    toast.success('Certificate approved successfully');
  };

  const handleReject = (certId) => {
    setCertificates(certificates.map(cert => 
      cert.id === certId ? { ...cert, status: 'rejected' } : cert
    ));
    toast.success('Certificate rejected');
  };

  const handleDownload = (cert) => {
    toast.success(`Downloading certificate for ${cert.studentName}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending Approval' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  const pendingCertificates = certificates.filter(cert => cert.status === 'pending');
  const approvedCertificates = certificates.filter(cert => cert.status === 'approved');

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Certificate Management</h1>
        <div className="text-sm text-gray-600">
          {pendingCertificates.length} pending approval
        </div>
      </div>

      {/* Pending Approvals */}
      {pendingCertificates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-yellow-600">Pending Approvals</h2>
          <div className="space-y-4">
            {pendingCertificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{cert.studentName}</h3>
                    <p className="text-gray-600">{cert.email}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {cert.internshipTitle} at {cert.company}
                    </p>
                  </div>
                  {getStatusBadge(cert.status)}
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duration</p>
                    <p className="text-sm text-gray-600">{cert.duration}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(cert.startDate).toLocaleDateString()} - {new Date(cert.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Completion Date</p>
                    <p className="text-sm text-gray-600">
                      {new Date(cert.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Rating</p>
                    {getRatingStars(cert.rating)}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Mentor Feedback:</p>
                  <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                    "{cert.mentorFeedback}"
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                    <Eye size={16} />
                    View Details
                  </button>
                  <button 
                    onClick={() => handleReject(cert.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    <X size={16} />
                    Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(cert.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    <Check size={16} />
                    Approve & Generate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Approved Certificates */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-green-600">Approved Certificates</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Internship</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {approvedCertificates.map((cert) => (
                  <tr key={cert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{cert.studentName}</div>
                        <div className="text-sm text-gray-500">{cert.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{cert.internshipTitle}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{cert.company}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{cert.duration}</td>
                    <td className="px-6 py-4">
                      {getRatingStars(cert.rating)}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(cert.status)}
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDownload(cert)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-900 text-sm"
                      >
                        <Download size={16} />
                        Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {approvedCertificates.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 text-4xl mb-2">🏆</div>
            <p className="text-gray-600">No approved certificates yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Certificates;