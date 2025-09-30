import { useState, useEffect } from "react";
import {
  User,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Mail,
  Phone,
  Award,
  CheckCircle,
  X,
  Calendar,
  Video,
  MapPinIcon,
  PhoneCall,
  Link,
  FileText,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const RecruiterApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '',
    mode: 'online',
    location: '',
    meetingLink: '',
    notes: ''
  });
  const token = localStorage.getItem("token");

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/recruiter/applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data);
    } catch (error) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDecision = async (applicationId, action, interviewData = null) => {
    try {
      const payload = { action };
      if (interviewData) {
        payload.interviewDate = interviewData.date;
        payload.interviewTime = interviewData.time;
        payload.interviewMode = interviewData.mode;
        payload.interviewLocation = interviewData.location;
        payload.interviewMeetingLink = interviewData.meetingLink;
        payload.interviewNotes = interviewData.notes;
      }

      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/recruiter`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Application ${action}d successfully!`);
      fetchApplications();
      setShowScheduleModal(false);
      setInterviewForm({ date: '', time: '', mode: 'online', location: '', meetingLink: '', notes: '' });
    } catch (error) {
      toast.error(`Failed to ${action} application`);
    }
  };

  const openScheduleModal = (application) => {
    setSelectedApplication(application);
    setShowScheduleModal(true);
  };

  const handleScheduleInterview = () => {
    if (!interviewForm.date || !interviewForm.time) {
      toast.error('Please fill in date and time');
      return;
    }
    handleDecision(selectedApplication._id, 'schedule', interviewForm);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "pending recruiter review": {
        bg: "bg-indigo-100",
        text: "text-indigo-800",
        label: "Pending Review",
      },
      "interview scheduled": {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Interview Scheduled",
      },
      hired: { bg: "bg-green-100", text: "text-green-800", label: "Hired" },
      "rejected by recruiter": {
        bg: "bg-red-100",
        text: "text-red-800",
        label: "Rejected",
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Applications
          </h1>
          <p className="text-gray-600">
            Mentor-approved applications for your job postings
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Applications
            </h3>
            <p className="text-gray-500">
              Mentor-approved applications will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div
                key={application._id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
              >
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Student Info */}
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={
                          application.student.profileImage ||
                          "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                        }
                        alt={application.student.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {application.student.name}
                        </h3>
                        <p className="text-gray-600">
                          {application.student.department} • {application.student.year}
                        </p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {application.student.email}
                          </span>
                          {application.student.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {application.student.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                        <div className="text-2xl font-bold text-blue-600">
                          {application.student.cgpa}
                        </div>
                        <div className="text-xs text-gray-600">CGPA</div>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                        <div className="text-2xl font-bold text-green-600">
                          {application.student.skills?.length || 0}
                        </div>
                        <div className="text-xs text-gray-600">Skills</div>
                      </div>
                    </div>

                    {application.student.skills && application.student.skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {application.student.skills.slice(0, 4).map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md text-xs font-medium border border-indigo-200"
                            >
                              {skill}
                            </span>
                          ))}
                          {application.student.skills.length > 4 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium border border-gray-200">
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
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Briefcase className="w-5 h-5" />
                        {application.job.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {application.job.description}
                      </p>

                      <div className="space-y-2 mb-4">
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

                      {application.job.skillsRequired && application.job.skillsRequired.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Required Skills
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {application.job.skillsRequired.map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Status:</span>
                          {getStatusBadge(application.status)}
                        </div>
                        {application.interviewDate && (
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center gap-2 text-sm text-blue-700 mb-1">
                              <Calendar className="w-4 h-4" />
                              <span className="font-medium">Interview Scheduled</span>
                            </div>
                            <div className="text-sm text-blue-600">
                              {new Date(application.interviewDate).toLocaleDateString()} 
                              {application.interviewTime && ` at ${application.interviewTime}`}
                            </div>
                            {application.interviewMode && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-blue-600">
                                {application.interviewMode === 'online' && <Video className="w-3 h-3" />}
                                {application.interviewMode === 'offline' && <MapPinIcon className="w-3 h-3" />}
                                {application.interviewMode === 'phone' && <PhoneCall className="w-3 h-3" />}
                                {application.interviewMode.charAt(0).toUpperCase() + application.interviewMode.slice(1)}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-gray-100">
                        {application.status === "pending recruiter review" && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => openScheduleModal(application)}
                              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              Schedule Interview
                            </button>
                            <button
                              onClick={() => handleDecision(application._id, "reject")}
                              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        )}

                        {application.status === "interview scheduled" && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleDecision(application._id, "hire")}
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Hire
                            </button>
                            <button
                              onClick={() => handleDecision(application._id, "reject")}
                              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" />
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Interview Scheduling Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Schedule Interview</h3>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={interviewForm.date}
                        onChange={(e) => setInterviewForm({...interviewForm, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        value={interviewForm.time}
                        onChange={(e) => setInterviewForm({...interviewForm, time: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Interview Mode</label>
                    <select
                      value={interviewForm.mode}
                      onChange={(e) => setInterviewForm({...interviewForm, mode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="online">Online</option>
                      <option value="offline">Offline</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>

                  {interviewForm.mode === 'offline' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={interviewForm.location}
                        onChange={(e) => setInterviewForm({...interviewForm, location: e.target.value})}
                        placeholder="Enter interview location"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}

                  {interviewForm.mode === 'online' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                      <input
                        type="url"
                        value={interviewForm.meetingLink}
                        onChange={(e) => setInterviewForm({...interviewForm, meetingLink: e.target.value})}
                        placeholder="https://meet.google.com/..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      value={interviewForm.notes}
                      onChange={(e) => setInterviewForm({...interviewForm, notes: e.target.value})}
                      placeholder="Any additional instructions for the candidate..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleScheduleInterview}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Schedule Interview
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterApplications;
