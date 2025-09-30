import Job from '../models/JobModel.js';
import User from '../models/UserModel.js';

export const getJobRecommendations = async (req, res) => {
  try {
    console.log('=== Job Recommendations API Called ===');
    console.log('Request headers:', req.headers.authorization);
    console.log('User from token:', req.user);
    
    const studentId = req.user._id;
    console.log('Getting recommendations for student:', studentId);
    
    // Get student profile
    const student = await User.findById(studentId).select(
      'skills department specialization preferredLocations remotePref cgpa'
    );
    
    console.log('Student profile:', student);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get active approved jobs
    const jobs = await Job.find({ 
      isActive: true, 
      status: 'approved'
    }).populate('recruiter', 'company name');
    
    console.log('Found jobs:', jobs.length);

    // Generate recommendations using built-in logic
    const recommendations = jobs.map(job => {
      const studentSkills = (student.skills || []).map(s => s.toLowerCase());
      const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase());
      const matchedSkills = studentSkills.filter(s => jobSkills.includes(s));
      const missingSkills = jobSkills.filter(s => !studentSkills.includes(s));
      const skillsScore = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 70 : 35;
      const locationScore = student.preferredLocations?.includes(job.location) ? 20 : 10;
      const cgpaScore = student.cgpa >= 6.0 ? 10 : 5;
      const matchScore = skillsScore + locationScore + cgpaScore;
      
      return {
        job_id: job._id,
        job_title: job.title,
        company: job.recruiter?.company || 'Company Name',
        location: job.location,
        match_score: Math.round(matchScore * 10) / 10,
        matched_skills: matchedSkills,
        missing_skills: missingSkills,
        category: matchScore >= 80 ? 'Top Match' : matchScore >= 60 ? 'Good Match' : matchScore >= 40 ? 'Near Miss' : 'Not Suitable',
        job_details: {
          description: job.description,
          duration: job.duration,
          stipend: job.stipend,
          type: job.type
        }
      };
    }).filter(rec => rec.match_score >= 40).sort((a, b) => b.match_score - a.match_score);
    
    console.log('Generated recommendations:', recommendations.length);

    res.json({
      student_profile: {
        skills: student.skills,
        department: student.department,
        specialization: student.specialization,
        cgpa: student.cgpa
      },
      total_jobs_analyzed: jobs.length,
      recommendations: recommendations,
      summary: {
        top_matches: recommendations.filter(r => r.category === 'Top Match').length,
        good_matches: recommendations.filter(r => r.category === 'Good Match').length,
        near_misses: recommendations.filter(r => r.category === 'Near Miss').length
      }
    });
  } catch (error) {
    console.error('Job recommendation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getJobRecommendationsForStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Get student profile
    const student = await User.findById(studentId).select(
      'skills department specialization preferredLocations remotePref cgpa name'
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Get active approved jobs
    const jobs = await Job.find({ 
      isActive: true, 
      status: 'approved'
    }).populate('recruiter', 'company name');

    // Generate recommendations using built-in logic
    const recommendations = jobs.map(job => {
      const studentSkills = (student.skills || []).map(s => s.toLowerCase());
      const jobSkills = (job.skillsRequired || []).map(s => s.toLowerCase());
      const matchedSkills = studentSkills.filter(s => jobSkills.includes(s));
      const missingSkills = jobSkills.filter(s => !studentSkills.includes(s));
      const skillsScore = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 70 : 35;
      const locationScore = student.preferredLocations?.includes(job.location) ? 20 : 10;
      const cgpaScore = student.cgpa >= 6.0 ? 10 : 5;
      const matchScore = skillsScore + locationScore + cgpaScore;
      
      return {
        job_id: job._id,
        job_title: job.title,
        company: job.recruiter?.company || 'Company Name',
        location: job.location,
        match_score: Math.round(matchScore * 10) / 10,
        matched_skills: matchedSkills,
        missing_skills: missingSkills,
        category: matchScore >= 80 ? 'Top Match' : matchScore >= 60 ? 'Good Match' : matchScore >= 40 ? 'Near Miss' : 'Not Suitable',
        job_details: {
          description: job.description,
          duration: job.duration,
          stipend: job.stipend,
          type: job.type
        }
      };
    }).filter(rec => rec.match_score >= 40).sort((a, b) => b.match_score - a.match_score);

    res.json({
      student_name: student.name,
      recommendations: recommendations.slice(0, 10) // Top 10 recommendations
    });
  } catch (error) {
    console.error('Job recommendation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};