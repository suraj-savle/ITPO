import { useState, useEffect } from "react";
import { Search, MapPin, DollarSign, Clock, Briefcase, Star, Target, AlertTriangle, ChevronDown } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  makeAuthenticatedRequest,
  isTokenValid,
  handleAuthError,
} from "../../utils/auth";

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRecommended, setShowRecommended] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
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

      // Fetch jobs and recommendations in parallel
      console.log('Fetching jobs and recommendations...');
      const token = localStorage.getItem('token');
      const [jobsRes, recRes] = await Promise.all([
        makeAuthenticatedRequest(
          "http://localhost:5000/api/jobs?status=approved",
          {},
          navigate
        ),
fetch('http://localhost:5000/api/recommendations/jobs', {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => res.ok ? res : { json: () => ({ recommendations: [] }) })
        .catch(() => ({ json: () => ({ recommendations: [] }) }))
      ]);
      
      const jobsData = await jobsRes.json();
      const recData = await recRes.json().catch(() => ({ recommendations: [] }));
      
      console.log('Jobs data:', jobsData.length);
      console.log('Recommendations data:', recData);
      
      // Create recommendations map
      const recMap = {};
      recData.recommendations?.forEach(rec => {
        recMap[rec.job_id] = rec;
      });
      console.log('Recommendations map:', recMap);
      setRecommendations(recMap);

      const approvedJobs = jobsData.filter(job => job.status === 'approved');
      const jobsWithStatus = approvedJobs.map((job) => {
        const application = applications.find(
          (app) => app.job && app.job._id === job._id
        );
        let canApply = !application;

        if (
          application &&
          ["rejected by mentor", "rejected by recruiter"].includes(
            application.status
          )
        ) {
          // Check if rejection was within last minute
          if (application.rejectedAt) {
            const oneMinuteAgo = new Date();
            oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
            canApply = new Date(application.rejectedAt) <= oneMinuteAgo;
          } else {
            canApply = true; // Old rejections without timestamp
          }
        }

        return {
          ...job,
          applicationStatus: application ? application.status : null,
          canApply,
          rejectedAt: application?.rejectedAt,
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
    let filtered = jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.skillsRequired?.some((skill) =>
          skill.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    
    if (showRecommended) {
      filtered = filtered.filter(job => recommendations[job._id]);
    }
    
    if (selectedJobType !== 'All') {
      filtered = filtered.filter(job => {
        const jobType = job.type || job.duration || '';
        return jobType.toLowerCase().includes(selectedJobType.toLowerCase());
      });
    }
    
    setFilteredJobs(filtered);
  }, [searchTerm, jobs, showRecommended, recommendations, selectedJobType]);

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
          method: "POST",
          body: JSON.stringify({}),
        },
        navigate
      );

      const responseData = await response.json();

      toast.success("Applied successfully!");
      window.dispatchEvent(new CustomEvent("applicationCreated"));
      fetchJobs();
    } catch (error) {
      if (!error.message.includes("Authentication")) {
        const errorMsg = error.response?.data?.message || error.message;
        if (errorMsg.includes("Cannot reapply until")) {
          toast.error(errorMsg, { duration: 5000 });
        } else {
          toast.error(errorMsg);
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-screen">
            <div className="text-gray-500">Loading jobs...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Openings
          </h1>
          <p className="text-gray-600">
            Discover exciting opportunities
          </p>
        </div>

        {/* Search Bar and Filters */}
        <div className="mb-8 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search jobs, skills, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {selectedJobType}
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {showDropdown && (
                <div className="absolute top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {['All', 'Internship', 'Part-time', 'Full-time', 'Contract', 'Remote'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedJobType(type);
                        setShowDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                        selectedJobType === type ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showRecommended}
                onChange={(e) => setShowRecommended(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-gray-700">Recommended</span>
            </label>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchTerm ? "No jobs found" : "No jobs available"}
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Check back later for new opportunities"}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {job.description}
                  </p>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.stipend || "Not specified"}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    {job.duration || "Not specified"}
                  </div>
                </div>

                {/* Recommendation Badge */}
                {recommendations[job._id] && (
                  <div className="mb-4">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium w-fit ${
                      recommendations[job._id].category === 'Top Match' ? 'bg-green-100 text-green-800' :
                      recommendations[job._id].category === 'Good Match' ? 'bg-blue-100 text-blue-800' :
                      recommendations[job._id].category === 'Near Miss' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {recommendations[job._id].category === 'Top Match' && <Target className="w-3 h-3" />}
                      {recommendations[job._id].category === 'Good Match' && <Star className="w-3 h-3" />}
                      {recommendations[job._id].category === 'Near Miss' && <AlertTriangle className="w-3 h-3" />}
                      <span>{recommendations[job._id].category}</span>
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {job.skillsRequired && job.skillsRequired.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {job.skillsRequired.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skillsRequired.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{job.skillsRequired.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="mb-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>

                {job.canApply ? (
                  <button
                    onClick={() => applyJob(job._id)}
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    {job.applicationStatus &&
                    ["rejected by mentor", "rejected by recruiter"].includes(
                      job.applicationStatus
                    )
                      ? "Apply Again"
                      : "Apply Now"}
                  </button>
                ) : (
                  <div className="w-full">
                    {job.applicationStatus === "pending mentor approval" ? (
                      <div className="bg-yellow-100 text-yellow-700 py-3 rounded-xl font-semibold text-center">
                        Pending Mentor Approval
                      </div>
                    ) : job.applicationStatus === "pending recruiter review" ? (
                      <div className="bg-indigo-100 text-indigo-700 py-3 rounded-xl font-semibold text-center">
                        Pending Recruiter Review
                      </div>
                    ) : job.applicationStatus === "interview scheduled" ? (
                      <div className="bg-green-100 text-green-700 py-3 rounded-xl font-semibold text-center">
                        Interview Scheduled
                      </div>
                    ) : job.applicationStatus === "hired" ? (
                      <div className="bg-emerald-100 text-emerald-700 py-3 rounded-xl font-semibold text-center">
                        Hired
                      </div>
                    ) : job.rejectedAt &&
                      new Date(job.rejectedAt) >
                        new Date(Date.now() - 60 * 1000) ? (
                      <div className="bg-red-100 text-red-700 py-2 rounded-xl font-semibold text-center text-sm">
                        <div>Can reapply at</div>
                        <div className="font-bold">
                          {new Date(
                            new Date(job.rejectedAt).getTime() + 60 * 1000
                          ).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-100 text-gray-500 py-3 rounded-xl font-semibold text-center">
                        Already Applied
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Job Details Modal */}
        {showModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                    <p className="text-gray-600">{selectedJob.recruiter?.company || selectedJob.recruiter?.name}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                    <p className="text-gray-600">{selectedJob.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
                    {selectedJob.rolesResponsibilities ? (
                      <p className="text-gray-600 whitespace-pre-line">{selectedJob.rolesResponsibilities}</p>
                    ) : (
                      <p className="text-gray-500 italic">No specific responsibilities listed for this position.</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                      <p className="text-gray-600">{selectedJob.location}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Stipend</h3>
                      <p className="text-gray-600">₹{selectedJob.stipend}</p>
                    </div>
                  </div>
                  
                  {selectedJob.skillsRequired?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.skillsRequired.map((skill, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Posted By</h3>
                      <p className="text-gray-600">{selectedJob.recruiter?.company || selectedJob.recruiter?.name}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Posted On</h3>
                      <p className="text-gray-600">{new Date(selectedJob.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
