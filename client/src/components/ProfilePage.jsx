import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userApi } from '../api/userApi';

export default function ProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [bio, setBio] = useState('');
    const [skillsOffered, setSkillsOffered] = useState('');
    const [skillsWanted, setSkillsWanted] = useState('');

    const currentUser = JSON.parse(localStorage.getItem('user'));

    // If no ID is passed, assume current user
    const targetId = id || (currentUser ? currentUser.id : null);
    const isOwnProfile = currentUser && targetId == currentUser.id;

    useEffect(() => {
        if (!targetId) {
            navigate('/login');
            return;
        }
        fetchProfile();
    }, [targetId]);

    const fetchProfile = async () => {
        try {
            const data = await userApi.getUserById(targetId);
            setProfileUser(data);

            // Initialize form
            setBio(data.bio || '');
            setSkillsOffered(data.skillsOffered ? data.skillsOffered.join(', ') : '');
            setSkillsWanted(data.skillsWanted ? data.skillsWanted.join(', ') : '');
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                bio,
                skillsOffered: skillsOffered.split(',').map(s => s.trim()).filter(s => s),
                skillsWanted: skillsWanted.split(',').map(s => s.trim()).filter(s => s),
            };

            await userApi.updateProfile(targetId, updatedData);
            setIsEditing(false);
            fetchProfile(); // Refresh
            alert("Profile Updated Successfully!");
        } catch (error) {
            console.error("Update failed:", error);
            alert(`Failed to update profile: ${error.message}`);
        }
    };

    // Calculate Rank based on Points
    const getRank = (points) => {
        if (points > 1000) return { title: 'Grandmaster 🏆', color: 'text-yellow-500' };
        if (points > 500) return { title: 'Expert 🥇', color: 'text-purple-500' };
        if (points > 100) return { title: 'Advanced 🥈', color: 'text-blue-500' };
        return { title: 'Beginner 🥉', color: 'text-green-500' };
    };

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading...</div>;
    if (!profileUser) return <div className="min-h-screen pt-24 text-center">User not found.</div>;

    const rank = getRank(profileUser.skillPoints);

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-slate-900">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden"
                >
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-primary to-purple-600"></div>

                    <div className="px-8 pb-8">
                        {/* Avatar & Info */}
                        <div className="relative flex flex-col md:flex-row items-center md:items-end -mt-12 mb-6 gap-6">
                            <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1 shadow-lg">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
                                    {profileUser.name.charAt(0).toUpperCase()}
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profileUser.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400">{profileUser.role} • {profileUser.email}</p>
                            </div>

                            {/* Gamification Stats */}
                            <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-900 p-3 rounded-xl border border-gray-100 dark:border-white/10">
                                <div className="text-center px-4 border-r border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Points</p>
                                    <p className="text-xl font-bold text-primary">{profileUser.skillPoints}</p>
                                </div>
                                <div className="text-center px-2">
                                    <p className="text-xs text-gray-500 uppercase font-bold">Rank</p>
                                    <p className={`text-lg font-bold ${rank.color}`}>{rank.title}</p>
                                </div>
                            </div>
                        </div>

                        <hr className="border-gray-100 dark:border-white/5 my-6" />

                        {/* Main Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Left: Bio */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span>📝</span> About Me
                                </h3>
                                {isEditing ? (
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none"
                                        rows="4"
                                        placeholder="Tell us about yourself..."
                                    />
                                ) : (
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {profileUser.bio || "No bio yet."}
                                    </p>
                                )}
                            </div>

                            {/* Right: Skills */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">🚀 Skills Offered</h3>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={skillsOffered}
                                            onChange={(e) => setSkillsOffered(e.target.value)}
                                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="Java, React, Python (comma separated)"
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {profileUser.skillsOffered && profileUser.skillsOffered.length > 0 ? (
                                                profileUser.skillsOffered.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : <span className="text-gray-400 italic">None listed</span>}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">🎯 Skills Wanted</h3>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={skillsWanted}
                                            onChange={(e) => setSkillsWanted(e.target.value)}
                                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none"
                                            placeholder="Machine Learning, Design (comma separated)"
                                        />
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {profileUser.skillsWanted && profileUser.skillsWanted.length > 0 ? (
                                                profileUser.skillsWanted.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : <span className="text-gray-400 italic">None listed</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        {isOwnProfile && (
                            <div className="mt-8 flex justify-end">
                                {isEditing ? (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-6 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-2 rounded-xl font-bold text-white bg-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 rounded-xl font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
