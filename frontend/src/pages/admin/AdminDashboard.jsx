import { useState, useEffect } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  TrendingUp,
  Award,
  Building,
  BarChart3,
} from "lucide-react";
import { toast } from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:5000/api/admin/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const placementRate = stats.totalStudents
    ? Math.round((stats.placedStudents / stats.totalStudents) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-5 h-5 animate-pulse" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100  mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          System overview and key metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.totalStudents || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Total Students</h3>
          <p className="text-sm text-gray-500">Registered students</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-50 rounded-lg">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.placedStudents || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Placed Students</h3>
          <p className="text-sm text-gray-500">Successfully placed</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserPlus className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.totalMentors || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Total Mentors</h3>
          <p className="text-sm text-gray-500">Active mentors</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.pendingApprovals || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Pending Approvals</h3>
          <p className="text-sm text-gray-500">Awaiting review</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Placement Statistics
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Placed Students</h4>
                <p className="text-sm text-gray-500">Successfully placed</p>
              </div>
              <span className="text-2xl font-semibold text-green-600">
                {stats.placedStudents || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Unplaced Students</h4>
                <p className="text-sm text-gray-500">Still seeking</p>
              </div>
              <span className="text-2xl font-semibold text-red-600">
                {stats.unplacedStudents || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Placement Rate</h4>
                <p className="text-sm text-gray-500">Overall success</p>
              </div>
              <span className="text-2xl font-semibold text-indigo-600">
                {placementRate}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Total Mentors</h4>
                <p className="text-sm text-gray-500">Active mentors</p>
              </div>
              <span className="text-2xl font-semibold text-purple-600">
                {stats.totalMentors || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Total Recruiters</h4>
                <p className="text-sm text-gray-500">Active recruiters</p>
              </div>
              <span className="text-2xl font-semibold text-green-600">
                {stats.totalRecruiters || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Pending Approvals</h4>
                <p className="text-sm text-gray-500">Awaiting review</p>
              </div>
              <span className="text-2xl font-semibold text-orange-600">
                {stats.pendingApprovals || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
