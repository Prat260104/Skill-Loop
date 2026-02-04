import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notificationApi } from '../api/notificationApi';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Get User ID safely
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    // Fetch Data
    const fetchNotifications = async () => {
        if (!userId) return;
        try {
            const count = await notificationApi.getUnreadCount(userId);
            setUnreadCount(count);

            // Only fetch full list if dropdown is open (Optimization)
            if (isOpen) {
                const list = await notificationApi.getMyNotifications(userId);
                setNotifications(list);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Poll every 10 seconds (Simple "Real-time" effect)
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, [userId, isOpen]);

    // Handle Click Outside to close
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);

    const handleRead = async (notification) => {
        if (!notification.read) {
            await notificationApi.markAsRead(notification.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            // Update local state to show it turned gray
            setNotifications(prev => prev.map(n =>
                n.id === notification.id ? { ...n, read: true } : n
            ));
        }
    };

    if (!userId) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50"
                    >
                        <div className="p-3 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200">Notifications</h3>
                            <button onClick={fetchNotifications} className="text-xs text-primary hover:underline">Refresh</button>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-400 text-sm">
                                    No notifications yet.
                                </div>
                            ) : (
                                notifications.map(n => (
                                    <div
                                        key={n.id}
                                        onClick={() => handleRead(n)}
                                        className={`p-3 border-b border-gray-50 dark:border-white/5 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${!n.read ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="flex-1">
                                                <p className={`text-sm ${!n.read ? 'font-semibold text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {n.message}
                                                </p>
                                                <span className="text-xs text-gray-400 mt-1 block">
                                                    {new Date(n.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {!n.read && (
                                                <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
