import { useState } from 'react';
import { Eye, MessageCircle, TrendingUp } from 'lucide-react';

const Mentees = () => {
  const [mentees] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@university.edu',
      department: 'Computer Science',
      year: '3rd Year',
      applications: 5,
      interviews: 2,
      status: 'Active',
      lastActivity: '2024-01-20',
      placementStatus: 'Unplaced'
    },
    {
      id: 2,
      name: 'Sarah Smith',
      email: 'sarah.smith@university.edu',
      department: 'Computer Science',
      year: '4th Year',
      applications: 8,
      interviews: 4,
      status: 'Active',
      lastActivity: '2024-01-19',
      placementStatus: 'Placed'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@university.edu',
      department: 'Computer Science',
      year: '3rd Year',
      applications: 3,
      interviews: 1,
      status: 'Active',
      lastActivity: '2024-01-18',
      placementStatus: 'Unplaced'
    }
  ]);

  const getStatusBadge = (status) => {
    return status === 'Placed' 
      ? <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Placed</span>
      : <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Unplaced</span>;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Mentees</h1>
        <div className="text-sm text-gray-600">
          {mentees.length} students assigned
        </div>
      </div>

      <div className="grid gap-6">
        {mentees.map((mentee) => (
          <div key={mentee.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/48"
                  alt={mentee.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">{mentee.name}</h3>
                  <p className="text-gray-600 text-sm">{mentee.email}</p>
                  <p className="text-gray-500 text-sm">{mentee.department} • {mentee.year}</p>
                </div>
              </div>
              {getStatusBadge(mentee.placementStatus)}
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{mentee.applications}</div>
                <div className="text-sm text-gray-600">Applications</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{mentee.interviews}</div>
                <div className="text-sm text-gray-600">Interviews</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-purple-600">Last Activity</div>
                <div className="text-sm text-gray-600">{new Date(mentee.lastActivity).toLocaleDateString()}</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-gray-600">Status</div>
                <div className="text-sm text-gray-800">{mentee.status}</div>
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
    </div>
  );
};

export default Mentees;