import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Save, Send, FileText, Calendar, MapPin, DollarSign, Users, Clock } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const JobPostingForm = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    title: "",
    department: "",
    description: "",
    rolesResponsibilities: "",
    
    // Eligibility Criteria
    eligibility: {
      degrees: [],
      academicYear: [],
      minimumGPA: "",
      skillsRequired: [],
      experienceRequired: "Fresher"
    },
    
    // Compensation
    compensation: {
      type: "stipend",
      amount: "",
      currency: "INR",
      benefits: []
    },
    
    // Job Details
    location: "",
    workMode: "on-site",
    expectedJoiningDate: "",
    duration: "",
    
    // Application Requirements
    applicationRequirements: {
      documentsRequired: [],
      deadline: "",
      contactInfo: {
        email: "",
        phone: ""
      }
    }
  });

  useEffect(() => {
    if (jobId) {
      setIsEditMode(true);
      fetchJobData();
    }
  }, [jobId]);

  const fetchJobData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const job = response.data;
      setFormData({
        title: job.title || "",
        department: job.department || "",
        description: job.description || "",
        rolesResponsibilities: job.rolesResponsibilities || "",
        eligibility: {
          degrees: job.eligibility?.degrees || [],
          academicYear: job.eligibility?.academicYear || [],
          minimumGPA: job.eligibility?.minimumGPA || "",
          skillsRequired: job.skillsRequired || job.eligibility?.skillsRequired || [],
          experienceRequired: job.eligibility?.experienceRequired || "Fresher"
        },
        compensation: {
          type: job.compensation?.type || "stipend",
          amount: job.stipend || job.compensation?.amount || "",
          currency: job.compensation?.currency || "INR",
          benefits: job.compensation?.benefits || []
        },
        location: job.location || "",
        workMode: job.workMode || "on-site",
        expectedJoiningDate: job.expectedJoiningDate ? job.expectedJoiningDate.split('T')[0] : "",
        duration: job.duration || "",
        applicationRequirements: {
          documentsRequired: job.applicationRequirements?.documentsRequired || [],
          deadline: job.applicationRequirements?.deadline ? job.applicationRequirements.deadline.split('T')[0] : "",
          contactInfo: {
            email: job.applicationRequirements?.contactInfo?.email || "",
            phone: job.applicationRequirements?.contactInfo?.phone || ""
          }
        }
      });
    } catch (error) {
      console.error("Error fetching job data:", error);
      toast.error("Failed to load job data");
    }
  };

  const degreeOptions = ["B.Tech", "M.Tech", "BCA", "MCA", "B.Sc", "M.Sc", "MBA", "BBA"];
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"];
  const skillOptions = ["JavaScript", "Python", "Java", "React", "Node.js", "SQL", "MongoDB", "AWS", "Docker", "Git"];
  const documentOptions = ["Resume", "Cover Letter", "Transcript", "Portfolio", "Certificates"];
  const benefitOptions = ["Health Insurance", "Flexible Hours", "Remote Work", "Learning Budget", "Gym Membership"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedInputChange = (parent, child, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  };

  const handleArrayToggle = (parent, child, value) => {
    setFormData(prev => {
      const currentArray = prev[parent][child] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: newArray
        }
      };
    });
  };

  const handleSubmit = async (isDraft = false) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: formData.title || "Job Title",
        description: formData.description || "Job Description",
        rolesResponsibilities: formData.rolesResponsibilities || "",
        location: formData.location || "Location TBD",
        skillsRequired: formData.eligibility?.skillsRequired || [],
        stipend: formData.compensation?.amount || "Not specified",
        submit: !isDraft
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/jobs/${jobId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(isDraft ? "Job updated as draft" : "Job resubmitted for approval");
      } else {
        await axios.post("http://localhost:5000/api/jobs", payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(isDraft ? "Job saved as draft" : "Job submitted for approval");
      }

      navigate("/recruiter/jobs");
    } catch (error) {
      console.error("Job posting error:", error);
      toast.error(error.response?.data?.message || "Failed to save job posting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{isEditMode ? 'Edit Job Posting' : 'Create Job Posting'}</h1>
        <p className="text-gray-600">{isEditMode ? 'Update the job posting details' : 'Fill in the details to create a comprehensive job posting'}</p>
      </div>

      <form className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Software Developer Intern"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Engineering, Marketing"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the job position, company culture, and what makes this opportunity unique..."
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Roles & Responsibilities *</label>
            <textarea
              name="rolesResponsibilities"
              value={formData.rolesResponsibilities}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="List the key responsibilities and day-to-day tasks..."
              required
            />
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Eligibility Criteria</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Degrees *</label>
              <div className="flex flex-wrap gap-2">
                {degreeOptions.map(degree => (
                  <button
                    key={degree}
                    type="button"
                    onClick={() => handleArrayToggle('eligibility', 'degrees', degree)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.eligibility.degrees.includes(degree)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {degree}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year *</label>
              <div className="flex flex-wrap gap-2">
                {yearOptions.map(year => (
                  <button
                    key={year}
                    type="button"
                    onClick={() => handleArrayToggle('eligibility', 'academicYear', year)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.eligibility.academicYear.includes(year)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum GPA *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.eligibility.minimumGPA}
                  onChange={(e) => handleNestedInputChange('eligibility', 'minimumGPA', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 7.0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Experience Required</label>
                <select
                  value={formData.eligibility.experienceRequired}
                  onChange={(e) => handleNestedInputChange('eligibility', 'experienceRequired', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Fresher">Fresher</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2+ years">2+ years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleArrayToggle('eligibility', 'skillsRequired', skill)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.eligibility.skillsRequired.includes(skill)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compensation & Benefits */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Compensation & Benefits</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={formData.compensation.type}
                onChange={(e) => handleNestedInputChange('compensation', 'type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="stipend">Stipend</option>
                <option value="salary">Salary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
              <input
                type="text"
                value={formData.compensation.amount}
                onChange={(e) => handleNestedInputChange('compensation', 'amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 25,000 per month"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.compensation.currency}
                onChange={(e) => handleNestedInputChange('compensation', 'currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits</label>
            <div className="flex flex-wrap gap-2">
              {benefitOptions.map(benefit => (
                <button
                  key={benefit}
                  type="button"
                  onClick={() => handleArrayToggle('compensation', 'benefits', benefit)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.compensation.benefits.includes(benefit)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {benefit}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Job Details */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Bangalore, Mumbai, Remote"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode *</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="on-site">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Joining Date *</label>
              <input
                type="date"
                name="expectedJoiningDate"
                value={formData.expectedJoiningDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., 6 months, Full-time"
                required
              />
            </div>
          </div>
        </div>

        {/* Application Requirements */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">Application Requirements</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
              <div className="flex flex-wrap gap-2">
                {documentOptions.map(doc => (
                  <button
                    key={doc}
                    type="button"
                    onClick={() => handleArrayToggle('applicationRequirements', 'documentsRequired', doc)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.applicationRequirements.documentsRequired.includes(doc)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {doc}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline *</label>
                <input
                  type="date"
                  value={formData.applicationRequirements.deadline}
                  onChange={(e) => handleNestedInputChange('applicationRequirements', 'deadline', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                <input
                  type="email"
                  value={formData.applicationRequirements.contactInfo.email}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      applicationRequirements: {
                        ...prev.applicationRequirements,
                        contactInfo: {
                          ...prev.applicationRequirements.contactInfo,
                          email: e.target.value
                        }
                      }
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="hr@company.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.applicationRequirements.contactInfo.phone}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      applicationRequirements: {
                        ...prev.applicationRequirements,
                        contactInfo: {
                          ...prev.applicationRequirements.contactInfo,
                          phone: e.target.value
                        }
                      }
                    }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            Save as Draft
          </button>
          
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;