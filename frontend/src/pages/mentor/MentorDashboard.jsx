import { useState, useEffect } from "react";
import axios from "axios";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";

export default function MentorDashboard() {
  const [apps, setApps] = useState([]);
  const [mentees, setMentees] = useState([]);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const [appsRes, menteesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/applications/mentor", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/mentor/mentees", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setApps(appsRes.data);
      setMentees(menteesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const pendingCount = apps.filter(
    (app) => app.status === "pending mentor approval"
  ).length;

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100  mx-auto p-4 ">
      <h1 className="text-3xl font-bold mb-8">Mentor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">My Mentees</p>
              <p className="text-2xl font-bold">{mentees.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold">{apps.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
