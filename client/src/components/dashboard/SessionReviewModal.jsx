import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiStar, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';

/**
 * Two-Step Session Review Modal
 * 
 * Step 1: Student writes review + gives star rating → clicks Submit
 * Step 2: Shows result from backend DTO (success/flagged message, sentiment label, points info)
 * 
 * WHY two steps?
 * → Best practice: user gets immediate visual feedback after submit
 * → If sentiment was toxic, we show a gentle message (not punitive)
 * → If AI failed, we still show "Session completed" (fail-open UX)
 * 
 * INTERVIEW TIP: "I implemented a two-step modal pattern — submit then result —
 * to give progressive disclosure. The result step adapts based on the backend DTO,
 * showing different feedback for normal vs flagged reviews."
 */
const SessionReviewModal = ({ isOpen, onClose, onSubmit, session, completionResult }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    // Are we in the result step? (completionResult is the DTO from backend)
    const showResult = completionResult !== null && completionResult !== undefined;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (review.trim().length < 10) {
            alert("Please write a bit more detailed review (at least 10 characters).");
            return;
        }
        setIsSubmitting(true);
        await onSubmit(review, rating);
        setIsSubmitting(false);
        // Don't reset form or close — parent will set completionResult → shows result step
    };

    const handleClose = () => {
        // Reset form state when closing
        setReview('');
        setRating(0);
        setHover(0);
        onClose();
    };

    // =============================================
    // Sentiment label ko user-friendly text me convert
    // =============================================
    const getSentimentDisplay = (label) => {
        if (!label) return null; // ML failed — don't show anything
        switch (label) {
            case 'POSITIVE': return { text: 'Mostly Positive', emoji: '😊', color: 'text-green-600 dark:text-green-400' };
            case 'NEGATIVE': return { text: 'Mostly Negative', emoji: '😔', color: 'text-red-500 dark:text-red-400' };
            default: return { text: 'Mixed', emoji: '😐', color: 'text-yellow-600 dark:text-yellow-400' };
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
                onClick={(e) => e.target === e.currentTarget && handleClose()}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-700"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Session Review"
                >
                    {/* ====== STEP 2: Result Screen ====== */}
                    {showResult ? (
                        <div className="p-8 text-center">
                            {/* Success/Warning Icon */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                className="mb-6"
                            >
                                {completionResult.flaggedForReview ? (
                                    <HiExclamationCircle className="w-16 h-16 text-amber-500 mx-auto" />
                                ) : (
                                    <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                                )}
                            </motion.div>

                            {/* Main Message */}
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {completionResult.message}
                            </h2>

                            {/* Details Card */}
                            <div className="mt-6 bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-3 text-left">
                                {/* Points Info */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Mentor Points</span>
                                    <span className={`text-sm font-semibold ${completionResult.pointsAwarded ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                        {completionResult.pointsAwarded ? '+50 Awarded ✓' : 'Under Review'}
                                    </span>
                                </div>

                                {/* Sentiment Label (only if ML responded) */}
                                {completionResult.sentimentLabel && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">Feedback Tone</span>
                                        <span className={`text-sm font-semibold ${getSentimentDisplay(completionResult.sentimentLabel)?.color}`}>
                                            {getSentimentDisplay(completionResult.sentimentLabel)?.emoji}{' '}
                                            {getSentimentDisplay(completionResult.sentimentLabel)?.text}
                                        </span>
                                    </div>
                                )}

                                {/* Review Submitted */}
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Review</span>
                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                        {completionResult.reviewSubmitted ? 'Submitted ✓' : 'Skipped'}
                                    </span>
                                </div>
                            </div>

                            {/* Flagged Message (neutral, non-accusatory copy) */}
                            {completionResult.flaggedForReview && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-4 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg"
                                >
                                    Thank you for your feedback. Our team will review it shortly.
                                </motion.p>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="mt-6 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all"
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        /* ====== STEP 1: Review Form ====== */
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                Rate your Session <HiStar className="w-6 h-6 text-yellow-400" />
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                How was your session with <span className="font-semibold text-indigo-600 dark:text-indigo-400">{session?.mentor?.name}</span>?
                                Your feedback helps us improve the community.
                            </p>

                            <form onSubmit={handleSubmit}>
                                {/* Star Rating */}
                                <div className="flex justify-center mb-6">
                                    {[...Array(5)].map((_, index) => {
                                        const ratingValue = index + 1;
                                        return (
                                            <button
                                                type="button"
                                                key={ratingValue}
                                                className={`text-3xl mx-1 transition-colors duration-200 focus:outline-none ${ratingValue <= (hover || rating)
                                                    ? "text-yellow-400"
                                                    : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                                onClick={() => setRating(ratingValue)}
                                                onMouseEnter={() => setHover(ratingValue)}
                                                onMouseLeave={() => setHover(rating)}
                                                aria-label={`Rate ${ratingValue} star${ratingValue > 1 ? 's' : ''}`}
                                            >
                                                ★
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Review Textarea */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Your Review
                                    </label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                                        rows="4"
                                        placeholder="What did you learn? Was the mentor helpful?"
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        required
                                    ></textarea>
                                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 text-right">
                                        {review.length} characters
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
                                        disabled={isSubmitting || !rating}
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Analyzing...
                                            </span>
                                        ) : (
                                            "Submit Review"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SessionReviewModal;
