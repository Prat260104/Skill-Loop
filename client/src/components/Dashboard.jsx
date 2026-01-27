import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import UserCard from './UserCard';

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:9090/api/user');
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            } else {
                console.error("Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.skillsOffered && user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (user.skillsWanted && user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 bg-gray-50 dark:bg-slate-900">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                            Explore Community
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Find mentors, students, and peers to trade skills with.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search by name or skill..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-3 pl-12 rounded-xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm dark:text-white"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-80 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <UserCard key={user.id} user={user} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-500 text-lg">No users found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
