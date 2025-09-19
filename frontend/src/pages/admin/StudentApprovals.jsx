import { useState, useEffect } from 'react';

const StudentApprovals = () => {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

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
    }
  };

  const handleApprove = async (studentId, mentorId) => {
    try {
      const token = localStorage.getItem('token');
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
        alert('Student approved successfully');
      }
    } catch (error) {
      console.error('Error approving student:', error);
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
        alert('Student rejected');
      }
    } catch (error) {
      console.error('Error rejecting student:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Student Approvals</h1>
      
      {pendingStudents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No pending student approvals</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {pendingStudents.map(student => (
            <div key={student._id} className="bg-white p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{student.name}</h3>
                  <p className="text-gray-600">{student.email}</p>
                  <p className="text-sm text-gray-500">Roll No: {student.rollNo}</p>
                </div>
                <div>
                  <p><strong>Department:</strong> {student.department}</p>
                  <p><strong>Year:</strong> {student.year}</p>
                  <p><strong>CGPA:</strong> {student.cgpa}</p>
                  <p><strong>Phone:</strong> {student.phone}</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-center">
                <select 
                  className="border rounded px-3 py-2"
                  id={`mentor-${student._id}`}
                >
                  <option value="">Select Mentor (Optional)</option>
                  {mentors.map(mentor => (
                    <option key={mentor._id} value={mentor._id}>
                      {mentor.name} - {mentor.department}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => {
                    const mentorId = document.getElementById(`mentor-${student._id}`).value;
                    handleApprove(student._id, mentorId);
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                
                <button
                  onClick={() => handleReject(student._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentApprovals;