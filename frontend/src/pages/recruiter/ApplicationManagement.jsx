import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  User, Mail, Phone, GraduationCap, Star, Calendar, 
  Download, MessageSquare, CheckCircle, XCircle, Clock,
  Filter, Search, ArrowLeft
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ApplicationManagement = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionData, setActionData] = useState({
    status: "",
    note: "",
    interviewDate: ""
  });

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/recruiter/jobs/${jobId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setApplications(response.data.applications || []);
      setJob(response.data.job || null);
    } catch (error) {
      console.error("Fetch applications error:", error);
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedApplication || !actionData.status) {
      toast.error("Please select a status");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const payload = {
        status: actionData.status,
        recruiterNote: actionData.note
      };

      if (actionData.status === "interview scheduled" && actionData.interviewDate) {
        payload.interviewDate = actionData.interviewDate;
      }

      await axios.put(
        `http://localhost:5000/api/recruiter/applications/${selectedApplication._id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Application status updated successfully");
      setShowModal(false);
      setSelectedApplication(null);
      setActionData({ status: "", note: "", interviewDate: "" });
      fetchApplications();
    } catch (error) {
      console.error("Update application error:", error);
      toast.error("Failed to update application status");
    }
  };

  const downloadResume = async (studentId, studentName) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/recruiter/student-resume/${studentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${studentName.replace(/\s+/g, '_')}_Resume.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download resume error:", error);
      toast.error("Failed to download resume");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending mentor approval":
        return "bg-yellow-100 text-yellow-700";
      case "rejected by mentor":
        return "bg-red-100 text-red-700";
      case "pending recruiter review":
        return "bg-blue-100 text-blue-700";
      case "rejected by recruiter":
        return "bg-red-100 text-red-700";
      case "interview scheduled":
        return "bg-purple-100 text-purple-700";
      case "hired":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending mentor approval":
      case "pending recruiter review":
        return <Clock className="w-4 h-4" />;
      case "rejected by mentor":
      case "rejected by recruiter":
        return <XCircle className="w-4 h-4" />;
      case "interview scheduled":
        return <Calendar className="w-4 h-4" />;
      case "hired":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.student?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.student?.department?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading applications...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Applications for {job?.title || "Job"}
          </h1>
          <p className="text-gray-600 mt-1">
            {job?.department && `${job.department} • `}
            {applications.length} applications received
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="pending mentor approval">Pending Mentor Approval</option>
          <option value="pending recruiter review">Pending Review</option>
          <option value="interview scheduled">Interview Scheduled</option>
          <option value="hired">Hired</option>
          <option value="rejected by recruiter">Rejected</option>
        </select>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== "all" 
                ? "No applications match your filters" 
                : "No applications received yet"}
            </div>
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div key={application._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {application.student?.profileImage ? (
                        <img
                          src={application.student.profileImage}
                          alt={application.student.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-indigo-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {application.student?.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            {application.student?.email}
                          </span>
                          {application.student?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {application.student.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      {application.status.replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <GraduationCap className="w-4 h-4" />
                      <span>{application.student?.department} • {application.student?.year}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Star className="w-4 h-4" />
                      <span>CGPA: {application.student?.cgpa || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Applied: {new Date(application.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {application.student?.skills && application.student.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {application.student.skills.slice(0, 6).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                        {application.student.skills.length > 6 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{application.student.skills.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {application.interviewDate && (
                    <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                      <p className="text-sm text-purple-700">
                        <strong>Interview Scheduled:</strong> {new Date(application.interviewDate).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {application.recruiterNote && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Your Note:</strong> {application.recruiterNote}
                      </p>
                    </div>
                  )}

                  {application.mentorNote && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700">
                        <strong>Mentor Note:</strong> {application.mentorNote}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  {application.student?.resumeUrl && (
                    <button
                      onClick={() => downloadResume(application.student._id, application.student.name)}
                      className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Resume
                    </button>
                  )}

                  <button
                    onClick={() => navigate(`/recruiter/student/${application.student._id}`)}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>

                  {application.status === "pending recruiter review" && (
                    <button
                      onClick={() => {
                        setSelectedApplication(application);
                        setActionData({ status: "", note: "", interviewDate: "" });
                        setShowModal(true);
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-sm font-medium"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Review Application - {selectedApplication.student?.name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Decision *
                </label>
                <select
                  value={actionData.status}
                  onChange={(e) => setActionData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select Decision</option>
                  <option value="interview scheduled">Schedule Interview</option>
                  <option value="hired">Hire Candidate</option>
                  <option value="rejected by recruiter">Reject Application</option>
                </select>
              </div>

              {actionData.status === "interview scheduled" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={actionData.interviewDate}
                    onChange={(e) => setActionData(prev => ({ ...prev, interviewDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note (Optional)
                </label>
                <textarea
                  value={actionData.note}
                  onChange={(e) => setActionData(prev => ({ ...prev, note: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add any comments or feedback..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedApplication(null);
                  setActionData({ status: "", note: "", interviewDate: "" });
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationManagement;