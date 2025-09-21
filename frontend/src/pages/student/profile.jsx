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
import { useNavigate } from "react-router-dom";
import { handleAuthError, makeAuthenticatedRequest, isTokenValid } from "../../utils/auth";

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const avatarOptions = [
    'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    'https://api.dicebear.com/7.x/avataaars/svg?seed=8'
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
        const res = await makeAuthenticatedRequest(
          "http://localhost:5000/api/student/profile",
          {},
          navigate
        );

        const data = await res.json();
        if (data) {
          const updatedData = {
            ...data,
            skills: Array.isArray(data.skills) ? data.skills : [],
            projects: Array.isArray(data.projects) ? data.projects : [],
            experiences: Array.isArray(data.experiences) ? data.experiences : [],
            profileCompletion: calculateProfileCompletion(data),
            reputationPoints: calculateProfileCompletion(data)
          };
          setFormData((prev) => ({ ...prev, ...updatedData }));
          if (data.resumeUrl) setResumePreview(data.resumeUrl);
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        if (!err.message.includes("Authentication")) {
          toast.error("Failed to load profile");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

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
        experiences: Array.isArray(formData.experiences) ? formData.experiences : [],
        course: formData.course,
        specialization: formData.specialization,
        backlogs: formData.backlogs,
        profileImage: formData.profileImage,
        resumeUrl: formData.resumeUrl
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
          resumeUrl: resumePreview || data.user.resumeUrl
        };
        setFormData(updatedData);
      }
      
    } catch (err) {
      console.error('Profile update error:', err);
      if (!err.message.includes("Authentication")) {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  const calculateProfileCompletion = (data) => {
    const fields = [
      data.name, data.email, data.phone, data.department, data.year,
      data.rollNo, data.cgpa, data.description, data.course, data.specialization
    ];
    const arrays = [data.skills, data.projects, data.experiences];
    const socialLinks = Object.values(data.socialLinks || {}).filter(Boolean);
    
    const basicFields = fields.filter(Boolean).length;
    const arrayFields = arrays.filter(arr => arr && arr.length > 0).length;
    const socialCount = socialLinks.length > 0 ? 1 : 0;
    const resumeCount = data.resumeUrl ? 1 : 0;
    
    const total = 10 + 3 + 1 + 1; // 10 basic + 3 arrays + 1 social + 1 resume
    const completed = basicFields + arrayFields + socialCount + resumeCount;
    
    return Math.round((completed / total) * 100);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      const fileUrl = URL.createObjectURL(file);
      setResumePreview(fileUrl);
      setFormData(prev => ({ ...prev, resumeUrl: fileUrl }));
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Modern Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              My Profile
            </h1>
            <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
          </div>
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 transition-all duration-200 shadow-lg font-medium"
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 flex items-center gap-2 transition-all duration-200 shadow-lg font-medium"
            >
              <Edit3 size={20} />
              Edit Profile
            </button>
          )}
        </div>

      {/* Modern Profile Card */}
      <div className="relative bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="relative">
                <img
                  src={formData.profileImage || avatarOptions[0]}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/40 shadow-2xl transition-transform group-hover:scale-105"
                />
                {formData.status === "active" && (
                  <div className="absolute -bottom-2 -right-2 bg-green-400 p-2 rounded-full border-3 border-white shadow-lg">
                    <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
                  </div>
                )}
                {isEditing && (
                  <button
                    onClick={() => setShowAvatarModal(true)}
                    className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit3 size={24} className="text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-3xl font-bold bg-transparent border-b-2 border-white/40 focus:border-white focus:outline-none text-center lg:text-left w-full"
                  />
                ) : (
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {formData.name}
                  </h1>
                )}
                <div className="flex items-center justify-center lg:justify-start gap-2 mt-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                    <span className="text-sm font-medium">{formData.course}</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5">
                    <span className="text-sm font-medium">{formData.department}</span>
                  </div>
                </div>
              </div>
              
              <div>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-3 focus:border-white/60 focus:outline-none resize-none text-white placeholder-white/70"
                    rows="2"
                    placeholder="Tell us about yourself..."
                  />
                ) : (
                  <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
                    {formData.description || "No description added yet."}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Section */}
            <div className="flex lg:flex-col gap-6 lg:gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star size={24} className="fill-yellow-300 text-yellow-300" />
                  <span className="text-2xl font-bold">{formData.reputationPoints}</span>
                </div>
                <p className="text-white/80 text-sm font-medium">Reputation</p>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{formData.profileCompletion}%</div>
                <p className="text-white/80 text-sm font-medium">Complete</p>
                <div className="w-16 bg-white/20 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-400 to-blue-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${formData.profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Choose Avatar</h3>
            <div className="grid grid-cols-4 gap-3 mb-4">
              {avatarOptions.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, profileImage: avatar }));
                    setShowAvatarModal(false);
                  }}
                  className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors"
                >
                  <img src={avatar} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
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

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                <TrendingUp size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {formData.profileCompletion}%
              </span>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Profile Completion</h3>
            <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${formData.profileCompletion}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
                <GraduationCap size={24} className="text-white" />
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
                  className="text-2xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-green-500 focus:outline-none w-20 text-right"
                />
              ) : (
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {formData.cgpa}/10
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-800">CGPA</h3>
            <p className="text-gray-600 text-sm">Academic Performance</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
                <Award size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {formData.badges.length}
              </span>
            </div>
            <h3 className="font-semibold text-gray-800">Badges Earned</h3>
            <p className="text-gray-600 text-sm">Achievements Unlocked</p>
          </div>
        </div>

        {/* Modern Navigation Tabs */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-2 border border-white/20 mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "overview", label: "Overview", icon: UserCheck, color: "from-blue-500 to-indigo-600" },
              { id: "academic", label: "Academic", icon: GraduationCap, color: "from-green-500 to-emerald-600" },
              { id: "skills", label: "Skills", icon: Award, color: "from-yellow-500 to-orange-600" },
              { id: "projects", label: "Projects", icon: Briefcase, color: "from-purple-500 to-pink-600" },
              { id: "experience", label: "Experience", icon: Building, color: "from-red-500 to-rose-600" },
              { id: "social", label: "Social", icon: Link, color: "from-cyan-500 to-blue-600" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-3 transition-all duration-200 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                <tab.icon size={20} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modern Tab Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gradient-to-br from-white/50 to-blue-50/50 rounded-2xl p-6 border border-white/30">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <UserCheck size={20} className="text-white" />
                    </div>
                    Personal Information
                  </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-gray-500" />
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none flex-1"
                      />
                    ) : (
                      <span className="text-gray-700">{formData.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-gray-500" />
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none flex-1"
                      />
                    ) : (
                      <span className="text-gray-700">{formData.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <BookOpen size={18} className="text-gray-500" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none flex-1"
                      />
                    ) : (
                      <span className="text-gray-700">{formData.department}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-gray-500" />
                    {isEditing ? (
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none flex-1 bg-transparent"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    ) : (
                      <span className="text-gray-700">{formData.year}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap size={18} className="text-gray-500" />
                    {isEditing ? (
                      <input
                        type="text"
                        name="rollNo"
                        value={formData.rollNo}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none flex-1"
                      />
                    ) : (
                      <span className="text-gray-700">{formData.rollNo}</span>
                    )}
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
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckCircle size={20} className="text-green-600" />
                      <span className="font-semibold text-green-800">
                        Placed
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-medium">Company:</span>{" "}
                        {formData.placementDetails.company}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Role:</span>{" "}
                        {formData.placementDetails.roleOffered}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Package:</span>{" "}
                        {formData.placementDetails.package}
                      </p>
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
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-4 w-full hover:border-indigo-400 transition-colors"
                  />
                  {resumePreview && (
                    <a
                      href={resumePreview}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FileText size={18} />
                      View Current Resume
                    </a>
                  )}
                </div>
              ) : (
                formData.resumeUrl && (
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
                )
              )}
            </div>
          </div>
        )}

        {/* Academic Tab */}
        {activeTab === "academic" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Academic Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Course
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.course}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Specialization
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="specialization"
                        value={formData.specialization}
                        onChange={handleInputChange}
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.specialization}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Backlogs
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="backlogs"
                        value={formData.backlogs}
                        onChange={handleInputChange}
                        min="0"
                        className="border-b border-gray-300 focus:border-blue-500 focus:outline-none w-20"
                      />
                    ) : (
                      <p className="text-gray-800">{formData.backlogs}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Certifications
                </h3>
                <div className="space-y-4">
                  {formData.certifications.map((cert, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-xl">
                      <h4 className="font-medium text-gray-800">{cert.name}</h4>
                      <p className="text-sm text-gray-600">{cert.issuer}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(cert.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
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
                  value={Array.isArray(formData.skills) ? formData.skills.join(", ") : ""}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const skillsArray = inputValue
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter((skill) => skill.length > 0);
                    setFormData((prev) => ({ ...prev, skills: skillsArray }));
                  }}
                  placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js, Python)"
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none bg-white/50 backdrop-blur-sm"
                  rows="4"
                />
                <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  Separate skills with commas (e.g., JavaScript, React, Node.js)
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {(Array.isArray(formData.skills) ? formData.skills : []).map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {skill}
                  </span>
                ))}
                {(!formData.skills || formData.skills.length === 0) && (
                  <p className="text-gray-500 italic">No skills added yet. Click edit to add your skills.</p>
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
                    <Linkedin size={20} className="text-blue-700" />
                  )}
                  {platform === "github" && (
                    <Github size={20} className="text-gray-800" />
                  )}
                  {platform === "portfolio" && (
                    <Globe size={20} className="text-blue-500" />
                  )}
                  {platform === "twitter" && (
                    <Twitter size={20} className="text-blue-400" />
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
                        className="w-full p-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 focus:outline-none"
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
              <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
              {isEditing && (
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      projects: [...(prev.projects || []), {
                        title: '',
                        description: '',
                        technologies: [],
                        githubLink: '',
                        liveDemo: ''
                      }]
                    }));
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
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
                          setFormData(prev => ({ ...prev, projects: newProjects }));
                        }}
                        placeholder="Project Title"
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                      <textarea
                        value={project.description}
                        onChange={(e) => {
                          const newProjects = [...formData.projects];
                          newProjects[index].description = e.target.value;
                          setFormData(prev => ({ ...prev, projects: newProjects }));
                        }}
                        placeholder="Project Description"
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        rows="3"
                      />
                      <input
                        type="text"
                        value={Array.isArray(project.technologies) ? project.technologies.join(', ') : ''}
                        onChange={(e) => {
                          const newProjects = [...formData.projects];
                          const techArray = e.target.value.split(',').map(t => t.trim()).filter(t => t.length > 0);
                          newProjects[index].technologies = techArray;
                          setFormData(prev => ({ ...prev, projects: newProjects }));
                        }}
                        placeholder="Technologies (comma separated: React, Node.js, MongoDB)"
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="url"
                        value={project.githubLink}
                        onChange={(e) => {
                          const newProjects = [...formData.projects];
                          newProjects[index].githubLink = e.target.value;
                          setFormData(prev => ({ ...prev, projects: newProjects }));
                        }}
                        placeholder="GitHub Link"
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="url"
                        value={project.liveDemo}
                        onChange={(e) => {
                          const newProjects = [...formData.projects];
                          newProjects[index].liveDemo = e.target.value;
                          setFormData(prev => ({ ...prev, projects: newProjects }));
                        }}
                        placeholder="Live Demo Link"
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const newProjects = formData.projects.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, projects: newProjects }));
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
                      <p className="text-gray-600 mb-4">{project.description}</p>

                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-2">
                          Technologies
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(project.technologies) ? project.technologies : []).map((tech, i) => (
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
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <Github size={16} /> Code
                          </a>
                        )}
                        {project.liveDemo && (
                          <a
                            href={project.liveDemo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
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
              <h3 className="text-lg font-semibold text-gray-800">Work Experience</h3>
              {isEditing && (
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      experiences: [...prev.experiences, {
                        role: '',
                        company: '',
                        description: ''
                      }]
                    }));
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm"
                >
                  Add Experience
                </button>
              )}
            </div>
            <div className="space-y-4">
              {formData.experiences.map((exp, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) => {
                          const newExperiences = [...formData.experiences];
                          newExperiences[index].role = e.target.value;
                          setFormData(prev => ({ ...prev, experiences: newExperiences }));
                        }}
                        placeholder="Job Role"
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => {
                          const newExperiences = [...formData.experiences];
                          newExperiences[index].company = e.target.value;
                          setFormData(prev => ({ ...prev, experiences: newExperiences }));
                        }}
                        placeholder="Company Name"
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                      <textarea
                        value={exp.description}
                        onChange={(e) => {
                          const newExperiences = [...formData.experiences];
                          newExperiences[index].description = e.target.value;
                          setFormData(prev => ({ ...prev, experiences: newExperiences }));
                        }}
                        placeholder="Job Description"
                        className="w-full p-2 border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                        rows="3"
                      />
                      <button
                        onClick={() => {
                          const newExperiences = formData.experiences.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, experiences: newExperiences }));
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