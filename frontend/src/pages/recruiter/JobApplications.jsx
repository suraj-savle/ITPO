import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Download,
  Calendar,
  CheckCircle,
  X,
  Clock,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const JobApplications = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchJobApplications();
  }, [jobId]);

  const fetchJobApplications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/jobs/${jobId}/applications`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setApplications(res.data.applications || []);
      setJob(res.data.job);
    } catch (error) {
      toast.error("Failed to load applications");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (
    applicationId,
    action,
    interviewDate = null
  ) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${applicationId}/recruiter`,
        { action, interviewDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Application ${action}d successfully!`);
      fetchJobApplications();
    } catch (error) {
      toast.error(`Failed to ${action} application`);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      "pending recruiter review": {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Pending Review",
      },
      "interview scheduled": {
        bg: "bg-indigo-100",
        text: "text-indigo-700",
        label: "Interview Scheduled",
      },
      hired: { bg: "bg-green-100", text: "text-green-700", label: "Hired" },
      "rejected by recruiter": {
        bg: "bg-red-100",
        text: "text-red-700",
        label: "Rejected",
      },
    }[status] || { bg: "bg-gray-100", text: "text-gray-700", label: status };

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
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/recruiter/post")}
          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Applications for {job?.title}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {applications.length} applications received
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Applications
          </h3>
          <p className="text-gray-500">
            No applications received for this job yet
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <img
                    src={
                      app.student?.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.student?.name}`
                    }
                    alt={app.student?.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-100"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {app.student?.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {app.student?.department} • {app.student?.year}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>CGPA: {app.student?.cgpa}</span>
                      <span>Skills: {app.student?.skills?.length || 0}</span>
                    </div>
                  </div>
                </div>
                {getStatusBadge(app.status)}
              </div>

              {app.interviewDate && (
                <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 text-indigo-700">
                    <Calendar className="w-4 h-4" />
                    Interview scheduled:{" "}
                    {new Date(app.interviewDate).toLocaleDateString()}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      window.open(
                        `/recruiter/student/${app.student._id}`,
                        "_blank"
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    View Profile
                  </button>
                  {app.student?.resumeUrl && (
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = app.student.resumeUrl;
                        link.download = `${app.student.name}_Resume.pdf`;
                        link.target = "_blank";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="flex items-center gap-2 px-3 py-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Resume
                    </button>
                  )}
                </div>

                {app.status === "pending recruiter review" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const date = prompt(
                          "Enter interview date (YYYY-MM-DD):"
                        );
                        if (date) handleDecision(app._id, "schedule", date);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </button>
                    <button
                      onClick={() => handleDecision(app._id, "reject")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}

                {app.status === "interview scheduled" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDecision(app._id, "hire")}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Hire
                    </button>
                    <button
                      onClick={() => handleDecision(app._id, "reject")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobApplications;
