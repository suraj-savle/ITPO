// src/pages/RecruiterJobs.jsx
import { useState, useEffect } from "react";
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
      const res = await axios.get("http://localhost:5000/api/get-post", {
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
        "http://localhost:5000/api/post-job",
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Recruiter Dashboard</h2>

      <form onSubmit={createJob} className="bg-white p-4 rounded-lg shadow-md mb-6">
        <input
          className="border p-2 w-full mb-2 rounded"
          type="text"
          placeholder="Job Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          className="border p-2 w-full mb-2 rounded"
          placeholder="Job Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          type="text"
          placeholder="Skills Required (comma separated)"
          value={form.skillsRequired}
          onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
        />
        <input
          className="border p-2 w-full mb-2 rounded"
          type="text"
          placeholder="Stipend"
          value={form.stipend}
          onChange={(e) => setForm({ ...form, stipend: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" type="submit">
          Post Job
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Your Job Posts</h3>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h4 className="font-bold">{job.title}</h4>
              <p>{job.description}</p>
              <p className="text-sm text-gray-500">
                {job.location} • {job.stipend} • Skills: {job.skillsRequired.join(", ")}
              </p>
            </div>
            <div>
              {job.isActive ? (
                <span className="text-green-600 font-semibold">Active</span>
              ) : (
                <span className="text-red-600 font-semibold">Inactive</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
