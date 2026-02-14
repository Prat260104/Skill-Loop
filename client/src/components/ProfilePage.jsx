import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userApi } from '../api/userApi';
import InterviewModal from './InterviewModal';
import SessionRequestModal from './SessionRequestModal';
import InteractiveBackground from './InteractiveBackground';

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

    // Session Modal State
    const [isSessionRequestOpen, setIsSessionRequestOpen] = useState(false);

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
                const newExpLines = parsedData.experience.map(exp => exp.org);
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
        <div className="min-h-screen pt-20 pb-12 px-4 relative bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
            <InteractiveBackground />

            {/* Notification Toast */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: -20, x: '-50%' }}
                        className={`fixed top-24 left-1/2 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 border backdrop-blur-md ${notification.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' :
                            notification.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' :
                                'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'
                            }`}
                    >
                        <span className="text-xl">
                            {notification.type === 'success' ? '✨' : notification.type === 'error' ? '❌' : '⏳'}
                        </span>
                        <span className="font-semibold">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 dark:border-white/5 overflow-hidden"
                >
                    {/* Interactive Spotlight Banner */}
                    <div
                        className="h-48 relative overflow-hidden bg-slate-900 border-b border-white/10 group cursor-default"
                        onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                            e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                        }}
                    >
                        {/* 1. Base Deep Space Background */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0a0a0a] to-black"></div>

                        {/* 2. Grid & Noise (Subtle Texture) */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
                        <div className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
                        </div>

                        {/* 3. Floating Container for Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="relative flex flex-col items-center justify-center"
                            >
                                {/* === LAYER 1: DIM BASE TEXT (Always Visible) === */}
                                <h1 className="text-6xl md:text-8xl font-black text-white/5 tracking-tighter select-none transition-none">
                                    SKILL LOOP
                                </h1>
                                <p className="text-lg md:text-xl font-bold tracking-[0.8em] text-white/10 mt-2 uppercase transition-none">
                                    Connected
                                </p>

                                {/* === LAYER 2: GLOWING REVEAL TEXT (Masked by Cursor) === */}
                                <div
                                    className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-none"
                                    style={{
                                        maskImage: 'radial-gradient(circle 120px at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)',
                                        WebkitMaskImage: 'radial-gradient(circle 120px at var(--mouse-x) var(--mouse-y), black 0%, transparent 100%)',
                                    }}
                                >
                                    {/* The Text itself (Brighter with Cyan/Purple Gradient) */}
                                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-purple-500 tracking-tighter select-none drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-none">
                                        SKILL LOOP
                                    </h1>
                                    <p className="text-lg md:text-xl font-bold tracking-[0.8em] text-cyan-400 mt-2 uppercase drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-none">
                                        Connected
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    <div className="px-8 pb-12">
                        {/* Profile Header Section */}
                        <div className="relative flex flex-col md:flex-row items-end gap-6 -mt-16 mb-8">
                            {/* Avatar */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="relative group"
                            >
                                <div className="w-32 h-32 rounded-3xl bg-white dark:bg-slate-800 p-1.5 shadow-2xl rotate-3 hover:rotate-0 transition-all duration-300">
                                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-5xl font-bold text-white shadow-inner">
                                        {profileUser.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                                {/* Status Dot */}
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-lg">
                                    <div className="w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></div>
                                </div>
                            </motion.div>

                            {/* Name & Role */}
                            <div className="flex-1 text-center md:text-left mb-4 md:mb-0 translate-y-4">
                                <motion.h1
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight"
                                >
                                    {profileUser.name}
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex flex-wrap gap-3 justify-center md:justify-start items-center text-gray-600 dark:text-gray-300 font-medium"
                                >
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 flex items-center gap-2">
                                        💼 {profileUser.role || 'Member'}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 flex items-center gap-2">
                                        📧 {profileUser.email}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg border font-bold flex items-center gap-2 ${rank.color} bg-white/5`}>
                                        {rank.title}
                                    </span>
                                </motion.div>
                            </div>

                            {/* Actions Button Group */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex gap-4"
                            >
                                {isOwnProfile ? (
                                    isEditing ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5 transition-all"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowVerifyDropdown(!showVerifyDropdown)}
                                                className="relative px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                                            >
                                                <span>Verify Skills 🤖</span>
                                                {showVerifyDropdown && (
                                                    <div className="absolute top-full right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 text-left">
                                                        <div className="p-2">
                                                            <p className="px-3 py-2 text-xs font-bold text-gray-400 uppercase">Select Skill to Verify</p>
                                                            {profileUser.skillsOffered && profileUser.skillsOffered.length > 0 ? (
                                                                profileUser.skillsOffered.map((skill, i) => (
                                                                    <button
                                                                        key={i}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setInterviewSkill(skill);
                                                                            setIsInterviewOpen(true);
                                                                            setShowVerifyDropdown(false);
                                                                        }}
                                                                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-between group"
                                                                    >
                                                                        {skill}
                                                                        <span className="opacity-0 group-hover:opacity-100 text-primary">→</span>
                                                                    </button>
                                                                ))
                                                            ) : (
                                                                <p className="px-3 py-2 text-sm text-gray-500 italic">No skills added yet.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-3 rounded-xl font-bold text-gray-700 dark:text-white border-2 border-gray-200 dark:border-white/10 hover:border-primary hover:text-primary dark:hover:border-primary transition-all flex items-center gap-2"
                                            >
                                                <span>Edit Profile ✏️</span>
                                            </button>
                                        </div>
                                    )
                                ) : (
                                    <button
                                        onClick={() => setIsSessionRequestOpen(true)}
                                        className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/50 transform hover:-translate-y-0.5 transition-all text-lg flex items-center gap-2 animate-pulse-soft"
                                    >
                                        <span>📅 Request Session</span>
                                    </button>
                                )}
                            </motion.div>
                        </div>

                        {/* Resume Auto-Fill Section (Only for Owner) */}
                        {isOwnProfile && isEditing && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-8 p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-4"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                        ✨ AI Auto-Fill
                                    </h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Upload your resume to automatically populate Bio, Experience, and Skills.</p>
                                </div>
                                <div className="relative overflow-hidden group">
                                    <button
                                        disabled={uploading}
                                        className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 transition-all ${uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    >
                                        {uploading ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                                <span>Parsing Resume...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>📄 Upload PDF</span>
                                            </>
                                        )}
                                    </button>
                                    {!uploading && (
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleResumeUpload}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        )}

                        <hr className="border-gray-200 dark:border-white/5 mb-10" />

                        {/* Content Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                            {/* Left Column: About & Stats */}
                            <div className="space-y-8">
                                {/* About Card */}
                                <section>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        About Me
                                    </h3>
                                    {isEditing ? (
                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-gray-400"
                                            rows="6"
                                            placeholder="Tell not just what you do, but why you do it..."
                                        />
                                    ) : (
                                        <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-gray-600 dark:text-gray-300 leading-relaxed font-light text-lg">
                                            {profileUser.bio || "No bio yet."}
                                        </div>
                                    )}
                                </section>

                                {/* Points Card */}
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Skill Points</p>
                                        <p className="text-4xl font-black text-amber-500 mt-1">{profileUser.skillPoints}</p>
                                    </div>
                                    <div className="text-4xl">🏆</div>
                                </div>
                            </div>

                            {/* Right Column: Experience, Skills */}
                            <div className="lg:col-span-2 space-y-10">

                                {/* Experience Section */}
                                <section>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                        Professional Experience
                                    </h3>
                                    {isEditing ? (
                                        <textarea
                                            value={experience}
                                            onChange={(e) => setExperience(e.target.value)}
                                            className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all"
                                            rows="5"
                                            placeholder="Worked at Google (2020-2022)&#10;Senior Dev at Amazon"
                                        />
                                    ) : (
                                        <div className="space-y-4">
                                            {profileUser.experience && profileUser.experience.length > 0 ? (
                                                profileUser.experience.map((exp, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, x: 20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-default"
                                                    >
                                                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                                            💼
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800 dark:text-gray-200 text-lg group-hover:text-primary transition-colors">{exp}</p>
                                                            {/* Placeholder for duration/role if we parse it later */}
                                                            <p className="text-sm text-gray-500">Previous Role</p>
                                                        </div>
                                                    </motion.div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-400 bg-gray-50 dark:bg-white/5 rounded-2xl border-dashed border-2 border-gray-200 dark:border-white/10">
                                                    No experience listed yet.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </section>

                                {/* Skills Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Offered Skills */}
                                    <section>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            🚀 Can Teach
                                        </h3>
                                        {isEditing ? (
                                            <textarea
                                                value={skillsOffered}
                                                onChange={(e) => setSkillsOffered(e.target.value)}
                                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none"
                                                rows="3"
                                            />
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {profileUser.skillsOffered && profileUser.skillsOffered.length > 0 ? (
                                                    profileUser.skillsOffered.map((skill, i) => (
                                                        <span key={i} className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 transition-transform hover:scale-105 cursor-default
                                                            ${profileUser.verifiedSkills && profileUser.verifiedSkills.includes(skill)
                                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                                                : 'bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/10'}
                                                        `}>
                                                            {skill}
                                                            {profileUser.verifiedSkills && profileUser.verifiedSkills.includes(skill) && (
                                                                <span className="text-emerald-500 text-xs" title="Verified">✓</span>
                                                            )}
                                                        </span>
                                                    ))
                                                ) : <span className="text-gray-400 italic">None listed</span>}
                                            </div>
                                        )}
                                    </section>

                                    {/* Wanted Skills */}
                                    <section>
                                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                            🎯 Wants to Learn
                                        </h3>
                                        {isEditing ? (
                                            <textarea
                                                value={skillsWanted}
                                                onChange={(e) => setSkillsWanted(e.target.value)}
                                                className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none"
                                                rows="3"
                                            />
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {profileUser.skillsWanted && profileUser.skillsWanted.length > 0 ? (
                                                    profileUser.skillsWanted.map((skill, i) => (
                                                        <span key={i} className="px-4 py-2 rounded-xl text-sm font-bold bg-pink-500/5 text-pink-600 dark:text-pink-400 border border-pink-500/10 hover:bg-pink-500/10 transition-colors cursor-default">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : <span className="text-gray-400 italic">None listed</span>}
                                            </div>
                                        )}
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div >

                {/* Modals - Rendered at root level of container */}
                <InterviewModal
                    isOpen={isInterviewOpen}
                    onClose={() => setIsInterviewOpen(false)}
                    skill={interviewSkill}
                    userId={profileUser.id}
                    onVerified={(skill) => {
                        setIsInterviewOpen(false);
                        setNotification({ type: 'success', message: `${skill} Verified! Points Awarded! 🏆` });
                        fetchProfile();
                    }}
                />

                <SessionRequestModal
                    isOpen={isSessionRequestOpen}
                    onClose={() => setIsSessionRequestOpen(false)}
                    mentor={profileUser}
                    currentUser={currentUser}
                />
            </div >
        </div >
    );
}
