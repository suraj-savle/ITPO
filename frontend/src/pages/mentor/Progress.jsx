import { useState, useEffect } from "react";
import {
  Activity,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  User,
  Briefcase,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  makeAuthenticatedRequest,
  isTokenValid,
  handleAuthError,
} from "../../utils/auth";

const Progress = () => {
  const [mentees, setMentees] = useState([]);
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    placed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    if (!isTokenValid()) {
      handleAuthError(navigate);
      return;
    }

    try {
      const [menteesRes, appsRes] = await Promise.all([
        makeAuthenticatedRequest(
          "http://localhost:5000/api/mentor/mentees",
          {},
          navigate
        ),
        makeAuthenticatedRequest(
          "http://localhost:5000/api/mentor/application-history",
          {},
          navigate
        ),
      ]);

      const menteesData = await menteesRes.json();
      const appsData = await appsRes.json();

      setMentees(menteesData.mentees || []);
      setApplications(appsData || []);

      // Calculate stats
      const totalApps = appsData.length;
      const pending = appsData.filter(
        (app) => app.status === "pending mentor approval"
      ).length;
      const approved = appsData.filter(
        (app) =>
          app.status === "pending recruiter review" ||
          app.status === "interview scheduled" ||
          app.status === "hired"
      ).length;
      const rejected = appsData.filter(
        (app) => app.status === "rejected by mentor"
      ).length;
      const placed = menteesData.mentees?.filter((m) => m.isPlaced).length || 0;

      setStats({ total: totalApps, pending, approved, rejected, placed });
    } catch (err) {
      if (!err.message.includes("Authentication")) {
        console.error("Error fetching data:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending mentor approval":
        return "text-yellow-600 bg-yellow-50";
      case "pending recruiter review":
        return "text-indigo-600 bg-indigo-50";
      case "interview scheduled":
        return "text-purple-600 bg-purple-50";
      case "hired":
        return "text-green-600 bg-green-50";
      case "rejected by mentor":
      case "rejected by recruiter":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRecentActivity = () => {
    return applications
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Activity className="w-5 h-5 animate-pulse" />
          Loading progress data...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100  mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Progress Tracking
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Last updated: {lastUpdate.toLocaleTimeString()}
            <span className="inline-flex items-center ml-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="ml-1 text-xs">Live</span>
            </span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
              <p className="text-sm text-gray-500">Total Apps</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.pending}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.approved}
              </p>
              <p className="text-sm text-gray-500">Approved</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.rejected}
              </p>
              <p className="text-sm text-gray-500">Rejected</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.placed}
              </p>
              <p className="text-sm text-gray-500">Placed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Mentees Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                My Mentees ({mentees.length})
              </h2>
            </div>
            <div className="p-6">
              {mentees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No mentees assigned yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {mentees.map((mentee) => {
                    const menteeApps = applications.filter(
                      (app) => app.student?._id === mentee._id
                    );
                    return (
                      <div
                        key={mentee._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              mentee.profileImage ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentee.name}`
                            }
                            alt={mentee.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {mentee.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {mentee.department} • {mentee.year}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {menteeApps.length} apps
                            </p>
                            <p className="text-xs text-gray-500">
                              CGPA: {mentee.cgpa}
                            </p>
                          </div>
                          <div
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              mentee.isPlaced
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {mentee.isPlaced ? "Placed" : "Active"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="bg-white rounded-xl border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Activity
              </h2>
            </div>
            <div className="p-6">
              {getRecentActivity().length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {getRecentActivity().map((app) => (
                    <div key={app._id} className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(
                            app.status
                          )
                            .split(" ")[0]
                            .replace("text-", "bg-")}`}
                        ></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {app.student?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {app.job?.title}
                        </p>
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(app.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
