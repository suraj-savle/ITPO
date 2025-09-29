import { useState, useEffect } from "react";
import { Users, Briefcase, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const PlacementDashboard = () => {
  const [stats, setStats] = useState({
    users: {},
    jobs: {},
    applications: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/dashboard/stats",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Placement Cell Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of campus placement activities</p>
      </div>

      {/* User Statistics */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">User Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-2xl font-semibold text-gray-900">
                {stats.users.totalStudents || 0}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 mt-4">Total Students</h3>
            <p className="text-sm text-gray-500">
              {stats.users.activeStudents || 0} active, {stats.users.pendingStudents || 0} pending
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Briefcase className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="text-2xl font-semibold text-gray-900">
                {stats.users.totalRecruiters || 0}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 mt-4">Recruiters</h3>
            <p className="text-sm text-gray-500">
              {stats.users.pendingRecruiters || 0} pending approval
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-2xl font-semibold text-gray-900">
                {stats.jobs.activeJobs || 0}
              </span>
            </div>
            <h3 className="font-medium text-gray-900 mt-4">Active Jobs</h3>
            <p className="text-sm text-gray-500">
              {stats.jobs.pendingJobs || 0} pending review
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-2xl font-semibold text-gray-900">
                {stats.applications.placementRate || 0}%
              </span>
            </div>
            <h3 className="font-medium text-gray-900 mt-4">Placement Rate</h3>
            <p className="text-sm text-gray-500">
              {stats.applications.placedStudents || 0} students placed
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
              <h3 className="font-medium text-gray-900">Pending Approvals</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Student Registrations</span>
                <span className="font-medium">{stats.users.pendingStudents || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Recruiter Registrations</span>
                <span className="font-medium">{stats.users.pendingRecruiters || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Job Postings</span>
                <span className="font-medium">{stats.jobs.pendingJobs || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
              <h3 className="font-medium text-gray-900">Application Pipeline</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Applications</span>
                <span className="font-medium">{stats.applications.totalApplications || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>In Progress</span>
                <span className="font-medium">
                  {(stats.applications.totalApplications || 0) - (stats.applications.placedStudents || 0)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Successful Placements</span>
                <span className="font-medium text-green-600">{stats.applications.placedStudents || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="font-medium text-gray-900">Alerts & Notifications</h3>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>System running smoothly</p>
              <p>All services operational</p>
              <p>No critical alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-700">New student registration pending approval</span>
            <span className="text-xs text-gray-500 ml-auto">2 min ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">Job posting approved for TechCorp</span>
            <span className="text-xs text-gray-500 ml-auto">15 min ago</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-gray-700">New application submitted</span>
            <span className="text-xs text-gray-500 ml-auto">1 hour ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementDashboard;