import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [status, setStatus] = useState(null); // success | error | loading
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        try {
            const response = await fetch('http://localhost:9090/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const text = await response.text();
                setStatus('success');
                setMessage(text);
                // Optionally redirect here later
            } else {
                const errorText = await response.text();
                setStatus('error');
                setMessage('Error: ' + errorText);
            }
        } catch (error) {
            setStatus('error');
            setMessage('Network Error: Is Backend running?');
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-white/5"
            >
                <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <input
                            type="email" name="email" required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <input
                            type="password" name="password" required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all"
                    >
                        {status === 'loading' ? 'Signing In...' : 'Sign In'}
                    </button>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <div className="text-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:underline font-medium">
                            Sign Up
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
