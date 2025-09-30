import { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  BookOpen,
  Calendar,
  GraduationCap,
  Award,
  Briefcase,
  Building,
  Link,
  FileText,
  Star,
  TrendingUp,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Code,
  Trophy,
  CheckCircle,
  Clock,
  UserCheck,
  Bookmark,
  Edit3,
  Save,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  handleAuthError,
  makeAuthenticatedRequest,
  isTokenValid,
} from "../../utils/auth";

const Profile = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isMentorView, setIsMentorView] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const avatarOptions = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=emma",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=anna",
  ];

  // Initialize formData with proper structure
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    year: "1st Year",
    rollNo: "",
    cgpa: 0,
    description: "",
    skills: [],
    socialLinks: {
      linkedin: "",
      github: "",
      portfolio: "",
      twitter: "",
      leetcode: "",
      codeforces: "",
      hackerrank: "",
    },
    projects: [],
    experiences: [],
    resumeUrl: "",
    profileCompletion: 0,
    reputationPoints: 0,
    profileImage: "",
    role: "student",
    isPlaced: false,
    placementDetails: {},
    badges: [],
    certifications: [],
    course: "",
    specialization: "",
    backlogs: 0,
    status: "active",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isTokenValid()) {
        handleAuthError(navigate);
        return;
      }

      try {
        // Check if this is mentor viewing student profile
        const isMentor = studentId !== undefined;
        setIsMentorView(isMentor);
        console.log('Is mentor view:', isMentor);

        // Disable editing for mentor view
        if (isMentor) {
          setIsEditing(false);
        }

        const endpoint = isMentor
          ? `http://localhost:5000/api/mentor/student-profile/${studentId}`
          : "http://localhost:5000/api/student/profile";
          
        console.log('Fetching from endpoint:', endpoint);

        const res = await makeAuthenticatedRequest(endpoint, {}, navigate);
        console.log('API response status:', res.status);

        const data = await res.json();
        console.log('API response data:', data);
        if (data) {
          const updatedData = {
            ...data,
            skills: Array.isArray(data.skills) ? data.skills : [],
            projects: Array.isArray(data.projects) ? data.projects : [],
            experiences: Array.isArray(data.experiences)
              ? data.experiences
              : [],
            profileCompletion: calculateProfileCompletion(data),
            reputationPoints: calculateProfileCompletion(data),
          };
          setFormData((prev) => ({ ...prev, ...updatedData }));
          if (data.resumeUrl) setResumePreview(data.resumeUrl);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (err.message.includes("403") || err.message.includes("401")) {
          toast.error("Access denied");
          navigate("/mentor");
        } else if (!err.message.includes("Authentication")) {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Auto-refresh disabled during editing to prevent data loss
    if (!isMentorView && !isEditing) {
      const interval = setInterval(() => {
        fetchProfile().catch(console.error);
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [navigate, studentId, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!isTokenValid()) {
      handleAuthError(navigate);
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        year: formData.year,
        cgpa: formData.cgpa,
        description: formData.description,
        skills: Array.isArray(formData.skills) ? formData.skills : [],
        socialLinks: formData.socialLinks || {},
        projects: Array.isArray(formData.projects) ? formData.projects : [],
        experiences: Array.isArray(formData.experiences)
          ? formData.experiences
          : [],
        course: formData.course,
        specialization: formData.specialization,
        backlogs: formData.backlogs,
        profileImage: formData.profileImage,
        resumeUrl: formData.resumeUrl,
      };

      const res = await makeAuthenticatedRequest(
        "http://localhost:5000/api/student/update-profile",
        {
          method: "PUT",
          body: JSON.stringify(updateData),
        },
        navigate
      );

      const data = await res.json();
      toast.success("Profile updated successfully!");
      setIsEditing(false);

      if (data.user) {
        const updatedData = {
          ...data.user,
          profileCompletion: calculateProfileCompletion(data.user),
          reputationPoints: calculateProfileCompletion(data.user),
          resumeUrl: resumePreview || data.user.resumeUrl,
        };
        setFormData(updatedData);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      if (!err.message.includes("Authentication")) {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const calculateProfileCompletion = (data) => {
    const fields = [
      data.name,
      data.email,
      data.phone,
      data.department,
      data.year,
      data.rollNo,
      data.cgpa,
      data.description,
      data.course,
      data.specialization,
    ];
    const arrays = [data.skills, data.projects, data.experiences];
    const socialLinks = Object.values(data.socialLinks || {}).filter(Boolean);

    const basicFields = fields.filter(Boolean).length;
    const arrayFields = arrays.filter((arr) => arr && arr.length > 0).length;
    const socialCount = socialLinks.length > 0 ? 1 : 0;
    const resumeCount = data.resumeUrl ? 1 : 0;

    const total = 10 + 3 + 1 + 1; // 10 basic + 3 arrays + 1 social + 1 resume
    const completed = basicFields + arrayFields + socialCount + resumeCount;

    return Math.round((completed / total) * 100);
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);

      // Upload the file immediately
      const formData = new FormData();
      formData.append("resume", file);

      try {
        const response = await makeAuthenticatedRequest(
          "http://localhost:5000/api/student/upload-resume",
          {
            method: "POST",
            body: formData,
            headers: {}, // Let browser set Content-Type for FormData
          },
          navigate
        );

        const data = await response.json();
        setResumePreview(data.resumeUrl);
        setFormData((prev) => ({ ...prev, resumeUrl: data.resumeUrl }));
        toast.success("Resume uploaded successfully!");
      } catch (error) {
        console.error("Resume upload error:", error);
        toast.error("Failed to upload resume");
      }
    }
  };

  if (loading) {
    console.log('Loading state:', loading);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }
  
  console.log('Form data:', formData);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            {isMentorView && (
              <button
                onClick={() => navigate("/mentor")}
                className="mb-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                ← Back to Mentees
              </button>
            )}
            <h1 className="text-3xl font-bold text-gray-900">
              {isMentorView ? "Student Profile" : "My Profile"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isMentorView
                ? "View student information and details"
                : "Manage your personal information and preferences"}
            </p>
          </div>
          {!isMentorView &&
            (isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                >
                  <Save size={18} />
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
              >
                <Edit3 size={18} />
                Edit Profile
              </button>
            ))}
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <img
                src={
                  formData.profileImage ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    formData.name || "student"
                  }`
                }
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
              />
              {formData.status === "active" && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              )}
              {!isMentorView && isEditing && (
                <button
                  onClick={() => setShowAvatarModal(true)}
                  className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit3 size={20} className="text-white" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="text-2xl font-bold bg-transparent border-b border-gray-300 focus:border-indigo-500 focus:outline-none w-full mb-2"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {formData.name}
                </h1>
              )}
              
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {formData.course}
                </span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {formData.department}
                </span>
              </div>

              {isEditing ? (
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:border-indigo-500 focus:outline-none resize-none"
                  rows="2"
                  placeholder="Tell us about yourself..."
                  onKeyDown={(e) => e.stopPropagation()}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {formData.description || "No description added yet."}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star size={18} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold text-gray-900">
                    {formData.reputationPoints}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">Reputation</p>
              </div>

              <div className="text-center">
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {formData.profileCompletion}%
                </div>
                <p className="text-gray-600 text-sm">Complete</p>
                <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${formData.profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar Selection Modal */}
        {showAvatarModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Choose Avatar
              </h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {avatarOptions.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        profileImage: avatar,
                      }));
                      setShowAvatarModal(false);
                    }}
                    className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 hover:border-indigo-500 transition-colors"
                  >
                    <img
                      src={avatar}
                      alt={`Avatar ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp size={20} className="text-indigo-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {formData.profileCompletion}%
              </span>
            </div>
            <h3 className="font-medium text-gray-800 mb-1">Profile Completion</h3>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${formData.profileCompletion}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <GraduationCap size={20} className="text-green-600" />
              </div>
              {isEditing ? (
                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="10"
                  className="text-xl font-bold bg-transparent border-b border-gray-300 focus:border-green-500 focus:outline-none w-16 text-right"
                  onKeyDown={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {formData.cgpa}/10
                </span>
              )}
            </div>
            <h3 className="font-medium text-gray-800">CGPA</h3>
            <p className="text-gray-600 text-sm">Academic Performance</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award size={20} className="text-purple-600" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {formData.badges.length}
              </span>
            </div>
            <h3 className="font-medium text-gray-800">Badges Earned</h3>
            <p className="text-gray-600 text-sm">Achievements</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
          <div className="flex flex-wrap gap-1">
            {[
              {
                id: "overview",
                label: "Overview",
                icon: UserCheck,
                color: "from-indigo-500 to-indigo-600",
              },
              {
                id: "academic",
                label: "Academic",
                icon: GraduationCap,
                color: "from-green-500 to-emerald-600",
              },
              {
                id: "skills",
                label: "Skills",
                icon: Award,
                color: "from-yellow-500 to-orange-600",
              },
              {
                id: "projects",
                label: "Projects",
                icon: Briefcase,
                color: "from-purple-500 to-pink-600",
              },
              {
                id: "experience",
                label: "Experience",
                icon: Building,
                color: "from-red-500 to-rose-600",
              },
              {
                id: "social",
                label: "Social",
                icon: Link,
                color: "from-cyan-500 to-indigo-600",
              },
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
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-600 rounded-lg">
                      <UserCheck size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Personal Information
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <Mail size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleInputChange}
                            className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{formData.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <Phone size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Phone</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleInputChange}
                            className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{formData.phone}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <BookOpen size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Department</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="department"
                            value={formData.department || ''}
                            onChange={handleInputChange}
                            className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{formData.department}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <Calendar size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Year</label>
                        {isEditing ? (
                          <select
                            name="year"
                            value={formData.year || ''}
                            onChange={handleInputChange}
                            className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                            onKeyDown={(e) => e.stopPropagation()}
                          >
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="4th Year">4th Year</option>
                          </select>
                        ) : (
                          <p className="text-gray-900 font-medium">{formData.year}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                      <GraduationCap size={16} className="text-gray-400" />
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 uppercase tracking-wide">Roll Number</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="rollNo"
                            value={formData.rollNo || ''}
                            onChange={handleInputChange}
                            className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <p className="text-gray-900 font-medium">{formData.rollNo}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white/50 to-green-50/50 rounded-2xl p-6 border border-white/30">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                      <Award size={20} className="text-white" />
                    </div>
                    Placement Status
                  </h3>
                  {formData.isPlaced ? (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-500 rounded-full">
                          <CheckCircle size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-green-800 text-lg">
                          Successfully Placed! 🎉
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white/60 rounded-lg p-3">
                          <p className="text-sm text-gray-600 mb-1">Company</p>
                          <p className="font-semibold text-gray-800">
                            {formData.placementDetails?.company ||
                              "Not specified"}
                          </p>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3">
                          <p className="text-sm text-gray-600 mb-1">Role</p>
                          <p className="font-semibold text-gray-800">
                            {formData.placementDetails?.roleOffered ||
                              "Not specified"}
                          </p>
                        </div>
                        <div className="bg-white/60 rounded-lg p-3">
                          <p className="text-sm text-gray-600 mb-1">Package</p>
                          <p className="font-semibold text-gray-800">
                            {formData.placementDetails?.package ||
                              "Not specified"}
                          </p>
                        </div>
                        {formData.placementDetails?.placedAt && (
                          <div className="bg-white/60 rounded-lg p-3">
                            <p className="text-sm text-gray-600 mb-1">
                              Placed On
                            </p>
                            <p className="font-semibold text-gray-800">
                              {new Date(
                                formData.placementDetails.placedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Clock size={20} className="text-yellow-600" />
                        <span className="font-semibold text-yellow-800">
                          Seeking Opportunities
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-2">
                        Keep applying to jobs and building your profile!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-white/50 to-purple-50/50 rounded-2xl p-6 border border-white/30">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                    <Trophy size={20} className="text-white" />
                  </div>
                  Badges & Achievements
                </h3>
                <div className="flex flex-wrap gap-3">
                  {formData.badges.map((badge, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Section */}
              <div className="bg-gradient-to-br from-white/50 to-indigo-50/50 rounded-2xl p-6 border border-white/30">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                    <FileText size={20} className="text-white" />
                  </div>
                  Resume
                </h3>
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="border-2 border-dashed border-gray-300 rounded-xl p-4 w-full hover:border-indigo-400 transition-colors"
                    />
                    {resumePreview && (
                      <div className="flex gap-2">
                        <a
                          href={resumePreview}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                        >
                          <FileText size={16} />
                          View Current Resume
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  formData.resumeUrl && (
                    <div className="flex gap-2">
                      <a
                        href={formData.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                      >
                        <FileText size={18} />
                        View Resume
                        <ExternalLink size={14} />
                      </a>
                      {isMentorView && (
                        <button
                          onClick={async () => {
                            try {
                              const token = localStorage.getItem("token");
                              const response = await fetch(
                                `http://localhost:5000/api/mentor/student-resume/${studentId}`,
                                {
                                  headers: { Authorization: `Bearer ${token}` },
                                }
                              );

                              if (response.ok) {
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = `${formData.name.replace(
                                  /\s+/g,
                                  "_"
                                )}_Resume.pdf`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                                toast.success("Download initiated");
                              } else {
                                toast.error("Failed to download resume");
                              }
                            } catch (error) {
                              console.error("Error downloading resume:", error);
                              toast.error("Error downloading resume");
                            }
                          }}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                        >
                          <FileText size={18} />
                          Download Resume
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* Academic Tab */}
          {activeTab === "academic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <GraduationCap size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Academic Details
                    </h3>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
                        Course
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="course"
                          value={formData.course}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{formData.course}</p>
                      )}
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
                        Specialization
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="specialization"
                          value={formData.specialization}
                          onChange={handleInputChange}
                          className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{formData.specialization}</p>
                      )}
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-gray-200">
                      <label className="text-xs text-gray-500 uppercase tracking-wide mb-2 block">
                        Backlogs
                      </label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="backlogs"
                          value={formData.backlogs}
                          onChange={handleInputChange}
                          min="0"
                          className="w-full bg-transparent border-none focus:outline-none text-gray-900 font-medium"
                        />
                      ) : (
                        <p className="text-gray-900 font-medium">{formData.backlogs}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-purple-600 rounded-lg">
                      <Award size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Certifications
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {formData.certifications.length > 0 ? (
                      formData.certifications.map((cert, index) => (
                        <div key={index} className="p-4 bg-white rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {cert.name}
                          </h4>
                          <p className="text-sm text-gray-600 mb-1">{cert.issuer}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(cert.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-white rounded-lg border border-gray-200 text-center">
                        <p className="text-gray-500 text-sm">No certifications added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === "skills" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Skills & Expertise
              </h3>
              {isEditing ? (
                <div>
                  <textarea
                    value={
                      formData.skillsInput !== undefined 
                        ? formData.skillsInput
                        : Array.isArray(formData.skills)
                        ? formData.skills.join(", ")
                        : ""
                    }
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      // Store raw input without processing
                      setFormData((prev) => ({ 
                        ...prev, 
                        skillsInput: inputValue
                      }));
                    }}
                    onBlur={(e) => {
                      // Process skills only on blur
                      const inputValue = e.target.value;
                      const skillsArray = inputValue
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter((skill) => skill.length > 0);
                      setFormData((prev) => ({ 
                        ...prev, 
                        skills: skillsArray,
                        skillsInput: undefined // Clear temp input
                      }));
                    }}
                    placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js, Python)"
                    className="w-full p-4 border border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
                    rows="4"
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                    Separate skills with commas (e.g., JavaScript, React, Node.js)
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {(Array.isArray(formData.skills) ? formData.skills : []).map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                      >
                        {skill}
                      </span>
                    )
                  )}
                  {(!formData.skills || formData.skills.length === 0) && (
                    <p className="text-gray-500 italic">
                      No skills added yet. Click edit to add your skills.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Social Tab */}
          {activeTab === "social" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">
                Social Profiles
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(formData.socialLinks).map(([platform, url]) => (
                  <div
                    key={platform}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl"
                  >
                    {platform === "linkedin" && (
                      <Linkedin size={20} className="text-indigo-700" />
                    )}
                    {platform === "github" && (
                      <Github size={20} className="text-gray-800" />
                    )}
                    {platform === "portfolio" && (
                      <Globe size={20} className="text-indigo-500" />
                    )}
                    {platform === "twitter" && (
                      <Twitter size={20} className="text-indigo-400" />
                    )}
                    {platform === "leetcode" && (
                      <Code size={20} className="text-orange-500" />
                    )}
                    {platform === "codeforces" && (
                      <Code size={20} className="text-red-500" />
                    )}
                    {platform === "hackerrank" && (
                      <Code size={20} className="text-green-500" />
                    )}

                    <div className="flex-1">
                      <p className="font-medium text-gray-800 capitalize mb-1">
                        {platform}
                      </p>
                      {isEditing ? (
                        <input
                          type="url"
                          value={url}
                          onChange={(e) =>
                            handleSocialLinkChange(platform, e.target.value)
                          }
                          placeholder={`Enter your ${platform} URL`}
                          className="w-full p-1.5 border border-gray-300 rounded text-sm focus:border-indigo-500 focus:outline-none"
                        />
                      ) : (
                        <p className="text-sm text-gray-600 truncate">{url}</p>
                      )}
                    </div>
                    {!isEditing && url && (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Tab */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Briefcase size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Projects
                  </h3>
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFormData((prev) => ({
                        ...prev,
                        projects: [
                          ...(prev.projects || []),
                          {
                            title: "",
                            description: "",
                            technologies: [],
                            githubLink: "",
                            liveDemo: "",
                          },
                        ],
                      }));
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Add Project
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.projects.map((project, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[index].title = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              projects: newProjects,
                            }));
                          }}
                          placeholder="Project Title"
                          className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <textarea
                          value={project.description}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[index].description = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              projects: newProjects,
                            }));
                          }}
                          placeholder="Project Description"
                          className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                          rows="3"
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <input
                          type="text"
                          value={
                            project.technologiesInput !== undefined
                              ? project.technologiesInput
                              : Array.isArray(project.technologies)
                              ? project.technologies.join(", ")
                              : ""
                          }
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[index].technologiesInput = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              projects: newProjects,
                            }));
                          }}
                          onBlur={(e) => {
                            const newProjects = [...formData.projects];
                            const techArray = e.target.value
                              .split(",")
                              .map((t) => t.trim())
                              .filter((t) => t.length > 0);
                            newProjects[index].technologies = techArray;
                            delete newProjects[index].technologiesInput;
                            setFormData((prev) => ({
                              ...prev,
                              projects: newProjects,
                            }));
                          }}
                          placeholder="Technologies (comma separated: React, Node.js, MongoDB)"
                          className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <input
                          type="url"
                          value={project.githubLink}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[index].githubLink = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              projects: newProjects,
                            }));
                          }}
                          placeholder="GitHub Link"
                          className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <input
                          type="url"
                          value={project.liveDemo}
                          onChange={(e) => {
                            const newProjects = [...formData.projects];
                            newProjects[index].liveDemo = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              projects: newProjects,
                            }));
                          }}
                          placeholder="Live Demo Link"
                          className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newProjects = formData.projects.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              projects: newProjects,
                            }));
                          }}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove Project
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">
                          {project.title}
                        </h4>
                        <p className="text-gray-600 mb-4">
                          {project.description}
                        </p>

                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">
                            Technologies
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {(Array.isArray(project.technologies)
                              ? project.technologies
                              : []
                            ).map((tech, i) => (
                              <span
                                key={i}
                                className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {project.githubLink && (
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              <Github size={16} /> Code
                            </a>
                          )}
                          {project.liveDemo && (
                            <a
                              href={project.liveDemo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm"
                            >
                              <ExternalLink size={16} /> Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Tab */}
          {activeTab === "experience" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <Building size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Work Experience
                  </h3>
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFormData((prev) => ({
                        ...prev,
                        experiences: [
                          ...prev.experiences,
                          {
                            role: "",
                            company: "",
                            description: "",
                          },
                        ],
                      }));
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Add Experience
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {formData.experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-indigo-500 pl-4 py-2"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => {
                            const newExperiences = [...formData.experiences];
                            newExperiences[index].role = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              experiences: newExperiences,
                            }));
                          }}
                          placeholder="Job Role"
                          className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => {
                            const newExperiences = [...formData.experiences];
                            newExperiences[index].company = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              experiences: newExperiences,
                            }));
                          }}
                          placeholder="Company Name"
                          className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                        />
                        <textarea
                          value={exp.description}
                          onChange={(e) => {
                            const newExperiences = [...formData.experiences];
                            newExperiences[index].description = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              experiences: newExperiences,
                            }));
                          }}
                          placeholder="Job Description"
                          className="w-full p-2 border border-gray-300 rounded focus:border-indigo-500 focus:outline-none"
                          rows="3"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newExperiences = formData.experiences.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              experiences: newExperiences,
                            }));
                          }}
                          className="text-red-600 text-sm hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {exp.role} • {exp.company}
                        </h4>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;