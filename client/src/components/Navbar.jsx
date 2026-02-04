import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink, scroller } from 'react-scroll';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { HiMenu, HiX, HiChevronDown, HiLogout, HiViewGrid } from 'react-icons/hi';
import ThemeToggle from './ThemeToggle';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false); // Mobile Menu
    const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile Dropdown
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));

    const navLinks = [
        { name: 'Home', to: 'hero' },
        { name: 'Features', to: 'features' },
        { name: 'Mentors', to: 'mentors' },
        { name: 'About', to: 'about' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle scroll logic
    const handleNavClick = (to) => {
        setIsOpen(false);
        if (location.pathname === '/') {
            scroller.scrollTo(to, { smooth: true, duration: 500, offset: -64 });
        } else {
            navigate('/', { state: { scrollTo: to } });
        }
    };

    const handleLogoClick = () => {
        if (location.pathname === '/') {
            scroller.scrollTo('hero', { smooth: true, duration: 500 });
        } else {
            navigate('/', { state: { scrollTo: 'hero' } });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/80 border-b border-gray-200 dark:border-white/5 transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20"> {/* Increased Height for easier clicking */}

                    {/* Logo */}
                    <div className="flex-shrink-0 cursor-pointer flex items-center gap-2" onClick={handleLogoClick}>
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/30">
                            S
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
                            SkillLoop
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.name}
                                onClick={() => handleNavClick(link.to)}
                                className="relative group text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                            </button>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        {user && <NotificationBell />}
                        <ThemeToggle />

                        {user ? (
                            // Logged In: Profile Dropdown
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 focus:outline-none group"
                                >
                                    <div className="text-right hidden lg:block">
                                        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{user.name}</p>
                                        <p className="text-xs text-primary font-medium">{user.role || 'Member'}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[2px] shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                                        <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-primary font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <HiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-white/5 py-2 overflow-hidden"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 lg:hidden">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>

                                            <RouterLink to={`/profile/${user.id}`} onClick={() => setIsProfileOpen(false)}>
                                                <div className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors text-gray-700 dark:text-gray-200 border-b border-gray-100 dark:border-white/5">
                                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">My Profile</p>
                                                        <p className="text-xs text-gray-400">View & Edit</p>
                                                    </div>
                                                </div>
                                            </RouterLink>

                                            <RouterLink to="/dashboard" onClick={() => setIsProfileOpen(false)}>
                                                <div className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors text-gray-700 dark:text-gray-200">
                                                    <HiViewGrid className="w-5 h-5 text-primary" />
                                                    <span className="text-sm font-medium">Dashboard</span>
                                                </div>
                                            </RouterLink>

                                            <RouterLink to="/leaderboard" onClick={() => setIsProfileOpen(false)}>
                                                <div className="px-4 py-3 flex items-center gap-3 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 cursor-pointer transition-colors text-yellow-600">
                                                    <span>🏆</span>
                                                    <span className="text-sm font-medium">Hall of Fame</span>
                                                </div>
                                            </RouterLink>

                                            <div onClick={handleLogout} className="px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer transition-colors text-red-600">
                                                <HiLogout className="w-5 h-5" />
                                                <span className="text-sm font-medium">Log Out</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            // Logged Out: Sign In Button
                            <RouterLink to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-purple-600 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all"
                                >
                                    Sign In
                                </motion.button>
                            </RouterLink>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden gap-4">
                        {user && <NotificationBell />}
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none"
                        >
                            {isOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-white/10 overflow-hidden"
                    >
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link.to)}
                                    className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </button>
                            ))}

                            <div className="pt-4 border-t border-gray-100 dark:border-white/5 mt-4">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 px-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-gray-500">{user.email}</p>
                                            </div>
                                        </div>
                                        <RouterLink to="/dashboard" onClick={() => setIsOpen(false)}>
                                            <button className="w-full flex items-center justify-center gap-2 bg-primary/10 text-primary py-3 rounded-xl font-bold mb-2">
                                                <HiViewGrid className="w-5 h-5" />
                                                Dashboard
                                            </button>
                                        </RouterLink>
                                        <RouterLink to="/leaderboard" onClick={() => setIsOpen(false)}>
                                            <button className="w-full flex items-center justify-center gap-2 bg-yellow-400/10 text-yellow-600 py-3 rounded-xl font-bold mb-3">
                                                🏆 Leaderboard
                                            </button>
                                        </RouterLink>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-600 py-3 rounded-xl font-bold"
                                        >
                                            <HiLogout className="w-5 h-5" />
                                            Log Out
                                        </button>
                                    </>
                                ) : (
                                    <RouterLink to="/login" onClick={() => setIsOpen(false)}>
                                        <button className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30">
                                            Sign In
                                        </button>
                                    </RouterLink>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav >
    );
}
