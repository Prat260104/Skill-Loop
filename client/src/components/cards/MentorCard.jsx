import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sendConnectionRequest, getConnectionStatus } from '../../api/connectionApi';

const MentorCard = ({ mentor, currentUserId }) => {
    const { id: mentorId, name, role, skillsOffered, matchScore, bio } = mentor;
    const [status, setStatus] = useState('NONE'); // NONE, PENDING, ACCEPTED

    useEffect(() => {
        if (currentUserId && mentorId) {
            checkStatus();
        }
    }, [currentUserId, mentorId]);

    const checkStatus = async () => {
        try {
            const data = await getConnectionStatus(currentUserId, mentorId);
            if (data && data.status) {
                setStatus(data.status);
            }
        } catch (error) {
            console.error("Failed to check status", error);
        }
    };

    const handleConnect = async () => {
        if (status !== 'NONE') return;
        try {
            await sendConnectionRequest(currentUserId, mentorId);
            setStatus('PENDING');
        } catch (error) {
            alert("Failed to send request");
        }
    };
    // Calculate Color based on Match Score (Green > 80%, Orange > 50%, Red < 50%)
    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-400 border-green-400";
        if (score >= 50) return "text-yellow-400 border-yellow-400";
        return "text-red-400 border-red-400";
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative w-80 p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden text-white"
        >
            {/* Glow Effect behind the card */}
            <div className="absolute top-0 -left-10 w-20 h-20 bg-purple-500 blur-[80px] opacity-30" />
            <div className="absolute bottom-0 -right-10 w-20 h-20 bg-blue-500 blur-[80px] opacity-30" />

            {/* Header: Avatar + Match Ring */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl">
                        {name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">{name}</h3>
                        <p className="text-xs text-gray-300">{role}</p>
                    </div>
                </div>

                {/* Match Score Ring */}
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${getScoreColor(matchScore)}`}>
                    <span className="text-xs font-bold">{matchScore}%</span>
                </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-300 mb-4 line-clamp-2 h-10">
                {bio || "Passionate mentor ready to help you grow skills."}
            </p>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
                {skillsOffered?.slice(0, 3).map((skill, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-gray-300">
                        {skill}
                    </span>
                ))}
                {skillsOffered?.length > 3 && (
                    <span className="px-2 py-1 text-xs text-gray-400">+{skillsOffered.length - 3}</span>
                )}
            </div>

            {/* Action Button */}
            {/* Action Button */}
            <button
                onClick={handleConnect}
                disabled={status !== 'NONE'}
                className={`w-full py-2 rounded-xl font-semibold text-sm transition-all shadow-lg 
                ${status === 'ACCEPTED'
                        ? 'bg-green-500 text-white cursor-default'
                        : status === 'PENDING'
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-500/20 text-white'
                    }`}
            >
                {status === 'ACCEPTED' ? 'Message' : status === 'PENDING' ? 'Request Sent' : 'Connect & Chat'}
            </button>
        </motion.div>
    );
};

export default MentorCard;
