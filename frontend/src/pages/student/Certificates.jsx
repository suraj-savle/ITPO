import { useState } from 'react';
import { Download, Award, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const Certificates = () => {
  const [certificates] = useState([
    {
      id: 1,
      title: 'Software Development Internship',
      company: 'TechCorp',
      completionDate: '2023-12-15',
      duration: '3 months',
      mentorFeedback: 'Excellent performance in React development',
      rating: 4.8,
      status: 'completed'
    },
    {
      id: 2,
      title: 'Data Science Training',
      company: 'DataSoft',
      completionDate: '2023-11-30',
      duration: '6 months',
      mentorFeedback: 'Outstanding work on machine learning projects',
      rating: 4.9,
      status: 'completed'
    },
    {
      id: 3,
      title: 'DevOps Training Program',
      company: 'CloudTech',
      completionDate: null,
      duration: '4 months',
      mentorFeedback: null,
      rating: null,
      status: 'in_progress'
    }
  ]);

  const handleDownload = (certificateId, title) => {
    // Simulate PDF download
    toast.success(`Downloading certificate for ${title}`);
  };

  const getRatingStars = (rating) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ⭐
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  const completedCertificates = certificates.filter(cert => cert.status === 'completed');
  const inProgressCertificates = certificates.filter(cert => cert.status === 'in_progress');

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold">Certificates</h1>
        <div className="text-sm text-gray-600">
          {completedCertificates.length} completed, {inProgressCertificates.length} in progress
        </div>
      </div>

      {/* Completed Certificates */}
      {completedCertificates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="text-green-600" size={20} />
            Completed Certificates
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {completedCertificates.map((certificate) => (
              <div key={certificate.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {certificate.title}
                    </h3>
                    <p className="text-gray-600">{certificate.company}</p>
                  </div>
                  <Award className="text-green-600" size={24} />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    Completed: {new Date(certificate.completionDate).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Duration: {certificate.duration}
                  </div>
                  {certificate.rating && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Mentor Rating:</p>
                      {getRatingStars(certificate.rating)}
                    </div>
                  )}
                </div>

                {certificate.mentorFeedback && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Mentor Feedback:</p>
                    <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                      "{certificate.mentorFeedback}"
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleDownload(certificate.id, certificate.title)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Download size={18} />
                  Download Certificate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In Progress */}
      {inProgressCertificates.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            In Progress
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {inProgressCertificates.map((certificate) => (
              <div key={certificate.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {certificate.title}
                    </h3>
                    <p className="text-gray-600">{certificate.company}</p>
                  </div>
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="text-sm text-gray-600">
                    Duration: {certificate.duration}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    Training in progress...
                  </div>
                </div>

                <div className="bg-blue-50 text-blue-700 py-2 px-4 rounded-md text-center text-sm">
                  Certificate will be available upon completion
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {certificates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
          <p className="text-gray-600">Complete internships and training programs to earn certificates!</p>
        </div>
      )}
    </div>
  );
};

export default Certificates;
