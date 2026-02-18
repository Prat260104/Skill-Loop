import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiUser, HiMail, HiLockClosed } from 'react-icons/hi';
import { authApi } from '../api/authApi';

export default function Signup() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [status, setStatus] = useState(null); // success | error
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const data = await authApi.signup(formData);

            setStatus('success');
            setMessage('Account Created! Redirecting to setup...');

            // Save and Redirect
            localStorage.setItem('user', JSON.stringify(data));
            setTimeout(() => {
                window.location.href = '/profile-setup';
            }, 1000);

        } catch (error) {
            setStatus('error');
            setMessage('Error: ' + (error.message || 'Signup Failed'));
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-white/5"
            >
                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Join Skill Loop
                </h2>
                <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
                    Create your account and start learning
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                        <div className="relative">
                            <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text" name="name" required
                                placeholder="Your full name"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                        <div className="relative">
                            <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="email" name="email" required
                                placeholder="you@example.com"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                        <div className="relative">
                            <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="password" name="password" required
                                placeholder="Create a password"
                                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
                    >
                        {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Creating Account...
                            </span>
                        ) : 'Sign Up'}
                    </button>

                    {message && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-4 rounded-xl text-sm ${status === 'success'
                                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                                }`}
                        >
                            {message}
                        </motion.div>
                    )}

                    <div className="text-center mt-6 text-gray-600 dark:text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary hover:underline font-semibold">
                            Sign In
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
