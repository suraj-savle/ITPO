import { useState, useEffect } from "react";
import { Users, Briefcase, Calendar, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AnnouncementBanner from "../../components/AnnouncementBanner";

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    approvedStudents: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [recruiterInfo, setRecruiterInfo] = useState({ name: "", company: "" });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch user profile
        const profileRes = await axios.get(
          "http://localhost:5000/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecruiterInfo({
          name: profileRes.data.user.name,
          company: profileRes.data.user.company,
        });

        const jobsRes = await axios.get(
          "http://localhost:5000/api/jobs/recruiter",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const jobs = jobsRes.data || [];

        const studentsRes = await axios.get(
          "http://localhost:5000/api/recruiter/students",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const students = studentsRes.data || [];

        // Use existing endpoints only
        let applications = [];
        try {
          const appsRes = await axios.get(
            "http://localhost:5000/api/recruiter/applications",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          applications = appsRes.data || [];
        } catch {
          applications = [];
        }
        
        const statsData = {
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.isActive).length,
          totalApplications: applications.length,
          approvedStudents: students.length
        };

        setStats({
          totalJobs: statsData.totalJobs || jobs.length,
          activeJobs: statsData.activeJobs || jobs.filter((job) => job.isActive).length,
          totalApplications: statsData.totalApplications || 0,
          approvedStudents: statsData.approvedStudents || students.length,
        });

        setRecentJobs(jobs.slice(0, 5));
        setRecentApplications(applications.slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
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
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          {recruiterInfo.company ? `${recruiterInfo.company} - ` : ""}Overview
          of your recruitment activities
        </p>
      </div>

      {/* Announcements */}
      <AnnouncementBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.totalJobs}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Total Jobs</h3>
          <p className="text-sm text-gray-500">Posted positions</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.activeJobs}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Active Jobs</h3>
          <p className="text-sm text-gray-500">Currently recruiting</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.totalApplications}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Applications</h3>
          <p className="text-sm text-gray-500">Total received</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {stats.approvedStudents}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Approved Students</h3>
          <p className="text-sm text-gray-500">Ready to recruit</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{job.title}</h4>
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      job.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {job.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No jobs posted yet</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            Recent Applications
          </h2>
          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {app.student?.name}
                    </h4>
                    <p className="text-sm text-gray-500">{app.job?.title}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                      {app.status
                        ?.replace("pending recruiter review", "Pending")
                        ?.replace("interview scheduled", "Interview")}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">
                No applications received yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate("/recruiter/jobs")}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Manage Jobs</div>
              <div className="text-sm text-gray-500">Create and manage job postings</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate("/recruiter/applications")}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Users className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Review Applications</div>
              <div className="text-sm text-gray-500">Manage candidate applications</div>
            </div>
          </button>
          
          <button
            onClick={() => navigate("/recruiter/students")}
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">View Students</div>
              <div className="text-sm text-gray-500">Browse student profiles</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
