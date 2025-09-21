// src/pages/StudentJobs.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);
  const [myApps, setMyApps] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch all applications first to filter jobs
  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/jobs/my-applications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyApps(res.data || []);
      return res.data || [];
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error("Failed to load your applications.");
      setMyApps([]);
      return [];
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch available jobs excluding already applied
  const fetchJobs = async () => {
    setLoadingJobs(true);
    try {
      const appliedApps = await fetchApplications(); // get applied jobs first
      const res = await axios.get("http://localhost:5000/api/all-post", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter out jobs student has already applied to
      const appliedJobIds = appliedApps.map((app) => app.job?._id);
      const availableJobs = (res.data || []).filter(
        (job) => !appliedJobIds.includes(job._id)
      );

      setJobs(availableJobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to load jobs.");
      setJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const applyJob = async (jobId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/post/${jobId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Applied successfully!");

      // Move job from Available Jobs to My Applications instantly
      const appliedJob = jobs.find((job) => job._id === jobId);
      if (appliedJob) {
        setMyApps((prev) => [...prev, { job: appliedJob, status: "applied" }]);
        setJobs((prev) => prev.filter((job) => job._id !== jobId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error applying");
      console.error("Apply Job Error:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      {loadingJobs ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-4 rounded shadow flex flex-col"
            >
              <h3 className="font-bold">{job.title}</h3>
              <p>{job.description}</p>
              <p className="text-sm text-gray-500">
                {job.location} • {job.stipend || "N/A"} • Skills:{" "}
                {job.skillsRequired?.join(", ") || "N/A"}
              </p>
              <button
                className="mt-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                onClick={() => applyJob(job._id)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs available to apply.</p>
      )}

      <h2 className="text-2xl font-bold my-4">My Applications</h2>
      {loadingApps ? (
        <p>Loading applications...</p>
      ) : myApps.length > 0 ? (
        <div className="space-y-2">
          {myApps.map((app) => (
            <div
              key={app._id}
              className="bg-white p-3 rounded shadow flex justify-between"
            >
              <div>
                <h4 className="font-semibold">
                  {app.job?.title || "Job title not available"}
                </h4>
                <p>Status: {app.status || "N/A"}</p>
              </div>
              {app.interviewDate && (
                <p>Interview: {new Date(app.interviewDate).toLocaleString()}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You haven't applied to any jobs yet.</p>
      )}
    </div>
  );
}
