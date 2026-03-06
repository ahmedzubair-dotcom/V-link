import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            // Determine next steps: If verified go to home, else go to LiveID
            navigate('/home');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glassmorphism-dark p-8 w-full max-w-md z-10"
            >
                <div className="flex justify-center mb-6">
                    <Shield className="w-12 h-12 text-primary-500" />
                </div>
                <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                        <input
                            type="email"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold rounded-xl mt-6 shadow-lg shadow-primary-500/20 transition-all"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-6 text-sm">
                    Don't have an account? <span className="text-primary-400 cursor-pointer hover:underline" onClick={() => navigate('/register')}>Register</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
