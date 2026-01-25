import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link as ScrollLink, scroller } from 'react-scroll'; // For smooth scrolling
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'; // For page navigation
import { HiMenu, HiX } from 'react-icons/hi';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const navLinks = [
        { name: 'Home', to: 'hero' },
        { name: 'Features', to: 'features' },
        { name: 'Mentors', to: 'mentors' },
        { name: 'About', to: 'about' },
    ];

    // Handle scroll after navigation from another page
    useEffect(() => {
        if (location.pathname === '/' && location.state?.scrollTo) {
            scroller.scrollTo(location.state.scrollTo, {
                smooth: true,
                duration: 500,
                offset: -64, // Adjust for navbar height
            });
            // Clean up state
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleNavClick = (to) => {
        setIsOpen(false);
        if (location.pathname === '/') {
            scroller.scrollTo(to, {
                smooth: true,
                duration: 500,
                offset: -64,
            });
        } else {
            navigate('/', { state: { scrollTo: to } });
        }
    };

    const handleLogoClick = () => {
        if (location.pathname === '/') {
            scroller.scrollTo('hero', {
                smooth: true,
                duration: 500,
            });
        } else {
            navigate('/', { state: { scrollTo: 'hero' } });
        }
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 dark:bg-slate-900/80 border-b border-gray-200 dark:border-white/10"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={handleLogoClick}>
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                            Skill Loop
                        </span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link.to)}
                                    className="cursor-pointer text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors bg-transparent border-none outline-none"
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Theme Toggle & Login Button */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        <RouterLink to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-medium shadow-lg shadow-primary/25 transition-all"
                            >
                                Sign In
                            </motion.button>
                        </RouterLink>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <HiX className="h-8 w-8" /> : <HiMenu className="h-8 w-8" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10"
                    >
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">
                            {navLinks.map((link) => (
                                <button
                                    key={link.name}
                                    onClick={() => handleNavClick(link.to)}
                                    className="block cursor-pointer px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gray-100 dark:hover:bg-white/5 w-full text-left"
                                >
                                    {link.name}
                                </button>
                            ))}
                            <div className="w-full px-3">
                                <RouterLink to="/login" onClick={() => setIsOpen(false)}>
                                    <button className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-bold">
                                        Sign In
                                    </button>
                                </RouterLink>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
