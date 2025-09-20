import { useState, useEffect } from "react";
import axios from "axios";

export default function MentorDashboard() {
  const [apps, setApps] = useState([]);
  const token = localStorage.getItem("token");

  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/mentor-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  const handleApproval = async (jobId, studentId, action) => {
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${jobId}/mentor/${studentId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Mentor Applications</h2>
      {apps.map(app => (
        <div key={app._id}>
          <h4>{app.job.title}</h4>
          <p>Student: {app.student.name}</p>
          <p>Status: {app.status}</p>
          <button onClick={() => handleApproval(app.job._id, app.student._id, "approve")}>Approve</button>
          <button onClick={() => handleApproval(app.job._id, app.student._id, "reject")}>Reject</button>
        </div>
      ))}
    </div>
  );
}
