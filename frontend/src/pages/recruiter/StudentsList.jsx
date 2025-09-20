import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchStudents = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/recruiter/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();

      // Instead of filtering by role, just set all returned users
      setStudents(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  fetchStudents();
}, [navigate]);


  if (loading)
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;

  if (!students.length)
    return <div className="text-center text-gray-500 mt-20">No student profiles available</div>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Students</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {students.map((student) => (
          <div
            key={student._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300"
          >
            {/* Profile Header */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={student.profileImage || "/default-profile.png"}
                alt={student.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{student.name}</h2>
                <p className="text-gray-500 text-sm">
                  {student.department} • {student.year}
                </p>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-600 mb-1">Skills:</h3>
              <p className="text-gray-700 text-sm">
                {student.skills.length ? student.skills.join(", ") : "N/A"}
              </p>
            </div>

            {/* CGPA */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-600 mb-1">CGPA:</h3>
              <p className="text-gray-700 text-sm">{student.cgpa}/10</p>
            </div>

            {/* View More Button */}
            <Link
              to={`/recruiter/student/${student._id}`}
              className="mt-auto inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-center transition-all duration-300"
            >
              View More
            </Link>
          </div>
        ))}
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default StudentsList;
