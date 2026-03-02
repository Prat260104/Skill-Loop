import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sessionApi } from '../../api/sessionApi';
import SessionReviewModal from './SessionReviewModal';
import ChatBox from '../chat/ChatBox';

const MySessions = ({ user }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming'); // upcoming, pending, completed
    const [selectedSession, setSelectedSession] = useState(null);
    const [activeChatSession, setActiveChatSession] = useState(null); // Chat state
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user && user.id) {
            fetchSessions();
        }
    }, [user]);

    // Check URL for ?reviewSession=xxx and trigger modal if found
    useEffect(() => {
        if (sessions.length > 0) {
            const params = new URLSearchParams(location.search);
            const reviewSessionId = params.get('reviewSession');

            if (reviewSessionId) {
                // Find the session that matches this ID
                const sessionToReview = sessions.find(s => s.id === Number(reviewSessionId));

                // Only open the modal if the user is the STUDENT for this session
                // Mentors can't review and get points for themselves!
                if (sessionToReview && sessionToReview.student.id === user.id && sessionToReview.status === 'ACCEPTED') {
                    setSelectedSession(sessionToReview);
                    setIsReviewModalOpen(true);

                    // Clean up the URL so it doesn't keep opening on refresh
                    navigate('/dashboard', { replace: true });
                }
            }
        }
    }, [sessions, location.search, navigate, user.id]);

    const fetchSessions = async () => {
        try {
            const data = await sessionApi.getMySessions(user.id);
            // Sort by date desc
            const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setSessions(sorted);
        } catch (err) {
            setError("Failed to load sessions");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteClick = (session) => {
        setSelectedSession(session);
        setIsReviewModalOpen(true);
    };

    const handleReviewSubmit = async (review, rating) => {
        try {
            await sessionApi.completeSession(selectedSession.id, user.id, review);
            // Refresh list
            await fetchSessions();
            setIsReviewModalOpen(false);
            setSelectedSession(null);
        } catch (err) {
            alert("Failed to complete session: " + err.message);
        }
    };

    const handleAccept = async (session) => {
        try {
            await sessionApi.acceptSession(session.id, user.id);
            await fetchSessions();
        } catch (err) {
            alert("Failed to accept session: " + err.message);
        }
    };

    const handleReject = async (session) => {
        if (!confirm("Are you sure you want to reject this session?")) return;
        try {
            await sessionApi.rejectSession(session.id, user.id);
            await fetchSessions();
        } catch (err) {
            alert("Failed to reject session: " + err.message);
        }
    };

    // Filter logic
    const filteredSessions = sessions.filter(session => {
        if (activeTab === 'upcoming') return session.status === 'ACCEPTED';
        if (activeTab === 'pending') return session.status === 'PENDING';
        if (activeTab === 'completed') return session.status === 'COMPLETED' || session.status === 'REJECTED';
        return true;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'COMPLETED': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Card Component for a Session
    const SessionCard = ({ session }) => {
        const isStudent = session.student.id === user.id;
        const isMentor = session.mentor.id === user.id;
        const counterpart = isStudent ? session.mentor : session.student;
        const roleLabel = isStudent ? "Mentor" : "Student";

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                            {counterpart.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{session.skill}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {roleLabel}: <span className="font-medium text-indigo-600 dark:text-indigo-400">{counterpart.name}</span>
                            </p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                        {session.status}
                    </span>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-slate-700">
                    <div className="text-xs text-gray-400">
                        {new Date(session.createdAt).toLocaleDateString()}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {session.status === 'PENDING' && isMentor && (
                            <>
                                <button
                                    onClick={() => handleAccept(session)}
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(session)}
                                    className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    Reject
                                </button>
                            </>
                        )}

                        {session.status === 'ACCEPTED' && isStudent && (
                            <button
                                onClick={() => handleCompleteClick(session)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Mark Complete
                            </button>
                        )}

                        {session.status === 'ACCEPTED' && (
                            <>
                                <button
                                    onClick={() => navigate(`/room/${session.id}`)}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <span className="text-lg">📹</span> Join Class
                                </button>
                                <button
                                    onClick={() => setActiveChatSession(session)}
                                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                                >
                                    Chat
                                </button>
                            </>
                        )}
                    </div>

                    {session.status === 'COMPLETED' && session.review && (
                        <div className="text-sm text-gray-600 dark:text-gray-300 italic">
                            "{session.review.substring(0, 50)}..."
                        </div>
                    )}
                </div>
            </motion.div>
        );
    };

    if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading sessions...</div>;

    if (!user) return <div className="p-8 text-center">Please log in to view sessions.</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Sessions</h2>
                <div className="flex space-x-2 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl">
                    {['upcoming', 'pending', 'completed'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-sm'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="text-red-500 p-4 bg-red-50 rounded-xl">{error}</div>}

            <div className="grid gap-4">
                {filteredSessions.length > 0 ? (
                    filteredSessions.map(session => (
                        <SessionCard key={session.id} session={session} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                        <p className="text-gray-500 dark:text-gray-400">No {activeTab} sessions found.</p>
                    </div>
                )}
            </div>

            <SessionReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => setIsReviewModalOpen(false)}
                onSubmit={handleReviewSubmit}
                session={selectedSession}
            />

            {/* Mount the ChatBox if there is an active chat session */}
            {activeChatSession && (
                <ChatBox
                    currentUserId={user.id}
                    peer={activeChatSession.student.id === user.id ? activeChatSession.mentor : activeChatSession.student}
                    sessionId={activeChatSession.id}
                    onClose={() => setActiveChatSession(null)}
                />
            )}
        </div>
    );
};

export default MySessions;
