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

    // 2. Get User By ID
    // GET /api/user/{id}
    getUserById: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            return handleResponse(response);
        } catch (error) {
            console.error("Error fetching user details:", error);
            throw error;
        }
    },

    // 3. Get Leaderboard
    // GET /api/user/leaderboard
    getLeaderboard: async () => {
        try {
            const response = await fetch(`${API_URL}/leaderboard`);
            return handleResponse(response);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
            throw error;
        }
    },

    // 4. Update Profile
    // PUT /api/user/{id}/profile
    updateProfile: async (id, data) => {
        try {
            const response = await fetch(`${API_URL}/${id}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }
};
