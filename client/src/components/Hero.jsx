import { motion } from 'framer-motion';
import { Link } from 'react-scroll';

export default function Hero() {
    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900 dark:bg-vibrant-bg-darker transition-colors duration-1000">
            {/* Animated Background Gradients */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse-glow delay-1000" />
            </div>

            <div className="container mx-auto px-4 z-10">
                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-block mb-6 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md"
                    >
                        <span className="text-sm font-medium text-primary">
                            ✨ The Future of Learning
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
                        <span className="relative">
                            <span className="text-primary animate-gradient-xy">
                                The Loop
                            </span>
                        </span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
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
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
                        >
                            Get Started
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 rounded-xl border-2 border-primary/20 bg-primary/5 backdrop-blur-sm text-primary font-semibold hover:bg-primary/10 transition-all"
                        >
                            Watch Demo
                        </motion.button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="mt-20 pt-10 border-t border-white/10 flex flex-wrap justify-center gap-12 text-center"
                    >
                        {[
                            { value: '10K+', label: 'Active Learners' },
                            { value: '500+', label: 'Premium Courses' },
                            { value: '98%', label: 'Satisfaction' },
                        ].map((stat, index) => (
                            <div key={index} className="space-y-1">
                                <div className="text-3xl font-bold text-white">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium text-gray-400 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>

                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent pointer-events-none"></div>
        </div>
    );
}
