import axios from 'axios';

const BASE_URL = 'https://ptec-notebot-server.vercel.app';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Levels
  getLevels: async () => {
    try {
      const response = await api.get('/levels');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch levels');
    }
  },

  // Courses
  getCourses: async () => {
    try {
      const response = await api.get('/courses');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses');
    }
  },

  getCoursesByLevel: async (levelId) => {
    try {
      const response = await api.get(`/courses_level/${levelId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch courses by level');
    }
  },

  // Notes
  getNotes: async () => {
    try {
      const response = await api.get('/notes');
      return response.data;
    } catch (error) {
      console.error('API getNotes error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch notes');
    }
  },

  getNotesByCourse: async (courseId) => {
    try {
      const response = await api.get(`/notes_course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('API getNotesByCourse error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch notes by course');
    }
  },
};

export default api;