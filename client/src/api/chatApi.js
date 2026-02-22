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
 * Fetches the entire chat history for a specific session.
 * 
 * @param {number} sessionId - ID of the session
 * @returns {Promise<Array>} A promise that resolves to an array of ChatMessageResponse objects
 */
export const getChatHistory = async (sessionId) => {
    try {
        const response = await fetch(`${API_URL}/history/${sessionId}`);
        return handleResponse(response);
    } catch (error) {
        console.error("Error fetching chat history:", error);
        throw error;
    }
};
