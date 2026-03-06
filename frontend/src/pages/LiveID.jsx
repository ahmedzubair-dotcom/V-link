import React, { useRef, useState, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const LiveID = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const [streamActive, setStreamActive] = useState(false);
    const [status, setStatus] = useState('idle'); // idle, capturing, verifying, success, error
    const [errorMsg, setErrorMsg] = useState('');

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setStreamActive(true);
            }
        } catch (err) {
            setErrorMsg('Camera access denied or unavailable.');
            setStatus('error');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setStreamActive(false);
    };

    const captureAndVerify = useCallback(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        setStatus('capturing');
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);

        // Get base64 string
        const imageBase64 = canvasRef.current.toDataURL('image/jpeg', 0.8);

        setStatus('verifying');
        try {
            const res = await axios.post('/users/verify', { image: imageBase64 });
            if (res.data.isVerified) {
                setStatus('success');
                stopCamera();
                // Update context to reflect verified status so Home stops redirecting if needed
                setUser(prev => ({ ...prev, isVerified: true }));
                setTimeout(() => navigate('/setup-profile'), 2000);
            }
        } catch (err) {
            setStatus('error');
            setErrorMsg(err.response?.data?.message || 'Verification failed. Please ensure your face is clearly visible.');
        }
    }, [navigate, setUser]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0f1c] text-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glassmorphism-dark p-8 w-full max-w-lg text-center"
            >
                <div className="flex justify-center mb-6">
                    <ShieldCheck className="w-16 h-16 text-primary-500" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Live Identity Check</h2>
                <p className="text-gray-400 mb-8">Part of our GuardianShield security. We need to verify you are a real person.</p>

                <div className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-8 border-2 border-dashed border-gray-700 flex items-center justify-center">
                    {streamActive ? (
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                        <div className="opacity-50 flex flex-col items-center">
                            <Camera className="w-12 h-12 mb-2" />
                            <span>Camera Inactive</span>
                        </div>
                    )}
                    {status === 'verifying' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                        </div>
                    )}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                {status === 'error' && (
                    <div className="bg-red-500/20 text-red-300 p-4 rounded-xl mb-6 flex items-start text-left text-sm">
                        <AlertTriangle className="w-5 h-5 mr-3 shrink-0" />
                        <p>{errorMsg}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="bg-green-500/20 text-green-300 p-4 rounded-xl mb-6 flex items-center justify-center font-semibold">
                        <CheckCircle className="w-5 h-5 mr-2" /> Verification Successful!
                    </div>
                )}

                <div className="flex gap-4 justify-center">
                    {!streamActive && status !== 'success' && (
                        <button
                            onClick={startCamera}
                            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 transition rounded-xl font-semibold w-full"
                        >
                            Start Camera
                        </button>
                    )}
                    {streamActive && status !== 'verifying' && status !== 'success' && (
                        <button
                            onClick={captureAndVerify}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 transition shadow-lg shadow-primary-500/20 rounded-xl font-bold w-full"
                        >
                            Verify Face
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LiveID;
