import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userApi } from '../api/userApi';
import InterviewModal from './InterviewModal';

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
    const [experience, setExperience] = useState(''); // New State for Experience

    // UI States
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState(null); // { type, message }

    // Interview Modal State
    const [isInterviewOpen, setIsInterviewOpen] = useState(false);
    const [interviewSkill, setInterviewSkill] = useState(null);
    const [showVerifyDropdown, setShowVerifyDropdown] = useState(false);

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
            setSkillsOffered(data.skillsOffered ? [...new Set(data.skillsOffered)].join(', ') : '');
            setSkillsWanted(data.skillsWanted ? data.skillsWanted.join(', ') : '');
            setExperience(data.experience ? data.experience.join('\n') : ''); // Join with newlines for text area
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleResumeUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        setNotification({ type: 'info', message: 'Parsing your resume...' });

        try {
            const parsedData = await userApi.uploadResume(targetId, file);

            // 1. Auto-fill Skills (Deduplicated)
            let newSkills = parsedData.skills || [];
            const currentSkills = skillsOffered.split(',').map(s => s.trim()).filter(s => s);
            const combinedSkills = [...new Set([...currentSkills, ...newSkills])]; // Deduplicate
            const updatedSkillsStr = combinedSkills.join(', ');
            setSkillsOffered(updatedSkillsStr);

            // 2. Auto-fill Bio (from Summary if available)
            if (parsedData.summary) {
                setBio(parsedData.summary);
            }

            // 3. Auto-fill Experience
            if (parsedData.experience && parsedData.experience.length > 0) {
                // parsedData.experience is likely List<Map> from API: [{org: "Google", type: "AI"}, ...]
                // We want to format it nicely for the text area
                const newExpLines = parsedData.experience.map(exp => `Worked at ${exp.org}`);
                setExperience(newExpLines.join('\n'));
            }

            setNotification({ type: 'success', message: 'Success! Profile auto-filled.' });
            setTimeout(() => setNotification(null), 3000);

        } catch (error) {
            console.error("Resume upload failed", error);
            setNotification({ type: 'error', message: 'Failed to parse resume.' });
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            const updatedData = {
                bio,
                skillsOffered: skillsOffered.split(',').map(s => s.trim()).filter(s => s),
                skillsWanted: skillsWanted.split(',').map(s => s.trim()).filter(s => s),
                experience: experience.split('\n').map(s => s.trim()).filter(s => s) // Split by newline to send as List
            };

            await userApi.updateProfile(targetId, updatedData);
            setIsEditing(false);
            fetchProfile(); // Refresh
            setNotification({ type: 'success', message: 'Profile Updated Successfully!' });
            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            console.error("Update failed:", error);
            setNotification({ type: 'error', message: `Failed to update profile: ${error.message}` });
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
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-slate-900 relative">
            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-24 left-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border ${notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                            notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' :
                                'bg-blue-50 border-blue-200 text-blue-700'
                            }`}
                    >
                        <span className="text-xl">
                            {notification.type === 'success' ? '✨' : notification.type === 'error' ? '❌' : '⏳'}
                        </span>
                        <span className="font-semibold">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
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

                            {/* Middle: Experience Section (New) */}
                            <div className="space-y-4 md:col-span-2">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                    <span>💼</span> Experience
                                </h3>
                                {isEditing ? (
                                    <textarea
                                        value={experience}
                                        onChange={(e) => setExperience(e.target.value)}
                                        className="w-full p-3 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none"
                                        rows="4"
                                        placeholder="Worked at Google&#10;Intern at Amazon"
                                    />
                                ) : (
                                    <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-1">
                                        {profileUser.experience && profileUser.experience.length > 0 ? (
                                            profileUser.experience.map((exp, i) => (
                                                <li key={i}>{exp}</li>
                                            ))
                                        ) : <li className="text-gray-400 italic list-none">No experience listed.</li>}
                                    </ul>
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
                                                    <div key={i} className="group relative inline-block">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-2
                                                            ${profileUser.verifiedSkills && profileUser.verifiedSkills.includes(skill)
                                                                ? 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200'
                                                                : 'bg-gray-50 text-gray-700 border-gray-200'}
                                                        `}>
                                                            {skill}
                                                            {profileUser.verifiedSkills && profileUser.verifiedSkills.includes(skill) ? (
                                                                <span className="text-emerald-500" title="Verified Skill">✓</span>
                                                            ) : null}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : <span className="text-gray-400 italic">None listed</span>}
                                        </div>
                                    )}
                                </div>

                                {/* Interview Modal */}
                                <InterviewModal
                                    isOpen={isInterviewOpen}
                                    onClose={() => setIsInterviewOpen(false)}
                                    skill={interviewSkill}
                                    userId={profileUser.id}
                                    onVerified={(skill) => {
                                        setIsInterviewOpen(false);
                                        setNotification({ type: 'success', message: `${skill} Verified! Points Awarded! 🏆` });
                                        fetchProfile(); // Refresh to show badge
                                    }}
                                />
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
                                <div className="flex gap-3 items-center">
                                    <div className="relative overflow-hidden inline-block group">
                                        <button
                                            disabled={uploading}
                                            className={`
                                                    px-5 py-2.5 rounded-xl font-bold text-white shadow-lg 
                                                    flex items-center gap-2 transition-all transform 
                                                    ${uploading
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 active:scale-95'
                                                }
                                                `}
                                        >
                                            {uploading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>Processing...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-lg">📄</span>
                                                    <span>Auto-Fill from Resume</span>
                                                </>
                                            )}
                                        </button>
                                        {!uploading && (
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleResumeUpload}
                                                className="absolute left-0 top-0 opacity-0 w-full h-full cursor-pointer"
                                                title="Upload PDF Resume to auto-fill skills"
                                            />
                                        )}
                                    </div>
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
                                <div className="flex gap-3 relative">
                                    {/* Verify Skills Dropdown */}
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowVerifyDropdown(!showVerifyDropdown)}
                                            className="px-6 py-2 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 transition-all"
                                        >
                                            Verify Skills 🤖
                                        </button>

                                        {showVerifyDropdown && (
                                            <div className="absolute bottom-full mb-2 right-0 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-20">
                                                <div className="p-2">
                                                    <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase">Select Skill to Verify</p>
                                                    {profileUser.skillsOffered && profileUser.skillsOffered.length > 0 ? (
                                                        profileUser.skillsOffered.map((skill, i) => (
                                                            <button
                                                                key={i}
                                                                onClick={() => {
                                                                    setInterviewSkill(skill);
                                                                    setIsInterviewOpen(true);
                                                                    setShowVerifyDropdown(false);
                                                                }}
                                                                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                                            >
                                                                {skill}
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <p className="px-3 py-2 text-sm text-gray-500 italic">No skills to verify.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 rounded-xl font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div >
            </div >
        </div >
    );
}
