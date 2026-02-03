import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MentorCard from '../cards/MentorCard';
import { motion } from 'framer-motion';

const RecommendedMentors = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // TODO: dynamic user ID from Auth Context
    const currentUserId = 1;

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // API Call to our Spring Boot Backend
                const response = await axios.get(`http://localhost:9090/api/recommendations/${currentUserId}`);
                setMentors(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch matches:", err);
                setError("Could not load recommendations.");
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="flex gap-4 overflow-hidden py-4">
                {/* Simple Shimmer Skeleton */}
                {[1, 2, 3].map((n) => (
                    <div key={n} className="w-80 h-64 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-400 p-4 bg-red-500/10 rounded-xl">{error}</div>;
    }

    if (mentors.length === 0) {
        return (
            <div className="text-gray-400 p-6 text-center border border-gray-700 border-dashed rounded-xl">
                <p>No matches yet. Try adding more skills to your profile!</p>
            </div>
        );
    }

    return (
        <section className="mb-12">
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
                ✨ Recommended Mentors
            </motion.h2>

            {/* Horizontal Scroll Container */}
            <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
                {mentors.map((mentor) => (
                    <div key={mentor.id} className="snap-center">
                        <MentorCard mentor={mentor} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RecommendedMentors;
