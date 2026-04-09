import api from './axiosConfig';

// POST /api/connections/send?senderId=X&receiverId=Y
export const sendConnectionRequest = async (senderId, receiverId) => {
    try {
        const response = await api.post(`/api/connections/send?senderId=${senderId}&receiverId=${receiverId}`);
        return response.data;
    } catch (error) {
        console.error('Error sending connection request:', error);
        throw error;
    }
};

// PUT /api/connections/accept/{requestId}
export const acceptConnectionRequest = async (requestId) => {
    try {
        const response = await api.put(`/api/connections/accept/${requestId}`);
        return response.data;
    } catch (error) {
        console.error('Error accepting connection request:', error);
        throw error;
    }
};

// PUT /api/connections/reject/{requestId}
export const rejectConnectionRequest = async (requestId) => {
    try {
        const response = await api.put(`/api/connections/reject/${requestId}`);
        return response.data;
    } catch (error) {
        console.error('Error rejecting connection request:', error);
        throw error;
    }
};

// GET /api/connections/status?senderId=X&receiverId=Y
export const getConnectionStatus = async (senderId, receiverId) => {
    try {
        const response = await api.get(`/api/connections/status?senderId=${senderId}&receiverId=${receiverId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching connection status:', error);
        return { status: 'NONE' };
    }
};

// GET /api/connections/pending/{userId}
export const getPendingRequests = async (userId) => {
    try {
        const response = await api.get(`/api/connections/pending/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        return [];
    }
};
