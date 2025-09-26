import { useState, useEffect } from "react";
import { Activity, Users, Clock, Filter, RefreshCw } from "lucide-react";
import { toast } from "react-hot-toast";
import { makeAuthenticatedRequest } from "../../utils/auth";

const ActivityMonitor = () => {
  const [activities, setActivities] = useState([]);
  const [usersStatus, setUsersStatus] = useState([]);
  const [statusSummary, setStatusSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");
  const [activeTab, setActiveTab] = useState("activities");

  useEffect(() => {
    fetchData();
  }, [selectedRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [activitiesRes, statusRes] = await Promise.all([
        makeAuthenticatedRequest(
          `/api/admin/activities${selectedRole ? `?role=${selectedRole}` : ""}`
        ),
        makeAuthenticatedRequest(
          `/api/admin/users-status${
            selectedRole ? `?role=${selectedRole}` : ""
          }`
        ),
      ]);

      if (activitiesRes.success) setActivities(activitiesRes.activities);
      if (statusRes.success) {
        setUsersStatus(statusRes.users);
        setStatusSummary(statusRes.statusSummary);
      }
    } catch (error) {
      toast.error("Failed to fetch activity data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-orange-600 bg-orange-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "student":
        return "text-indigo-600 bg-indigo-50";
      case "mentor":
        return "text-purple-600 bg-purple-50";
      case "recruiter":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const getLastSeenText = (lastLogin) => {
    if (!lastLogin) return "Never";
    const diff = new Date() - new Date(lastLogin);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading activity data...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Activity Monitor
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track user activities and status
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {statusSummary.active || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Active Users</h3>
          <p className="text-sm text-gray-500">Currently active</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {statusSummary.pending || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Pending Users</h3>
          <p className="text-sm text-gray-500">Awaiting approval</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Activity className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {statusSummary.recentlyActive || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Recently Active</h3>
          <p className="text-sm text-gray-500">Last 7 days</p>
        </div>
      </div>

      {/* Filter and Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("activities")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "activities"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Recent Activities
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === "status"
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              User Status
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">All Roles</option>
              <option value="student">Students</option>
              <option value="mentor">Mentors</option>
              <option value="recruiter">Recruiters</option>
            </select>
          </div>
        </div>

        {activeTab === "activities" ? (
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No recent activities found
              </p>
            ) : (
              activities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Activity className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.userName}
                      </p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                        activity.userRole
                      )}`}
                    >
                      {activity.userRole}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {usersStatus.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No users found</p>
            ) : (
              usersStatus.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.assignedMentor && (
                        <p className="text-xs text-purple-600">
                          Mentor: {user.assignedMentor.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Last seen: {getLastSeenText(user.lastLogin)}
                    </p>
                    {user.role === "student" && (
                      <p className="text-xs text-indigo-600">
                        Profile: {user.profileCompletion}%
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityMonitor;
