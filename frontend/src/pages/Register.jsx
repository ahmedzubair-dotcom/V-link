import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', collegeId: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/verify-live'); // Next step in flow
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glassmorphism-dark p-8 w-full max-w-md z-10"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-secondary-500 to-orange-400 flex items-center justify-center shadow-xl">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

                {error && <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition-colors"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">College Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition-colors"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">College ID (Roll No.)</label>
                        <input
                            type="text"
                            name="collegeId"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition-colors"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary-500 transition-colors"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-secondary-600 to-orange-500 hover:from-secondary-500 hover:to-orange-400 text-white font-bold rounded-xl mt-6 shadow-lg shadow-secondary-500/20 transition-all"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center text-gray-400 mt-6 text-sm">
                    Already have an account? <span className="text-secondary-400 cursor-pointer hover:underline" onClick={() => navigate('/login')}>Sign in</span>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
