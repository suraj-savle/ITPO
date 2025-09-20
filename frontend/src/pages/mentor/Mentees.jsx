import { useState, useEffect } from 'react';
import { Eye, MessageCircle, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Mentees = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMentees = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/mentor/mentees', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch mentees');
        }

        const data = await res.json();
        setMentees(data.mentees || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load mentees');
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, [navigate]);

  const getStatusBadge = (isPlaced) => {
    return isPlaced 
      ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Placed</span>
      : <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Unplaced</span>;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading mentees...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Mentees</h1>
        <div className="text-sm text-gray-600">
          {mentees.length} students assigned
        </div>
      </div>

      {mentees.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No mentees assigned yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {mentees.map((mentee) => (
            <div key={mentee._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={mentee.profileImage || "https://via.placeholder.com/48"}
                    alt={mentee.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{mentee.name}</h3>
                    <p className="text-gray-600 text-sm">{mentee.email}</p>
                    <p className="text-gray-500 text-sm">{mentee.department} • {mentee.year}</p>
                    <p className="text-gray-500 text-sm">Roll No: {mentee.rollNo}</p>
                  </div>
                </div>
                {getStatusBadge(mentee.isPlaced)}
              </div>

              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{mentee.appliedJobs?.length || 0}</div>
                  <div className="text-sm text-gray-600">Applications</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{mentee.cgpa || 0}</div>
                  <div className="text-sm text-gray-600">CGPA</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-purple-600">Skills</div>
                  <div className="text-sm text-gray-600">{mentee.skills?.length || 0} skills</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Status</div>
                  <div className="text-sm text-gray-800 capitalize">{mentee.status}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  <Eye size={16} />
                  View Details
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
                  <MessageCircle size={16} />
                  Send Message
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
                  <TrendingUp size={16} />
                  Track Progress
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Mentees;