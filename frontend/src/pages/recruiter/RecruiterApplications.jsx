import { useState, useEffect } from "react";
import axios from "axios";

export default function RecruiterApplications() {
  const [apps, setApps] = useState([]);
  const [interviewDate, setInterviewDate] = useState({});
  const token = localStorage.getItem("token");

  // Fetch mentor-approved applications
  const fetchApplications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/jobs/recruiter-applications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  // Schedule interview
  const scheduleInterview = async (jobId, studentId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/jobs/${jobId}/recruiter/${studentId}/schedule`,
        { interviewDate: interviewDate[studentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Recruiter Applications (Mentor Approved)</h2>
      {apps.map(app => (
        <div key={app._id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px" }}>
          <h4>{app.job.title}</h4>
          <p>Student: {app.student.name}</p>
          <p>Status: {app.status}</p>

          {app.status === "Approved by Mentor" ? (
            <div>
              <input
                type="datetime-local"
                value={interviewDate[app.student._id] || ""}
                onChange={(e) =>
                  setInterviewDate({ ...interviewDate, [app.student._id]: e.target.value })
                }
              />
              <button onClick={() => scheduleInterview(app.job._id, app.student._id)}>
                Schedule Interview
              </button>
            </div>
          ) : (
            <p>Interview Date: {app.interviewDate}</p>
          )}
        </div>
      ))}
    </div>
  );
}
