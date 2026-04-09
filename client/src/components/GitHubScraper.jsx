import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSearch, HiArrowRight, HiChartBar, HiSparkles, HiSave, HiExclamation, HiCode, HiLightningBolt, HiShieldCheck, HiDatabase } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import DinoLoader from './DinoLoader';
import api from '../api/axiosConfig';

const GitHubScraper = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    const saveProfile = async () => {
        setSaving(true);
        setSaveMessage(null);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.id) {
                throw new Error("User not found. Please login.");
            }

            const payload = {
                user_id: user.id,
                username: data.username,
                top_projects_count: data.top_projects_count,
                verified_languages: data.verified_languages,
                ai_analysis: data.ai_analysis
            };

            await api.post('/api/github/save', payload);

            setSaveMessage({ type: 'success', text: 'Profile saved & skills updated successfully.' });
        } catch (err) {
            console.error(err);
            setSaveMessage({ type: 'error', text: err.response?.data || err.message || 'Failed to save profile' });
        } finally {
            setSaving(false);
        }
    };

    const analyzeProfile = async () => {
        if (!username) return;

        setLoading(true);
        setError(null);
        setData(null);

        try {
            const response = await api.post('http://127.0.0.1:8001/api/v1/github/analyze', { github_url: username });
            const result = response.data;

            let aiAnalysis = result.ai_analysis;
            if (typeof aiAnalysis === 'string') {
                try {
                    const cleanJson = aiAnalysis.replace(/```json/g, '').replace(/```/g, '').trim();
                    aiAnalysis = JSON.parse(cleanJson);
                } catch (e) {
                    console.error("Failed to parse AI JSON", e);
                    aiAnalysis = { summary: result.ai_analysis, seniority: "Unknown", frameworks: [] };
                }
            }

            setData({ ...result, ai_analysis: aiAnalysis });
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Failed to analyze profile');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        {
            icon: <HiCode className="w-6 h-6" />,
            title: "Repository Scan",
            description: "Scans your top public repositories to extract real languages and tech patterns.",
            color: "from-cyan-500 to-blue-600",
            bg: "bg-cyan-500/10 border-cyan-500/20",
            iconBg: "bg-cyan-500/20 text-cyan-400"
        },
        {
            icon: <HiSparkles className="w-6 h-6" />,
            title: "AI Analysis",
            description: "Gemini AI evaluates your code patterns, seniority level, and implied frameworks.",
            color: "from-purple-500 to-pink-600",
            bg: "bg-purple-500/10 border-purple-500/20",
            iconBg: "bg-purple-500/20 text-purple-400"
        },
        {
            icon: <HiShieldCheck className="w-6 h-6" />,
            title: "Skill Verification",
            description: "Verified languages from actual code — no self-reported skills, only proven ones.",
            color: "from-emerald-500 to-green-600",
            bg: "bg-emerald-500/10 border-emerald-500/20",
            iconBg: "bg-emerald-500/20 text-emerald-400"
        },
        {
            icon: <HiDatabase className="w-6 h-6" />,
            title: "Profile Sync",
            description: "One click to save verified skills directly to your Skill Loop profile.",
            color: "from-amber-500 to-orange-600",
            bg: "bg-amber-500/10 border-amber-500/20",
            iconBg: "bg-amber-500/20 text-amber-400"
        }
    ];

    return (
        <div className="min-h-screen pt-20 pb-16 bg-gray-50 dark:bg-slate-900 transition-colors">

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Subtle gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.15),transparent_50%)]" />

                <div className="relative z-10 max-w-5xl mx-auto px-4 pt-16 pb-20">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                            <FaGithub className="w-4 h-4 text-gray-300" />
                            <span className="text-sm font-medium text-gray-300">GitHub Profile Analyzer</span>
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-center mb-4"
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                            Prove Your Skills with{' '}
                            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                                Real Code
                            </span>
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                            Enter any GitHub username to get AI-powered analysis of coding skills, seniority level, and tech stack — verified from actual repositories.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto mt-10"
                    >
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <DinoLoader />
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex-1 relative">
                                    <FaGithub className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Enter GitHub username..."
                                        className="w-full bg-white/10 border border-white/15 text-white pl-12 pr-4 py-4 rounded-2xl focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all text-base placeholder:text-gray-500"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && analyzeProfile()}
                                    />
                                </div>
                                <button
                                    onClick={analyzeProfile}
                                    disabled={loading || !username}
                                    className="px-8 py-4 rounded-2xl font-bold text-base transition-all bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    Analyze <HiArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center font-medium flex items-center justify-center gap-2"
                            >
                                <HiExclamation className="w-5 h-5" /> {error}
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* Results Section */}
            <AnimatePresence>
                {data && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-5xl mx-auto px-4 -mt-6"
                    >
                        {/* Profile Summary Bar */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shrink-0">
                                {data.username?.charAt(0)?.toUpperCase() || 'G'}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{data.username}</h2>
                                <div className="flex flex-wrap gap-3 mt-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                                        {data.top_projects_count} repos scanned
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${data.ai_analysis.seniority === 'Advanced' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' :
                                        data.ai_analysis.seniority === 'Intermediate' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' :
                                            'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20'
                                        }`}>
                                        {data.ai_analysis.seniority} Level
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={saveProfile}
                                disabled={saving}
                                className={`px-6 py-3 rounded-xl font-bold text-white flex items-center gap-2 transition-all shrink-0 ${saving
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5'
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <HiSave className="w-5 h-5" /> Save to Profile
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Save Message */}
                        {saveMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 rounded-xl text-sm font-medium text-center border ${saveMessage.type === 'success'
                                    ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20'
                                    : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                                    }`}
                            >
                                {saveMessage.text}
                            </motion.div>
                        )}

                        {/* Data Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Verified Languages */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                                        <HiChartBar className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Verified Languages</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {data.verified_languages.map((lang, index) => (
                                        <span key={index} className="px-4 py-2 rounded-xl text-sm font-semibold bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Implied Tech Stack */}
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                        <HiSparkles className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Implied Tech Stack</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {data.ai_analysis.frameworks?.map((tech, i) => (
                                        <span key={i} className="px-4 py-2 rounded-xl text-sm font-semibold bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20">
                                            {tech}
                                        </span>
                                    )) || <span className="text-gray-400 italic">None detected</span>}
                                </div>
                            </div>
                        </div>

                        {/* AI Summary */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm p-6 mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                                    <HiSparkles className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Summary</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-base">
                                {data.ai_analysis.summary}
                            </p>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* How It Works - always visible, fills the page */}
            {!data && !loading && (
                <section className="max-w-5xl mx-auto px-4 py-16">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">How It Works</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                            Our pipeline combines GitHub API scraping with Gemini AI to deliver verified, meaningful skill analysis.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * i }}
                                className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-white/10 p-6 hover:border-gray-300 dark:hover:border-white/20 hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                        {feature.icon}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step {i + 1}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Powered by GitHub API + Gemini AI</span>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default GitHubScraper;
