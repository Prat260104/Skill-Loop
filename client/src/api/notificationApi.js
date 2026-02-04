const API_URL = 'http://localhost:9090/api/notifications';

// Helper to handle response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong');
    }
    return response.json();
};

export const notificationApi = {
    // 1. Get All Notifications
    // GET /api/notifications/user/{userId}
    getMyNotifications: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/user/${userId}`);
            return handleResponse(response);
        } catch (error) {
            console.error("Error fetching notifications:", error);
            throw error;
        }
    },

    // 2. Get Unread Count
    // GET /api/notifications/unread-count/{userId}
    getUnreadCount: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/unread-count/${userId}`);
            return handleResponse(response);
        } catch (error) {
            console.error("Error fetching unread count:", error);
            return 0; // Return 0 on error so UI doesn't break
        }
    },

    // 3. Mark as Read
    // PUT /api/notifications/{id}/read
    markAsRead: async (notificationId) => {
        try {
            const response = await fetch(`${API_URL}/${notificationId}/read`, {
                method: 'PUT'
            });
            // Returns a string message, not JSON, so we handle it differently
            if (!response.ok) throw new Error('Failed to mark read');
            return true;
        } catch (error) {
            console.error("Error marking notification read:", error);
            throw error;
        }
    }
};
