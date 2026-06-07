import axios from 'axios';

/**
 * Central Axios instance for the UAE Travel Card System backend.
 * Default local backend URL: http://localhost:8080
 * Custom overrides can be set using the environment variable VITE_API_BASE_URL.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15_000, // 15s timeout to allow Render free tier time to spin up on cold start
});

/**
 * Response interceptor — normalises error messages so every caught error
 * has a human-readable `.message` string regardless of backend response shape.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An unexpected error occurred. Please try again.';

    if (error.response) {
      // Server returned a response with a non-2xx status
      const data = error.response.data;
      if (typeof data === 'string' && data.length > 0) {
        message = data;
      } else if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      } else {
        message = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      // Request was made but no response received (backend down?)
      message =
        'Cannot reach the backend. Please check your network connection or verify the backend server is running.';
    } else {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
