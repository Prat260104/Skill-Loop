import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDark, setIsDark] = useState(true);
    const [colorTheme, setColorTheme] = useState('purple');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const savedColor = localStorage.getItem('colorTheme');
        if (savedTheme) setIsDark(savedTheme === 'dark');
        if (savedColor) setColorTheme(savedColor);
    }, []);

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    useEffect(() => {
        localStorage.setItem('colorTheme', colorTheme);
        // Remove old theme classes
        document.body.classList.remove('theme-purple', 'theme-pink', 'theme-cyan', 'theme-gold');
        // Add new theme class
        document.body.classList.add(`theme-${colorTheme}`);
    }, [colorTheme]);

    const toggleTheme = () => setIsDark(!isDark);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, colorTheme, setColorTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
