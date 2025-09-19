import { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    phone: '+1234567890',
    department: 'Computer Science',
    year: '3rd Year',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    coverLetter: 'I am a passionate computer science student...'
  });

  const [newSkill, setNewSkill] = useState('');
  const [resume, setResume] = useState(null);

  const availableSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'MongoDB', 'SQL', 'Git', 'Docker', 'AWS'];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = (skill) => {
    if (!formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      toast.success('Resume uploaded successfully');
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleSave = () => {
    toast.success('Profile updated successfully');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Management</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                </select>
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Resume</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload your resume (PDF only)</p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-700"
              >
                Choose File
              </label>
              {resume && (
                <p className="text-sm text-green-600 mt-2">✓ {resume.name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSkills
              .filter(skill => !formData.skills.includes(skill))
              .map((skill) => (
                <button
                  key={skill}
                  onClick={() => addSkill(skill)}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                >
                  + {skill}
                </button>
              ))}
          </div>
        </div>

        {/* Cover Letter */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Cover Letter</h2>
          <textarea
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            rows={6}
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Write your cover letter here..."
          />
        </div>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Save size={18} />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;