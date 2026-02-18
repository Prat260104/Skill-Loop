import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import InteractiveBackground from './InteractiveBackground';

export default function Hero() {
    // ... existing hook logic ...
    const heroRef = useRef(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    // Mouse Follow Effect (Keep this for the spotlight layer)
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <div
            ref={heroRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 dark:bg-vibrant-bg-darker transition-colors duration-1000 group"
        >
            {/* 0. NEW: Canvas Particle Network (The Antigravity Effect) */}
            <InteractiveBackground />

            {/* 1. Interactive Mouse Spotlight Background (REMOVED as per user request to focus on particles) */}
            {/* <motion.div ... /> */}

            {/* 2. Static Animated Blobs (Parallax) */}
            <motion.div style={{ y: y1 }} className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse-glow pointer-events-none" />
            <motion.div style={{ y: y2 }} className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] opacity-30 animate-pulse-glow delay-1000 pointer-events-none" />

            {/* 3. Grid Pattern Overlay for Tech Feel */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-20"></div>

            <div className="container mx-auto px-4 z-10 relative">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md"
                    >
                        <span className="text-sm font-medium text-primary">
                            The Future of Learning
                        </span>
                    </motion.div>

                    {/* Main Title */}
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight"
                    >
                        Master New Skills in <br />
                        <span className="relative inline-block">
                            <span className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 blur opacity-30 animate-tilt"></span>
                            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
                                The Loop
                            </span>
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
                    >
                        Join the community of lifelong learners. Experience a revolutionary way to track, share, and master your professional growth journey with style.
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <RouterLink to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/50 transition-all border border-white/10"
                            >
                                Get Started
                            </motion.button>
                        </RouterLink>

                        <ScrollLink to="features" smooth={true} duration={500} offset={-64}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm text-white font-semibold hover:bg-white/10 transition-all"
                            >
                                Watch Demo
                            </motion.button>
                        </ScrollLink>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
        </div>
    );
}
