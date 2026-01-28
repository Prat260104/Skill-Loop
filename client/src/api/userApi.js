const API_URL = 'http://localhost:9090/api/user';

// Helper to handle response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong');
    }
    return response.json();
};

export const userApi = {
    // 1. Get All Users
    // GET /api/user
    getAllUsers: async () => {
        try {
            const response = await fetch(API_URL);
            return handleResponse(response);
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    },

    // 2. Get Leaderboard
    // GET /api/user/leaderboard
    getLeaderboard: async () => {
        try {
            const response = await fetch(`${API_URL}/leaderboard`);
            return handleResponse(response);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            throw error;
        }
    }
};
