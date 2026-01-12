import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function BrandIntro({ onComplete }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Auto-skip after 4 seconds
        const timer = setTimeout(() => {
            handleComplete();
        }, 4000);

        return () => clearTimeout(timer);
    }, []);

    const handleComplete = () => {
        setShow(false);
        setTimeout(() => {
            onComplete();
        }, 500);
    };

    // Particle configuration for fancy effects
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
    }));

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] bg-gradient-to-br from-vibrant-bg-darker via-vibrant-bg-dark to-vibrant-bg-card flex items-center justify-center overflow-hidden"
                >
                    {/* Animated Background Gradient */}
                    <div className="absolute inset-0 opacity-50">
                        <div className="absolute inset-0 bg-gradient-to-r from-vibrant-purple via-vibrant-pink to-vibrant-cyan animate-gradient-xy"></div>
                    </div>

                    {/* Glow Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-vibrant-purple vibrant-glow rounded-full"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-vibrant-pink vibrant-glow rounded-full"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-vibrant-cyan vibrant-glow rounded-full"></div>
                    </div>

                    {/* Colorful Particles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {particles.map((particle) => (
                            <motion.div
                                key={particle.id}
                                className={`absolute w-2 h-2 rounded-full ${particle.id % 3 === 0 ? 'bg-vibrant-purple' :
                                    particle.id % 3 === 1 ? 'bg-vibrant-pink' : 'bg-vibrant-cyan'
                                    }`}
                                style={{
                                    left: `${particle.x}%`,
                                    top: `${particle.y}%`,
                                }}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1.5, 0],
                                    y: [0, -100, -200],
                                }}
                                transition={{
                                    duration: particle.duration,
                                    repeat: Infinity,
                                    delay: particle.delay,
                                }}
                            />
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 text-center px-8">
                        {/* Logo Animation - Letters appear one by one */}
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
                            className="mb-8"
                        >
                            <div className="flex justify-center items-center gap-2">
                                {['S', 'k', 'i', 'l', 'l', 'L', 'o', 'o', 'p'].map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ opacity: 0, y: 50, rotateY: 90 }}
                                        animate={{ opacity: 1, y: 0, rotateY: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: index * 0.1,
                                            type: 'spring',
                                        }}
                                        className={`text-7xl md:text-9xl font-black bg-gradient-to-r from-vibrant-purple via-vibrant-pink to-vibrant-cyan bg-clip-text text-transparent drop-shadow-2xl ${index % 2 === 0 ? 'animate-float' : ''
                                            }`}
                                        style={{ display: 'inline-block' }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>

                        {/* Tagline */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            className="text-xl md:text-2xl text-white font-semibold mb-8 shimmer"
                        >
                            ✨ Where Skills Meet Opportunity
                        </motion.div>

                        {/* Loading Bar */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5 }}
                            className="w-64 h-1 mx-auto bg-vibrant-bg-card rounded-full overflow-hidden"
                        >
                            <motion.div
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 2, delay: 1.5, ease: 'easeInOut' }}
                                className="h-full bg-gradient-to-r from-vibrant-purple via-vibrant-pink to-vibrant-cyan"
                            />
                        </motion.div>

                        {/* Skip Button */}
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2 }}
                            onClick={handleComplete}
                            className="mt-12 px-6 py-3 rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-all backdrop-blur-sm"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Skip Intro →
                        </motion.button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
