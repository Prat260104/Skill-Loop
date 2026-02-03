import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPendingRequests, acceptConnectionRequest, rejectConnectionRequest } from '../../api/connectionApi';

const IncomingRequests = ({ userId }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchRequests();
        }
    }, [userId]);

    const fetchRequests = async () => {
        try {
            const data = await getPendingRequests(userId);
            setRequests(data);
        } catch (error) {
            console.error("Failed to load requests", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await acceptConnectionRequest(requestId);
            // Remove from list
            setRequests(prev => prev.filter(req => req.id !== requestId));
        } catch (error) {
            alert("Failed to accept request");
        }
    };

    const handleReject = async (requestId) => {
        try {
            await rejectConnectionRequest(requestId);
            // Remove from list
            setRequests(prev => prev.filter(req => req.id !== requestId));
        } catch (error) {
            alert("Failed to reject request");
        }
    };

    if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading requests...</div>;

    if (requests.length === 0) return null; // Hide if no requests

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-white/10 shadow-sm"
        >
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-2">
                🔔 Incoming Requests
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{requests.length}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requests.map(req => (
                    <div key={req.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                                {req.sender.name[0]}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{req.sender.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{req.sender.role}</p>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => handleAccept(req.id)}
                                className="px-3 py-1.5 text-xs font-semibold text-green-600 bg-green-100 hover:bg-green-200 rounded-lg transition-colors"
                            >
                                Accept
                            </button>
                            <button
                                onClick={() => handleReject(req.id)}
                                className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default IncomingRequests;
