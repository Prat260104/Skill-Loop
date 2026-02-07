import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GitHubScraper = () => {
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

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
        <div className="min-h-screen bg-black text-white p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-4xl"
            >
                <h1 className="text-5xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
                    GitHub Hybrid Intelligence
                </h1>
                <p className="text-gray-400 text-center mb-10 text-lg">
                    Analyze any GitHub profile using <span className="text-yellow-400">Official API</span> + <span className="text-blue-400">Gemini AI</span>
                </p>

                {/* Input Section */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 p-8 rounded-3xl shadow-2xl mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Enter GitHub Username or URL (e.g., prateekrai)"
                            className="flex-1 bg-gray-800/50 border border-gray-700 text-white px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-lg"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && analyzeProfile()}
                        />
                        <button
                            onClick={analyzeProfile}
                            disabled={loading}
                            className={`px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${loading
                                    ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/25'
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
                            className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-center"
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
                            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-6 rounded-3xl">
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400">
                                    <span className="bg-cyan-500/20 p-2 rounded-lg">📊</span> Verified Hard Data
                                </h3>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-xl">
                                        <span className="text-gray-400">Repositories Scanned</span>
                                        <span className="text-2xl font-bold">{data.top_projects_count}</span>
                                    </div>

                                    <div>
                                        <span className="text-gray-400 block mb-2">Verified Languages</span>
                                        <div className="flex flex-wrap gap-2">
                                            {data.verified_languages.map((lang, index) => (
                                                <span key={index} className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-full text-sm font-medium">
                                                    {lang}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: AI Intelligence */}
                            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-700/50 p-6 rounded-3xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-pink-400">
                                    <span className="bg-pink-500/20 p-2 rounded-lg">🧠</span> Gemini AI Insight
                                </h3>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">Seniority Level</span>
                                        <span className={`px-4 py-1 rounded-full text-sm font-bold ${data.ai_analysis.seniority === 'Advanced' ? 'bg-green-500/20 text-green-400' :
                                                data.ai_analysis.seniority === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {data.ai_analysis.seniority}
                                        </span>
                                    </div>

                                    <div>
                                        <span className="text-gray-400 block mb-2">Implied Tech Stack</span>
                                        <div className="flex flex-wrap gap-2">
                                            {data.ai_analysis.frameworks?.map((tech, i) => (
                                                <span key={i} className="px-3 py-1 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded-lg text-sm">
                                                    {tech}
                                                </span>
                                            )) || <span className="text-gray-500 italic">None detected</span>}
                                        </div>
                                    </div>

                                    <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 italic text-gray-300 text-sm">
                                        "{data.ai_analysis.summary}"
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Save Button (For Future Integration) */}
            {data && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-8 z-10"
                >
                    <button className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-full font-bold text-white shadow-lg shadow-green-500/20 transition-all flex items-center gap-2">
                        <span>💾</span> Save to Skill Loop Profile
                    </button>
                    <p className="text-center text-gray-500 text-xs mt-2">Connecting to Spring Boot...</p>
                </motion.div>
            )}
        </div>
    );
};

export default GitHubScraper;
