import { useState, useEffect } from "react";
import { Plus, Briefcase, MapPin, DollarSign, Users, Trash2, Eye, Calendar } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    skillsRequired: "",
    stipend: "",
  });

  const token = localStorage.getItem("token");

  const fetchJobs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/recruiter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const createJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/jobs",
        {
          title: form.title,
          description: form.description,
          location: form.location,
          skillsRequired: form.skillsRequired.split(",").map((s) => s.trim()),
          stipend: form.stipend,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Job posted successfully!");
      setForm({ title: "", description: "", location: "", skillsRequired: "", stipend: "" });
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error posting job");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job? This will remove it for all students.")) {
      return;
    }
    
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Job deleted successfully!");
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error deleting job");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Modern Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Job Management
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Briefcase size={20} />
            Create and manage your job postings
          </p>
        </div>

        {/* Create Job Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Plus size={24} className="text-white" />
            </div>
            Post New Job
          </h2>
          
          <form onSubmit={createJob} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title</label>
                <input
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                  type="text"
                  placeholder="e.g., Software Developer Intern"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                  type="text"
                  placeholder="e.g., Remote, New York, Hybrid"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description</label>
              <textarea
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                placeholder="Describe the role, responsibilities, and what you're looking for..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills Required</label>
                <input
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                  type="text"
                  placeholder="React, Node.js, Python, etc. (comma separated)"
                  value={form.skillsRequired}
                  onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Stipend/Salary</label>
                <input
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors bg-white/50 backdrop-blur-sm"
                  type="text"
                  placeholder="e.g., $50,000/year, $20/hour, ₹25,000/month"
                  value={form.stipend}
                  onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                  required
                />
              </div>
            </div>

            <button 
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3" 
              type="submit"
            >
              <Plus size={20} />
              Post Job Opening
            </button>
          </form>
        </div>

        {/* Job Listings */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
              <Briefcase size={20} className="text-white" />
            </div>
            Your Job Posts ({jobs.length})
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300">
                {/* Job Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{job.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        {job.stipend}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Job Description */}
                <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Applications Count */}
                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                  <Users size={16} />
                  <span>{job.applications?.length || 0} applications received</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium">
                    <Eye size={16} />
                    View Applications
                  </button>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {jobs.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto">
                <Briefcase size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Job Posts Yet</h3>
                <p className="text-gray-600">Create your first job posting to start recruiting talented students.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
