import api from './api'; // Ensure this points to your configured axios instance

/**
 * Fetches the entire chat history between two users.
 * 
 * @param {number} userId1 - ID of the first user (e.g., the logged-in user)
 * @param {number} userId2 - ID of the second user (e.g., the mentor/mentee)
 * @returns {Promise<Array>} A promise that resolves to an array of ChatMessageResponse objects
 */
export const getChatHistory = async (userId1, userId2) => {
    try {
        // Calls the @GetMapping("/api/chat/history/{userId1}/{userId2}") endpoint we built in Spring Boot
        const response = await api.get(`/chat/history/${userId1}/${userId2}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};
