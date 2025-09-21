import { useState, useEffect } from "react";
import { Search, MapPin, DollarSign, Clock, Briefcase } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { makeAuthenticatedRequest, isTokenValid, handleAuthError } from "../../utils/auth";

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    if (!isTokenValid()) {
      handleAuthError(navigate);
      return;
    }

    setLoading(true);
    try {
      let applications = [];
      try {
        const appsRes = await makeAuthenticatedRequest(
          "http://localhost:5000/api/applications/me",
          {},
          navigate
        );
        applications = await appsRes.json();
      } catch (appError) {
        // No applications yet
      }
      
      const jobsRes = await makeAuthenticatedRequest(
        "http://localhost:5000/api/jobs",
        {},
        navigate
      );
      const jobsData = await jobsRes.json();
      
      const jobsWithStatus = jobsData.map(job => {
        const application = applications.find(app => app.job && app.job._id === job._id);
        return {
          ...job,
          applicationStatus: application ? application.status : null,
          canApply: !application || ['rejected by mentor', 'rejected by recruiter'].includes(application?.status)
        };
      });
      
      setJobs(jobsWithStatus);
      setFilteredJobs(jobsWithStatus);
    } catch (error) {
      if (!error.message.includes("Authentication")) {
        toast.error("Failed to load jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skillsRequired?.some(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  const navigate = useNavigate();

  const applyJob = async (jobId) => {
    if (!isTokenValid()) {
      handleAuthError(navigate);
      return;
    }

    try {
      const response = await makeAuthenticatedRequest(
        `http://localhost:5000/api/applications/${jobId}/apply`,
        {
          method: 'POST',
          body: JSON.stringify({})
        },
        navigate
      );
      
      const responseData = await response.json();
      
      toast.success("Applied successfully!");
      window.dispatchEvent(new CustomEvent('applicationCreated'));
      fetchJobs();
      
    } catch (error) {
      if (!error.message.includes("Authentication")) {
        const errorMsg = error.response?.data?.message || error.message;
        toast.error(errorMsg);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading jobs...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Job Openings
          </h1>
          <p className="text-gray-600">Discover exciting internship opportunities</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, skills, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? 'No jobs found' : 'No jobs available'}
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new opportunities'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{job.description}</p>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.stipend || "Stipend not specified"}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.duration || "Duration not specified"}
                  </div>
                </div>

                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{job.skillsRequired.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}


                
                {job.applicationStatus ? (
                  <div className="w-full bg-gray-100 text-gray-500 py-3 rounded-xl font-semibold text-center">
                    {job.applicationStatus === 'pending mentor approval' ? 'Pending Mentor Approval' : 
                     job.applicationStatus === 'rejected by mentor' ? (
                       <button
                         onClick={() => applyJob(job._id)}
                         className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                       >
                         Apply Again
                       </button>
                     ) : job.applicationStatus === 'rejected by recruiter' ? (
                       <button
                         onClick={() => applyJob(job._id)}
                         className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                       >
                         Apply Again
                       </button>
                     ) : 'Already Applied'}
                  </div>
                ) : (
                  <button
                    onClick={() => applyJob(job._id)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}