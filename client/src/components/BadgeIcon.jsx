import { motion } from 'framer-motion';
import { HiFire, HiMoon, HiSun, HiStar, HiCode } from 'react-icons/hi';

export default function BadgeIcon({ badge }) {
    let icon, colorClass, gradient, title, description;

    switch (badge) {
        case 'ICEBREAKER':
            icon = <HiFire className="w-5 h-5 text-orange-500" />;
            colorClass = "border-orange-500/30 bg-orange-500/10";
            gradient = "from-orange-500/20 to-red-500/20";
            title = "Icebreaker";
            description = "Completed the very first session on the platform.";
            break;
        case 'NIGHT_OWL':
            icon = <HiMoon className="w-5 h-5 text-indigo-400" />;
            colorClass = "border-indigo-400/30 bg-indigo-500/10";
            gradient = "from-indigo-500/20 to-purple-500/20";
            title = "Night Owl";
            description = "Completed a session late at night.";
            break;
        case 'EARLY_BIRD':
            icon = <HiSun className="w-5 h-5 text-yellow-400" />;
            colorClass = "border-yellow-400/30 bg-yellow-500/10";
            gradient = "from-yellow-400/20 to-orange-400/20";
            title = "Early Bird";
            description = "Started the day right with an early morning session.";
            break;
        case 'FIVE_STAR':
            icon = <HiStar className="w-5 h-5 text-amber-500" />;
            colorClass = "border-amber-500/30 bg-amber-500/10";
            gradient = "from-amber-400/20 to-yellow-500/20";
            title = "Five Star Mentor";
            description = "Consistently received top ratings from students.";
            break;
        case 'CODE_NINJA':
            icon = <HiCode className="w-5 h-5 text-emerald-400" />;
            colorClass = "border-emerald-400/30 bg-emerald-500/10";
            gradient = "from-emerald-400/20 to-teal-500/20";
            title = "Code Ninja";
            description = "Verified a deep tech stack via GitHub.";
            break;
        default:
            return null;
    }

    return (
        <div className="relative group cursor-pointer inline-block">
            {/* The Badge Icon */}
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-12 h-12 flex items-center justify-center rounded-2xl border ${colorClass} bg-gradient-to-br ${gradient} shadow-lg backdrop-blur-sm transition-all`}
            >
                {icon}
            </motion.div>

            {/* Tooltip on Hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 w-48 bg-slate-800 dark:bg-black text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-2xl z-50 filter drop-shadow-lg text-center border border-white/10">
                <p className="font-bold mb-1">{title}</p>
                <p className="text-xs text-gray-300">{description}</p>
                {/* Carrot/Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-border-8 border-solid border-transparent border-t-slate-800 dark:border-t-black"></div>
            </div>
        </div>
    );
}
