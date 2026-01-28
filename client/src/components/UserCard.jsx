import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionApi } from '../api/sessionApi';

export default function UserCard({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSkill, setSelectedSkill] = useState('');
    const [loading, setLoading] = useState(false);

    // Hardcoded current user for MVP (In reality, this comes from Auth Context)
    const CURRENT_USER_ID = 1;

    const handleConnectClick = () => {
        // Pre-select the first offered skill if available
        if (user.skillsOffered && user.skillsOffered.length > 0) {
            setSelectedSkill(user.skillsOffered[0]);
        }
        setIsModalOpen(true);
    };

    const handleSendRequest = async () => {
        if (!selectedSkill) return;
        setLoading(true);
        try {
            await sessionApi.requestSession(CURRENT_USER_ID, {
                mentorId: user.id,
                skill: selectedSkill,
                startTime: new Date().toISOString() // Default to "Now" for MVP
            });
            alert(`Request sent to ${user.name} for ${selectedSkill}!`);
            setIsModalOpen(false);
        } catch (error) {
            alert("Failed to send request: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden group"
            >
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg dark:text-white">{user.name}</h3>
                            <p className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-full inline-block">
                                {user.role || 'Member'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-sm font-bold text-yellow-500 flex items-center gap-1">
                            🏆 {user.skillPoints}
                        </span>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-2 min-h-[40px]">
                    {user.bio || "No bio available."}
                </p>

                <div className="space-y-3 mb-6">
                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Can Teach</h4>
                        <div className="flex flex-wrap gap-2">
                            {user.skillsOffered && user.skillsOffered.length > 0 ? (
                                user.skillsOffered.map((skill, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400 italic">None listed</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Wants to Learn</h4>
                        <div className="flex flex-wrap gap-2">
                            {user.skillsWanted && user.skillsWanted.length > 0 ? (
                                user.skillsWanted.map((skill, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md">
                                        {skill}
                                    </span>
                                ))
                            ) : (
                                <span className="text-xs text-gray-400 italic">None listed</span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleConnectClick}
                    className="w-full py-2.5 rounded-xl border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                >
                    Connect
                </button>
            </motion.div>

            {/* Request Mdoal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-white/10"
                        >
                            <h3 className="text-xl font-bold mb-4 dark:text-white">Request Session with {user.name}</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    What do you want to learn?
                                </label>
                                <select
                                    value={selectedSkill}
                                    onChange={(e) => setSelectedSkill(e.target.value)}
                                    className="w-full p-2 rounded-lg border dark:bg-slate-800 dark:border-white/20 dark:text-white"
                                >
                                    <option value="" disabled>Select a skill</option>
                                    {user.skillsOffered?.map(skill => (
                                        <option key={skill} value={skill}>{skill}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors dark:text-gray-300 dark:hover:bg-white/5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendRequest}
                                    disabled={loading || !selectedSkill}
                                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? 'Sending...' : 'Send Request'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
