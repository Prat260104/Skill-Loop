import { motion } from 'framer-motion';
import { HiChip, HiCode, HiLightningBolt, HiSparkles } from 'react-icons/hi';

const steps = [
    {
        icon: HiChip,
        title: 'AI Smart Profiling',
        desc: 'Our NLP engine scans your GitHub for projects, then launches an AI-Agent Interview to verify your skills via a technical chat.',
        color: 'text-purple-400',
        bg: 'bg-purple-400/10'
    },
    {
        icon: HiLightningBolt,
        title: 'Vector Matchmaking',
        desc: 'Beyond simple filters. We use Vector Embeddings to match your "Teaching Style" with a peer\'s "Learning Pace".',
        color: 'text-cyan-400',
        bg: 'bg-cyan-400/10'
    },
    {
        icon: HiCode,
        title: 'The "Code-Room"',
        desc: 'Live collaboration environment with synced IDE, Sketches, and low-latency WebRTC Video calls.',
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10'
    },
    {
        icon: HiSparkles,
        title: 'AI Session Analysis',
        desc: 'Our bot joins your session to summarize key takeaways and auto-suggest resources based on your conversation.',
        color: 'text-pink-400',
        bg: 'bg-pink-400/10'
    }
];

export default function HowItWorks() {
    return (
        <section className="py-24 bg-slate-900 dark:bg-[#0B0F19] relative overflow-hidden">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 hidden md:block" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl font-bold text-white mb-4"
                    >
                        How <span className="text-primary">The Loop</span> Works
                    </motion.h2>
                    <p className="text-gray-400">Your journey from beginner to master in 4 simple steps.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2, duration: 0.5 }}
                            className="relative group text-center"
                        >
                            {/* Circle Badge */}
                            <div className={`w-20 h-20 mx-auto rounded-2xl ${step.bg} flex items-center justify-center mb-6 relative z-10 border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                                <step.icon className={`w-10 h-10 ${step.color}`} />
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed px-2">
                                {step.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
