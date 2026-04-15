import api from './axiosConfig';

export const authApi = {
    // POST /api/auth/login
    login: async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            return response.data;
        } catch (error) {
            console.error('Login Error:', error);
            
            // Extract backend error message
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            } else if (error.response?.status === 400) {
                console.error('Full 400 Response:', error.response.data);
                throw new Error('Invalid email or password');
            }
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
            
            // Extract backend error message
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (error.response?.data?.error) {
                throw new Error(error.response.data.error);
            } else if (error.response?.status === 400) {
                console.error('Full 400 Response:', error.response.data);
                throw new Error('Sign up failed - check your input');
            }
            throw error;
        }
    },
};
