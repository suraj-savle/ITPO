import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
        const res = await fetch(`http://localhost:5000/api/recruiter/student/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  if (loading) return <div className="flex items-center justify-center h-64">Loading...</div>;
  if (!student) return <div className="flex items-center justify-center h-64">Student not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={student.profileImage || "/default-profile.png"}
            alt={student.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <h1 className="text-2xl font-bold">{student.name}</h1>
            <p className="text-gray-500">{student.department} • {student.year}</p>
            <p className="mt-2 text-gray-700">{student.description}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-3">Projects</h2>
          {student.projects.length ? (
            student.projects.map((p, idx) => (
              <div key={idx} className="mb-3">
                <h3 className="font-medium">{p.title}</h3>
                <p className="text-gray-600 text-sm">{p.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects added</p>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-3">Social Links</h2>
          {Object.entries(student.socialLinks).map(([platform, url]) => (
            url && (
              <p key={platform} className="text-gray-700 mb-1">
                <span className="font-medium capitalize">{platform}:</span>{" "}
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{url}</a>
              </p>
            )
          ))}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 md:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Experience</h2>
          {student.experiences.length ? (
            student.experiences.map((exp, idx) => (
              <div key={idx} className="mb-3 border-l-2 border-blue-500 pl-3">
                <h3 className="font-medium">{exp.role} @ {exp.company}</h3>
                <p className="text-gray-600 text-sm">{new Date(exp.startDate).toLocaleDateString()} - {exp.currentlyWorking ? "Present" : new Date(exp.endDate).toLocaleDateString()}</p>
                <p className="text-gray-700">{exp.description}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No experience added</p>
          )}
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default RecruiterStudentProfile;
