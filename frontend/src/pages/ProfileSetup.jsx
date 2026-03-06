import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const ProfileSetup = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext);

    const [bio, setBio] = useState('');
    const [interestsStr, setInterestsStr] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const interests = interestsStr.split(',').map(i => i.trim()).filter(i => i);
            const res = await axios.put('/users/profile', {
                bio,
                interests,
                profileImage: profileImage || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user?.name,
            });
            setUser({ ...user, ...res.data });
            navigate('/home');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphism-dark p-8 w-full max-w-lg z-10"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-500 to-primary-500 flex items-center justify-center shadow-xl">
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-2">Complete Profile</h2>
                <p className="text-gray-400 text-center mb-8">Add some details so peers can find you better.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Avatar URL (Optional)</label>
                        <div className="flex items-center gap-4">
                            {profileImage ? (
                                <img src={profileImage} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-primary-500" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                                    <User className="w-5 h-5 text-gray-500" />
                                </div>
                            )}
                            <input
                                type="url"
                                placeholder="https://..."
                                className="flex-1 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                value={profileImage}
                                onChange={(e) => setProfileImage(e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Bio</label>
                        <textarea
                            rows="3"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us a bit about yourself..."
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Interests (Comma separated)</label>
                        <input
                            type="text"
                            className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                            value={interestsStr}
                            onChange={(e) => setInterestsStr(e.target.value)}
                            placeholder="Coding, Design, Music, Gaming"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-primary-500 hover:from-primary-500 hover:to-purple-400 text-white font-bold rounded-xl mt-6 shadow-lg shadow-purple-500/20 transition-all flex justify-center"
                    >
                        {loading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div> : "Save & Continue"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default ProfileSetup;
