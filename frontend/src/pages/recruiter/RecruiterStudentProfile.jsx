import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Star,
  Award,
  Briefcase,
  Building,
  Link,
  FileText,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Code,
  Trophy,
  Download,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const RecruiterStudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/recruiter/student/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch student");
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading student profile...</div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-gray-400 mb-4">👤</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Student Not Found
          </h3>
          <p className="text-gray-600">
            The requested student profile could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/recruiter/students")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Students
          </button>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Student Profile
          </h1>
          <p className="text-gray-600 mt-1">Complete profile overview</p>
        </div>

        {/* Profile Header Card */}
        <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl shadow-2xl p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={
                    student.profileImage ||
                    "https://api.dicebear.com/7.x/avataaars/svg?seed=1"
                  }
                  alt={student.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white/40 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 bg-green-400 p-2 rounded-full border-3 border-white shadow-lg">
                  <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center lg:text-left space-y-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{student.name}</h1>
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                      <GraduationCap size={16} />
                      <span className="text-sm font-medium">
                        {student.course}
                      </span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                      <MapPin size={16} />
                      <span className="text-sm font-medium">
                        {student.department}
                      </span>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">
                        {student.year}
                      </span>
                    </div>
                  </div>
                  <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
                    {student.description || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex lg:flex-col gap-6 lg:gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {student.cgpa || 0}
                  </div>
                  <p className="text-white/80 text-sm font-medium">CGPA</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {student.skills?.length || 0}
                  </div>
                  <p className="text-white/80 text-sm font-medium">Skills</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-1">
                    {student.projects?.length || 0}
                  </div>
                  <p className="text-white/80 text-sm font-medium">Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Resume Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg">
                <Mail size={20} className="text-white" />
              </div>
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-700">{student.email}</span>
              </div>
              {student.phone && (
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-gray-700">{student.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <GraduationCap size={16} className="text-gray-500" />
                <span className="text-gray-700">Roll: {student.rollNo}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                <Award size={20} className="text-white" />
              </div>
              Academic
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Specialization
                </span>
                <p className="text-gray-800">
                  {student.specialization || "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">
                  Backlogs
                </span>
                <p className="text-gray-800">{student.backlogs || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                <FileText size={20} className="text-white" />
              </div>
              Resume
            </h3>
            {student.resumeUrl ? (
              <div className="space-y-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (student.resumeUrl && student.resumeUrl.trim() !== "") {
                      window.open(student.resumeUrl, "_blank");
                    } else {
                      toast.error("No resume uploaded");
                    }
                  }}
                  className="w-full bg-gradient-to-r from-indigo-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <FileText size={16} />
                  View Resume
                </button>
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    if (student.resumeUrl && student.resumeUrl.trim() !== "") {
                      try {
                        const token = localStorage.getItem("token");
                        const response = await fetch(
                          `http://localhost:5000/api/recruiter/student-resume/${student._id}`,
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );

                        if (response.ok) {
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = `${student.name.replace(
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
                    } else {
                      toast.error("No resume uploaded");
                    }
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Resume
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No resume uploaded</p>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
              <Award size={20} className="text-white" />
            </div>
            Skills & Expertise
          </h3>
          <div className="flex flex-wrap gap-3">
            {(student.skills || []).map((skill, index) => (
              <span
                key={index}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow"
              >
                {skill}
              </span>
            ))}
            {(!student.skills || student.skills.length === 0) && (
              <p className="text-gray-500 italic">No skills listed</p>
            )}
          </div>
        </div>

        {/* Projects & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Projects */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-lg">
                <Briefcase size={20} className="text-white" />
              </div>
              Projects ({student.projects?.length || 0})
            </h3>
            <div className="space-y-6">
              {(student.projects || []).map((project, index) => (
                <div
                  key={index}
                  className="border-l-4 border-indigo-500 pl-4 py-2"
                >
                  <h4 className="font-bold text-gray-800 mb-2">
                    {project.title}
                  </h4>
                  <p className="text-gray-600 mb-3">{project.description}</p>
                  {project.technologies && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(project.technologies)
                          ? project.technologies
                          : []
                        ).map((tech, i) => (
                          <span
                            key={i}
                            className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    {project.githubLink && (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                      >
                        <Github size={14} /> Code
                      </a>
                    )}
                    {project.liveDemo && (
                      <a
                        href={project.liveDemo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm"
                      >
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {(!student.projects || student.projects.length === 0) && (
                <p className="text-gray-500 italic">No projects listed</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                <Building size={20} className="text-white" />
              </div>
              Experience ({student.experiences?.length || 0})
            </h3>
            <div className="space-y-6">
              {(student.experiences || []).map((exp, index) => (
                <div
                  key={index}
                  className="border-l-4 border-green-500 pl-4 py-2"
                >
                  <h4 className="font-bold text-gray-800">{exp.role}</h4>
                  <p className="text-gray-600 font-medium">{exp.company}</p>
                  <p className="text-gray-500 text-sm mb-2">
                    {exp.startDate
                      ? new Date(exp.startDate).toLocaleDateString()
                      : "Start Date"}{" "}
                    -
                    {exp.currentlyWorking
                      ? "Present"
                      : exp.endDate
                      ? new Date(exp.endDate).toLocaleDateString()
                      : "End Date"}
                  </p>
                  <p className="text-gray-700">{exp.description}</p>
                </div>
              ))}
              {(!student.experiences || student.experiences.length === 0) && (
                <p className="text-gray-500 italic">No experience listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-lg">
              <Link size={20} className="text-white" />
            </div>
            Social Profiles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(student.socialLinks || {}).map(
              ([platform, url]) => {
                if (!url) return null;

                const getIcon = (platform) => {
                  switch (platform) {
                    case "linkedin":
                      return <Linkedin size={20} className="text-indigo-700" />;
                    case "github":
                      return <Github size={20} className="text-gray-800" />;
                    case "twitter":
                      return <Twitter size={20} className="text-indigo-400" />;
                    case "portfolio":
                      return <Globe size={20} className="text-indigo-500" />;
                    default:
                      return <Code size={20} className="text-gray-600" />;
                  }
                };

                return (
                  <a
                    key={platform}
                    href={url.startsWith("http") ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-white/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {getIcon(platform)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 capitalize">
                        {platform}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{url}</p>
                    </div>
                    <ExternalLink size={16} className="text-gray-400" />
                  </a>
                );
              }
            )}
          </div>
          {Object.values(student.socialLinks || {}).every((url) => !url) && (
            <p className="text-gray-500 italic">No social profiles linked</p>
          )}
        </div>

        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default RecruiterStudentProfile;
