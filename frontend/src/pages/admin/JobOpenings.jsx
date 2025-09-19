import { useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const JobOpenings = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Software Development Intern',
      company: 'TechCorp',
      location: 'Remote',
      stipend: '$800-1200',
      skills: ['React', 'Node.js'],
      status: 'Active',
      applications: 25,
      postedDate: '2024-01-20'
    },
    {
      id: 2,
      title: 'Data Science Intern',
      company: 'DataSoft',
      location: 'New York, NY',
      stipend: '$1000-1500',
      skills: ['Python', 'ML'],
      status: 'Active',
      applications: 42,
      postedDate: '2024-01-19'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    stipend: '',
    skills: '',
    description: ''
  });

  const handleAdd = () => {
    setEditingJob(null);
    setFormData({ title: '', company: '', location: '', stipend: '', skills: '', description: '' });
    setShowModal(true);
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      stipend: job.stipend,
      skills: job.skills.join(', '),
      description: job.description || ''
    });
    setShowModal(true);
  };

  const handleDelete = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
    toast.success('Job deleted successfully');
  };

  const handleSave = () => {
    const jobData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()),
      status: 'Active',
      applications: 0,
      postedDate: new Date().toISOString().split('T')[0]
    };

    if (editingJob) {
      setJobs(jobs.map(job => job.id === editingJob.id ? { ...job, ...jobData } : job));
      toast.success('Job updated successfully');
    } else {
      setJobs([...jobs, { id: Date.now(), ...jobData }]);
      toast.success('Job added successfully');
    }
    
    setShowModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Job Openings Management</h1>
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Job
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stipend</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applications</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                      <div className="text-sm text-gray-500">
                        Posted: {new Date(job.postedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.company}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.stipend}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{job.applications}</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleEdit(job)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(job.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingJob ? 'Edit Job' : 'Add New Job'}
            </h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-3 border rounded-md"
              />
              <input
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full p-3 border rounded-md"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border rounded-md"
              />
              <input
                type="text"
                placeholder="Stipend Range"
                value={formData.stipend}
                onChange={(e) => setFormData({...formData, stipend: e.target.value})}
                className="w-full p-3 border rounded-md"
              />
              <input
                type="text"
                placeholder="Required Skills (comma separated)"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                className="w-full p-3 border rounded-md"
              />
              <textarea
                placeholder="Job Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border rounded-md"
                rows={4}
              />
            </div>
            
            <div className="flex gap-2 justify-end mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {editingJob ? 'Update' : 'Add'} Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobOpenings;