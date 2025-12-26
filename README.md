
# ITPO - Internship and Training Placement Office

A comprehensive web application for managing internship and training placements with AI-powered job recommendations, mentor approval workflows, and modern placement management system.

## 🚀 Project Overview

ITPO is a full-stack web application designed to streamline the internship and training placement process for educational institutions. It connects students, mentors, recruiters, and administrators in a unified platform with intelligent job matching and comprehensive workflow management.

## ✨ Key Features

### 🎯 AI-Powered Job Recommendations
- **Smart Matching Algorithm**: 70% skills, 20% location, 10% academic performance
- **Personalized Recommendations**: Top Match, Good Match, Near Miss categories
- **Skill Gap Analysis**: Identifies missing skills for career development
- **Real-time Updates**: Dynamic recommendations based on profile changes

### 👥 Multi-Role System
- **Students**: Profile management, job applications, recommendation viewing
- **Mentors**: Application approval, student monitoring, progress tracking
- **Recruiters**: Job posting, application management, interview scheduling
- **Admins**: System oversight, job approval, user management

### 📋 Advanced Application Workflow
- **Three-Stage Process**: Student Apply → Mentor Approve → Recruiter Review
- **Interview Scheduling**: Comprehensive scheduling with online/offline/phone options
- **Status Tracking**: Real-time application status updates
- **Placement Management**: Automatic placement status updates

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18**: Modern functional components with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API communication
- **React Router**: Client-side routing
- **React Hot Toast**: Notification system

### Backend Stack
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Token authentication
- **Bcrypt**: Password hashing
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing

### AI/ML Components
- **Python Flask**: Recommendation service
- **Scikit-learn**: Machine learning algorithms
- **Pandas**: Data manipulation and analysis
- **NumPy**: Numerical computing

## 📁 Project Structure

```
ITPO/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   └── shared/      # Shared components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin dashboard pages
│   │   │   ├── auth/        # Authentication pages
│   │   │   ├── mentor/      # Mentor dashboard pages
│   │   │   ├── recruiter/   # Recruiter dashboard pages
│   │   │   └── student/     # Student dashboard pages
│   │   ├── services/        # API service functions
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main application component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── uploads/             # File upload storage
│   └── server.js            # Main server file
├── recommendation_service/   # Python ML service
│   ├── app.py              # Flask application
│   └── requirements.txt    # Python dependencies
└── README.md               # Project documentation
```

## 🗄️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['student', 'mentor', 'recruiter', 'admin'],
  department: String,
  year: String,
  cgpa: Number,
  skills: [String],
  isPlaced: Boolean,
  placementDetails: {
    company: String,
    roleOffered: String,
    package: String,
    placedAt: Date
  },
  assignedMentor: ObjectId,
  activityLog: [ActivitySchema]
}
```

### Job Model
```javascript
{
  title: String,
  description: String,
  rolesResponsibilities: String,
  location: String,
  skillsRequired: [String],
  stipend: String,
  recruiter: ObjectId,
  isActive: Boolean,
  status: ['draft', 'pending_approval', 'approved', 'rejected'],
  applications: [ApplicationSchema]
}
```

### Application Model
```javascript
{
  student: ObjectId,
  job: ObjectId,
  mentor: ObjectId,
  recruiter: ObjectId,
  status: ['pending mentor approval', 'rejected by mentor', 
           'pending recruiter review', 'rejected by recruiter',
           'interview scheduled', 'hired'],
  interviewDate: Date,
  interviewTime: String,
  interviewMode: ['online', 'offline', 'phone'],
  interviewLocation: String,
  interviewMeetingLink: String,
  interviewNotes: String
}
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Python (v3.8 or higher)
- Git

### Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd ITPO/backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
MONGO_URI=mongodb://localhost:27017/itpo
JWT_SECRET=your_jwt_secret_key
PORT=5000

# Start the server
npm start
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
VITE_API_URL=http://localhost:5000

# Start development server
npm run dev
```

### Recommendation Service Setup
```bash
# Navigate to recommendation service
cd ../recommendation_service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the service
python app.py
```

## 🔐 Authentication & Authorization

### Role-Based Access Control
- **JWT Authentication**: Secure token-based authentication
- **Role Middleware**: Route protection based on user roles
- **Session Management**: Automatic token refresh and logout

### Security Features
- **Password Hashing**: Bcrypt with salt rounds
- **Input Validation**: Comprehensive request validation
- **CORS Configuration**: Secure cross-origin requests
- **File Upload Security**: Type and size validation

## 🤖 AI Recommendation Engine

### Algorithm Details
```python
def calculate_job_match(student, job):
    weights = {'skills': 0.7, 'location': 0.2, 'cgpa': 0.1}
    
    # Skills matching (70% weight)
    matched_skills = intersection(student_skills, job_skills)
    skills_score = (matched_skills / total_job_skills) * 100
    
    # Location preference (20% weight)
    location_score = 100 if preferred_location_match else 50
    
    # CGPA factor (10% weight)
    cgpa_score = 100 if cgpa >= 6.0 else scaled_score
    
    return weighted_total_score
```

### Recommendation Categories
- **Top Match (80%+)**: Excellent fit with high skill overlap
- **Good Match (60-79%)**: Good fit with moderate skill match
- **Near Miss (40-59%)**: Potential fit with skill development

## 📊 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/profile     # Get user profile
PUT  /api/auth/profile     # Update user profile
```

