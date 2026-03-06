import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, ShieldAlert, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            const res = await axios.get('/admin/incidents');
            setIncidents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const resolveIncident = async (id) => {
        try {
            await axios.post(`/admin/incidents/${id}/resolve`);
            setIncidents(incidents.filter(i => i._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f1c] text-white p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/home')} className="p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <ShieldAlert className="text-red-500 w-8 h-8" />
                        Admin Dashboard
                    </h1>
                </div>

                <div className="glassmorphism-dark p-6">
                    <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Open GuardianShield Incidents</h2>

                    {incidents.length === 0 ? (
                        <div className="text-center text-gray-500 py-10">
                            No open incidents. Community is safe!
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {incidents.map(inc => (
                                <div key={inc._id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg uppercase">
                                                Level {inc.threatLevel}
                                            </span>
                                            <span className="text-sm text-gray-400">ID: {inc._id}</span>
                                        </div>
                                        <p className="text-gray-200">{inc.description}</p>
                                    </div>
                                    <button
                                        onClick={() => resolveIncident(inc._id)}
                                        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 rounded-lg transition whitespace-nowrap"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Resolve
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Admin;
