
import { motion, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function MouseSpotlight() {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    // Smooth spring animation for the cursor follower
    const springConfig = { damping: 25, stiffness: 700 };
    const cursorX = useSpring(0, springConfig);
    const cursorY = useSpring(0, springConfig);
    const coreX = useSpring(0, springConfig);
    const coreY = useSpring(0, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            const { clientX, clientY } = e;
            cursorX.set(clientX);
            cursorY.set(clientY);
            coreX.set(clientX);
            coreY.set(clientY);
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener('mousemove', moveCursor);

        // Add hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
        interactiveElements.forEach((el) => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach((el) => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return (
        <>
            {/* The Orbiting Ring System */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-screen"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
            >
                {/* Dotted Circle Ring */}
                <motion.div
                    className={`relative rounded-full border border-dashed border-primary/50 transition-all duration-300 ease-out
                        ${isHovering ? 'w-16 h-16 border-primary bg-primary/10' : 'w-10 h-10'}
                    `}
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
