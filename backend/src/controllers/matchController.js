const Match = require('../models/Match');
const User = require('../models/User');

const getPotentialMatches = async (req, res) => {
    try {
        const userProfile = await User.findById(req.user.id).select('-passwordHash -deviceId -threatScore');
        const potentialMatches = await User.find({ _id: { $ne: req.user.id } }).select('-passwordHash -deviceId -threatScore');

        if (!potentialMatches.length) return res.json([]);

        const mlServiceUrl = process.env.ML_SERVICE_URL || 'http://localhost:5001';
        const mlRes = await fetch(`${mlServiceUrl}/api/match`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: req.user.id,
                userProfile: userProfile.toObject(),
                potentialMatches: potentialMatches.map(u => u.toObject())
            })
        });

        if (!mlRes.ok) {
            console.error('ML match service failed');
            return res.status(500).json({ message: 'ML match service failed' });
        }

        const scoredMatchesInfo = await mlRes.json();

        // Merge ML scores with user objects
        const scoredUsers = scoredMatchesInfo.map(info => {
            const userObj = potentialMatches.find(u => u.id === info.userId);
            if (userObj) {
                return {
                    ...userObj.toObject(),
                    matchScore: info.score,
                    commonInterests: info[' wspólneZainteresowania']
                };
            }
            return null;
        }).filter(u => u !== null);

        res.json(scoredUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const actionOnMatch = async (req, res) => {
    try {
        const { targetUserId, action } = req.body; // action: 'accept' or 'reject'
        // Logic to check existing match, or create one if mutual accept.
        // Simplifying logic: just creates a pending/accepted match.

        let match = await Match.findOne({
            users: { $all: [req.user.id, targetUserId] }
        });

        if (!match) {
            match = new Match({
                users: [req.user.id, targetUserId],
                status: action === 'accept' ? 'pending' : 'rejected' // very simplified
            });
        } else if (action === 'accept' && match.status === 'pending') {
            match.status = 'accepted';
        }

        const savedMatch = await match.save();
        res.status(200).json(savedMatch);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMatches = async (req, res) => {
    try {
        const matches = await Match.find({
            users: req.user.id,
            status: 'accepted'
        }).populate('users', 'name profileImage bio');

        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPotentialMatches,
    actionOnMatch,
    getMatches,
};
