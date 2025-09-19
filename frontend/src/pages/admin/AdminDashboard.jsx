import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total Students</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalStudents || 0}</p>
        </div>
        
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Placed Students</h3>
          <p className="text-3xl font-bold text-green-600">{stats.placedStudents || 0}</p>
        </div>
        
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-800">Total Mentors</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.totalMentors || 0}</p>
        </div>
        
        <div className="bg-purple-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-800">Pending Approvals</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.pendingApprovals || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Placement Statistics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Placed:</span>
              <span className="font-semibold text-green-600">{stats.placedStudents || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Unplaced:</span>
              <span className="font-semibold text-red-600">{stats.unplacedStudents || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Placement Rate:</span>
              <span className="font-semibold">
                {stats.totalStudents ? Math.round((stats.placedStudents / stats.totalStudents) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">System Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Mentors:</span>
              <span className="font-semibold">{stats.totalMentors || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Recruiters:</span>
              <span className="font-semibold">{stats.totalRecruiters || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending Approvals:</span>
              <span className="font-semibold text-orange-600">{stats.pendingApprovals || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;