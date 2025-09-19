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
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Openings</h1>
        <div className="text-sm text-gray-600">
          {jobs.length} opportunities available
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            {/* Company Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={job.logo}
                alt={job.company}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <p className="text-gray-600 text-sm">{job.company}</p>
              </div>
            </div>

            {/* Job Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                {job.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign size={16} />
                {job.stipend}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                {job.duration} • {job.type}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Required Skills:</p>
              <div className="flex flex-wrap gap-1">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {job.description}
            </p>

            {/* Apply Button */}
            <button
              onClick={() => handleApply(job.id)}
              disabled={appliedJobs.has(job.id)}
              className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                appliedJobs.has(job.id)
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
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