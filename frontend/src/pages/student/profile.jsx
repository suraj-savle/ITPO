// src/pages/Profile.jsx
import { useEffect, useState } from "react";

export default function Profile() {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-indigo-600 font-semibold text-xl">
        Loading profile...
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 font-semibold text-xl">
        No profile data available
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Student Profile
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Name:</span>
            <span className="text-gray-900">{student.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span className="text-gray-900">{student.email}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Roll No:</span>
            <span className="text-gray-900">{student.rollNo || "Not Provided"}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Created At:</span>
            <span className="text-gray-900">
              {new Date(student.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="mt-8 w-full bg-indigo-600 hover:bg-purple-600 text-white py-2 rounded-lg font-semibold transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
