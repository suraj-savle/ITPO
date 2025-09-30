import { useState, useEffect } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  Bell,
  Search,
  Filter,
  Eye,
  Check,
  X,
  MessageCircle,
  Star,
  Award,
  BookOpen,
  Target
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  makeAuthenticatedRequest,
  isTokenValid,
  handleAuthError,
} from "../../utils/auth";
import AnnouncementBanner from "../../components/AnnouncementBanner";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [dashboardData, setDashboardData] = useState({
    pendingApplications: [],
    recentApplications: [],
    students: [],
    notifications: [],
    stats: {
      totalStudents: 0,
      pendingApprovals: 0,
      approvedToday: 0,
      completedInternships: 0
    }
  });

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    if (!isTokenValid()) {
      handleAuthError(navigate);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch mentor dashboard data
      const response = await makeAuthenticatedRequest(
        "http://localhost:5000/api/mentor/dashboard",
        {},
        navigate
      );
      
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      if (!error.message.includes("Authentication")) {
        toast.error("Failed to load dashboard data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId, action, feedback = "") => {
    try {
      const response = await makeAuthenticatedRequest(
        `http://localhost:5000/api/mentor/applications/${applicationId}/${action}`,
        {
          method: "PUT",
          body: JSON.stringify({ feedback }),
        },
        navigate
      );

      if (response.ok) {
        toast.success(`Application ${action}d successfully`);
        setShowApplicationModal(false);
        setSelectedApplication(null);
        setFeedbackText("");
        fetchDashboardData();
      }
    } catch (error) {
      toast.error(`Failed to ${action} application`);
    }
  };

  const viewStudentProfile = (studentId) => {
    navigate(`/mentor/student/${studentId}`);
  };

  const filteredApplications = dashboardData.pendingApplications.filter(app => {
    const matchesSearch = app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentor Dashboard</h1>
          <p className="text-gray-600">Monitor and guide student applications and internship progress</p>
        </div>

        {/* Announcements */}
        <AnnouncementBanner />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.stats.totalStudents}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">{dashboardData.stats.pendingApprovals}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved Today</p>
                <p className="text-2xl font-bold text-green-600">{dashboardData.stats.approvedToday}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Internships</p>
                <p className="text-2xl font-bold text-purple-600">{dashboardData.stats.completedInternships}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex flex-wrap gap-1">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "applications", label: "Applications", icon: FileText },
              { id: "students", label: "My Students", icon: Users },
              { id: "feedback", label: "Feedback & Reports", icon: MessageSquare },
              { id: "notifications", label: "Notifications", icon: Bell }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <tab.icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              
              {/* Recent Applications */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Applications</h3>
                  <div className="space-y-3">
                    {dashboardData.recentApplications.slice(0, 5).map((app) => (
                      <div key={app._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{app.student?.name}</p>
                            <p className="text-sm text-gray-600">{app.job?.title}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          app.status === 'pending mentor approval' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'approved by mentor'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("applications")}
                      className="w-full flex items-center gap-3 p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <div className="text-left">
                        <p className="font-medium text-indigo-900">Review Applications</p>
                        <p className="text-sm text-indigo-600">{dashboardData.stats.pendingApprovals} pending</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("students")}
                      className="w-full flex items-center gap-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Users className="w-5 h-5 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium text-green-900">View Students</p>
                        <p className="text-sm text-green-600">{dashboardData.stats.totalStudents} assigned</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("feedback")}
                      className="w-full flex items-center gap-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium text-purple-900">Provide Feedback</p>
                        <p className="text-sm text-purple-600">Guide student progress</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Application Review</h2>
                
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search applications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending mentor approval">Pending</option>
                    <option value="approved by mentor">Approved</option>
                    <option value="rejected by mentor">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{application.student?.name}</h3>
                            <p className="text-gray-600">{application.student?.email}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Job Applied For</p>
                            <p className="font-medium text-gray-900">{application.job?.title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Company</p>
                            <p className="font-medium text-gray-900">{application.job?.company}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Applied On</p>
                            <p className="font-medium text-gray-900">
                              {new Date(application.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Status</p>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              application.status === 'pending mentor approval' 
                                ? 'bg-yellow-100 text-yellow-800'
                                : application.status === 'approved by mentor'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => viewStudentProfile(application.student._id)}
                          className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        
                        {application.status === 'pending mentor approval' && (
                          <>
                            <button
                              onClick={() => handleApplicationAction(application._id, 'approve')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            
                            <button
                              onClick={() => {
                                setSelectedApplication(application);
                                setShowApplicationModal(true);
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">My Students</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.students.map((student) => (
                  <div key={student._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">{student.department}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">CGPA:</span>
                        <span className="font-medium">{student.cgpa}/10</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Year:</span>
                        <span className="font-medium">{student.year}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Applications:</span>
                        <span className="font-medium">{student.applicationCount || 0}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => viewStudentProfile(student._id)}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs content would go here */}
          {activeTab === "feedback" && (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Feedback & Reports</h3>
              <p className="text-gray-500">Feature coming soon...</p>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Notifications</h3>
              <p className="text-gray-500">Feature coming soon...</p>
            </div>
          )}
        </div>
      </div>

      {/* Application Action Modal */}
      {showApplicationModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Reject Application</h3>
            <p className="text-gray-600 mb-4">
              Provide feedback for {selectedApplication.student?.name}'s application:
            </p>
            
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter your feedback..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="4"
            />
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedApplication(null);
                  setFeedbackText("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApplicationAction(selectedApplication._id, 'reject', feedbackText)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorDashboard;