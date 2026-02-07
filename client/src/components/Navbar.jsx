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

    const [hoveredLink, setHoveredLink] = useState(null);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4 pointer-events-none">
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                className="pointer-events-auto w-full max-w-7xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/60 border border-white/20 dark:border-white/5 shadow-2xl shadow-indigo-500/10 rounded-2xl transition-all duration-300"
            >
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Logo */}
                        <div className="flex-shrink-0 cursor-pointer flex items-center gap-3" onClick={handleLogoClick}>
                            <motion.div
                                whileHover={{ rotate: 180 }}
                                transition={{ duration: 0.5 }}
                                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20"
                            >
                                S
                            </motion.div>
                            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent tracking-tight">
                                SkillLoop
                            </span>
                        </div>

                        {/* Desktop Menu - Sliding Spotlight Effect */}
                        <div className="hidden md:flex items-center space-x-1" onMouseLeave={() => setHoveredLink(null)}>
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link.to)}
                                    onMouseEnter={() => setHoveredLink(link.name)}
                                    className="relative px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-white transition-colors group"
                                >
                                    <span className="relative z-10">{link.name}</span>
                                    {hoveredLink === link.name && (
                                        <motion.div
                                            layoutId="navbar-hover-pill"
                                            className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-lg -z-0"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {user && <NotificationBell />}
                            <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-2"></div>
                            <ThemeToggle />

                            {user ? (
                                // Logged In: Profile Dropdown
                                <div className="relative ml-2" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-3 focus:outline-none pl-2 pr-1 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                                    >
                                        <div className="text-right hidden lg:block">
                                            <p className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-none">{user.name}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 p-[2px]">
                                            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                {user.name.charAt(0)}
                                            </div>
                                        </div>
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {isProfileOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 py-2 overflow-hidden z-50 ring-1 ring-black/5"
                                            >
                                                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                                </div>

                                                <div className="p-2 space-y-1">
                                                    <RouterLink to={`/profile/${user.id}`} onClick={() => setIsProfileOpen(false)}>
                                                        <div className="px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-primary/5 dark:hover:bg-primary/20 cursor-pointer transition-colors text-gray-700 dark:text-gray-200 group">
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                                👤
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold">Profile</p>
                                                            </div>
                                                        </div>
                                                    </RouterLink>

                                                    <RouterLink to="/dashboard" onClick={() => setIsProfileOpen(false)}>
                                                        <div className="px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-primary/5 dark:hover:bg-primary/20 cursor-pointer transition-colors text-gray-700 dark:text-gray-200 group">
                                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                                                <HiViewGrid className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm font-semibold">Dashboard</span>
                                                        </div>
                                                    </RouterLink>

                                                    <RouterLink to="/github-scraper" onClick={() => setIsProfileOpen(false)}>
                                                        <div className="px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-purple-500/5 dark:hover:bg-purple-500/20 cursor-pointer transition-colors text-gray-700 dark:text-gray-200 group">
                                                            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                                                🐙
                                                            </div>
                                                            <span className="text-sm font-semibold">GitHub Scraper</span>
                                                        </div>
                                                    </RouterLink>

                                                    <RouterLink to="/leaderboard" onClick={() => setIsProfileOpen(false)}>
                                                        <div className="px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-yellow-500/5 dark:hover:bg-yellow-500/20 cursor-pointer transition-colors text-gray-700 dark:text-gray-200 group">
                                                            <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
                                                                🏆
                                                            </div>
                                                            <span className="text-sm font-semibold">Leaderboard</span>
                                                        </div>
                                                    </RouterLink>
                                                </div>

                                                <div className="mt-1 pt-2 border-t border-gray-100 dark:border-white/5 px-2 pb-2">
                                                    <div onClick={handleLogout} className="px-3 py-2 rounded-xl flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/20 cursor-pointer transition-colors text-red-600 dark:text-red-400 font-medium">
                                                        <HiLogout className="w-5 h-5" />
                                                        <span className="text-sm">Log Out</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <RouterLink to="/login">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-5 py-2 rounded-xl font-bold text-white bg-primary shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all text-sm ml-2"
                                    >
                                        Sign In
                                    </motion.button>
                                </RouterLink>
                            )}
                        </div>

                        {/* Mobile Menu Button - Styled */}
                        <div className="flex md:hidden items-center gap-4">
                            {user && <NotificationBell />}
                            <ThemeToggle />
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:outline-none bg-gray-50 dark:bg-white/5"
                            >
                                {isOpen ? <HiX className="h-5 w-5" /> : <HiMenu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay - Integrated into the island */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden border-t border-gray-100 dark:border-white/5 overflow-hidden"
                        >
                            <div className="px-4 pt-2 pb-4 space-y-1">
                                {navLinks.map((link) => (
                                    <button
                                        key={link.name}
                                        onClick={() => handleNavClick(link.to)}
                                        className="block w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-primary dark:hover:text-primary transition-colors"
                                    >
                                        {link.name}
                                    </button>
                                ))}
                                <div className="h-px bg-gray-100 dark:bg-white/5 my-2"></div>
                                {user ? (
                                    <>
                                        <RouterLink to="/dashboard" onClick={() => setIsOpen(false)}>
                                            <button className="block w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5">
                                                Dashboard
                                            </button>
                                        </RouterLink>
                                        <RouterLink to="/github-scraper" onClick={() => setIsOpen(false)}>
                                            <button className="block w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 text-purple-500">
                                                GitHub Scraper 🐙
                                            </button>
                                        </RouterLink>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            Log Out
                                        </button>
                                    </>
                                ) : (
                                    <RouterLink to="/login" onClick={() => setIsOpen(false)}>
                                        <button className="w-full mt-2 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30">
                                            Sign In
                                        </button>
                                    </RouterLink>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
}
