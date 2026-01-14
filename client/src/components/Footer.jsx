import { motion } from 'framer-motion';
import { FaGithub, FaTwitter, FaLinkedin, FaHeart } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-gray-300 pt-16 pb-8 border-t border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-4 inline-block">
                            Skill Loop
                        </span>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Empowering developers and learners to exchange skills, grow together, and master their craft through community-driven loops.
                        </p>
                    </div>

                    {/* Links Column 1 */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">Find Mentors</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Browse Skills</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                        </ul>
                    </div>

                    {/* Links Column 2 */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                        </ul>
                    </div>

                    {/* Social Column */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect</h3>
                        <div className="flex space-x-4">
                            <motion.a whileHover={{ y: -3 }} href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-all">
                                <FaGithub className="w-5 h-5" />
                            </motion.a>
                            <motion.a whileHover={{ y: -3 }} href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-all">
                                <FaTwitter className="w-5 h-5" />
                            </motion.a>
                            <motion.a whileHover={{ y: -3 }} href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-all">
                                <FaLinkedin className="w-5 h-5" />
                            </motion.a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © 2026 Skill Loop. All rights reserved.
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        Made with <FaHeart className="text-red-500 w-4 h-4" /> by Prateek
                    </p>
                </div>
            </div>
        </footer>
    );
}
