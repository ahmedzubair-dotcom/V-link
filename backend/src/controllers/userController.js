const User = require('../models/User');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash -deviceId -threatScore');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.bio = req.body.bio || user.bio;
            user.interests = req.body.interests || user.interests;
            user.profileImage = req.body.profileImage || user.profileImage;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
                interests: updatedUser.interests,
                profileImage: updatedUser.profileImage,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyUser = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ message: 'Image data is required' });
        }

        // Call Python ML service Phase 6 Face Detection
        const mlResponse = await fetch('http://localhost:5001/api/verify-face', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image })
        });

        const data = await mlResponse.json();

        if (data.hasFace) {
            const user = await User.findById(req.user.id);
            if (user) {
                user.isVerified = true;
                await user.save();
                res.json({ message: 'User verified successfully', isVerified: true, details: data.message });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } else {
            res.status(400).json({ message: 'Face verification failed', details: data.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile,
    verifyUser,
};
