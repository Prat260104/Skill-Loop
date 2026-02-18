import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiStar } from 'react-icons/hi';

const SessionReviewModal = ({ isOpen, onClose, onSubmit, session }) => {
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (review.trim().length < 10) {
            alert("Please write a bit more detailed review (at least 10 characters).");
            return;
        }
        setIsSubmitting(true);
        await onSubmit(review, rating);
        setIsSubmitting(false);
        setReview('');
        setRating(0);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-slate-700"
                >
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
                                    onClick={onClose}
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
                                            Submitting...
                                        </span>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SessionReviewModal;
