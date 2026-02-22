const API_URL = 'http://localhost:9090/api/chat';

// Helper to handle response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong');
    }
    return response.json();
};

/**
 * Fetches the entire chat history between two users.
 * 
 * @param {number} userId1 - ID of the first user (e.g., the logged-in user)
 * @param {number} userId2 - ID of the second user (e.g., the mentor/mentee)
 * @returns {Promise<Array>} A promise that resolves to an array of ChatMessageResponse objects
 */
export const getChatHistory = async (userId1, userId2) => {
    try {
        const response = await fetch(`${API_URL}/history/${userId1}/${userId2}`);
        return handleResponse(response);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};