### Job Management Endpoints
```
GET    /api/jobs                    # Get all active jobs
POST   /api/jobs                    # Create new job (recruiter)
GET    /api/jobs/recruiter          # Get recruiter's jobs
PUT    /api/jobs/:id/toggle         # Toggle job active status
DELETE /api/jobs/:id                # Delete job
```

### Application Endpoints
```
POST /api/applications/:jobId       # Apply to job
GET  /api/applications/my           # Get my applications
PUT  /api/applications/:id/mentor   # Mentor decision
PUT  /api/applications/:id/recruiter # Recruiter decision
```

### Recommendation Endpoints
```
GET /api/recommendations/jobs       # Get job recommendations
GET /api/recommendations/student/:id # Get recommendations for student
```

## 🎨 UI Components & Design System

### Color Palette
- **Primary**: Indigo (600, 700)
- **Success**: Green (600, 700)
- **Warning**: Yellow (600, 700)
- **Error**: Red (600, 700)
- **Neutral**: Gray (50, 100, 200, 600, 900)

### Component Library
- **Cards**: Clean white cards with subtle shadows
- **Buttons**: Solid colors with hover states
- **Forms**: Consistent input styling with validation
- **Modals**: Centered overlays with backdrop
- **Badges**: Status indicators with color coding

## 🔄 Workflow Processes

### Student Application Flow
1. **Browse Jobs**: View AI-recommended and all available jobs
2. **Apply**: Submit application with one click
3. **Mentor Review**: Wait for mentor approval
4. **Recruiter Review**: Application forwarded to recruiter
5. **Interview**: Schedule and attend interview
6. **Placement**: Receive hiring decision

### Recruiter Hiring Flow
1. **Post Job**: Create detailed job posting
2. **Admin Approval**: Wait for job approval
3. **Receive Applications**: View mentor-approved applications
4. **Schedule Interviews**: Set up interviews with candidates
5. **Make Decisions**: Hire or reject candidates
6. **Placement Tracking**: Monitor hired students

### Mentor Supervision Flow
1. **Review Applications**: Evaluate student applications
2. **Approve/Reject**: Make decisions with feedback
3. **Monitor Progress**: Track student application status
4. **Placement Updates**: Receive hiring notifications

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Touch-friendly interface
- Optimized navigation
- Readable typography
- Fast loading times

## 🧪 Testing Credentials

### Student Accounts
```
Email: student@itpo.com
Password: Student@123
```

### Mentor Accounts
```
CSE Mentor: csementor@itpo.com / CSEmentor@123
IT Mentor: itmentor@itop.com / ITmentor@123
Mechanical Mentor: mmentor@itpo.com / Mmentor@123
```

### Recruiter Account
```
Email: suraj@itpo.com
Password: Pass@123
```

### Admin Account
```
Email: admin@itpo.com
Password: admin123
```

## 🚀 Deployment

### Production Environment
- **Frontend**: Vercel/Netlify deployment
- **Backend**: Railway/Heroku deployment
- **Database**: MongoDB Atlas
- **File Storage**: AWS S3 or Cloudinary

### Environment Variables
```bash
# Backend
MONGO_URI=mongodb+srv://...
JWT_SECRET=production_secret
NODE_ENV=production
PORT=5000

# Frontend
VITE_API_URL=https://api.yourdomain.com
VITE_ENV=production
```

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker implementation

### Backend Optimizations
- **Database Indexing**: Optimized query performance
- **Response Compression**: Gzip compression
- **Rate Limiting**: API request throttling
- **Caching**: Redis for session storage

## 🔒 Security Measures

### Data Protection
- **Input Sanitization**: XSS prevention
- **SQL Injection Prevention**: Parameterized queries
- **File Upload Security**: Type and size validation
- **HTTPS Enforcement**: SSL/TLS encryption

### Authentication Security
- **JWT Expiration**: Short-lived tokens
- **Password Policies**: Strong password requirements
- **Account Lockout**: Brute force protection
- **Session Management**: Secure session handling

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**: Check frontend/backend URL configuration
2. **Database Connection**: Verify MongoDB connection string
3. **File Upload Issues**: Check multer configuration and file permissions
4. **Authentication Failures**: Verify JWT secret and token expiration

### Debug Mode
```bash
# Backend debugging
DEBUG=* npm start

# Frontend debugging
npm run dev -- --debug
```

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: Follow ESLint and Prettier configurations
2. **Commit Messages**: Use conventional commit format
3. **Branch Naming**: feature/description or fix/description
4. **Pull Requests**: Include description and testing notes

### Code Review Process
1. Create feature branch
2. Implement changes with tests
3. Submit pull request
4. Code review and approval
5. Merge to main branch

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team & Support

### Development Team
- **Full Stack Development**: Complete MERN stack implementation
- **AI/ML Integration**: Python-based recommendation engine
- **UI/UX Design**: Modern, responsive interface design
- **Database Design**: Optimized MongoDB schema

### Support & Contact
- **Documentation**: Comprehensive inline documentation
- **Issue Tracking**: GitHub Issues for bug reports
- **Feature Requests**: GitHub Discussions for enhancements
- **Community**: Discord/Slack for real-time support

---

## 🎯 Future Roadmap

### Phase 1 (Current)
- ✅ Core functionality implementation
- ✅ AI-powered job recommendations
- ✅ Multi-role authentication system
- ✅ Modern UI/UX design

### Phase 2 (Upcoming)
- 📧 Email notification system
- 📊 Advanced analytics dashboard
- 💬 In-app messaging system
- 📱 Mobile application

### Phase 3 (Future)
- 🤖 Advanced AI features
- 🔗 Third-party integrations
- 📈 Performance optimization
- 🌐 Multi-language support

---
