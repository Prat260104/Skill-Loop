import { motion } from 'framer-motion';
import { useState } from 'react';
import { HiAcademicCap, HiLightningBolt, HiUserGroup } from 'react-icons/hi';

export default function Features() {
    const features = [
        {
            icon: HiLightningBolt,
            title: 'Skill Barter',
            description: 'Exchange your expertise for knowledge you need. Learn DSA while teaching Web Dev.',
            gradient: 'from-yellow-400 to-orange-500',
            color: 'text-yellow-400',
        },
        {
            icon: HiUserGroup,
            title: 'Senior Mentorship',
            description: 'Connect with experienced peers. Learn from those who\'ve walked the path before.',
            gradient: 'from-purple-400 to-pink-500',
            color: 'text-purple-400',
        },
        {
            icon: HiAcademicCap,
            title: 'Earn Rewards',
            description: 'Get points for every session. Redeem for courses, certifications, and exclusive benefits.',
            gradient: 'from-cyan-400 to-blue-500',
            color: 'text-cyan-400',
        },
    ];

    return (
        <div className="relative py-24 bg-slate-900 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Why Choose{' '}
                        <span className="text-primary">
                            Skill Loop?
                        </span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        A revolutionary platform that transforms the way students learn and grow together
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} feature={feature} index={index} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ feature, index }) {
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const rotateX = (e.clientY - centerY) / 20;
        const rotateY = (centerX - e.clientX) / 20;

        setRotateX(rotateX);
        setRotateY(rotateY);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    const Icon = feature.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            style={{ transformStyle: 'preserve-3d' }}
            className="group relative"
        >
            {/* Card */}
            <div className="relative h-full p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10">

                {/* Icon with Gradient Background */}
                <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6`}
                >
                    <Icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Title */}
                <h3 className={`text-2xl font-bold mb-4 ${feature.color}`}>
                    {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 leading-relaxed">
                    {feature.description}
                </p>

                {/* Glow Effect on Hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10 blur-xl`}></div>
            </div>
        </motion.div>
    );
}
