import api from './axiosConfig';

export const authApi = {
    // POST /api/auth/login
    login: async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login Error:', error);
            throw error;
        }
    },

    // POST /api/auth/signup
    signup: async (userData) => {
        try {
            const response = await api.post('/api/auth/signup', userData);
            return response.data;
        } catch (error) {
            console.error('Signup Error:', error);
            throw error;
        }
    },
};
