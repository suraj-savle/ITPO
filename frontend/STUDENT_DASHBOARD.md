# Student Dashboard

A minimal React.js + TailwindCSS student dashboard for Campus Connect.

## Features

### 🏠 Dashboard Layout
- Responsive header with logo, notifications, and user profile
- Collapsible sidebar navigation
- Mobile-friendly design

### 👤 Profile Management
- Edit personal information (name, email, phone, department, year)
- Upload resume (PDF only)
- Manage skills with tag system
- Write and edit cover letter

### 💼 Job Openings
- Browse available internships and training opportunities
- View job details (company, role, skills, stipend, location)
- One-click apply functionality
- Applied status tracking

### 📋 My Applications
- Track application status with color-coded badges
- View interview dates when scheduled
- Withdraw applications before deadline
- Tabular view with sorting

### 🏆 Certificates
- View completed training certificates
- Download PDF certificates
- See mentor feedback and ratings
- Track in-progress programs

## Routes

- `/student` - Profile management (default)
- `/student/jobs` - Job openings
- `/student/applications` - Application tracking
- `/student/certificates` - Certificate downloads

## Components

- `DashboardLayout.jsx` - Main layout with header and sidebar
- `Profile.jsx` - Profile management form
- `JobOpenings.jsx` - Job listings with apply functionality
- `Applications.jsx` - Application status tracking
- `Certificates.jsx` - Certificate management

## Usage

Navigate to `/student` after login to access the dashboard.

## Dependencies

- React Router DOM for navigation
- Lucide React for icons
- React Hot Toast for notifications
- TailwindCSS for styling