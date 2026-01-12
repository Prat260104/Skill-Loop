import { motion, AnimatePresence } from 'framer-motion';
import { HiSun, HiMoon, HiColorSwatch } from 'react-icons/hi';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

export default function ThemeToggle() {
    const { isDark, toggleTheme, colorTheme, setColorTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes = [
        { id: 'purple', color: '#a855f7' },
        { id: 'pink', color: '#ec4899' },
        { id: 'cyan', color: '#06b6d4' },
        { id: 'gold', color: '#fbbf24' },
    ];

    return (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-4">
            {/* Color Theme Selector */}
            <div className="relative">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-white dark:bg-vibrant-bg-card border-2 border-primary/50 text-primary shadow-lg backdrop-blur-md"
                >
                    <HiColorSwatch className="w-6 h-6" />
                </motion.button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                            className="absolute top-14 right-0 bg-white dark:bg-vibrant-bg-card p-3 rounded-2xl shadow-xl border border-primary/20 flex flex-col gap-3 min-w-[max-content]"
                        >
                            <div className="text-xs font-bold text-gray-500 dark:text-gray-400 px-1 uppercase tracking-wider">
                                Theme Color
                            </div>
                            <div className="flex gap-2">
                                {themes.map((theme) => (
                                    <motion.button
                                        key={theme.id}
                                        onClick={() => {
                                            setColorTheme(theme.id);
                                            setIsOpen(false);
                                        }}
                                        whileHover={{ scale: 1.2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-8 h-8 rounded-full border-2 ${colorTheme === theme.id ? 'border-white ring-2 ring-primary' : 'border-transparent'
                                            }`}
                                        style={{ backgroundColor: theme.color }}
                                        aria-label={`Select ${theme.id} theme`}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dark/Light Mode Toggle */}
            <motion.button
                onClick={toggleTheme}
                className="p-3 rounded-full bg-white dark:bg-vibrant-bg-card backdrop-blur-md border-2 border-primary dark:border-primary shadow-2xl hover:shadow-primary/50 transition-all duration-300"
                whileHover={{ scale: 1.15, rotate: 15 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: isDark ? 0 : 180 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                >
                    {isDark ? (
                        <HiSun className="w-6 h-6 text-primary" />
                    ) : (
                        <HiMoon className="w-6 h-6 text-primary" />
                    )}
                </motion.div>
            </motion.button>
        </div>
    );
}
