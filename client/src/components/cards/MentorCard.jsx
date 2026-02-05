import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const MentorCard = ({ mentor }) => {
    const { id: mentorId, name, role, skillsOffered, matchScore, bio } = mentor;
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/profile/${mentorId}`);
    };

    // Calculate Color based on Match Score (Green > 80%, Orange > 50%, Red < 50%)
    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-400 border-green-400";
        if (score >= 50) return "text-yellow-400 border-yellow-400";
        return "text-red-400 border-red-400";
    };

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={handleViewProfile}
            className="relative w-80 p-5 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden text-white cursor-pointer group h-[400px] flex flex-col"
        >
            {/* Glow Effect behind the card */}
            <div className="absolute top-0 -left-10 w-20 h-20 bg-purple-500 blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity" />
            <div className="absolute bottom-0 -right-10 w-20 h-20 bg-blue-500 blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity" />

            {/* Header: Avatar + Match Ring */}
            <div className="flex justify-between items-start mb-4 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-xl shrink-0">
                        {name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-purple-300 transition-colors line-clamp-1">{name}</h3>
                        <p className="text-xs text-gray-300">{role}</p>
                    </div>
                </div>

                {/* Match Score Ring */}
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 ${getScoreColor(matchScore)} shrink-0`}>
                    <span className="text-xs font-bold">{matchScore}%</span>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto pr-1 mb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                {/* Bio */}
                <p className="text-sm text-gray-300 mb-4">
                    {bio || "Passionate mentor ready to help you grow skills."}
                </p>

                {/* Skills Tags */}
                <div className="flex flex-wrap gap-2">
                    {skillsOffered?.map((skill, index) => (
                        <span key={index} className="px-2 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-gray-300 whitespace-nowrap">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile();
                }}
                className="w-full py-2 rounded-xl font-semibold text-sm transition-all shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 shadow-purple-500/20 text-white shrink-0 mt-auto"
            >
                View Profile & Connect
            </button>
        </motion.div>
    );
};

export default MentorCard;
