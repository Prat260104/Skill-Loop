import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiStar } from 'react-icons/hi';
import BadgeIcon from './BadgeIcon';

export default function UserCard({ user }) {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/profile/${user.id}`);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-white/5 relative overflow-hidden group cursor-pointer min-h-[440px] flex flex-col"
            onClick={handleViewProfile}
        >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />

            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-lg dark:text-white group-hover:text-primary transition-colors truncate">{user.name}</h3>
                        <p className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-full inline-block">
                            {user.role || 'Member'}
                        </p>
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-yellow-500 flex items-center gap-1">
                        <HiStar className="w-4 h-4" /> {user.skillPoints}
                    </span>
                </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 h-[40px]">
                {user.bio || "No bio available."}
            </p>

            {/* Badges Preview */}
            <div className="flex gap-2 mb-4 items-center">
                {user.badges && user.badges.length > 0 ? (
                    user.badges.slice(0, 4).map((badge, idx) => (
                        <div key={idx} className="scale-75 origin-left -ml-1">
                            <BadgeIcon badge={badge} />
                        </div>
                    ))
                ) : (
                    <span className="text-xs text-gray-400 italic mb-2">New unbadged member</span>
                )}
            </div>

            <div className="space-y-3 mb-6 flex-1 overflow-hidden">
                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Can Teach</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.skillsOffered && user.skillsOffered.length > 0 ? (
                            <>
                                {user.skillsOffered.slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md whitespace-nowrap">
                                        {skill}
                                    </span>
                                ))}
                                {user.skillsOffered.length > 3 && (
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-md">
                                        +{user.skillsOffered.length - 3}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-xs text-gray-400 italic">None listed</span>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Wants to Learn</h4>
                    <div className="flex flex-wrap gap-2">
                        {user.skillsWanted && user.skillsWanted.length > 0 ? (
                            <>
                                {user.skillsWanted.slice(0, 3).map((skill, idx) => (
                                    <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md whitespace-nowrap">
                                        {skill}
                                    </span>
                                ))}
                                {user.skillsWanted.length > 3 && (
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 rounded-md">
                                        +{user.skillsWanted.length - 3}
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="text-xs text-gray-400 italic">None listed</span>
                        )}
                    </div>
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile();
                }}
                className="w-full py-2.5 rounded-xl border border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all duration-300 mt-auto"
            >
                View Profile & Connect
            </button>
        </motion.div>
    );
}
