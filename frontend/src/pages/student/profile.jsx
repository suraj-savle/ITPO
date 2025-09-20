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

const Profile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState("");

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
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/student/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        if (data) {
          setFormData((prev) => ({ ...prev, ...data }));
          if (data.resumeUrl) setResumePreview(data.resumeUrl);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile");
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
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login again");
      navigate("/login");
      return;
    }

    try {
      const formToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (["skills", "socialLinks", "projects", "experiences"].includes(key))
          formToSend.append(key, JSON.stringify(formData[key]));
        else formToSend.append(key, formData[key]);
      });
      if (resume) formToSend.append("resume", resume);

      const res = await fetch("http://localhost:5000/api/student/update-profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formToSend,
      });

      if (!res.ok) throw new Error("Update failed");
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else throw new Error(data.message || "Update failed");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header with Edit Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-6 text-white mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={formData.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-lg"
            />
            {formData.status === "active" && (
              <div className="absolute bottom-0 right-0 bg-green-500 p-1.5 rounded-full border-2 border-white">
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="text-2xl font-bold bg-transparent border-b border-white/30 focus:border-white/70 focus:outline-none"
              />
            ) : (
              <h1 className="text-2xl font-bold">{formData.name}</h1>
            )}
            <p className="text-blue-100">
              {formData.course} • {formData.department}
            </p>
            {isEditing ? (
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full mt-1 bg-transparent border-b border-white/30 focus:border-white/70 focus:outline-none resize-none"
                rows="2"
              />
            ) : (
              <p className="text-blue-100/90 mt-1">{formData.description}</p>
            )}
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex items-center gap-2 text-yellow-300">
              <Star size={20} className="fill-yellow-300" />
              <span className="text-xl font-semibold">
                {formData.reputationPoints}
              </span>
            </div>
            <p className="text-blue-100/80 text-sm">Reputation Points</p>
            <div className="bg-white/20 rounded-full px-3 py-1 text-sm">
              {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Stats and Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Profile Completion
            </span>
            <span className="text-blue-600 font-semibold">
              {formData.profileCompletion}%
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${formData.profileCompletion}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">CGPA</p>
              {isEditing ? (
                <input
                  type="number"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  max="10"
                  className="text-xl font-bold text-gray-900 w-20 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
                />
              ) : (
                <p className="text-xl font-bold text-gray-900">
                  {formData.cgpa}/10
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Award size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Badges Earned</p>
              <p className="text-xl font-bold text-gray-900">
                {formData.badges.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white rounded-xl shadow-sm p-2 border border-gray-100">
        {[
          { id: "overview", label: "Overview", icon: UserCheck },
          { id: "academic", label: "Academic", icon: GraduationCap },
          { id: "skills", label: "Skills", icon: Award },
          { id: "projects", label: "Projects", icon: Briefcase },
          { id: "experience", label: "Experience", icon: Building },
          { id: "social", label: "Social", icon: Link },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${
              activeTab === tab.id
                ? "bg-blue-100 text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <UserCheck size={20} />
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

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Award size={20} />
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

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Trophy size={20} />
                Badges & Achievements
              </h3>
              <div className="flex flex-wrap gap-2">
                {formData.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileText size={20} />
                Resume
              </h3>
              {isEditing ? (
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="border border-gray-300 rounded-lg p-2"
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
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    <FileText size={20} />
                    View Resume
                    <ExternalLink size={16} />
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
                  value={formData.skills.join(", ")}
                  onChange={(e) => {
                    const skillsArray = e.target.value
                      .split(",")
                      .map((skill) => skill.trim())
                      .filter((skill) => skill !== "");
                    setFormData((prev) => ({ ...prev, skills: skillsArray }));
                  }}
                  placeholder="Enter skills separated by commas"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  rows="3"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate skills with commas
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-medium"
                  >
                    {skill}
                  </span>
                ))}
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

        {/* Projects and Experience tabs would need similar editing functionality */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {formData.projects.map((project, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-semibold text-gray-800 mb-2">
                    {project.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{project.description}</p>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">
                      Technologies
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
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
              ))}
            </div>
          </div>
        )}

        {activeTab === "experience" && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Work Experience
            </h3>
            <div className="space-y-4">
              {formData.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-500 pl-4 py-2"
                >
                  <h4 className="font-semibold text-gray-800">
                    {exp.role} • {exp.company}
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    {new Date(exp.startDate).toLocaleDateString()} -{" "}
                    {exp.currentlyWorking
                      ? "Present"
                      : new Date(exp.endDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;