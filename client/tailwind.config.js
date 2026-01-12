/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Vibrant dark mode colors - purple, pink, cyan, gold
                primary: 'var(--primary)',
                'primary-glow': 'var(--primary-glow)',
                vibrant: {
                    purple: '#a855f7',       // Bright purple
                    pink: '#ec4899',         // Hot pink
                    cyan: '#06b6d4',         // Electric cyan
                    gold: '#fbbf24',         // Golden yellow
                    indigo: '#6366f1',       // Rich indigo
                    bg: {
                        dark: '#0f0a1e',     // Deep purple-black
                        darker: '#06040f',   // Almost black with purple tint
                        card: '#1a0f2e',     // Card background purple-tinted
                    },
                },
                // Professional light mode with vibrant accents
                light: {
                    purple: '#8b5cf6',       // Professional purple
                    pink: '#d946ef',         // Bright fuchsia
                    cyan: '#0ea5e9',         // Sky blue
                    gold: '#f59e0b',         // Amber
                    bg: {
                        main: '#faf5ff',     // Soft purple-white
                        card: '#ffffff',     // Pure white
                        hover: '#f3e8ff',    // Light purple tint
                    },
                    text: {
                        primary: '#1e1b4b',  // Deep indigo
                        secondary: '#6b7280', // Medium gray
                    },
                },
            },
            transitionDuration: {
                'fast': '100ms',
                'instant': '50ms',
            },
        },
    },
    plugins: [],
}
