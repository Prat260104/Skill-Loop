import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionApi } from '../api/sessionApi';

export default function SessionRequestModal({ isOpen, onClose, mentor, currentUser }) {
    const [skill, setSkill] = useState('');
    const [startTime, setStartTime] = useState('');
    const [duration, setDuration] = useState('60'); // Minutes
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, success, error

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus('idle');

        try {
            const requestData = {
                mentorId: mentor.id,
                skill: skill,
                startTime: new Date(startTime).toISOString(),
                duration: parseInt(duration),
                note: note
            };

            await sessionApi.requestSession(currentUser.id, requestData);
            setStatus('success');
            setTimeout(() => {
                onClose();
                setStatus('idle');
                // Reset form
                setSkill('');
                setStartTime('');
                setNote('');
            }, 2000);
        } catch (error) {
            console.error("Session request failed:", error);
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };

    // Calculate min datetime (now)
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const minDateTime = now.toISOString().slice(0, 16);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            📅 Request Session
                        </h2>
                        <p className="text-indigo-100 text-sm">with <span className="font-bold">{mentor.name}</span></p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {status === 'success' ? (
                        <div className="text-center py-8">
                            <div className="text-5xl mb-4">✅</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Request Sent!</h3>
                            <p className="text-gray-500">Wait for {mentor.name} to accept.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Skill Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Topic / Skill</label>
                                <select
                                    required
                                    value={skill}
                                    onChange={(e) => setSkill(e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Select a topic...</option>
                                    {mentor.skillsOffered && mentor.skillsOffered.map((s, i) => (
                                        <option key={i} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date & Time */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proposed Time</label>
                                <input
                                    type="datetime-local"
                                    required
                                    min={minDateTime}
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary dark:text-white"
                                />
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                <div className="flex gap-2">
                                    {['30', '45', '60'].map((mins) => (
                                        <button
                                            key={mins}
                                            type="button"
                                            onClick={() => setDuration(mins)}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all border ${duration === mins
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:bg-gray-50'
                                                }`}
                                        >
                                            {mins} min
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Note */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message (Optional)</label>
                                <textarea
                                    rows="3"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Hi, I'd like to learn about..."
                                    className="w-full p-2.5 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                            </div>

                            {status === 'error' && (
                                <p className="text-red-500 text-sm text-center">Failed to send request. Please try again.</p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Sending...' : 'Send Request 🚀'}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
