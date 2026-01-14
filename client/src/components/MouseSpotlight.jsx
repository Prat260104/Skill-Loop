import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function MouseSpotlight() {
    const { colorTheme } = useTheme(); // Ensuring component re-renders on theme change
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // 1. The Core (You) - Fast response
    const springConfigCore = { damping: 20, stiffness: 400 };
    const coreX = useSpring(mouseX, springConfigCore);
    const coreY = useSpring(mouseY, springConfigCore);

    // 2. The Loop (The Ecosystem) - Slower, "towing" feel
    const springConfigLoop = { damping: 20, stiffness: 150 };
    const loopX = useSpring(mouseX, springConfigLoop);
    const loopY = useSpring(mouseY, springConfigLoop);

    useEffect(() => {
        const updateMousePosition = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, [mouseX, mouseY]);

    return (
        <>
            {/* The Rotating "Skill Loop" Ring */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
                style={{
                    x: loopX,
                    y: loopY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                <motion.div
                    className="relative w-12 h-12 rounded-full border border-primary/50 border-dashed"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                    {/* Orbital Particle 1 (Theme Color - The Skill) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />

                    {/* Orbital Particle 2 (White - The Learner) */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-white dark:bg-gray-200 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                </motion.div>
            </motion.div>

            {/* The Core Dot (Cursor Center) */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] mix-blend-exclude"
                style={{
                    x: coreX,
                    y: coreY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            />
        </>
    );
}
