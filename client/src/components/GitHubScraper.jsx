import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveBackground from './InteractiveBackground';

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
            // Get User ID from Local Storage
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

            const response = await fetch('http://localhost:9090/api/github/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to save profile');
            }

            setSaveMessage("✅ Success! Profile Saved & Skills Updated.");
        } catch (err) {
            console.error(err);
            setSaveMessage("❌ Error: " + err.message);
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
            // Direct call to Python Service (Preview Mode)
            const response = await fetch('http://127.0.0.1:8000/api/v1/github/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ github_url: username })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.detail || 'Failed to analyze profile');
            }

            // Parse nested JSON from Gemini if it's a string
            let aiAnalysis = result.ai_analysis;
            if (typeof aiAnalysis === 'string') {
                try {
                    // Remove Markdown code block syntax if present
                    const cleanJson = aiAnalysis.replace(/```json/g, '').replace(/```/g, '').trim();
                    aiAnalysis = JSON.parse(cleanJson);
                } catch (e) {
                    console.error("Failed to parse AI JSON", e);
                    // Fallback if AI returns plain text instead of JSON
                    aiAnalysis = { summary: result.ai_analysis, seniority: "Unknown", frameworks: [] };
                }
            }

            setData({ ...result, ai_analysis: aiAnalysis });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 text-white p-8">

            {/* 0. Canvas Particle Network */}
            <InteractiveBackground />

            {/* 1. Ambient Glow Blobs (Parallax feel) */}
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse-glow pointer-events-none" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] opacity-30 animate-pulse-glow delay-1000 pointer-events-none" />

            {/* 2. Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-4xl relative"
            >
                {/* Header Section */}
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block mb-4 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md"
                    >
                        <span className="text-sm font-medium text-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                            🚀 Hybrid Intelligence Engine
                        </span>
                    </motion.div>

                    <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight leading-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 animate-gradient-x">
                            GitHub Hybrid Intelligence
                        </span>
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
                        Analyze any GitHub profile using <span className="text-yellow-400 font-semibold">GIT BIT</span> + <span className="text-blue-400 font-semibold">SKILL LOOP</span>
                    </p>
                </div>

                {/* Input Section */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl mb-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex flex-col md:flex-row gap-4 relative z-10">
                        <input
                            type="text"
                            placeholder="Enter GitHub Username or URL (e.g., prateekrai)"
                            className="flex-1 bg-black/20 border border-white/10 text-white px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-lg placeholder:text-gray-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && analyzeProfile()}
                        />
                        <button
                            onClick={analyzeProfile}
                            disabled={loading}
                            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${loading
                                ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                : 'bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/25 hover:shadow-primary/50 text-white'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Analyzing...
                                </span>
                            ) : 'Analyze Profile 🚀'}
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center font-medium"
                        >
                            ⚠️ {error}
                        </motion.div>
                    )}
                </div>

                {/* Results Section */}
                <AnimatePresence>
                    {data && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* Left Column: Hard Data */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-colors">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-cyan-400">
                                    <span className="bg-cyan-500/20 p-2.5 rounded-xl">📊</span> Verified Hard Data
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-4 bg-black/20 rounded-xl border border-white/5">
                                        <span className="text-gray-400">Repositories Scanned</span>
                                        <span className="text-3xl font-bold text-white">{data.top_projects_count}</span>
                                    </div>

                                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                        <span className="text-gray-400 block mb-3 text-sm uppercase tracking-wider">Verified Languages</span>
                                        <div className="flex flex-wrap gap-2">
                                            {data.verified_languages.map((lang, index) => (
                                                <span key={index} className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-sm font-medium text-cyan-200">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: AI Intelligence */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:bg-white/10 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-pink-400 relative z-10">
                                    <span className="bg-pink-500/20 p-2.5 rounded-xl">🧠</span> Gemini AI Insight
                                </h3>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                                        <span className="text-gray-400">Seniority Level</span>
                                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-lg ${data.ai_analysis.seniority === 'Advanced' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                            data.ai_analysis.seniority === 'Intermediate' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                            }`}>
                                            {data.ai_analysis.seniority}
                                        </span>
                                    </div>

                                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                        <span className="text-gray-400 block mb-3 text-sm uppercase tracking-wider">Implied Tech Stack</span>
                                        <div className="flex flex-wrap gap-2">
                                            {data.ai_analysis.frameworks?.map((tech, i) => (
                                                <span key={i} className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-200 rounded-lg text-sm">
                                                    {tech}
                                                </span>
                                            )) || <span className="text-gray-500 italic">None detected</span>}
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-gradient-to-br from-white/5 to-transparent rounded-xl border border-white/10 italic text-gray-300 text-sm leading-relaxed">
                                        "{data.ai_analysis.summary}"
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Save Button */}
            {data && (
                <div className="mt-12 z-10 text-center">
                    <button
                        onClick={saveProfile}
                        disabled={saving}
                        className={`px-10 py-4 rounded-full font-bold text-white shadow-2xl transition-all flex items-center gap-3 mx-auto text-lg ${saving
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-emerald-500/40 hover:-translate-y-1'
                            }`}
                    >
                        {saving ? (
                            <>
                                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span>💾</span> Save to Skill Loop Profile
                            </>
                        )}
                    </button>
                    {saveMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`inline-block mt-6 px-6 py-3 rounded-xl backdrop-blur-md border ${saveMessage.includes('Success')
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                        >
                            <span className="font-semibold">{saveMessage}</span>
                        </motion.div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GitHubScraper;
