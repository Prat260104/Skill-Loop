import api from './axiosConfig';

export const userApi = {
    // GET /api/user
    getAllUsers: async () => {
        try {
            const response = await api.get('/api/user');
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    // GET /api/user/{id}
    getUserById: async (id) => {
        try {
            const response = await api.get(`/api/user/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user details:', error);
            throw error;
        }
    },

    // GET /api/user/leaderboard
    getLeaderboard: async (department = null) => {
        try {
            const endpoint = department ? `/api/user/leaderboard?department=${encodeURIComponent(department)}` : '/api/user/leaderboard';
            const response = await api.get(endpoint);
            return response.data;
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
        }
    },

    // PUT /api/user/{id}/profile
    updateProfile: async (id, data) => {
        try {
            const response = await api.put(`/api/user/${id}/profile`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating profile:', error);
            throw error;
        }
    },

    // POST /api/user/{id}/resume  (multipart/form-data)
    uploadResume: async (id, file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.post(`/api/user/${id}/resume`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading resume:', error);
            throw error;
        }
    },
};
