import { useState, useEffect } from "react";
import { Eye, Edit, Trash2, Plus, Search, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const EnhancedRecruiterJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, [currentPage, filterStatus]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (filterStatus !== "all") {
        params.append("status", filterStatus);
      }

      const response = await axios.get(
        `http://localhost:5000/api/recruiter/jobs?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      setJobs(response.data.jobs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Fetch jobs error:", error);
      toast.error("Failed to fetch jobs");
      // Fallback to legacy API
      try {
        const response = await axios.get(
          "http://localhost:5000/api/jobs/recruiter",
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setJobs(response.data || []);
      } catch (fallbackError) {
        console.error("Fallback fetch error:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job deleted successfully");
      fetchJobs();
    } catch (error) {
      console.error("Delete job error:", error);
      toast.error("Failed to delete job");
    }
  };

  const handleToggleActive = async (jobId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/jobs/${jobId}/toggle`,
        { isActive: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Job ${!currentStatus ? "activated" : "deactivated"} successfully`);
      fetchJobs();
    } catch (error) {
      console.error("Toggle job status error:", error);
      toast.error("Failed to update job status");
    }
  };

  const handleEditJob = (jobId) => {
    navigate(`/recruiter/jobs/${jobId}/edit`);
  };

  const handleSubmitForApproval = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/jobs/${jobId}`,
        { submit: true },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Job submitted for approval successfully");
      fetchJobs();
    } catch (error) {
      console.error("Submit job error:", error);
      toast.error("Failed to submit job for approval");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "draft":
        return <Edit className="w-4 h-4 text-gray-500" />;
      case "pending_approval":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "request_changes":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "expired":
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "pending_approval":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "request_changes":
        return "bg-orange-100 text-orange-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading jobs...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Job Postings</h1>
          <p className="text-gray-600 mt-1">Manage your job postings and track applications</p>
        </div>
        <button
          onClick={() => navigate("/recruiter/create-job")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Create Job
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs by title, location, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="request_changes">Request Changes</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {searchTerm ? "No jobs match your search" : "No jobs found"}
            </div>
            {!searchTerm && (
              <button
                onClick={() => navigate("/recruiter/create-job")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Create Your First Job
              </button>
            )}
          </div>
        ) : (
          filteredJobs.map((job) => (
            <div key={job._id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status || 'draft')}`}>
                      {getStatusIcon(job.status || 'draft')}
                      {(job.status || 'draft').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    {job.isActive !== undefined && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          job.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </div>
                  
                  {job.department && (
                    <p className="text-sm text-indigo-600 font-medium mb-1">{job.department}</p>
                  )}
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {job.description || job.rolesResponsibilities}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📍 {job.location}</span>
                    <span>💰 {job.stipend || job.compensation?.amount}</span>
                    <span>👥 {job.applications?.length || job.applicationCount || 0} applications</span>
                    <span>📅 {new Date(job.createdAt).toLocaleDateString()}</span>
                    {job.applicationRequirements?.deadline && (
                      <span>⏰ Deadline: {new Date(job.applicationRequirements.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  {job.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">
                        <strong>Rejection Reason:</strong> {job.rejectionReason}
                      </p>
                    </div>
                  )}
                  
                  {job.placementCellComments && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Comments:</strong> {job.placementCellComments}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => navigate(`/recruiter/jobs/${job._id}/applications`)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    title="View Applications"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  
                  {(['draft', 'rejected', 'request_changes'].includes(job.status)) && (
                    <>
                      <button
                        onClick={() => handleEditJob(job._id)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {(['draft', 'request_changes'].includes(job.status)) && (
                        <button
                          onClick={() => handleSubmitForApproval(job._id)}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 rounded text-sm font-medium"
                          title="Submit for Approval"
                        >
                          Submit
                        </button>
                      )}
                    </>
                  )}
                  
                  {job.isActive !== undefined && job.status === 'approved' && (
                    <button
                      onClick={() => handleToggleActive(job._id, job.isActive)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        job.isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {job.isActive ? "Deactivate" : "Activate"}
                    </button>
                  )}
                  
                  {(['draft', 'rejected', 'request_changes'].includes(job.status)) && (
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedRecruiterJobs;