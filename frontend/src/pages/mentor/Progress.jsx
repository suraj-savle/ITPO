import { useState } from 'react';
import { TrendingUp, Calendar, Award, AlertCircle } from 'lucide-react';

const Progress = () => {
  const [students] = useState([
    {
      id: 1,
      name: 'John Doe',
      applications: [
        { company: 'TechCorp', status: 'interview_scheduled', date: '2024-01-25' },
        { company: 'WebSoft', status: 'rejected', date: '2024-01-15' },
        { company: 'DataFlow', status: 'under_review', date: '2024-01-20' }
      ],
      placementStatus: 'unplaced',
      totalApplications: 5,
      interviews: 2,
      offers: 0
    },
    {
      id: 2,
      name: 'Sarah Smith',
      applications: [
        { company: 'DataSoft', status: 'offer_made', date: '2024-01-22' },
        { company: 'AI Corp', status: 'interview_completed', date: '2024-01-18' }
      ],
      placementStatus: 'placed',
      totalApplications: 8,
      interviews: 4,
      offers: 1
    },
    {
      id: 3,
      name: 'Mike Johnson',
      applications: [
        { company: 'CloudTech', status: 'applied', date: '2024-01-19' },
        { company: 'StartupX', status: 'rejected', date: '2024-01-10' }
      ],
      placementStatus: 'unplaced',
      totalApplications: 3,
      interviews: 1,
      offers: 0
    }
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      applied: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Applied' },
      under_review: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Under Review' },
      interview_scheduled: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Interview Scheduled' },
      interview_completed: { bg: 'bg-indigo-100', text: 'text-indigo-800', label: 'Interview Done' },
      offer_made: { bg: 'bg-green-100', text: 'text-green-800', label: 'Offer Made' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.applied;
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPlacementBadge = (status) => {
    return status === 'placed' 
      ? <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <Award size={14} /> Placed
        </span>
      : <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <AlertCircle size={14} /> Unplaced
        </span>;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Progress Tracking</h1>
        <div className="text-sm text-gray-600">
          {students.filter(s => s.placementStatus === 'placed').length} of {students.length} students placed
        </div>
      </div>

      <div className="space-y-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <img
                  src="https://via.placeholder.com/48"
                  alt={student.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">{student.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>{student.totalApplications} Applications</span>
                    <span>{student.interviews} Interviews</span>
                    <span>{student.offers} Offers</span>
                  </div>
                </div>
              </div>
              {getPlacementBadge(student.placementStatus)}
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                Recent Applications
              </h4>
              <div className="space-y-2">
                {student.applications.map((app, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{app.company}</span>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Calendar size={14} />
                        {new Date(app.date).toLocaleDateString()}
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>
                ))}
              </div>
            </div>

            {student.placementStatus === 'unplaced' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-800 mb-2">
                  <AlertCircle size={16} />
                  <span className="font-medium">Needs Attention</span>
                </div>
                <p className="text-sm text-yellow-700">
                  Student has been applying but hasn't secured placement yet. Consider providing guidance on resume improvement or suggesting better-fit opportunities.
                </p>
                <button className="mt-2 text-sm bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700">
                  Send Guidance
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress;