import api from './axiosConfig';

export const sessionApi = {
    // POST /api/sessions/request/{studentId}
    requestSession: async (studentId, requestData) => {
        try {
            const response = await api.post(`/api/sessions/request/${studentId}`, requestData);
            return response.data;
        } catch (error) {
            console.error('Error requesting session:', error);
            throw error;
        }
    },

    // GET /api/sessions/user/{userId}
    getMySessions: async (userId) => {
        try {
            const response = await api.get(`/api/sessions/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching sessions:', error);
            throw error;
        }
    },

    // PUT /api/sessions/{sessionId}/accept/{mentorId}
    acceptSession: async (sessionId, mentorId) => {
        try {
            const response = await api.put(`/api/sessions/${sessionId}/accept/${mentorId}`);
            return response.data;
        } catch (error) {
            console.error('Error accepting session:', error);
            throw error;
        }
    },

    // PUT /api/sessions/{sessionId}/reject/{mentorId}
    rejectSession: async (sessionId, mentorId) => {
        try {
            const response = await api.put(`/api/sessions/${sessionId}/reject/${mentorId}`);
            return response.data;
        } catch (error) {
            console.error('Error rejecting session:', error);
            throw error;
        }
    },

    // PUT /api/sessions/{sessionId}/complete/{studentId}
    // Now sends both review text AND star rating to the backend
    completeSession: async (sessionId, studentId, review, rating) => {
        try {
            const response = await api.put(
                `/api/sessions/${sessionId}/complete/${studentId}`,
                { review, rating }
            );
            return response.data;
        } catch (error) {
            console.error('Error completing session:', error);
            throw error;
        }
    },
};
