import api from './axiosConfig';

export const notificationApi = {
    // GET /api/notifications/user/{userId}
    getMyNotifications: async (userId) => {
        try {
            const response = await api.get(`/api/notifications/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching notifications:', error);
            throw error;
        }
    },

    // GET /api/notifications/unread-count/{userId}
    getUnreadCount: async (userId) => {
        try {
            const response = await api.get(`/api/notifications/unread-count/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return 0;
        }
    },

    // PUT /api/notifications/{id}/read
    markAsRead: async (notificationId) => {
        try {
            await api.put(`/api/notifications/${notificationId}/read`);
            return true;
        } catch (error) {
            console.error('Error marking notification read:', error);
            throw error;
        }
    },
};
