import api from './axiosConfig';

// GET /api/chat/history/{sessionId}
export const getChatHistory = async (sessionId) => {
    try {
        const response = await api.get(`/api/chat/history/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching chat history:', error);
        throw error;
    }
};
