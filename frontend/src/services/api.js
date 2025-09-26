const API = process.env.REACT_APP_API_URL || "https://internconnect-zy2r.onrender.com";

// Auth APIs
export const loginUser = async (credentials) => {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to login');
  }
  return res.json();
};

export const registerStudent = async (userData) => {
  const res = await fetch(`${API}/api/auth/register-student`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to register');
  }
  return res.json();
};

// Profile APIs
export const getProfile = async (token) => {
  const res = await fetch(`${API}/api/student/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch profile');
  }
  return res.json();
};

export const updateProfile = async (profileData, token) => {
  const res = await fetch(`${API}/api/student/update-profile`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update profile');
  }
  return res.json();
};

// Admin APIs
export const getPendingStudents = async (token) => {
  const res = await fetch(`${API}/api/admin/pending-students`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch pending students');
  }
  return res.json();
};

export const approveStudent = async (studentId, token) => {
  const res = await fetch(`${API}/api/admin/approve-student/${studentId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to approve student');
  }
  return res.json();
};

// Posts APIs
export const getAllPosts = async (token) => {
  const res = await fetch(`${API}/api/admin/posts`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch posts');
  }
  return res.json();
};

export const createPost = async (postData, token) => {
  const res = await fetch(`${API}/api/admin/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to create post');
  }
  return res.json();
};

// Utility function to handle file uploads
export const uploadFile = async (file, type, token) => {
  const formData = new FormData();
  formData.append(type, file);

  const res = await fetch(`${API}/api/upload/${type}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to upload file');
  }
  return res.json();
};

// Error handler wrapper
export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.message.includes('401')) {
    // Handle unauthorized access
    localStorage.removeItem('token');
    window.location.href = '/login';
    return 'Session expired. Please login again.';
  }
  return error.message || 'An unexpected error occurred';
};