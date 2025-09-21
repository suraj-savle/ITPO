import { useState, useEffect } from 'react';
import { User, Briefcase, MapPin, DollarSign, Clock, Mail, Phone, Award, CheckCircle, X, Calendar, Download } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const StudentsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedStudent, setExpandedStudent] = useState(null);
  const token = localStorage.getItem('token');

  const fetchApplications = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/recruiter/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(res.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDecision = async (applicationId, action, interviewDate = null) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/recruiter`,
        { action, interviewDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Application ${action}d successfully!`);
      fetchApplications();
    } catch (error) {
      toast.error(`Failed to ${action} application`);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending recruiter review': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Pending Review' },
      'interview scheduled': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interview Scheduled' },
      'hired': { bg: 'bg-green-100', text: 'text-green-800', label: 'Hired' },
      'rejected by recruiter': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading applications...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Student Applications
          </h1>
          <p className="text-gray-600">Mentor-approved applications for your job postings</p>
        </div>

        {applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
              <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Applications</h3>
              <p className="text-gray-600">Mentor-approved applications will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg p-6"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Student Info */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={application.student.profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'}
                        alt={application.student.name}
                        className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{application.student.name}</h3>
                        <p className="text-gray-600">{application.student.department} • {application.student.year}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail size={14} />
                            {application.student.email}
                          </span>
                          {application.student.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={14} />
                              {application.student.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-indigo-600">{application.student.cgpa}</div>
                        <div className="text-xs text-gray-600">CGPA</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">{application.student.skills?.length || 0}</div>
                        <div className="text-xs text-gray-600">Skills</div>
                      </div>
                    </div>

                    {application.student.skills && application.student.skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Award size={16} />
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {application.student.skills.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {application.student.skills.length > 4 && (
                            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                              +{application.student.skills.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Job Info */}
                  <div>
                    <div className="mb-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Briefcase size={20} />
                        {application.job.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">{application.job.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center text-gray-500 text-sm">
                          <MapPin className="w-4 h-4 mr-2" />
                          {application.job.location}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <DollarSign className="w-4 h-4 mr-2" />
                          {application.job.stipend || "Stipend not specified"}
                        </div>
                        <div className="flex items-center text-gray-500 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          {application.job.duration || "Duration not specified"}
                        </div>
                      </div>
                    </div>

                    {application.job.skillsRequired && application.job.skillsRequired.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h5>
                        <div className="flex flex-wrap gap-2">
                          {application.job.skillsRequired.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        {getStatusBadge(application.status)}
                      </div>
                      {application.interviewDate && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          Interview: {new Date(application.interviewDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    {/* View Profile Button */}
                    <div className="mb-4">
                      <button
                        onClick={() => window.open(`/recruiter/student/${application.student._id}`, '_blank')}
                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 text-white py-2 px-4 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <User size={16} />
                        View Profile
                      </button>
                    </div>

                    {/* Download Resume Button */}
                    {application.student.resumeUrl && (
                      <div className="mb-4">
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = application.student.resumeUrl;
                            link.download = `${application.student.name}_Resume.pdf`;
                            link.target = '_blank';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Download size={16} />
                          Download Resume
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    {application.status === 'pending recruiter review' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            const date = prompt('Enter interview date (YYYY-MM-DD):');
                            if (date) handleDecision(application._id, 'schedule', date);
                          }}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <Calendar size={16} />
                          Schedule Interview
                        </button>
                        <button
                          onClick={() => handleDecision(application._id, 'reject')}
                          className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </div>
                    )}

                    {application.status === 'interview scheduled' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleDecision(application._id, 'hire')}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Hire
                        </button>
                        <button
                          onClick={() => handleDecision(application._id, 'reject')}
                          className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white py-2 px-4 rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                          <X size={16} />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList;
