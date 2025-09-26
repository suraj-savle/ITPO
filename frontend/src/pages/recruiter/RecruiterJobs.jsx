import { useState, useEffect } from "react";
import {
  Plus,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Trash2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
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
      setForm({
        title: "",
        description: "",
        location: "",
        skillsRequired: "",
        stipend: "",
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error posting job");
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Job deleted successfully!");
      fetchJobs();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error deleting job");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Job Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create and manage your job postings
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Post New Job
        </h2>

        <form onSubmit={createJob} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                type="text"
                placeholder="e.g., Software Developer Intern"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                type="text"
                placeholder="e.g., Remote, New York, Hybrid"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Describe the role, responsibilities, and requirements..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills Required
              </label>
              <input
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                type="text"
                placeholder="React, Node.js, Python (comma separated)"
                value={form.skillsRequired}
                onChange={(e) =>
                  setForm({ ...form, skillsRequired: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stipend/Salary
              </label>
              <input
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                type="text"
                placeholder="e.g., $50,000/year, ₹25,000/month"
                value={form.stipend}
                onChange={(e) => setForm({ ...form, stipend: e.target.value })}
                required
              />
            </div>
          </div>

          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            type="submit"
          >
            <Plus className="w-4 h-4" />
            Post Job Opening
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Briefcase className="w-5 h-5" />
          Your Job Posts ({jobs.length})
        </h2>

        {jobs.length === 0 ? (
          <div className="text-center py-16">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Job Posts Yet
            </h3>
            <p className="text-gray-500">
              Create your first job posting to start recruiting
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.stipend}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applications?.length || 0} applications
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      job.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {job.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {job.description}
                </p>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(`/recruiter/job/${job._id}/applications`)
                    }
                    className="flex items-center gap-2 px-3 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Applications
                  </button>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
