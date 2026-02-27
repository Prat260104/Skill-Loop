import { motion } from 'framer-motion';

export default function SessionCard({ session, currentUserId, onAccept, onReject, onComplete, onChat }) {
    const isMentor = session.mentor.id === parseInt(currentUserId);
    const isPending = session.status === 'PENDING';

    // Status Colors
    const statusColors = {
        PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        ACCEPTED: 'bg-green-100 text-green-800 border-green-200',
        REJECTED: 'bg-red-100 text-red-800 border-red-200',
        COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200'
    };

    // Helper to format date safely
    const formatDate = (dateString) => {
        if (!dateString) return "No Date";
        try {
            return new Date(dateString).toLocaleDateString();
        } catch (e) {
            return "Invalid Date";
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-4"
        >
            {/* Header: Status & Date */}
            <div className="flex justify-between items-start">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[session.status] || 'bg-gray-100'}`}>
                    {session.status}
                </span>
                <span className="text-sm text-gray-400">
                    {formatDate(session.scheduledTime || session.createdAt)}
                </span>
            </div>

            {/* Main Info */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                    {isMentor ? 'S' : 'M'}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">
                        {session.skill} Session
                    </h3>
                    <p className="text-sm text-gray-500">
                        {isMentor
                            ? `Student: ${session.student.name}`
                            : `Mentor: ${session.mentor.name}`}
                    </p>
                </div>
            </div>

            {/* Actions (Only for Mentor looking at Pending Request) */}
            {
                isMentor && isPending && (
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => onAccept(session.id)}
                            className="flex-1 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors"
                        >
                            Accept
                        </button>
                        <button
                            onClick={() => onReject(session.id)}
                            className="flex-1 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-sm font-semibold transition-colors"
                        >
                            Decline
                        </button>
                    </div>
                )
            }

            {/* Actions (Only for Student looking at Accepted Session) */}
            {
                !isMentor && session.status === 'ACCEPTED' && (
                    <div className="mt-2 flex gap-2">
                        <button
                            onClick={() => onComplete(session.id)}
                            className="flex-1 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-md shadow-blue-500/20"
                        >
                            Mark Complete
                        </button>
                        <button
                            onClick={() => onChat(session)}
                            className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-md shadow-purple-500/20"
                        >
                            Chat
                        </button>
                    </div>
                )
            }
            {
                !isMentor && session.status === 'ACCEPTED' && (
                    <p className="text-xs text-center text-gray-400 mt-2">
                        Clicking 'Mark Complete' will award +50 points to your mentor.
                    </p>
                )
            }

            {/* Actions (Only for Mentor looking at Accepted Session) */}
            {
                isMentor && session.status === 'ACCEPTED' && (
                    <div className="mt-2">
                        <button
                            onClick={() => onChat(session)}
                            className="w-full py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-semibold transition-colors shadow-md shadow-purple-500/20"
                        >
                            Chat
                        </button>
                    </div>
                )
            }

            {/* Contact Info (Only if Accepted) */}
            {
                session.status === 'ACCEPTED' && (
                    <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg text-sm text-center">
                        <p className="text-gray-600 dark:text-gray-300">
                            Meet at: <span className="font-mono text-primary">zoom.us/j/123456</span>
                        </p>
                    </div>
                )
            }
        </motion.div >
    );
}
