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
        <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 text-white p-4 md:p-8">

            {/* 0. Canvas Particle Network */}
            <InteractiveBackground />

            {/* 1. Ambient Glow Blobs */}
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse-glow pointer-events-none" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] opacity-30 animate-pulse-glow delay-1000 pointer-events-none" />

            {/* 2. Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20"></div>

            {/* 3. ORBITING TITLE (Floating Animation) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 hidden md:flex">
                <motion.div
                    className="w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] rounded-full absolute"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                >
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 whitespace-nowrap"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-xs font-semibold text-gray-300 tracking-wide uppercase">
                                    System Online
                                </span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-center">
                                <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500 drop-shadow-sm">
                                    Skill Loop Connected
                                </span>
                            </h1>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Mobile-Only Static Header */}
            <div className="md:hidden text-center mb-8 relative z-20">
                <h1 className="text-3xl font-black tracking-tight mb-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-gray-200 to-gray-500">
                        Skill Loop Connected
                    </span>
                </h1>
            </div>


            {/* Main Content (Center) */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-3xl relative flex flex-col items-center"
            >
                {/* Subtitle & Badges */}
                <div className="text-center mb-4">
                    <p className="text-gray-400 text-lg mb-4">Analyze any profile with:</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {/* Git Bit Chip */}
                        <div className="group relative px-5 py-2 rounded-xl bg-gray-900/60 border border-gray-700 hover:border-yellow-500/50 transition-all duration-300 cursor-default">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-500">⚡</span>
                                <span className="font-bold text-sm text-gray-300 group-hover:text-yellow-400 transition-colors">GIT BIT</span>
                            </div>
                        </div>
                        <span className="text-gray-600 self-center">+</span>
                        {/* Skill Loop Chip */}
                        <div className="group relative px-5 py-2 rounded-xl bg-gray-900/60 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 cursor-default">
                            <div className="flex items-center gap-2">
                                <span className="text-blue-500 group-hover:rotate-180 transition-transform duration-500">🔄</span>
                                <span className="font-bold text-sm text-gray-300 group-hover:text-blue-400 transition-colors">SKILL LOOP</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input Section - Reduced Size */}
                <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl mb-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="flex flex-col md:flex-row gap-3 relative z-10">
                        <div className="flex-1 relative group/input">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-500 group-focus-within/input:text-primary transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter GitHub Username"
                                className="w-full bg-black/20 border-2 border-white/5 text-white pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-primary/50 focus:bg-black/40 transition-all duration-300 text-base placeholder:text-gray-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && analyzeProfile()}
                            />
                        </div>
                        <button
                            onClick={analyzeProfile}
                            disabled={loading}
                            className={`px-6 py-3 rounded-xl font-bold text-base transition-all transform hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap ${loading
                                ? 'bg-gray-800 cursor-not-allowed text-gray-500'
                                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white shadow-purple-500/25 hover:shadow-purple-500/50'
                                }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Running...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Analyze 🚀
                                </span>
                            )}
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
                            className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
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
