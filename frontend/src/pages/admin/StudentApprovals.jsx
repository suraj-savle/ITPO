import { useState, useEffect } from 'react';
import { UserCheck, UserX, GraduationCap, Mail, Phone, BookOpen, Calendar, Award, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StudentApprovals = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentors, setSelectedMentors] = useState({});

  useEffect(() => {
    fetchPendingStudents();
    fetchMentors();
  }, []);

  const fetchPendingStudents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/pending-students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPendingStudents(data.students);
      }
    } catch (error) {
      console.error('Error fetching pending students:', error);
      toast.error('Failed to fetch pending students');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/mentors', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setMentors(data.mentors);
      }
    } catch (error) {
      console.error('Error fetching mentors:', error);
      toast.error('Failed to fetch mentors');
    }
  };

  const handleApprove = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const mentorId = selectedMentors[studentId] || '';
      const response = await fetch(`http://localhost:5000/api/admin/approve-student/${studentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mentorId })
      });
      
      if (response.ok) {
        setPendingStudents(prev => prev.filter(student => student._id !== studentId));
        toast.success('Student approved successfully');
      }
    } catch (error) {
      console.error('Error approving student:', error);
      toast.error('Failed to approve student');
    }
  };

  const handleReject = async (studentId) => {
    if (!confirm('Are you sure you want to reject this student?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/reject-student/${studentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        setPendingStudents(prev => prev.filter(student => student._id !== studentId));
        toast.success('Student rejected');
      }
    } catch (error) {
      console.error('Error rejecting student:', error);
      toast.error('Failed to reject student');
    }
  };

  const handleMentorChange = (studentId, mentorId) => {
    setSelectedMentors(prev => ({ ...prev, [studentId]: mentorId }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading student approvals...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Student Approvals
          </h1>
          <p className="text-gray-600 mt-1">Review and approve pending student registrations</p>
        </div>
        
        {pendingStudents.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No pending approvals</h3>
            <p className="text-gray-500">All student registrations have been processed</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {pendingStudents.map(student => (
              <div key={student._id} className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                      <GraduationCap size={24} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{student.name}</h3>
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail size={16} />
                        {student.email}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                    Pending Approval
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <BookOpen size={16} />
                      <span className="text-sm font-medium">Department</span>
                    </div>
                    <p className="font-semibold text-gray-800">{student.department}</p>
                  </div>
                  
                  <div className="bg-white/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar size={16} />
                      <span className="text-sm font-medium">Year</span>
                    </div>
                    <p className="font-semibold text-gray-800">{student.year}</p>
                  </div>
                  
                  <div className="bg-white/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Award size={16} />
                      <span className="text-sm font-medium">CGPA</span>
                    </div>
                    <p className="font-semibold text-gray-800">{student.cgpa}</p>
                  </div>
                  
                  <div className="bg-white/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Phone size={16} />
                      <span className="text-sm font-medium">Phone</span>
                    </div>
                    <p className="font-semibold text-gray-800">{student.phone}</p>
                  </div>
                </div>
                
                <div className="bg-white/50 rounded-xl p-4 mb-6">
                  <p className="text-sm font-medium text-gray-600 mb-1">Roll Number</p>
                  <p className="font-semibold text-gray-800">{student.rollNo}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assign Mentor (Optional)
                    </label>
                    <select 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
                      value={selectedMentors[student._id] || ''}
                      onChange={(e) => handleMentorChange(student._id, e.target.value)}
                    >
                      <option value="">No mentor assigned</option>
                      {mentors.map(mentor => (
                        <option key={mentor._id} value={mentor._id}>
                          {mentor.name} - {mentor.department}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(student._id)}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 flex items-center gap-2 transition-all duration-200 shadow-lg font-medium"
                    >
                      <UserCheck size={20} />
                      Approve
                    </button>
                    
                    <button
                      onClick={() => handleReject(student._id)}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-xl hover:from-red-600 hover:to-rose-700 flex items-center gap-2 transition-all duration-200 shadow-lg font-medium"
                    >
                      <UserX size={20} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentApprovals;
