import { API_URL } from './api';

export const loginUser = async (credentials) => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
};

export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'Server error occurred';
  } else if (error.request) {
    // No response received
    return 'No response from server. Please check your connection.';
  } else {
    // Other errors
    return error.message || 'An unexpected error occurred';
  }
};