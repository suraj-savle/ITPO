from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def calculate_job_match(student, job):
    weights = {'skills': 0.7, 'location': 0.2, 'cgpa': 0.1}
    total_score = 0
    
    # Skills Match (70%)
    student_skills = [s.lower() for s in (student.get('skills') or [])]
    job_skills = [s.lower() for s in (job.get('skillsRequired') or [])]
    
    if job_skills:
        matched_skills = [s for s in student_skills if s in job_skills]
        missing_skills = [s for s in job_skills if s not in student_skills]
        skills_score = (len(matched_skills) / len(job_skills)) * 100
    else:
        matched_skills = []
        missing_skills = []
        skills_score = 50
    
    total_score += skills_score * weights['skills']
    
    # Location Match (20%)
    location_score = 50
    if student.get('preferredLocations') and job.get('location') in student['preferredLocations']:
        location_score = 100
    elif student.get('remotePref') == 'remote':
        location_score = 70
    
    total_score += location_score * weights['location']
    
    # CGPA Match (10%)
    cgpa = student.get('cgpa', 0)
    cgpa_score = 100 if cgpa >= 6.0 else max(50, (cgpa / 10) * 100)
    total_score += cgpa_score * weights['cgpa']
    
    return {
        'match_score': round(total_score, 1),
        'matched_skills': matched_skills,
        'missing_skills': missing_skills
    }

def get_match_category(score):
    if score >= 80: return 'Top Match'
    elif score >= 60: return 'Good Match'
    elif score >= 40: return 'Near Miss'
    else: return 'Not Suitable'

@app.route('/recommend', methods=['POST'])
def recommend_jobs():
    try:
        data = request.json
        student = data.get('student', {})
        jobs = data.get('jobs', [])
        
        recommendations = []
        
        for job in jobs:
            match_data = calculate_job_match(student, job)
            
            if match_data['match_score'] >= 40:
                recommendations.append({
                    'job_id': job.get('_id'),
                    'job_title': job.get('title'),
                    'match_score': match_data['match_score'],
                    'matched_skills': match_data['matched_skills'],
                    'missing_skills': match_data['missing_skills'],
                    'category': get_match_category(match_data['match_score'])
                })
        
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        
        return jsonify({
            'recommendations': recommendations,
            'total_analyzed': len(jobs)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)