import { useState, useEffect } from "react";
import {
  Eye,
  User,
  GraduationCap,
  Award,
  TrendingUp,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  makeAuthenticatedRequest,
  isTokenValid,
  handleAuthError,
} from "../../utils/auth";

const Mentees = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMentees();
    const interval = setInterval(fetchMentees, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchMentees = async () => {
    if (!isTokenValid()) {
      handleAuthError(navigate);
      return;
    }

    try {
      const res = await makeAuthenticatedRequest(
        "http://localhost:5000/api/mentor/mentees",
        {},
        navigate
      );
      const data = await res.json();
      setMentees(data.mentees || []);
    } catch (err) {
      if (!err.message.includes("Authentication")) {
        console.error(err);
        toast.error("Failed to load mentees");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center gap-2 text-gray-500">
          <User className="w-5 h-5 animate-pulse" />
          Loading mentees...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100  mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Mentees</h1>
          <p className="text-sm text-gray-500 mt-1">
            {mentees.length} students assigned • Updates every 10 seconds
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Live
        </div>
      </div>

      {mentees.length === 0 ? (
        <div className="text-center py-16">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No mentees assigned yet
          </h3>
          <p className="text-gray-500">
            Students will appear here once assigned by admin
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mentees.map((mentee) => (
            <div
              key={mentee._id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      mentee.profileImage ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${mentee.name}`
                    }
                    alt={mentee.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {mentee.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {mentee.rollNo}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    mentee.isPlaced
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {mentee.isPlaced ? "Placed" : "Active"}
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span className="truncate">{mentee.department}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="w-4 h-4" />
                  <span>CGPA: {mentee.cgpa || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4" />
                  <span>{mentee.year}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-indigo-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-indigo-600">
                    {mentee.appliedJobs?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600">Applications</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {mentee.skills?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600">Skills</div>
                </div>
              </div>

              {/* Placement Details */}
              {mentee.isPlaced && mentee.placementDetails ? (
  // ✅ Placed
  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
    <div className="text-xs font-medium text-green-800 mb-1">
      Placement Details
    </div>
    <div className="text-xs text-green-700">
      <div className="truncate">
        {mentee.placementDetails.company}
      </div>
      <div className="truncate">
        {mentee.placementDetails.roleOffered}
      </div>
    </div>
  </div>
) : (
  // ❌ Not Placed
  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
    <div className="text-xs font-medium text-red-800 mb-1">
      Placement Status
    </div>
    <div className="text-xs text-red-700">
      Not Placed
    </div>
  </div>
)}


              {/* Action */}
              <button
                onClick={() => navigate(`/mentor/student/${mentee._id}`)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                <Eye size={16} />
                View Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentees;
