import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  User,
  Briefcase,
  UserCheck,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          "http://localhost:5000/api/recruiter/application-history",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        console.log("Recruiter history data:", data);
        setApplications(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load application history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending recruiter review":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "rejected by recruiter":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "interview scheduled":
        return <UserCheck className="w-5 h-5 text-indigo-500" />;
      case "hired":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "rejected by recruiter":
        return "bg-red-100 text-red-800";
      case "pending recruiter review":
        return "bg-yellow-100 text-yellow-800";
      case "interview scheduled":
        return "bg-indigo-100 text-indigo-800";
      case "hired":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading history...
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100  mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Application History</h1>
        <p className="text-gray-600">
          Review all applications you've processed
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No application history found.</p>
          <p className="text-gray-400 text-sm mt-2">
            Applications you review will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(app.status)}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        app.status
                      )}`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(app.updatedAt).toLocaleDateString()}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold">{app.student?.name}</h3>
                    <p className="text-sm text-gray-600">
                      {app.student?.email}
                    </p>
                    <p className="text-sm text-gray-500">
                      {app.student?.department} • {app.student?.year}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold">{app.job?.title}</h3>
                    <p className="text-sm text-gray-600">{app.job?.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <UserCheck className="w-5 h-5 text-gray-400" />
                  <div>
                    <h3 className="font-semibold">Mentor</h3>
                    <p className="text-sm text-gray-600">{app.mentor?.name}</p>
                    <p className="text-sm text-gray-500">{app.mentor?.email}</p>
                  </div>
                </div>
              </div>

              {app.interviewDate && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm font-medium text-indigo-700">
                    Interview Date:
                  </p>
                  <p className="text-sm text-indigo-600 mt-1">
                    {new Date(app.interviewDate).toLocaleString()}
                  </p>
                </div>
              )}

              {app.recruiterNote && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    Your Note:
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {app.recruiterNote}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
