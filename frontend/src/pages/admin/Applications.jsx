import { useState } from 'react';
import { Filter, Eye, Download } from 'lucide-react';

const Applications = () => {
  const [applications] = useState([
    {
      id: 1,
      studentName: 'John Doe',
      email: 'john.doe@university.edu',
      department: 'Computer Science',
      year: '3rd Year',
      jobTitle: 'Software Development Intern',
      company: 'TechCorp',
      skills: ['React', 'Node.js', 'JavaScript'],
      status: 'Applied',
      appliedDate: '2024-01-20',
      cgpa: 8.5
    },
    {
      id: 2,
      studentName: 'Sarah Smith',
      email: 'sarah.smith@university.edu',
      department: 'Computer Science',
      year: '4th Year',
      jobTitle: 'Data Science Intern',
      company: 'DataSoft',
      skills: ['Python', 'ML', 'Data Science'],
      status: 'Interview Scheduled',
      appliedDate: '2024-01-19',
      cgpa: 9.1
    },
    {
      id: 3,
      studentName: 'Mike Johnson',
      email: 'mike.johnson@university.edu',
      department: 'Electronics',
      year: '3rd Year',
      jobTitle: 'DevOps Trainee',
      company: 'CloudTech',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      status: 'Shortlisted',
      appliedDate: '2024-01-18',
      cgpa: 7.8
    }
  ]);

  const [filters, setFilters] = useState({
    department: '',
    status: '',
    company: ''
  });

  const filteredApplications = applications.filter(app => {
    return (
      (filters.department === '' || app.department === filters.department) &&
      (filters.status === '' || app.status === filters.status) &&
      (filters.company === '' || app.company === filters.company)
    );
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Applied': { bg: 'bg-blue-100', text: 'text-blue-800' },
      'Interview Scheduled': { bg: 'bg-purple-100', text: 'text-purple-800' },
      'Shortlisted': { bg: 'bg-green-100', text: 'text-green-800' },
      'Rejected': { bg: 'bg-red-100', text: 'text-red-800' }
    };

    const config = statusConfig[status] || statusConfig['Applied'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {status}
      </span>
    );
  };

  const groupedByJob = applications.reduce((acc, app) => {
    const key = `${app.company} - ${app.jobTitle}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(app);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Student Applications</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          <Download size={18} />
          Export Data
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid md:grid-cols-4 gap-4">
          <select
            value={filters.department}
            onChange={(e) => setFilters({...filters, department: e.target.value})}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Electronics">Electronics</option>
            <option value="Mechanical">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
          
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
          
          <select
            value={filters.company}
            onChange={(e) => setFilters({...filters, company: e.target.value})}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Companies</option>
            <option value="TechCorp">TechCorp</option>
            <option value="DataSoft">DataSoft</option>
            <option value="CloudTech">CloudTech</option>
          </select>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
            <Filter size={18} />
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Applications by Job */}
      <div className="space-y-6">
        {Object.entries(groupedByJob).map(([jobKey, jobApplications]) => (
          <div key={jobKey} className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b bg-gray-50">
              <h3 className="text-lg font-semibold">{jobKey}</h3>
              <p className="text-sm text-gray-600">{jobApplications.length} applications</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CGPA</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skills</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobApplications.filter(app => 
                    (filters.department === '' || app.department === filters.department) &&
                    (filters.status === '' || app.status === filters.status)
                  ).map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.studentName}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{app.department}</div>
                        <div className="text-sm text-gray-500">{app.year}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${
                          app.cgpa >= 8.5 ? 'text-green-600' :
                          app.cgpa >= 7.5 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {app.cgpa}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {app.skills.slice(0, 2).map((skill) => (
                            <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                          {app.skills.length > 2 && (
                            <span className="text-xs text-gray-500">+{app.skills.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(app.status)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default Applications;