import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Award, AlertCircle, CheckCircle, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Progress = () => {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgressData();
    const interval = setInterval(fetchProgressData, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchProgressData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const appsRes = await axios.get('http://localhost:5000/api/applications/mentor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setApplications(appsRes.data || []);
      setStudents([]);
    } catch (err) {
      console.error('Error:', err);
      setApplications([]);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const updatePlacementStatus = async (studentId, isPlaced, placementDetails = null) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/mentor/update-placement/${studentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isPlaced, placementDetails })
      });

      if (!res.ok) throw new Error('Failed to update placement status');

      const data = await res.json();
      toast.success(data.message);
      
      // Refresh data
      fetchProgressData();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update placement status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Applied' },
      shortlisted: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Shortlisted' },
      interview: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interview' },
      selected: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selected' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.applied;
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPlacementBadge = (isPlaced) => {
    return isPlaced 
      ? <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Award size={14} /> Placed
        </span>
      : <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <AlertCircle size={14} /> Unplaced
        </span>;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading progress data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Progress Tracking</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <ThumbsUp className="w-6 h-6 text-green-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-xl font-bold">{applications.filter(app => app.status === 'pending recruiter review').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <ThumbsDown className="w-6 h-6 text-red-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-xl font-bold">{applications.filter(app => app.status === 'rejected by mentor').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-yellow-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">{applications.filter(app => app.status === 'pending mentor approval').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <Award className="w-6 h-6 text-blue-600 mr-2" />
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-xl font-bold">{applications.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No students assigned for progress tracking.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {students.map((student) => (
            <div key={student._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={student.profileImage || "https://via.placeholder.com/48"}
                    alt={student.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{student.name}</h3>
                    <p className="text-gray-600 text-sm">{student.email} • {student.year}</p>
                    <p className="text-gray-500 text-sm">Roll: {student.rollNo} • CGPA: {student.cgpa}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <span>{student.totalApplications} Applications</span>
                      <span>{student.interviews} Interviews</span>
                      <span>{student.offers} Offers</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getPlacementBadge(student.isPlaced)}
                  <button
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowModal(true);
                    }}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {student.isPlaced && student.placementDetails && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <h4 className="font-medium text-green-800 mb-1">Placement Details</h4>
                  <p className="text-sm text-green-700">
                    Company: {student.placementDetails.company} | 
                    Role: {student.placementDetails.roleOffered} | 
                    Package: {student.placementDetails.package}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <TrendingUp size={18} />
                  Recent Applications
                </h4>
                {student.applications.length > 0 ? (
                  <div className="space-y-2">
                    {student.applications.map((app, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{app.company}</span>
                          <p className="text-sm text-gray-600">{app.jobTitle}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                            <Calendar size={14} />
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </div>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No applications yet</p>
                )}
              </div>

              {!student.isPlaced && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <AlertCircle size={16} />
                    <span className="font-medium">Needs Attention</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Student hasn't secured placement yet. Consider providing guidance on resume improvement or suggesting better-fit opportunities.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Update Status Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Update Placement Status</h3>
            <p className="text-sm text-gray-600 mb-4">{selectedStudent.name}</p>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md flex items-center gap-2"
              >
                <X size={16} /> Cancel
              </button>
              {!selectedStudent.isPlaced && (
                <button
                  onClick={() => updatePlacementStatus(selectedStudent._id, true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckCircle size={16} /> Mark as Placed
                </button>
              )}
              {selectedStudent.isPlaced && (
                <button
                  onClick={() => updatePlacementStatus(selectedStudent._id, false)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 flex items-center gap-2"
                >
                  <AlertCircle size={16} /> Mark as Unplaced
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;