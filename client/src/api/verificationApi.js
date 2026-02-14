const API_URL = 'http://localhost:9090/api/verification';

export const verificationApi = {
    generateQuestion: async (skill, userId) => {
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skill, difficulty: "Medium", userId })
        });
        if (!response.ok) throw new Error('Failed to generate question');
        return await response.json();
    },

    evaluateAnswer: async (payload) => {
        // payload = { question, userAnswer, userId, skill }
        const response = await fetch(`${API_URL}/evaluate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to evaluate answer');
        return await response.json();
    }
};
