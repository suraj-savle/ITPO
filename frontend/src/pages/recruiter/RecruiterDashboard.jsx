import { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, TrendingUp, Eye, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    approvedStudents: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch recruiter jobs
        const jobsRes = await axios.get('http://localhost:5000/api/jobs/recruiter', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const jobs = jobsRes.data || [];

        // Fetch approved students
        const studentsRes = await axios.get('http://localhost:5000/api/recruiter/students', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const students = studentsRes.data || [];

        // Fetch applications
        const appsRes = await axios.get('http://localhost:5000/api/applications/recruiter', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const applications = appsRes.data || [];

        // Calculate stats
        setStats({
          totalJobs: jobs.length,
          activeJobs: jobs.filter(job => job.isActive).length,
          totalApplications: applications.length,
          approvedStudents: students.length
        });

        setRecentJobs(jobs.slice(0, 5));
        setRecentApplications(applications.slice(0, 5));

      } catch (err) {
        console.error('Dashboard fetch error:', err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Recruiter Dashboard
          </h1>
          <p className="text-gray-600">Overview of your recruitment activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <Briefcase size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.totalJobs}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Total Jobs</h3>
            <p className="text-gray-600 text-sm">Posted positions</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <TrendingUp size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-green-600">{stats.activeJobs}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Active Jobs</h3>
            <p className="text-gray-600 text-sm">Currently recruiting</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Calendar size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-purple-600">{stats.totalApplications}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Applications</h3>
            <p className="text-gray-600 text-sm">Total received</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                <Users size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-orange-600">{stats.approvedStudents}</span>
            </div>
            <h3 className="font-semibold text-gray-800">Approved Students</h3>
            <p className="text-gray-600 text-sm">Ready to recruit</p>
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Jobs</h2>
          <div className="space-y-3">
            {recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div key={job._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-800">{job.title}</h4>
                    <p className="text-sm text-gray-600">{job.location}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {job.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No jobs posted yet</p>
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Applications</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Job</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Applied</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.length > 0 ? (
                  recentApplications.map((app) => (
                    <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-800">{app.student?.name}</div>
                          <div className="text-sm text-gray-600">{app.student?.email}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{app.job?.title}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      No applications received yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;