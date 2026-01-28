const API_URL = 'http://localhost:9090/api/sessions';

// Helper to handle response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong');
    }
    return response.json();
};

export const sessionApi = {
    // 1. Request a Session
    // POST /api/sessions/request/{studentId}
    requestSession: async (studentId, requestData) => {
        try {
            const response = await fetch(`${API_URL}/request/${studentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData) // { mentorId, skill, startTime }
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Error requesting session:", error);
            throw error;
        }
    },

    // 2. Get All My Sessions
    // GET /api/sessions/user/{userId}
    getMySessions: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/user/${userId}`);
            return handleResponse(response);
        } catch (error) {
            console.error("Error fetching sessions:", error);
            throw error;
        }
    },

    // 3. Accept Session
    // PUT /api/sessions/{sessionId}/accept/{mentorId}
    acceptSession: async (sessionId, mentorId) => {
        try {
            const response = await fetch(`${API_URL}/${sessionId}/accept/${mentorId}`, {
                method: 'PUT'
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Error accepting session:", error);
            throw error;
        }
    },

    // 4. Reject Session
    // PUT /api/sessions/{sessionId}/reject/{mentorId}
    rejectSession: async (sessionId, mentorId) => {
        try {
            const response = await fetch(`${API_URL}/${sessionId}/reject/${mentorId}`, {
                method: 'PUT'
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Error rejecting session:", error);
            throw error;
        }
    }
};
