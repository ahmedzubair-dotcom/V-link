import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('vlink_token') || null);
    const [loading, setLoading] = useState(true);

    // Axios default setup
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await axios.get('/auth/me');
                setUser(res.data);
            } catch (err) {
                console.error('Failed to fetch user', err);
                logout();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    const login = async (email, password) => {
        const res = await axios.post('/auth/login', { email, password });
        setToken(res.data.token);
        setUser(res.data);
        localStorage.setItem('vlink_token', res.data.token);
    };

    const register = async (userData) => {
        const res = await axios.post('/auth/register', userData);
        setToken(res.data.token);
        setUser(res.data);
        localStorage.setItem('vlink_token', res.data.token);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('vlink_token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
