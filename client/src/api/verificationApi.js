import api from './axiosConfig';

export const verificationApi = {
    // POST /api/verification/generate
    generateQuestion: async (skill, userId) => {
        try {
            const response = await api.post('/api/verification/generate', {
                skill,
                difficulty: 'Medium',
                userId,
            });
            return response.data;
        } catch (error) {
            console.error('Error generating question:', error);
            throw error;
        }
    },

    // POST /api/verification/evaluate
    evaluateAnswer: async (payload) => {
        // payload = { question, userAnswer, userId, skill }
        try {
            const response = await api.post('/api/verification/evaluate', payload);
            return response.data;
        } catch (error) {
            console.error('Error evaluating answer:', error);
            throw error;
        }
    },
};
