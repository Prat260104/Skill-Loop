import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

            // Convert comma-separated string to array
            const payload = {
                bio: formData.bio,
                skillsOffered: formData.skillsOffered.split(',').map(s => s.trim()),
                skillsWanted: formData.skillsWanted.split(',').map(s => s.trim())
            };

            const response = await fetch(`http://localhost:9090/api/user/${user.id}/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                // Update local storage to reflect complete profile
                user.profileComplete = true; // Use the key from backend DTO, but here we can just set a flag
                // Actually the backend DTO uses "isProfileComplete" (boolean), but let's stick to what we need.
                // Re-saving to local storage might be good practice.
                user.isProfileComplete = true;
                localStorage.setItem('user', JSON.stringify(user));

                setStatus('success');
                setTimeout(() => navigate('/dashboard'), 1500); // Go to Dashboard
            } else {
                setStatus('error');
            }
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
                        <textarea
                            name="bio"
                            rows="3"
                            required
                            placeholder="I am a software engineer..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills You Offer (Comma separated)</label>
                            <input
                                type="text"
                                name="skillsOffered"
                                required
                                placeholder="Java, React, Reading"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills You Want (Comma separated)</label>
                            <input
                                type="text"
                                name="skillsWanted"
                                required
                                placeholder="Guitar, Cooking, Spanish"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary outline-none transition-all dark:text-white"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all"
                    >
                        {status === 'loading' ? 'Saving...' : 'Save Profile'}
                    </button>

                    {status === 'success' && (
                        <div className="p-4 rounded-xl text-sm bg-green-100 text-green-700 text-center">
                            Profile Updated! Redirecting to Home...
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="p-4 rounded-xl text-sm bg-red-100 text-red-700 text-center">
                            Something went wrong.
                        </div>
                    )}
                </form>
            </motion.div>
        </div>
    );
}
