require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const matchRoutes = require('./routes/matches');
const chatRoutes = require('./routes/chat');
const adminRoutes = require('./routes/admin');
const path = require('path');

// Connect to Database
const Message = require('./models/Message');
const Incident = require('./models/Incident');

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io initialization (Phase 8)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_match', (matchId) => {
        socket.join(matchId);
        console.log(`Socket ${socket.id} joined room ${matchId}`);
    });

    socket.on('send_message', async (data) => {
        const { matchId, senderId, content } = data;

        try {
            // 1. GuardianShield Intercept
            const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';
            const mlRes = await fetch(`${mlServiceUrl}/api/moderate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content })
            });
            const mlData = await mlRes.json();
            const threatLevel = mlData.threatLevel;

            // 2. Save Message to DB (flagged if threat > 0)
            const newMessage = new Message({
                matchId,
                senderId,
                content: threatLevel >= 2 ? '[Message hidden by GuardianShield]' : content,
                flagged: threatLevel > 0
            });
            await newMessage.save();

            // 3. Handle Threat Levels
            if (threatLevel >= 2) {
                socket.emit('alert_message', {
                    type: 'blocked',
                    message: `Message blocked: ${mlData.reason}`
                });

                await Incident.create({
                    reporterId: senderId,
                    reportedId: senderId,
                    matchId,
                    threatLevel,
                    description: `Auto-flagged message: "${content}" - Reason: ${mlData.reason}`
                });

                if (threatLevel === 3) {
                    socket.emit('alert_message', { type: 'banned', message: 'You have been permanently banned for severe threats.' });
                }
                return; // DO NOT broadcast
            }

            if (threatLevel === 1) {
                socket.emit('alert_message', {
                    type: 'warning',
                    message: `Warning: ${mlData.reason}`
                });
            }

            // 4. Broadcast to peers in room
            io.to(matchId).emit('receive_message', newMessage);

        } catch (err) {
            console.error('Socket Message Error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*'
}));

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);

// --- AZURE KUDU DEPLOYMENT SUPPORT ---
// Serve static frontend files if they exist in the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all route to hand off routing to the React app
app.get('*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// Basic health check (fallback)
app.get('/api/health', (req, res) => {
    res.send('V-LINK Backend API Running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
