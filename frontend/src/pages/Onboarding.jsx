import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, Zap } from 'lucide-react';

const Onboarding = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
            {/* Background gradients */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000"></div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 text-center"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 flex items-center justify-center shadow-2xl">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
                    Welcome to <span className="text-gradient">V-LINK</span>
                </h1>
                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                    The verified student peer-matching platform protected by GuardianShield AI.
                    Connect with confidence.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <button
                        onClick={() => navigate('/register')}
                        className="px-8 py-4 bg-white text-gray-900 font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300"
                    >
                        Get Started
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-4 bg-transparent border border-gray-600 text-white font-semibold rounded-xl hover:bg-white/5 transition-all duration-300"
                    >
                        I already have an account
                    </button>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full z-10"
            >
                <div className="glassmorphism-dark p-6">
                    <Users className="text-primary-400 w-8 h-8 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Verified Peers</h3>
                    <p className="text-gray-400 text-sm">Every user is verified via College ID and Live Face Check.</p>
                </div>
                <div className="glassmorphism-dark p-6">
                    <Shield className="text-secondary-400 w-8 h-8 mb-4" />
                    <h3 className="font-bold text-lg mb-2">GuardianShield AI</h3>
                    <p className="text-gray-400 text-sm">Real-time NLP moderation keeps your chats safe and toxic-free.</p>
                </div>
                <div className="glassmorphism-dark p-6">
                    <Zap className="text-yellow-400 w-8 h-8 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Smart Matching</h3>
                    <p className="text-gray-400 text-sm">Our ML algorithm finds peers that actually share your interests.</p>
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;
