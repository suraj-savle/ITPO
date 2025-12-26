
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

##  Installation & Setup

### Clone the Repository

```bash
git clone https://github.com/suraj-savle/ITPO.git
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```bash
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

### Important: Seed Admin Account (First Time Setup)

Before starting the backend server for the first time, you must create an admin user.

### Open the file: backend/scripts/seedAdmin.js
Update the admin credentials inside the file:

### Run the seed script from the backend/scripts folder:

```bash
node seedAdmin.js
```

This will create the admin account in the database.

### Start the backend server:

```bash
npm start
```

### Frontend Setup

```bash
cd ../frontend
npm install
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
