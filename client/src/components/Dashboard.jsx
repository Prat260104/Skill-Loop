import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserCard from './UserCard';
import SessionCard from './SessionCard';
import { sessionApi } from '../api/sessionApi';
import { userApi } from '../api/userApi';

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'sessions'

    const CURRENT_USER_ID = 1; // Hardcoded for MVP

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'explore') {
                const data = await userApi.getAllUsers();
                // Filter out myself from explore
                setUsers(data.filter(u => u.id !== CURRENT_USER_ID));
            } else {
                const data = await sessionApi.getMySessions(CURRENT_USER_ID);
                setSessions(data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptSession = async (sessionId) => {
        try {
            await sessionApi.acceptSession(sessionId, CURRENT_USER_ID);
            // Refresh list
            fetchData();
            alert("Session Accepted!");
        } catch (error) {
            alert("Error accepting session");
        }
    };

    const handleRejectSession = async (sessionId) => {
        if (!confirm("Are you sure?")) return;
        try {
            await sessionApi.rejectSession(sessionId, CURRENT_USER_ID);
            fetchData();
            alert("Session Rejected!");
        } catch (error) {
            alert("Error rejecting session");
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.skillsOffered && user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (user.skillsWanted && user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                            {activeTab === 'explore' ? 'Explore Community' : 'My Sessions'}
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            {activeTab === 'explore'
                                ? 'Find mentors, students, and peers to trade skills with.'
                                : 'Manage your upcoming classes and requests.'}
                        </p>
                    </div>

                    {/* Tab Switcher & Search */}
                    <div className="flex flex-col gap-4 md:items-end">
                        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 w-fit">
                            <button
                                onClick={() => setActiveTab('explore')}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'explore'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                                    }`}
                            >
                                Explore
                            </button>
                            <button
                                onClick={() => setActiveTab('sessions')}
                                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'sessions'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
                                    }`}
                            >
                                My Sessions
                            </button>
                        </div>

                        {activeTab === 'explore' && (
                            <div className="relative w-full md:w-96">
                                <input
                                    type="text"
                                    placeholder="Search by name or skill..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-5 py-3 pl-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm dark:text-white"
                                />
                                <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-80 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {activeTab === 'explore' ? (
                            filteredUsers.length > 0 ? (
                                filteredUsers.map(user => (
                                    <UserCard key={user.id} user={user} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-gray-500 text-lg">No users found matching your search.</p>
                                </div>
                            )
                        ) : (
                            // SESSIONS TAB
                            sessions.length > 0 ? (
                                sessions.map(session => (
                                    <SessionCard
                                        key={session.id}
                                        session={session}
                                        currentUserId={CURRENT_USER_ID}
                                        onAccept={handleAcceptSession}
                                        onReject={handleRejectSession}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-20">
                                    <p className="text-gray-500 text-lg">You have no scheduled sessions yet.</p>
                                    <button
                                        onClick={() => setActiveTab('explore')}
                                        className="mt-4 text-primary font-semibold hover:underline"
                                    >
                                        Browse Mentors
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
