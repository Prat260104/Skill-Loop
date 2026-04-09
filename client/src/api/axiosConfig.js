import axios from 'axios';

// ─────────────────────────────────────────────
//  1. BASE INSTANCE
//  Single source of truth for the API base URL.
//  Change this ONE line to switch environments.
// ─────────────────────────────────────────────
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:9090',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─────────────────────────────────────────────
//  2. REQUEST INTERCEPTOR
//  Automatically attaches JWT token to EVERY
//  outgoing request — no need to add it manually
//  in each API file anymore.
// ─────────────────────────────────────────────
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ─────────────────────────────────────────────
//  3. RESPONSE INTERCEPTOR
//  - 401: Token expired → auto logout + redirect
//  - 403: Forbidden → user feedback
//  - 5xx: Server error → global error message
// ─────────────────────────────────────────────
api.interceptors.response.use(
    // Success: just return the response data directly
    (response) => response,

    // Error: handle globally
    (error) => {
        const status = error.response?.status;

        if (status === 401) {
            // Token expired or invalid — clear session and redirect to login
            console.warn('[SkillLoop] Session expired. Redirecting to login...');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        } else if (status === 403) {
            console.error('[SkillLoop] Access Forbidden:', error.response?.data);
        } else if (status >= 500) {
            console.error('[SkillLoop] Server Error:', error.response?.data);
        }

        // Always reject so individual catch blocks still work
        return Promise.reject(error);
    }
);

export default api;
