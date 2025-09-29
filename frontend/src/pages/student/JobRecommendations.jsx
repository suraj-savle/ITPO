import { useState, useEffect } from 'react';
import { Star, MapPin, Clock, DollarSign, Target, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const JobRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:5000/api/recommendations/jobs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch full job details for each recommendation
      const jobsResponse = await axios.get('http://localhost:5000/api/jobs?status=approved', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Merge recommendation data with full job details
      const enrichedRecommendations = response.data.recommendations.map(rec => {
        const fullJob = jobsResponse.data.find(job => job._id === rec.job_id);
        return { ...rec, fullJobDetails: fullJob };
      });
      
      setRecommendations(enrichedRecommendations);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      toast.error('Failed to load job recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Top Match': return 'bg-green-100 text-green-800 border-green-200';
      case 'Good Match': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Near Miss': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Recommendations</h1>
          <p className="text-gray-600">AI-powered matches based on your profile</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Matches</p>
                <p className="text-2xl font-bold text-green-600">{summary.top_matches || 0}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Good Matches</p>
                <p className="text-2xl font-bold text-blue-600">{summary.good_matches || 0}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Near Misses</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.near_misses || 0}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Job Cards */}
        {recommendations.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No Recommendations Found</h3>
            <p className="text-gray-500">Complete your profile to get personalized job recommendations</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div key={rec.job_id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{rec.job_title}</h3>
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium w-fit ${getCategoryColor(rec.category)}`}>
                        {rec.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{rec.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {rec.location}
                      </div>
                      {rec.job_details?.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {rec.job_details.duration}
                        </div>
                      )}
                      {rec.job_details?.stipend && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ₹{rec.job_details.stipend}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className={`text-2xl font-bold ${getScoreColor(rec.match_score)}`}>
                        {rec.match_score}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Match Score</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  {rec.matched_skills?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-2">✓ Matched Skills</h4>
                      <div className="flex flex-wrap gap-1">
                        {rec.matched_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs border border-green-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {rec.missing_skills?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-2">→ Skills to Learn</h4>
                      <div className="flex flex-wrap gap-1">
                        {rec.missing_skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-xs border border-orange-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedJob(rec);
                      setShowModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
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
                    <h2 className="text-2xl font-bold text-gray-900">{selectedJob.job_title}</h2>
                    <p className="text-gray-600">{selectedJob.company}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                {selectedJob.fullJobDetails && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
                      <p className="text-gray-600">{selectedJob.fullJobDetails.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Key Responsibilities</h3>
                      {selectedJob.fullJobDetails.rolesResponsibilities ? (
                        <p className="text-gray-600 whitespace-pre-line">{selectedJob.fullJobDetails.rolesResponsibilities}</p>
                      ) : (
                        <p className="text-gray-500 italic">No specific responsibilities listed for this position.</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                        <p className="text-gray-600">{selectedJob.fullJobDetails.location}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Stipend</h3>
                        <p className="text-gray-600">₹{selectedJob.fullJobDetails.stipend}</p>
                      </div>
                    </div>
                    
                    {selectedJob.fullJobDetails.skillsRequired?.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Required Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.fullJobDetails.skillsRequired.map((skill, index) => (
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
                        <p className="text-gray-600">{selectedJob.fullJobDetails.recruiter?.company || selectedJob.fullJobDetails.recruiter?.name}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Posted On</h3>
                        <p className="text-gray-600">{new Date(selectedJob.fullJobDetails.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;