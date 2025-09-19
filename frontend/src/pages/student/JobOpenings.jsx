import { useState } from 'react';
import { MapPin, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const JobOpenings = () => {
  const [jobs] = useState([
    {
      id: 1,
      company: 'TechCorp',
      logo: 'https://via.placeholder.com/60',
      title: 'Software Development Intern',
      skills: ['React', 'Node.js', 'JavaScript'],
      stipend: '$800-1200',
      location: 'Remote',
      type: 'Internship',
      duration: '3 months',
      description: 'Work on cutting-edge web applications...'
    },
    {
      id: 2,
      company: 'DataSoft',
      logo: 'https://via.placeholder.com/60',
      title: 'Data Science Intern',
      skills: ['Python', 'SQL', 'Machine Learning'],
      stipend: '$1000-1500',
      location: 'New York, NY',
      type: 'Internship',
      duration: '6 months',
      description: 'Analyze large datasets and build ML models...'
    },
    {
      id: 3,
      company: 'CloudTech',
      logo: 'https://via.placeholder.com/60',
      title: 'DevOps Trainee',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      stipend: '$900-1300',
      location: 'San Francisco, CA',
      type: 'Training',
      duration: '4 months',
      description: 'Learn cloud infrastructure and deployment...'
    }
  ]);

  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const handleApply = (jobId) => {
    setAppliedJobs(new Set([...appliedJobs, jobId]));
    toast.success('Application submitted successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Job Openings</h1>
        <div className="text-sm text-gray-600">
          {jobs.length} opportunities available
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
            {/* Company Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                {job.company.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.company}</p>
              </div>
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium">
                {job.type}
              </span>
            </div>

            {/* Job Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign size={16} className="flex-shrink-0" />
                <span className="truncate">{job.stipend}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="flex-shrink-0" />
                <span className="truncate">{job.duration}</span>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="text-xs text-gray-500 px-2 py-1">
                    +{job.skills.length - 4} more
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 flex-1">
              {job.description}
            </p>

            {/* Apply Button */}
            <button
              onClick={() => handleApply(job.id)}
              disabled={appliedJobs.has(job.id)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                appliedJobs.has(job.id)
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {appliedJobs.has(job.id) ? '✓ Applied' : 'Apply Now'}
            </button>
          </div>
        ))}
      </div>

      {jobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">💼</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No job openings available</h3>
          <p className="text-gray-600">Check back later for new opportunities!</p>
        </div>
      )}
    </div>
  );
};

export default JobOpenings;