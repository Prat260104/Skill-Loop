const API_URL = 'http://localhost:9090/api/connections';

// Helper to handle response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Something went wrong');
    }
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return response.text(); // For plain text responses like "Request Accepted"
};

// Send a connection request
export const sendConnectionRequest = async (senderId, receiverId) => {
    try {
        const response = await fetch(`${API_URL}/send?senderId=${senderId}&receiverId=${receiverId}`, {
            method: 'POST'
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error sending connection request:", error);
        throw error;
    }
};

// Accept a connection request
export const acceptConnectionRequest = async (requestId) => {
    try {
        const response = await fetch(`${API_URL}/accept/${requestId}`, {
            method: 'PUT'
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error accepting connection request:", error);
        throw error;
    }
};

// Reject a connection request
export const rejectConnectionRequest = async (requestId) => {
    try {
        const response = await fetch(`${API_URL}/reject/${requestId}`, {
            method: 'PUT'
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Error rejecting connection request:", error);
        throw error;
    }
};

// Get connection status between two users
export const getConnectionStatus = async (senderId, receiverId) => {
    try {
        const response = await fetch(`${API_URL}/status?senderId=${senderId}&receiverId=${receiverId}`);
        return handleResponse(response);
    } catch (error) {
        console.error("Error fetching connection status:", error);
        return { status: "NONE" };
    }
};

// Get pending requests for a user
export const getPendingRequests = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/pending/${userId}`);
        return handleResponse(response);
    } catch (error) {
        console.error("Error fetching pending requests:", error);
        return [];
    }
};
