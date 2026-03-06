import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Heart, X, MessageCircle, ShieldAlert, Users } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [matches, setMatches] = useState([]);
    const [activeMatches, setActiveMatches] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [potentialsRes, activeRes] = await Promise.all([
                axios.get('/matches/potential'),
                axios.get('/matches')
            ]);
            setMatches(potentialsRes.data);
            setActiveMatches(activeRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (targetUserId, action) => {
        try {
            await axios.post('/matches/action', { targetUserId, action });
            // Remove from stack
            setMatches(matches.filter(m => m._id !== targetUserId));
            // Refresh active matches if accept
            if (action === 'accept') fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white flex flex-col md:flex-row">
            {/* Sidebar Active Matches */}
            <div className="w-full md:w-80 bg-gray-900 border-r border-gray-800 p-6 flex flex-col h-screen overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <img src={user?.profileImage} alt="Profile" className="w-10 h-10 rounded-full border border-primary-500" />
                        <div className="font-bold">{user?.name}</div>
                    </div>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white transition">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                <h3 className="font-semibold text-gray-400 mb-4 text-sm uppercase tracking-wider">Your Connections</h3>
                <div className="flex-1 space-y-3">
                    {activeMatches.map((match) => {
                        // Find the other user in the match
                        const peer = match.users.find(u => u._id !== user._id);
                        if (!peer) return null;

                        return (
                            <div
                                key={match._id}
                                onClick={() => navigate(`/chat/${match._id}`)}
                                className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-xl cursor-pointer hover:bg-gray-800 transition"
                            >
                                <img src={peer.profileImage} alt={peer.name} className="w-12 h-12 rounded-full object-cover" />
                                <div>
                                    <div className="font-medium">{peer.name}</div>
                                    <div className="text-xs text-gray-400 truncate w-40">{peer.bio}</div>
                                </div>
                            </div>
                        )
                    })}
                    {activeMatches.length === 0 && (
                        <div className="text-center text-gray-500 text-sm mt-10">
                            No connections yet. Keep matching!
                        </div>
                    )}
                </div>

                {/* Admin Link if Admin logic applies - hardcoding for demo */}
                <button
                    onClick={() => navigate('/admin')}
                    className="mt-4 flex items-center justify-center gap-2 p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition w-full"
                >
                    <ShieldAlert className="w-5 h-5" /> Admin Dashboard
                </button>

            </div>

            {/* Main Matching Area */}
            <div className="flex-1 flex flex-col items-center p-8 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>

                <h2 className="text-2xl font-bold mb-8 z-10">Discover Verified Peers</h2>

                <div className="relative w-full max-w-sm h-[500px] z-10 flex items-center justify-center">
                    <AnimatePresence>
                        {matches.length > 0 ? (
                            <motion.div
                                key={matches[0]._id}
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, x: -200, scale: 0.9 }}
                                className="absolute w-full h-full glassmorphism-dark flex flex-col overflow-hidden"
                            >
                                <img src={matches[0].profileImage || 'https://via.placeholder.com/400'} alt="Profile" className="w-full h-[60%] object-cover" />
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        {matches[0].name}
                                        {matches[0].isVerified && <ShieldAlert className="w-5 h-5 text-green-400" />}
                                    </h3>
                                    <p className="text-sm text-primary-400 mb-2">{matches[0].collegeId}</p>
                                    <p className="text-gray-300 text-sm line-clamp-2 flex-1">{matches[0].bio}</p>

                                    <div className="flex flex-wrap gap-2 mt-auto mb-4">
                                        {matches[0].interests?.slice(0, 3).map((interest, i) => (
                                            <span key={i} className="px-2 py-1 bg-gray-800 rounded-lg text-xs text-gray-400">{interest}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="absolute bottom-6 left-0 w-full flex justify-center gap-6 px-6">
                                    <button
                                        onClick={() => handleAction(matches[0]._id, 'reject')}
                                        className="w-14 h-14 rounded-full bg-gray-800 border-2 border-red-500/50 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition shadow-lg shadow-red-500/20"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => handleAction(matches[0]._id, 'accept')}
                                        className="w-14 h-14 rounded-full bg-gray-800 border-2 border-green-500/50 flex items-center justify-center text-green-500 hover:bg-green-500 hover:text-white transition shadow-lg shadow-green-500/20"
                                    >
                                        <Heart className="w-6 h-6" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                    <Users className="w-10 h-10" />
                                </div>
                                <p>No more peers nearby.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
export default Home;
