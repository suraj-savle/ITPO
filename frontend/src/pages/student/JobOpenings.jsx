import { useEffect, useState } from 'react';
import { MapPin, DollarSign, Clock } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const JobOpenings = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/posts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error('Failed to fetch jobs');

        const data = await res.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load job openings');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (postId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/student/apply/${postId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to apply');

      setAppliedJobs(new Set([...appliedJobs, postId]));
      toast.success('Application submitted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to apply for this job');
    }
  };

  if (loading)
    return <div className="flex items-center justify-center h-64 text-gray-500">Loading...</div>;

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
          <div key={job._id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 h-full flex flex-col">
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
                <span className="truncate">{job.location || "Remote"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <DollarSign size={16} className="flex-shrink-0" />
                <span className="truncate">{job.stipend || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="flex-shrink-0" />
                <span className="truncate">{job.duration || "N/A"}</span>
              </div>
            </div>

            {/* Skills */}
            {job.requirements && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Skills / Requirements:</p>
                <div className="flex flex-wrap gap-1.5">
                  {job.requirements.split(',').slice(0, 4).map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                  {job.requirements.split(',').length > 4 && (
                    <span className="text-xs text-gray-500 px-2 py-1">
                      +{job.requirements.split(',').length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 flex-1">{job.description}</p>

            {/* Apply Button */}
            <button
              onClick={() => handleApply(job._id)}
              disabled={appliedJobs.has(job._id)}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                appliedJobs.has(job._id)
                  ? 'bg-green-100 text-green-800 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
              }`}
            >
              {appliedJobs.has(job._id) ? '✓ Applied' : 'Apply Now'}
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

      <Toaster position="top-center" />
    </div>
  );
};

export default JobOpenings;
