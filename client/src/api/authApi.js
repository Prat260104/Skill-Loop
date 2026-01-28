const API_URL = 'http://localhost:9090/api/auth';

// Helper to handle response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong');
    }
    return response.json();
};

export const authApi = {
    // 1. Login
    // POST /api/auth/login
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials) // { email, password }
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    },

    // 2. Signup
    // POST /api/auth/signup
    signup: async (userData) => {
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData) // { name, email, password }
            });
            return handleResponse(response);
        } catch (error) {
            console.error("Signup Error:", error);
            throw error;
        }
    }
};
