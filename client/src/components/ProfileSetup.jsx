import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiPencil, HiLightningBolt, HiBookOpen } from 'react-icons/hi';
import api from '../api/axiosConfig';

export default function ProfileSetup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        bio: '',
        skillsOffered: '',
        skillsWanted: ''
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // Get user from localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/login');
                return;
            }

            const payload = {
                bio: formData.bio,
                skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()),
                skillsWanted: formData.skillsWanted.split(',').map(s => s.trim())
            };

            await api.put(`/api/user/${user.id}/profile`, payload);

            // Update local storage to reflect complete profile
            user.profileComplete = true; // Use the key from backend DTO, but here we can just set a flag
            // Actually the backend DTO uses "isProfileComplete" (boolean), but let's stick to what we need.
            // Re-saving to local storage might be good practice.
            user.isProfileComplete = true;
            localStorage.setItem('user', JSON.stringify(user));

            setStatus('success');
            setTimeout(() => navigate('/dashboard'), 1500); // Go to Dashboard
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen pt-24 bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-white/5"
            >
                <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                    Complete Your Profile
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    Tell us what you can teach and what you want to learn.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                            <HiPencil className="w-4 h-4 text-primary" />
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            rows="3"
                            required
                            placeholder="Tell us about yourself..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                <HiLightningBolt className="w-4 h-4 text-yellow-500" />
                                Skills You Offer
                            </label>
                            <input
                                type="text"
                                name="skillsOffered"
                                required
                                placeholder="Java, React, Python"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                                <HiBookOpen className="w-4 h-4 text-blue-500" />
                                Skills You Want
                            </label>
                            <input
                                type="text"
                                name="skillsWanted"
                                required
                                placeholder="Machine Learning, DSA"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all dark:text-white"
                                onChange={handleChange}
                            />
                            <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
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
                                Saving...
                            </span>
                        ) : 'Save Profile'}
                    </button>

                    {status === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 text-center"
                        >
                            Profile Updated! Redirecting to Dashboard...
                        </motion.div>
                    )}
                    {status === 'error' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-center"
                        >
                            Something went wrong. Please try again.
                        </motion.div>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
