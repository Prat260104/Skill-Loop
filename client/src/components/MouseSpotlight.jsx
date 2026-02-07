import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const MouseSpotlight = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 700 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX - 16);
            cursorY.set(e.clientY - 16);
        };

        const handleMouseEnter = () => setIsHovering(true);
        const handleMouseLeave = () => setIsHovering(false);

        window.addEventListener('mousemove', moveCursor);

        // Add event listeners to specific interactive elements
        const interactiveElements = document.querySelectorAll('a, button, input, .interactive');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        // Use MutationObserver to add listeners to new elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    const newElements = document.querySelectorAll('a, button, input, .interactive');
                    newElements.forEach(el => {
                        el.removeEventListener('mouseenter', handleMouseEnter); // Remove old to avoid dupes
                        el.removeEventListener('mouseleave', handleMouseLeave);
                        el.addEventListener('mouseenter', handleMouseEnter);
                        el.addEventListener('mouseleave', handleMouseLeave);
                    });
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactiveElements.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
            observer.disconnect();
        };
    }, []);

    // Orbit Animation: A ring that always orbits
    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] overflow-hidden mix-blend-screen">
            {/* Main Cursor Dot */}
            <motion.div
                className="fixed top-0 left-0 w-4 h-4 rounded-full bg-white pointer-events-none mix-blend-difference"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    scale: isHovering ? 0.5 : 1
                }}
            />

            {/* Orbiting Ring */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary pointer-events-none"
                style={{
                    translateX: cursorXSpring,
                    translateY: cursorYSpring,
                    left: -8, // Offset to center around main cursor (width 16 + 8 offset = 24 / 2 = 12?)
                    // Actual logic: cursor is at top-left.
                    // Main dot is 16px (w-4). Center is at +8, +8.
                    // This ring is 32px (w-8). Center is at +16, +16.
                    // So need to offset by -8px relative to the 16px dot to center?
                    // Actually cursorX is e.clientX - 16. So cursorX is top-left of a 32px box centered on mouse.
                    // Main dot is 16px. Top-left of box (0,0) -> center (16,16).
                    // Dot (16px) centered in 32px box needs to be at (8,8).
                    x: -4, // Adjust for size difference (32px vs 16px center alignment)
                    y: -4,
                    scale: isHovering ? 1.5 : 1,
                    opacity: isHovering ? 1 : 0.5
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
                {/* A small planet orbiting the ring */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]"></div>
            </motion.div>
        </div>
    );
};

export default MouseSpotlight;
