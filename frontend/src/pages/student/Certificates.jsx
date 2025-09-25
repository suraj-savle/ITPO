import { Award, Download, Calendar, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const Certificates = () => {
  const certificates = [
    {
      id: 1,
      title: 'Full Stack Development',
      company: 'TechCorp Solutions',
      completionDate: '2024-01-15',
      duration: '6 months',
      rating: 4.9,
      skills: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Data Science & Analytics',
      company: 'DataVision Labs',
      completionDate: '2023-12-20',
      duration: '4 months',
      rating: 4.8,
      skills: ['Python', 'Machine Learning', 'SQL']
    }
  ];

  const handleDownload = (title) => {
    toast.success(`Downloading ${title} certificate`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Certificates</h1>
        <p className="text-sm text-gray-500 mt-1">{certificates.length} certificates earned</p>
      </div>

      <div className="grid gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{cert.title}</h3>
                  <p className="text-sm text-gray-500">{cert.company}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(cert.completionDate).toLocaleDateString()}
                    </div>
                    <span>{cert.duration}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-700">{cert.rating}</span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleDownload(cert.title)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download Certificate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Certificates;