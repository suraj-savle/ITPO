import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Edit, Building, MapPin, DollarSign, Calendar, Clock, Users, Award, Eye, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const JobVerification = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [comments, setComments] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState(null);

  useEffect(() => {
    fetchPendingJobs();
  }, []);

  const fetchPendingJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/admin/jobs/pending",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Fetch pending jobs error:", error);
      toast.error("Failed to fetch pending jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async () => {
    if (!selectedJob) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/jobs/${selectedJob._id}/review`,
        {
          action: actionType,
          comments
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success(`Job ${actionType}d successfully`);
      setShowModal(false);
      setSelectedJob(null);
      setComments("");
      fetchPendingJobs();
    } catch (error) {
      console.error("Job action error:", error);
      toast.error(`Failed to ${actionType} job`);
    }
  };

  const openModal = (job, action) => {
    setSelectedJob(job);
    setActionType(action);
    setShowModal(true);
  };

  const openDetailsModal = (job) => {
    setSelectedJobForDetails(job);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading pending jobs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Verification</h1>
          <p className="text-gray-600">Review and verify job postings from recruiters</p>
          {jobs.length > 0 && (
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} pending review
            </div>
          )}
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {jobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-16">
              <div className="text-gray-400 mb-2">
                <CheckCircle className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">All caught up!</h3>
              <p className="text-gray-500">No pending job verifications at the moment.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                          Pending Review
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span>{job.recruiter?.company || job.recruiter?.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          <span>{job.stipend || job.compensation?.amount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Submitted {new Date(job.submittedAt || job.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-2 mb-3">{job.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => openDetailsModal(job)}
                      className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(job, "approve")}
                        className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm"
                      >
                        <CheckCircle className="w-3 h-3" />
                        Approve
                      </button>
                      <button
                        onClick={() => openModal(job, "request_revision")}
                        className="flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
                      >
                        <Edit className="w-3 h-3" />
                        Changes
                      </button>
                      <button
                        onClick={() => openModal(job, "reject")}
                        className="flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <XCircle className="w-3 h-3" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Job Details Modal */}
        {showDetailsModal && selectedJobForDetails && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedJobForDetails.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedJobForDetails.recruiter?.company || selectedJobForDetails.recruiter?.name}</p>
                  </div>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                      <p className="text-gray-700 leading-relaxed">{selectedJobForDetails.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {selectedJobForDetails.rolesResponsibilities || 
                         "Key responsibilities and duties will be discussed during the interview process."}
                      </p>
                    </div>

                    {(selectedJobForDetails.skillsRequired?.length > 0 || selectedJobForDetails.eligibility?.skillsRequired?.length > 0) && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {(selectedJobForDetails.skillsRequired || selectedJobForDetails.eligibility?.skillsRequired || []).map((skill, index) => (
                            <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Information</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location</span>
                          <span className="font-medium text-gray-900">{selectedJobForDetails.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Compensation</span>
                          <span className="font-medium text-gray-900">{selectedJobForDetails.stipend || selectedJobForDetails.compensation?.amount}</span>
                        </div>
                        {selectedJobForDetails.department && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Department</span>
                            <span className="font-medium text-gray-900">{selectedJobForDetails.department}</span>
                          </div>
                        )}
                        {selectedJobForDetails.workMode && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Work Mode</span>
                            <span className="font-medium text-gray-900 capitalize">{selectedJobForDetails.workMode}</span>
                          </div>
                        )}
                        {selectedJobForDetails.duration && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium text-gray-900">{selectedJobForDetails.duration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedJobForDetails.eligibility && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Eligibility Criteria</h3>
                        <div className="space-y-3">
                          {selectedJobForDetails.eligibility.degrees && (
                            <div>
                              <span className="text-gray-600 block mb-1">Eligible Degrees</span>
                              <div className="flex flex-wrap gap-1">
                                {selectedJobForDetails.eligibility.degrees.map((degree, index) => (
                                  <span key={index} className="px-2 py-1 bg-white text-gray-700 text-sm rounded border">
                                    {degree}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedJobForDetails.eligibility.minimumGPA && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Minimum GPA</span>
                              <span className="font-medium text-gray-900">{selectedJobForDetails.eligibility.minimumGPA}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruiter Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name</span>
                          <span className="font-medium text-gray-900">{selectedJobForDetails.recruiter?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email</span>
                          <span className="font-medium text-gray-900">{selectedJobForDetails.recruiter?.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submitted</span>
                          <span className="font-medium text-gray-900">{new Date(selectedJobForDetails.submittedAt || selectedJobForDetails.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Modal */}
        {showModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {actionType === "approve" ? "Approve Job Posting" : 
                 actionType === "reject" ? "Reject Job Posting" : "Request Changes"}
              </h3>
            
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700 mb-1">
                  <span className="font-medium">Job:</span> {selectedJob.title}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Company:</span> {selectedJob.recruiter?.company || selectedJob.recruiter?.name}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comments {actionType !== "approve" && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={
                    actionType === "approve" ? "Add any approval notes (optional)..." :
                    actionType === "reject" ? "Please explain why this job posting is being rejected..." :
                    "Please specify what changes are needed..."
                  }
                  required={actionType !== "approve"}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedJob(null);
                    setComments("");
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJobAction}
                  disabled={actionType !== "approve" && !comments.trim()}
                  className={`flex-1 px-4 py-3 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                    actionType === "approve" ? "bg-emerald-600 hover:bg-emerald-700" :
                    actionType === "reject" ? "bg-red-600 hover:bg-red-700" :
                    "bg-amber-600 hover:bg-amber-700"
                  }`}
                >
                  {actionType === "approve" ? "Approve Job" : 
                   actionType === "reject" ? "Reject Job" : "Request Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobVerification;