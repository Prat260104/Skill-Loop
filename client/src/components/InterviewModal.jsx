import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { verificationApi } from '../api/verificationApi';

export default function InterviewModal({ isOpen, onClose, skill, userId, onVerified }) {
    const [step, setStep] = useState('intro'); // intro, loading, question, evaluating, result
    const [questionData, setQuestionData] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const startInterview = async () => {
        setStep('loading');
        setError(null);
        try {
            const data = await verificationApi.generateQuestion(skill, userId);
            if (data.error) throw new Error(data.error);
            setQuestionData(data);
            setStep('question');
        } catch (err) {
            setError(err.message);
            setStep('error');
        }
    };

    const submitAnswer = async () => {
        if (!userAnswer.trim()) return;
        setStep('evaluating');
        try {
            const data = await verificationApi.evaluateAnswer({
                question: questionData.question,
                userAnswer,
                userId,
                skill
            });
            setResult(data);
            setStep('result');
            if (data.is_verified && onVerified) {
                onVerified(skill);
            }
        } catch (err) {
            setError(err.message);
            setStep('error');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <span>🤖</span> AI Interviewer
                        </h2>
                        <p className="text-indigo-100 text-sm">Verifying Skill: <span className="font-bold">{skill}</span></p>
                    </div>
                    <button onClick={onClose} className="text-white/80 hover:text-white text-2xl">&times;</button>
                </div>

                {/* Body */}
                <div className="p-8 overflow-y-auto flex-1">

                    {step === 'intro' && (
                        <div className="text-center space-y-6">
                            <div className="text-6xl">🎓</div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Ready for your challenge?</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                The AI Agent will generate a unique, senior-level conceptual question about <b>{skill}</b>.
                            </p>
                            <button
                                onClick={startInterview}
                                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all"
                            >
                                Start Interview
                            </button>
                        </div>
                    )}

                    {(step === 'loading' || step === 'evaluating') && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-semibold animate-pulse">
                                {step === 'loading' ? 'Generating Question...' : 'Evaluating Answer...'}
                            </p>
                        </div>
                    )}

                    {step === 'question' && questionData && (
                        <div className="space-y-6">
                            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-xl border border-indigo-100 dark:border-indigo-500/30">
                                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1 block">Question</span>
                                <p className="text-lg font-medium text-gray-800 dark:text-indigo-50 leading-relaxed">
                                    {questionData.question}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Answer</label>
                                <textarea
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    className="w-full h-40 p-4 rounded-xl bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-mono text-sm"
                                    placeholder="Type your explanation or code here..."
                                />
                            </div>

                            <button
                                onClick={submitAnswer}
                                disabled={!userAnswer.trim()}
                                className="w-full py-3 bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all"
                            >
                                Submit Answer
                            </button>
                        </div>
                    )}

                    {step === 'result' && result && (
                        <div className="text-center space-y-6">
                            <div className="transform scale-150 mb-4">
                                {result.is_verified ? '🎉' : '📚'}
                            </div>

                            <div>
                                <h3 className={`text-3xl font-bold mb-2 ${result.is_verified ? 'text-green-600' : 'text-orange-500'}`}>
                                    {result.is_verified ? 'Verified!' : 'Not Verified'}
                                </h3>
                                <p className="text-4xl font-black text-gray-800 dark:text-white mb-1">
                                    {result.score}<span className="text-xl text-gray-400">/100</span>
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-slate-900 p-6 rounded-xl text-left border border-gray-100 dark:border-white/5">
                                <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-2">AI Feedback:</h4>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {result.feedback}
                                </p>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button onClick={onClose} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg">
                                    Close
                                </button>
                                {!result.is_verified && (
                                    <button onClick={startInterview} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg">
                                        Try Again
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="text-center py-12">
                            <div className="text-4xl mb-4">⚠️</div>
                            <h3 className="text-xl font-bold text-red-500 mb-2">Something went wrong</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Unknown error occurred'}</p>
                            <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-bold">
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
