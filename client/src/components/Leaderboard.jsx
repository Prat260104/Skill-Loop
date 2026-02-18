import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userApi } from '../api/userApi';

export default function Leaderboard() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const data = await userApi.getLeaderboard();
            setLeaders(data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const getMedal = (index) => {
        if (index === 0) return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-yellow-500/30">1</div>
        );
        if (index === 1) return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-gray-400/30">2</div>
        );
        if (index === 2) return (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-amber-600/30">3</div>
        );
        return (
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-sm">{index + 1}</div>
        );
    };

    const getRowStyle = (index) => {
        if (index === 0) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200';
        if (index === 1) return 'bg-gray-50 dark:bg-gray-800 border-gray-200';
        if (index === 2) return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200';
        return 'bg-white dark:bg-slate-800 border-gray-100 dark:border-white/5';
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-2">
                        Hall of Fame
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Top Mentors making an impact in Skill Loop.
                    </p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="h-20 bg-gray-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {leaders.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex items-center p-4 rounded-xl border-2 shadow-sm ${getRowStyle(index)}`}
                            >
                                {/* Rank / Medal */}
                                <div className="w-16 flex items-center justify-center flex-shrink-0">
                                    {getMedal(index)}
                                </div>

                                {/* User Info */}
                                <div className="flex-1 flex items-center gap-4 ml-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[2px]">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-primary font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                                            {user.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {user.role} • {user.skillPoints} Points
                                        </p>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="hidden md:flex gap-2">
                                    {user.skillsOffered && user.skillsOffered.slice(0, 2).map((skill, i) => (
                                        <span key={i} className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 text-xs font-medium border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
