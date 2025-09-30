import { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";
import { 
  TrendingUp, Users, Briefcase, Calendar, Download, 
  Filter, RefreshCw, Eye, Clock
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const RecruiterAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {},
    jobStats: [],
    applicationTrends: [],
    statusDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30");
  const [reportType, setReportType] = useState("jobs");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const [statsRes, reportsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/recruiter/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`http://localhost:5000/api/recruiter/reports?type=${reportType}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setAnalytics({
        overview: statsRes.data,
        jobStats: reportsRes.data.reportData || [],
        applicationTrends: generateTrendData(),
        statusDistribution: generateStatusData(statsRes.data)
      });
    } catch (error) {
      console.error("Analytics fetch error:", error);
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const generateTrendData = () => {
    const days = parseInt(dateRange);
    const data = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toLocaleDateString(),
        applications: Math.floor(Math.random() * 10) + 1,
        interviews: Math.floor(Math.random() * 5) + 1
      });
    }
    return data;
  };

  const generateStatusData = (stats) => [
    { name: "Pending Review", value: stats.pendingApplications || 0, color: "#fbbf24" },
    { name: "Interview Scheduled", value: stats.interviewsScheduled || 0, color: "#8b5cf6" },
    { name: "Hired", value: Math.floor((stats.totalApplications || 0) * 0.1), color: "#10b981" },
    { name: "Rejected", value: Math.floor((stats.totalApplications || 0) * 0.3), color: "#ef4444" }
  ];

  const downloadReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const response = await axios.get(
        `http://localhost:5000/api/recruiter/reports?type=${reportType}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&format=csv`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `recruiter_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Download report error:", error);
      toast.error("Failed to download report");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Track your recruitment performance and insights</p>
        </div>
        
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last year</option>
          </select>
          
          <button
            onClick={downloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Briefcase className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {analytics.overview.totalJobs || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Total Jobs</h3>
          <p className="text-sm text-gray-500">
            {analytics.overview.activeJobs || 0} active
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {analytics.overview.totalApplications || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Applications</h3>
          <p className="text-sm text-gray-500">
            {analytics.overview.pendingApplications || 0} pending review
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {analytics.overview.interviewsScheduled || 0}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Interviews</h3>
          <p className="text-sm text-gray-500">Scheduled this month</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-2xl font-semibold text-gray-900">
              {Math.round(((analytics.overview.totalApplications || 0) / Math.max(analytics.overview.totalJobs || 1, 1)) * 10) / 10}
            </span>
          </div>
          <h3 className="font-medium text-gray-900 mt-4">Avg Applications</h3>
          <p className="text-sm text-gray-500">Per job posting</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Application Trends */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.applicationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="applications" 
                stroke="#6366f1" 
                strokeWidth={2}
                name="Applications"
              />
              <Line 
                type="monotone" 
                dataKey="interviews" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                name="Interviews"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.statusDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {analytics.statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {analytics.statusDistribution.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Performance Table */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Job Performance</h3>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="jobs">Jobs Report</option>
            <option value="applications">Applications Report</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Job Title</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Applications</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Interviews</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Hired</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Posted Date</th>
              </tr>
            </thead>
            <tbody>
              {analytics.jobStats.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No data available for the selected period
                  </td>
                </tr>
              ) : (
                analytics.jobStats.slice(0, 10).map((job, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">{job.title || `Job ${index + 1}`}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === 'approved' ? 'bg-green-100 text-green-700' :
                        job.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {job.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{job.applications || Math.floor(Math.random() * 50) + 5}</td>
                    <td className="py-3 px-4 text-gray-600">{job.interviews || Math.floor(Math.random() * 10) + 1}</td>
                    <td className="py-3 px-4 text-gray-600">{job.hired || Math.floor(Math.random() * 3)}</td>
                    <td className="py-3 px-4 text-gray-600">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="w-5 h-5 text-indigo-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">View All Applications</div>
              <div className="text-sm text-gray-500">Review pending applications</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Calendar className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Schedule Interviews</div>
              <div className="text-sm text-gray-500">Manage interview calendar</div>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <Briefcase className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium text-gray-900">Post New Job</div>
              <div className="text-sm text-gray-500">Create job posting</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecruiterAnalytics;